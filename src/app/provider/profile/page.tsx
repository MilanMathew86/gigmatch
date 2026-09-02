"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  GOOD_FIT_SUGGESTIONS,
  OTHER_SERVICE_CATEGORY,
  SERVICE_CATEGORIES,
  TRAVEL_RANGE_OPTIONS,
  travelRangeKmForLabel,
  travelRangeLabelForKm,
  type ServiceCategory,
} from "@/lib/types";
import { useProviderFlow } from "@/lib/provider-flow-context";
import { Field, Input, Textarea, PillGroup, TagInput, SearchableSelect, SuggestionChipInput } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const TRAVEL_OPTIONS = TRAVEL_RANGE_OPTIONS.map((o) => o.label);

export default function ProviderProfilePage() {
  const { provider, setDraftProvider } = useProviderFlow();
  const [form, setForm] = useState(provider);
  const [syncedProviderId, setSyncedProviderId] = useState(provider.id);
  const [saved, setSaved] = useState(false);
  const [addingCert, setAddingCert] = useState(false);
  const [certName, setCertName] = useState("");
  const [certInstitution, setCertInstitution] = useState("");

  // Reset the draft form when the underlying provider identity changes
  // (e.g. onboarding just completed). Adjusting state during render, per
  // React's guidance, avoids an extra effect-triggered render pass.
  if (syncedProviderId !== provider.id) {
    setSyncedProviderId(provider.id);
    setForm(provider);
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function save() {
    setDraftProvider(form);
    setSaved(true);
  }

  function addCertificate() {
    if (!certName.trim()) return;
    update("certificates", [
      ...form.certificates,
      { id: `cert_${Date.now()}`, name: certName.trim(), institution: certInstitution.trim() || "Not specified", verified: false },
    ]);
    setCertName("");
    setCertInstitution("");
    setAddingCert(false);
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-[24px] font-bold text-ink">Your profile</h1>
      <p className="mt-1.5 text-[13.5px] text-ink-muted">
        This is what customers see when GigMatch recommends you.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <section className="flex flex-col gap-5">
          <SectionTitle>Personal details</SectionTitle>
          <Field label="Full name">
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Base location">
            <Input value={form.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} />
          </Field>
        </section>

        <section className="flex flex-col gap-5 border-t border-border pt-7">
          <SectionTitle>Services &amp; experience</SectionTitle>
          <Field label="Primary service" hint="Search or pick from the list — choose Others if your role isn't listed.">
            <SearchableSelect
              options={SERVICE_CATEGORIES as unknown as string[]}
              value={form.service}
              onChange={(v) => update("service", v as ServiceCategory)}
              otherOption={OTHER_SERVICE_CATEGORY}
              otherLabel="Others"
              customValue={form.customService ?? ""}
              onCustomChange={(v) => update("customService", v)}
              customPlaceholder="Tell us your job or service role"
              searchPlaceholder="Search job or service role"
            />
          </Field>
          <Field label="Skills">
            <TagInput values={form.skills} onChange={(v) => update("skills", v)} placeholder="Add a skill" />
          </Field>
          <Field label="Years of professional experience">
            <Input
              type="number"
              min={0}
              value={form.professionalExperienceYears}
              onChange={(e) => update("professionalExperienceYears", Number(e.target.value))}
            />
          </Field>
          <Field label="About you" optional>
            <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} />
          </Field>
          <Field label="Why are you a good fit?" optional hint="Pick what applies, or add your own.">
            <SuggestionChipInput
              values={form.whyGoodFit ?? []}
              onChange={(v) => update("whyGoodFit", v)}
              suggestions={GOOD_FIT_SUGGESTIONS}
              placeholder="Add your own reason"
            />
          </Field>
        </section>

        <section className="flex flex-col gap-5 border-t border-border pt-7">
          <SectionTitle>Location &amp; availability</SectionTitle>
          <Field label="Travel range">
            <PillGroup
              name="Travel range"
              options={TRAVEL_OPTIONS}
              value={travelRangeLabelForKm(form.travelRangeKm)}
              onChange={(v) => update("travelRangeKm", travelRangeKmForLabel(v))}
            />
          </Field>
          <Field label="Availability">
            <Input value={form.availabilitySummary} onChange={(e) => update("availabilitySummary", e.target.value)} />
          </Field>
        </section>

        <section className="flex flex-col gap-4 border-t border-border pt-7">
          <SectionTitle>Qualifications &amp; certificates</SectionTitle>
          {form.certificates.length > 0 && (
            <ul className="flex flex-col gap-2">
              {form.certificates.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-[13.5px]">
                  <span>
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="text-ink-muted"> · {c.institution}</span>
                  </span>
                  <Badge tone={c.verified ? "brand" : "neutral"}>{c.verified ? "Verified" : "Pending verification"}</Badge>
                </li>
              ))}
            </ul>
          )}
          {addingCert ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
              <Input placeholder="Certificate or qualification name" value={certName} onChange={(e) => setCertName(e.target.value)} />
              <Input placeholder="Issuing institution" value={certInstitution} onChange={(e) => setCertInstitution(e.target.value)} />
              <div className="flex gap-2">
                <Button size="sm" onClick={addCertificate}>
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAddingCert(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setAddingCert(true)} className="self-start text-[13.5px] font-semibold text-brand hover:underline">
              + Add Certificate
            </button>
          )}
        </section>
      </div>

      <div className="mt-9 flex items-center gap-4 border-t border-border pt-6">
        <Button onClick={save}>Save changes</Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand">
            <CheckCircle2 size={16} />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">{children}</h2>;
}
