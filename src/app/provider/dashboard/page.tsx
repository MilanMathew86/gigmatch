"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useProviderFlow } from "@/lib/provider-flow-context";
import { generateJobHistory, generateOpportunities } from "@/lib/mock/opportunities";
import { serviceLabel } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProviderDashboardPage() {
  const { provider, hasOnboarded } = useProviderFlow();
  const opportunities = generateOpportunities(provider).slice(0, 2);
  const recentJobs = generateJobHistory(provider).slice(0, 3);

  const completion = profileCompletion(provider);
  const service = serviceLabel(provider.service, provider.customService);

  return (
    <div>
      {hasOnboarded && (
        <div className="mb-6 rounded-xl border border-brand/20 bg-brand-tint px-4 py-3 text-[13.5px] text-brand-ink">
          Your profile is live. Opportunities will start matching to it as customers request{" "}
          {service.toLowerCase()} nearby.
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold text-ink">Welcome back, {provider.name.split(" ")[0]}</h1>
          <p className="mt-1 text-[13.5px] text-ink-muted">{service} · {provider.serviceArea}</p>
        </div>
        <Button href="/provider/opportunities">
          View Opportunities
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Rating"
          value={provider.rating ? provider.rating.toFixed(1) : "—"}
          icon={provider.rating ? <Star size={14} className="fill-gold text-gold" /> : undefined}
        />
        <StatCard label="Platform jobs" value={String(provider.platformJobsCompleted)} />
        <StatCard
          label="Verified credentials"
          value={String(provider.certificates.filter((c) => c.verified).length)}
        />
        <StatCard label="Availability" value={provider.availabilitySummary} small />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
            Profile completion
          </span>
          <span className="font-mono text-[13px] font-semibold text-ink">{completion}%</span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-brand" style={{ width: `${completion}%` }} />
        </div>
        {completion < 100 && (
          <Link href="/provider/profile" className="mt-3 inline-block text-[13px] font-semibold text-brand hover:underline">
            Complete your profile →
          </Link>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[17px] font-semibold text-ink">Current opportunities</h2>
          <Link href="/provider/opportunities" className="text-[13px] font-semibold text-brand hover:underline">
            See all
          </Link>
        </div>
        {opportunities.length === 0 ? (
          <p className="mt-3 text-[13.5px] text-ink-muted">No opportunities yet — check back soon.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {opportunities.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/provider/opportunities/${o.id}`}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5 text-[13.5px] transition-colors hover:border-brand/30"
                >
                  <span>
                    <span className="font-medium text-ink">{o.customerSummary}</span>
                    <span className="text-ink-muted"> · {o.date}</span>
                  </span>
                  {o.urgency !== "Routine" && <Badge tone={o.urgency === "Urgent" ? "urgent" : "brand"}>{o.urgency}</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[17px] font-semibold text-ink">Recent jobs</h2>
          <Link href="/provider/history" className="text-[13px] font-semibold text-brand hover:underline">
            Full history
          </Link>
        </div>
        {recentJobs.length === 0 ? (
          <p className="mt-3 text-[13.5px] text-ink-muted">
            No completed jobs yet — they&apos;ll show up here once you finish your first opportunity.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {recentJobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-[13.5px]">
                <span className="text-ink">{j.service} · {j.date}</span>
                {j.rating && (
                  <span className="inline-flex items-center gap-1 text-ink-muted">
                    <Star size={12} className="fill-gold text-gold" />
                    {j.rating.toFixed(1)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, small }: { label: string; value: string; icon?: React.ReactNode; small?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-[11.5px] text-ink-faint">{label}</div>
      <div className={`mt-1 flex items-center gap-1.5 font-semibold text-ink ${small ? "text-[13px]" : "text-[18px]"}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}

function profileCompletion(provider: ReturnType<typeof useProviderFlow>["provider"]): number {
  const checks = [
    provider.bio.trim().length > 0,
    provider.skills.length > 0,
    provider.availabilitySummary.length > 0 && provider.availabilitySummary !== "Availability not yet set",
    provider.identityVerified,
    provider.certificates.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
