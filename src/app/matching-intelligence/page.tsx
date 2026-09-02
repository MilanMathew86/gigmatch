"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { runSimulation } from "@/lib/simulation/engine";
import { DEFAULT_SIM_CONFIG, POLICIES, type Policy } from "@/lib/simulation/types";
import { TimelineChart } from "@/components/simulation/TimelineChart";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";

const DEMAND_MIXES = [
  { id: "typical", label: "Typical demand mix", urgentShare: 0.3 },
  { id: "mostly_urgent", label: "Mostly urgent demand", urgentShare: 0.85 },
] as const;

export default function MatchingIntelligencePage() {
  const [policy, setPolicy] = useState<Policy>("pure_exploitation");
  const [demandMixId, setDemandMixId] = useState<(typeof DEMAND_MIXES)[number]["id"]>("typical");
  const [comparing, setComparing] = useState(false);

  const urgentShare = DEMAND_MIXES.find((d) => d.id === demandMixId)!.urgentShare;
  const config = useMemo(() => ({ ...DEFAULT_SIM_CONFIG, urgentShare }), [urgentShare]);

  const result = useMemo(() => runSimulation(config, policy), [config, policy]);
  const allPolicies = useMemo(() => POLICIES.map((p) => ({ ...p, result: runSimulation(config, p.id) })), [config]);

  const { metrics, timeline } = result;
  const newSharePct = Math.round(metrics.newProviderMatchShare * 100);
  const benchmarkPct = Math.round(
    (DEFAULT_SIM_CONFIG.numNewEntrants / (DEFAULT_SIM_CONFIG.numEstablished + DEFAULT_SIM_CONFIG.numNewEntrants)) * 100
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
      <span className="text-[13px] font-semibold uppercase tracking-wide text-accent">Matching Intelligence</span>
      <h1 className="mt-2 font-display text-[30px] font-bold text-ink sm:text-[34px]">
        How GigMatch decides who gets seen
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
        Every provider shown to a customer has already passed suitability — right skills, right area, right
        availability. What follows is a different question: among suitable providers, how does GigMatch decide who
        actually gets the opportunity? This page runs a live, seeded simulation to show why that choice matters.
      </p>

      {/* Scenario facts */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 rounded-2xl border border-border bg-surface-2 px-5 py-4 text-[13px] text-ink-muted">
        <span><strong className="font-semibold text-ink">15</strong> established providers from round 1</span>
        <span><strong className="font-semibold text-ink">5</strong> new providers enter at round <strong className="font-semibold text-ink">400</strong></span>
        <span><strong className="font-semibold text-ink">2,000</strong> matching rounds total</span>
        <span>Both cohorts drawn from the <strong className="font-semibold text-ink">same quality distribution</strong></span>
      </div>

      {/* Policy selector */}
      <div className="mt-9">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">Allocation policy</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Allocation policy">
          {POLICIES.map((p) => {
            const active = p.id === policy;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPolicy(p.id)}
                className={
                  "h-10 rounded-full border px-4 text-[13.5px] font-medium transition-colors " +
                  (active
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink")
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 text-[13.5px] text-ink-muted">{POLICY_BLURB[policy]}</p>
      </div>

      {/* Chart */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13.5px] font-semibold text-ink">Share of matches going to new providers</h3>
          <span className="text-[12px] text-ink-faint">rolling, per 40-round window</span>
        </div>
        <div className="mt-3">
          <TimelineChart timeline={timeline} entryRound={config.entryRound} totalRounds={config.totalRounds} />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="New-provider match share" value={`${newSharePct}%`} hint={`since round ${config.entryRound}`} />
        <Stat
          label="Avg. matches per new provider"
          value={metrics.entrantAvgMatches.toFixed(0)}
          hint={`equal-share benchmark: ${metrics.equalShareBenchmark.toFixed(0)}`}
        />
        <Stat label="Match quality" value={metrics.avgReward.toFixed(2)} hint="avg. outcome reward, 0–1" />
        <Stat
          label="Providers ever matched"
          value={`${metrics.activeProviderCount} / ${metrics.totalProviderCount}`}
          hint="ecosystem reach"
        />
      </div>

      {/* Urgency experiment */}
      <div className="mt-9">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">Urgency experiment</h2>
        <p className="mt-2 text-[13.5px] text-ink-muted">
          When requests are urgent, platforms lean harder on what they already know — shrinking exploration right
          when new providers need it most. Switch the demand mix below to see the effect on the current policy.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Demand mix">
          {DEMAND_MIXES.map((d) => {
            const active = d.id === demandMixId;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDemandMixId(d.id)}
                className={
                  "h-10 rounded-full border px-4 text-[13.5px] font-medium transition-colors " +
                  (active
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink")
                }
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-ink-muted">
          <span>
            On routine-labeled rounds in this run: <strong className="font-semibold text-ink">{Math.round(metrics.routineNewShare * 100)}%</strong> of matches went to new providers
          </span>
          <span>
            On urgent-labeled rounds: <strong className="font-semibold text-ink">{Math.round(metrics.urgentNewShare * 100)}%</strong>
          </span>
        </div>
      </div>

      {/* Compare all three */}
      <div className="mt-9 border-t border-border pt-7">
        <button
          type="button"
          onClick={() => setComparing((c) => !c)}
          className="text-[13.5px] font-semibold text-brand hover:underline"
        >
          {comparing ? "Hide" : "Compare"} all three policies →
        </button>

        {comparing && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border text-left text-[11.5px] uppercase tracking-wide text-ink-faint">
                  <th className="py-2.5 pr-4 font-semibold">Policy</th>
                  <th className="py-2.5 pr-4 font-semibold">New-provider share</th>
                  <th className="py-2.5 pr-4 font-semibold">Avg. matches / new provider</th>
                  <th className="py-2.5 pr-4 font-semibold">Match quality</th>
                </tr>
              </thead>
              <tbody>
                {allPolicies.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink">
                      {p.label}
                      {p.id === policy && <Badge tone="brand" className="ml-2">viewing</Badge>}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-2">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{ width: `${Math.min(100, p.result.metrics.newProviderMatchShare * 100)}%` }}
                          />
                        </div>
                        <span className="text-ink-muted">{Math.round(p.result.metrics.newProviderMatchShare * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">{p.result.metrics.entrantAvgMatches.toFixed(0)}</td>
                    <td className="py-3 pr-4 text-ink-muted">{p.result.metrics.avgReward.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[13px] text-ink-faint">
              Equal-share benchmark for new providers: ~{metrics.equalShareBenchmark.toFixed(0)} matches each (
              {benchmarkPct}% of post-entry rounds). Match quality is the average outcome reward across all matches —
              it stays roughly level across policies, which is the point: exploring doesn&apos;t mean sacrificing quality.
            </p>
          </div>
        )}
      </div>

      {/* Research drawer */}
      <div className="mt-9 border-t border-border pt-7">
        <Drawer
          title="The research behind this page"
          trigger={
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13.5px] font-semibold text-ink-muted hover:border-brand/40 hover:text-ink">
              <Info size={15} />
              Why this simulation exists
            </span>
          }
        >
          <ResearchExplanation />
        </Drawer>
      </div>
    </div>
  );
}

const POLICY_BLURB: Record<Policy, string> = {
  pure_exploitation: "Always routes work to whichever provider has the best track record so far. Simple, but new providers never get a first job to prove themselves.",
  epsilon_greedy: "Mostly picks the best-known provider, but occasionally (about 10% of the time) tries someone else at random — a small, fixed amount of exploration.",
  ucb1: "Weighs both estimated quality and uncertainty — providers GigMatch knows less about get a temporary boost, which shrinks automatically as evidence builds.",
};

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-[12px] font-medium text-ink-faint">{label}</div>
      <div className="mt-1 font-display text-[22px] font-bold text-ink">{value}</div>
      <div className="mt-0.5 text-[11.5px] text-ink-faint">{hint}</div>
    </div>
  );
}

function ResearchExplanation() {
  return (
    <div className="flex flex-col gap-5 text-[13.5px] leading-relaxed text-ink-muted">
      <p>
        This page is a demo of a research finding, not a promise about how any specific platform behaves. It follows
        research on algorithmic myopia in platform ecosystems — how the way a marketplace allocates opportunities can
        quietly determine who gets to build a track record at all.
      </p>
      <div>
        <h4 className="font-semibold text-ink">The success trap</h4>
        <p className="mt-1">
          A platform that always routes work to today&apos;s top performers reinforces their lead — they get more
          jobs, more reviews, more confidence — while everyone else never gets a comparable chance to be observed.
          It&apos;s a self-reinforcing loop, not a reflection of who is actually more capable.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-ink">The new-provider entry problem</h4>
        <p className="mt-1">
          In this simulation, new providers are drawn from the exact same quality distribution as established ones —
          they&apos;re not less skilled. They simply start with no platform history. A system that equates &quot;no
          history&quot; with &quot;low quality&quot; will under-expose perfectly capable people by design.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-ink">Task criticality and urgency</h4>
        <p className="mt-1">
          Under time pressure, it&apos;s tempting to lean even harder on proven providers. The urgency experiment
          above shows that effect directly: exploration shrinks further right when new providers need visibility
          most, which can compound the entry problem for urgent, high-stakes categories.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-ink">Ecosystem effects</h4>
        <p className="mt-1">
          Locking out capable newcomers concentrates demand on a small pool of established providers — raising their
          workload and churn risk, and shrinking the overall supply the platform can rely on during demand spikes.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-ink">Why this is a design choice</h4>
        <p className="mt-1">
          UCB1 shows that near-equal access for new providers is achievable without materially hurting match quality
          — it&apos;s a deliberate allocation policy a platform can choose, not an unavoidable trade-off. GigMatch
          uses this idea to inform Layer 2 of its matching design: among suitable providers, uncertainty is treated
          as a reason to give visibility, not a reason to withhold it.
        </p>
      </div>
    </div>
  );
}
