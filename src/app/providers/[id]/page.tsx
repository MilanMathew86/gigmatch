import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, Star } from "lucide-react";
import { getProviderById } from "@/lib/mock/providers";
import { serviceLabel, travelRangeDisplay } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { RequestProviderButton } from "@/components/provider/RequestProviderButton";

export default async function ProviderProfilePage({ params }: PageProps<"/providers/[id]">) {
  const { id } = await params;
  const provider = getProviderById(id);
  if (!provider) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 lg:py-14">
      <Link
        href="/find-a-service/results"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back to results
      </Link>

      <div className="mt-5 flex flex-wrap items-start gap-4">
        <Avatar initials={provider.initials} color={provider.avatarColor} size={72} verified={provider.identityVerified} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-[24px] font-bold text-ink">{provider.name}</h1>
            {provider.isNewProvider && <Badge tone="new">New Provider</Badge>}
          </div>
          <p className="mt-0.5 text-[15px] text-ink-muted">{serviceLabel(provider.service, provider.customService)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-ink-muted">
            {provider.identityVerified && (
              <span className="inline-flex items-center gap-1 text-brand">
                <ShieldCheck size={14} />
                Identity verified
              </span>
            )}
            {provider.rating && (
              <span className="inline-flex items-center gap-1">
                <Star size={13} className="fill-gold text-gold" />
                {provider.rating.toFixed(1)}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} />
              {provider.serviceArea}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-ink">{provider.bio}</p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-4">
        <Stat label="Professional experience" value={`${provider.professionalExperienceYears} yrs`} />
        <Stat
          label="Platform experience"
          value={provider.isNewProvider ? "New to GigMatch" : `${provider.platformJobsCompleted} jobs`}
          sub={provider.isNewProvider ? undefined : "on GigMatch"}
        />
        <Stat label="Availability" value={provider.availabilitySummary} />
        <Stat label="Travel range" value={travelRangeDisplay(provider.travelRangeKm)} />
      </div>

      {provider.isNewProvider && (
        <p className="mt-3 text-[13px] text-ink-faint">
          GigMatch has limited platform history for this provider — that reflects how new they are here, not
          their professional ability.
        </p>
      )}

      <div className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">Skills</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {provider.skills.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {provider.whyGoodFit && provider.whyGoodFit.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">Why they&apos;re a good fit</h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {provider.whyGoodFit.map((r) => (
              <Badge key={r} tone="brand">
                {r}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {provider.certificates.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
            Qualifications & certificates
          </h2>
          <ul className="mt-2.5 flex flex-col gap-2">
            {provider.certificates.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-[13.5px]"
              >
                <span>
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="text-ink-muted"> · {c.institution}</span>
                </span>
                {c.verified && <Badge tone="brand">Verified</Badge>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <RequestProviderButton providerId={provider.id} />
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[12px] text-ink-faint">{label}</div>
      <div className="mt-0.5 text-[15px] font-semibold text-ink">{value}</div>
      {sub && <div className="text-[11.5px] text-ink-faint">{sub}</div>}
    </div>
  );
}
