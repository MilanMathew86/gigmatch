"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCustomerFlow } from "@/lib/customer-flow-context";
import { getProviderById } from "@/lib/mock/providers";
import { serviceLabel } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AuthPrompt } from "@/components/ui/AuthPrompt";

export default function ConfirmPage() {
  const { request, selectedProviderId } = useCustomerFlow();
  const provider = selectedProviderId ? getProviderById(selectedProviderId) : undefined;

  if (!request || !provider) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-[22px] font-semibold text-ink">Nothing to confirm yet</h1>
        <p className="mt-2 text-[14.5px] text-ink-muted">Start a request to select a provider.</p>
        <Button href="/find-a-service" className="mt-6">
          Find a Service
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-14">
      <div className="flex items-center gap-2 text-brand">
        <CheckCircle2 size={20} />
        <span className="text-[14px] font-semibold">Request sent</span>
      </div>

      <h1 className="mt-3 font-display text-[24px] font-bold text-ink">
        Your request has been sent to {provider.name}.
      </h1>
      <p className="mt-1.5 text-[14px] text-ink-muted">
        They typically respond within a few hours. You&apos;ll be notified once they accept.
      </p>

      <div className="mt-7 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <Avatar initials={provider.initials} color={provider.avatarColor} size={44} verified={provider.identityVerified} />
          <div>
            <div className="font-display text-[15px] font-semibold text-ink">{provider.name}</div>
            <div className="text-[13px] text-ink-muted">{serviceLabel(provider.service, provider.customService)}</div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-[13.5px]">
          <Row label="Service" value={serviceLabel(request.service, request.customService)} />
          <Row label="Date" value={request.date || "—"} />
          <Row label="Time" value={request.startTime ? `${request.startTime} – ${request.endTime}` : "—"} />
          <Row label="Duration" value={request.duration} />
          <Row label="Location" value={request.location || "—"} />
          <Row label="Status" value="Pending provider response" />
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Button href="/" variant="secondary" className="w-full sm:w-auto">
          Back to home
        </Button>
        <AuthPrompt context="customer" />
      </div>

      <p className="mt-6 text-[12px] text-ink-faint">
        Prototype — this request isn&apos;t sent anywhere and no account is required to view this page.{" "}
        <Link href="/matching-intelligence" className="underline">
          See how matching decisions are made
        </Link>
        .
      </p>
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
