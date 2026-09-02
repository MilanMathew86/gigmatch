import type { Cohort, Policy, SimArm, SimConfig, SimResult, TimelinePoint } from "./types";

// Deterministic PRNG (mulberry32) so a given seed always reproduces the same
// run — the demo depends on that for the "same seed, switch policy" story.
function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number, mean: number, std: number) {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

// Both cohorts are drawn from the same distribution on purpose — the
// simulation's whole point is that new entrants are not, on average, any
// less capable than established providers. What differs is what the
// platform knows about them yet.
function sampleTrueQuality(rand: () => number) {
  const raw = 0.3 + 0.35 * rand() + 0.25 * rand() + 0.1 * rand();
  return Math.min(0.97, Math.max(0.15, raw));
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function argmax<T>(items: T[], score: (item: T) => number, rand: () => number): T {
  let best = items[0];
  let bestScore = score(best);
  for (let i = 1; i < items.length; i++) {
    const s = score(items[i]);
    if (s > bestScore || (s === bestScore && rand() < 0.5)) {
      best = items[i];
      bestScore = s;
    }
  }
  return best;
}

type SimEvent = { round: number; armId: string; cohort: Cohort; urgent: boolean; reward: number };

export function runSimulation(config: SimConfig, policy: Policy): SimResult {
  const rand = mulberry32(config.seed);
  const arms: SimArm[] = [];

  for (let i = 0; i < config.numEstablished; i++) {
    arms.push({
      id: `E${i + 1}`,
      cohort: "established",
      trueQuality: sampleTrueQuality(rand),
      estimatedQuality: 0.7,
      timesMatched: 0,
      totalReward: 0,
    });
  }
  for (let i = 0; i < config.numNewEntrants; i++) {
    arms.push({
      id: `N${i + 1}`,
      cohort: "new",
      trueQuality: sampleTrueQuality(rand),
      estimatedQuality: 0.7,
      timesMatched: 0,
      totalReward: 0,
    });
  }

  const events: SimEvent[] = [];

  for (let round = 1; round <= config.totalRounds; round++) {
    const active = arms.filter((a) => a.cohort === "established" || round > config.entryRound);
    const urgent = rand() < config.urgentShare;
    // Task criticality suppresses exploration: on urgent requests the
    // platform leans harder on what it already knows (paper's Proposition 3).
    const epsilonEff = urgent ? config.epsilon * config.urgencyDamping : config.epsilon;
    const cEff = urgent ? config.ucbC * config.urgencyDamping : config.ucbC;

    let chosen: SimArm;
    if (policy === "pure_exploitation") {
      chosen = argmax(active, (a) => a.estimatedQuality, rand);
    } else if (policy === "epsilon_greedy") {
      chosen = rand() < epsilonEff ? active[Math.floor(rand() * active.length)] : argmax(active, (a) => a.estimatedQuality, rand);
    } else {
      chosen = argmax(
        active,
        (a) => (a.timesMatched === 0 ? Infinity : a.estimatedQuality + cEff * Math.sqrt((2 * Math.log(round)) / a.timesMatched)),
        rand
      );
    }

    const reward = clamp01(chosen.trueQuality + gaussian(rand, 0, 0.15));
    chosen.timesMatched += 1;
    chosen.totalReward += reward;
    chosen.estimatedQuality = chosen.totalReward / chosen.timesMatched;
    events.push({ round, armId: chosen.id, cohort: chosen.cohort, urgent, reward });
  }

  // --- Timeline: bucket into fixed-size windows for charting ---
  const bucketCount = 50;
  const bucketSize = Math.ceil(config.totalRounds / bucketCount);
  const timeline: TimelinePoint[] = [];
  for (let b = 0; b < bucketCount; b++) {
    const start = b * bucketSize + 1;
    const end = Math.min(config.totalRounds, start + bucketSize - 1);
    if (start > config.totalRounds) break;
    const windowEvents = events.filter((e) => e.round >= start && e.round <= end);
    const newInWindow = windowEvents.filter((e) => e.cohort === "new").length;
    const avgReward = windowEvents.length ? windowEvents.reduce((s, e) => s + e.reward, 0) / windowEvents.length : 0;
    timeline.push({
      round: end,
      newShareInWindow: windowEvents.length ? newInWindow / windowEvents.length : 0,
      avgRewardInWindow: avgReward,
    });
  }

  // --- Metrics ---
  const postEntry = events.filter((e) => e.round > config.entryRound);
  const newEvents = postEntry.filter((e) => e.cohort === "new");
  const avgReward = events.reduce((s, e) => s + e.reward, 0) / events.length;
  const entrantAvgMatches = newEvents.length / config.numNewEntrants;
  const totalProviderCount = config.numEstablished + config.numNewEntrants;
  const equalShareBenchmark = (config.totalRounds - config.entryRound) / totalProviderCount;
  const newProviderMatchShare = postEntry.length ? newEvents.length / postEntry.length : 0;
  const concentration = arms.reduce((s, a) => s + Math.pow(a.timesMatched / config.totalRounds, 2), 0);
  const activeProviderCount = arms.filter((a) => a.timesMatched > 0).length;

  const urgentPost = postEntry.filter((e) => e.urgent);
  const routinePost = postEntry.filter((e) => !e.urgent);
  const urgentNewShare = urgentPost.length ? urgentPost.filter((e) => e.cohort === "new").length / urgentPost.length : 0;
  const routineNewShare = routinePost.length ? routinePost.filter((e) => e.cohort === "new").length / routinePost.length : 0;

  return {
    config,
    policy,
    arms,
    timeline,
    metrics: {
      avgReward,
      newProviderMatchShare,
      entrantAvgMatches,
      equalShareBenchmark,
      concentration,
      activeProviderCount,
      totalProviderCount,
      urgentNewShare,
      routineNewShare,
    },
  };
}
