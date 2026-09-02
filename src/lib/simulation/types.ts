// Types for the Matching Intelligence demo: a client-side, seeded simulation
// of how three allocation policies treat newly-entered providers on an
// otherwise-identical pool. This models Layer 2 (opportunity allocation)
// only — Layer 1 (suitability filtering) is illustrated separately on the
// customer-facing pages.

export type Policy = "pure_exploitation" | "epsilon_greedy" | "ucb1";

export const POLICIES: { id: Policy; label: string; short: string }[] = [
  { id: "pure_exploitation", label: "Pure Exploitation", short: "Exploitation" },
  { id: "epsilon_greedy", label: "ε-Greedy", short: "ε-Greedy" },
  { id: "ucb1", label: "UCB1", short: "UCB1" },
];

export type SimConfig = {
  numEstablished: number;
  numNewEntrants: number;
  totalRounds: number;
  entryRound: number;
  epsilon: number;
  ucbC: number;
  urgentShare: number;
  urgencyDamping: number;
  seed: number;
};

export const DEFAULT_SIM_CONFIG: SimConfig = {
  numEstablished: 15,
  numNewEntrants: 5,
  totalRounds: 2000,
  entryRound: 400,
  epsilon: 0.1,
  ucbC: Math.SQRT2,
  urgentShare: 0.3,
  urgencyDamping: 0.2,
  seed: 123,
};

export type Cohort = "established" | "new";

export type SimArm = {
  id: string;
  cohort: Cohort;
  trueQuality: number;
  estimatedQuality: number;
  timesMatched: number;
  totalReward: number;
};

export type TimelinePoint = {
  round: number;
  newShareInWindow: number; // 0-1, share of matches in this window going to new-cohort arms
  avgRewardInWindow: number; // 0-1
};

export type SimMetrics = {
  avgReward: number;
  newProviderMatchShare: number; // post-entry only
  entrantAvgMatches: number; // avg matches per new-cohort arm, post-entry
  equalShareBenchmark: number; // matches a perfectly equal split would give each arm, post-entry
  concentration: number; // 0-1, sum of squared match shares across all arms (lower = more spread out)
  activeProviderCount: number; // arms that received at least one match
  totalProviderCount: number;
  urgentNewShare: number; // new-provider match share among urgent-round matches only (post-entry)
  routineNewShare: number; // new-provider match share among non-urgent-round matches (post-entry)
};

export type SimResult = {
  config: SimConfig;
  policy: Policy;
  arms: SimArm[];
  timeline: TimelinePoint[];
  metrics: SimMetrics;
};
