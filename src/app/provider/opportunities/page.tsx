"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProviderFlow } from "@/lib/provider-flow-context";
import { generateOpportunities } from "@/lib/mock/opportunities";
import { serviceLabel } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export default function OpportunitiesPage() {
  const { provider } = useProviderFlow();
  const opportunities = generateOpportunities(provider);

  return (
    <div>
      <h1 className="font-display text-[24px] font-bold text-ink">Opportunities</h1>
      <p className="mt-1.5 text-[13.5px] text-ink-muted">
        Suitable requests for {serviceLabel(provider.service, provider.customService).toLowerCase()} near{" "}
        {provider.serviceArea}.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {opportunities.map((o) => (
          <li key={o.id}>
            <Link
              href={`/provider/opportunities/${o.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/30"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[15.5px] font-semibold text-ink">{o.customerSummary}</span>
                  {o.urgency !== "Routine" && (
                    <Badge tone={o.urgency === "Urgent" ? "urgent" : "brand"}>{o.urgency}</Badge>
                  )}
                </div>
                <div className="mt-1 text-[13px] text-ink-muted">
                  {o.date} · {o.startTime}–{o.endTime} · {o.location}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[13.5px] font-semibold text-ink">{o.estimatedEarnings}</span>
                <ArrowRight size={16} className="text-ink-faint" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
