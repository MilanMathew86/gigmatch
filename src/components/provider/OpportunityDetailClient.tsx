"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { useProviderFlow } from "@/lib/provider-flow-context";
import { getOpportunityById } from "@/lib/mock/opportunities";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function OpportunityDetailClient({ opportunityId }: { opportunityId: string }) {
  const { provider } = useProviderFlow();
  const opportunity = getOpportunityById(provider, opportunityId);
  const [accepted, setAccepted] = useState(false);

  if (!opportunity) {
    return (
      <div className="py-10 text-center">
        <p className="text-[14.5px] text-ink-muted">This opportunity is no longer available.</p>
        <Link href="/provider/opportunities" className="mt-4 inline-block text-[13.5px] font-semibold text-brand">
          Back to opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Link href="/provider/opportunities" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={15} />
        Back to opportunities
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="font-display text-[22px] font-bold text-ink">{opportunity.customerSummary}</h1>
        {opportunity.urgency !== "Routine" && (
          <Badge tone={opportunity.urgency === "Urgent" ? "urgent" : "brand"}>{opportunity.urgency}</Badge>
        )}
      </div>
      <p className="mt-1 text-[13.5px] text-ink-muted">{opportunity.service}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border bg-surface p-5 text-[13.5px] sm:grid-cols-3">
        <Row label="Date" value={opportunity.date} />
        <Row label="Time" value={`${opportunity.startTime} – ${opportunity.endTime}`} />
        <Row label="Duration" value={opportunity.duration} />
        <Row label="Location" value={opportunity.location} />
        <Row label="Required skills" value={opportunity.requiredSkills.join(", ") || "None specified"} />
        <Row label="Estimated earnings" value={opportunity.estimatedEarnings} />
      </dl>

      <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-tint p-5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-brand-ink">
          <MapPin size={14} />
          Why you&apos;re a good fit
        </div>
        <p className="mt-1.5 text-[13.5px] text-brand-ink">{opportunity.whyGoodFit}</p>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        {accepted ? (
          <div className="flex items-center gap-2 text-brand">
            <CheckCircle2 size={18} />
            <span className="text-[14px] font-semibold">Opportunity accepted</span>
          </div>
        ) : (
          <Button onClick={() => setAccepted(true)} className="w-full sm:w-auto">
            Accept Opportunity
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
