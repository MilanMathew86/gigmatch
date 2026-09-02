"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useCustomerFlow } from "@/lib/customer-flow-context";
import { findSuitableProviders } from "@/lib/matching";
import { providers } from "@/lib/mock/providers";
import { serviceLabel } from "@/lib/types";
import { ProviderCard } from "@/components/provider/ProviderCard";
import { Button } from "@/components/ui/Button";

export default function MatchingResultsPage() {
  const { request } = useCustomerFlow();

  const matches = useMemo(() => (request ? findSuitableProviders(request, providers) : []), [request]);

  if (!request) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-[22px] font-semibold text-ink">Tell us what you need first</h1>
        <p className="mt-2 text-[14.5px] text-ink-muted">
          Start a request to see suitable providers for your job.
        </p>
        <Button href="/find-a-service" className="mt-6">
          Find a Service
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 lg:py-14">
      <Link href="/find-a-service" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={15} />
        Back
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[24px] font-bold text-ink">
            {serviceLabel(request.service, request.customService)}
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            {request.location || "Location not set"} · {request.date || "Date not set"}
            {request.startTime && ` · ${request.startTime}`}
            {request.urgency !== "Routine" && ` · ${request.urgency}`}
          </p>
        </div>
        <Link
          href="/find-a-service"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand hover:underline"
        >
          <Pencil size={13} />
          Edit request
        </Link>
      </div>

      <p className="mt-6 text-[13.5px] text-ink-faint">
        {matches.length} suitable provider{matches.length === 1 ? "" : "s"} found
      </p>

      {matches.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-[14.5px] text-ink-muted">
            No providers currently meet the requirements for this request. Try adjusting the required
            skills or checking back soon.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {matches.map((m) => (
            <ProviderCard
              key={m.provider.id}
              provider={m.provider}
              matchScore={m.matchScore}
              breakdown={m.breakdown}
              href={`/providers/${m.provider.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
