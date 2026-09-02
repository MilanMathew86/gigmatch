"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MatchScore } from "@/components/ui/MatchScore";
import { cn } from "@/lib/utils";
import { serviceLabel, type MatchBreakdown, type Provider } from "@/lib/types";

/** The one provider card used across matching results, the profile preview,
 * the provider dashboard, and opportunity lists. */
export function ProviderCard({
  provider,
  matchScore,
  breakdown,
  href,
  actions,
}: {
  provider: Provider;
  matchScore?: number;
  breakdown?: MatchBreakdown;
  href?: string;
  actions?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const Name = (
    <span className="truncate font-display text-[16px] font-semibold text-ink">{provider.name}</span>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3.5">
        <Avatar
          initials={provider.initials}
          color={provider.avatarColor}
          size={48}
          verified={provider.identityVerified}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {href ? (
              <Link href={href} className="hover:underline">
                {Name}
              </Link>
            ) : (
              Name
            )}
            {provider.isNewProvider && <Badge tone="new">New Provider</Badge>}
          </div>
          <div className="mt-0.5 truncate text-[13.5px] text-ink-muted">
            {serviceLabel(provider.service, provider.customService)}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted">
            {provider.rating ? (
              <span className="inline-flex items-center gap-1">
                <Star size={13} className="fill-gold text-gold" />
                {provider.rating.toFixed(1)}
              </span>
            ) : (
              <span className="text-ink-faint">No ratings yet</span>
            )}
            <span>·</span>
            <span>{provider.professionalExperienceYears} yrs professional experience</span>
            <span>·</span>
            <span>{provider.platformJobsCompleted} GigMatch jobs</span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted">
            <span>{provider.availabilitySummary}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {provider.serviceArea}
            </span>
          </div>
        </div>

        {matchScore !== undefined && <MatchScore score={matchScore} />}
      </div>

      {breakdown && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-brand"
          >
            Why this match?
            <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
          </button>

          {expanded && (
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-4">
              <BreakdownItem label="Skills fit" value={`${breakdown.skillsFitPct}%`} />
              <BreakdownItem label="Availability fit" value={`${breakdown.availabilityFitPct}%`} />
              <BreakdownItem label="Location fit" value={`${breakdown.locationFitPct}%`} />
              <BreakdownItem label="Experience" value={`${breakdown.experienceYears} yrs`} />
              <div className="col-span-2 sm:col-span-4">
                <dt className="text-ink-faint">Platform history</dt>
                <dd className="mt-0.5 text-ink">{breakdown.platformHistoryNote}</dd>
              </div>
              {breakdown.verifiedCredentialsNote && (
                <div className="col-span-2 sm:col-span-4">
                  <dt className="text-ink-faint">Credentials</dt>
                  <dd className="mt-0.5 text-ink">{breakdown.verifiedCredentialsNote}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      )}

      {actions && <div className="mt-4 border-t border-border pt-4">{actions}</div>}
    </div>
  );
}

function BreakdownItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
