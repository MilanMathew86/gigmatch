"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import {
  GOOD_FIT_SUGGESTIONS,
  OTHER_SERVICE_CATEGORY,
  SERVICE_CATEGORIES,
  TRAVEL_RANGE_OPTIONS,
  travelRangeKmForLabel,
  type Certificate,
  type ServiceCategory,
} from "@/lib/types";
import { Field, Input, Textarea, PillGroup, TagInput, SearchableSelect, SuggestionChipInput } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Stepper } from "@/components/ui/Stepper";
import { AuthPrompt } from "@/components/ui/AuthPrompt";
import { useProviderFlow } from "@/lib/provider-flow-context";

const STEPS = ["Basic details", "Services", "Location", "Qualifications"];
const TRAVEL_OPTIONS = TRAVEL_RANGE_OPTIONS.map((o) => o.label);

type Draft = {
  fullName: string;
  primaryPhone: string;
  secondaryPhone: string;
  identityVerified: boolean;
  service: ServiceCategory;
  customService: string;
  skills: string[];
  experienceYears: string;
  bio: string;
  whyGoodFit: string[];
  baseLocation: string;
  travelRange: string;
  availabilitySummary: string;
  certificates: Certificate[];
};

const emptyDraft: Draft = {
  fullName: "",
  primaryPhone: "",
  secondaryPhone: "",
  identityVerified: false,
  service: "Elder Care",
  customService: "",
  skills: [],
  experienceYears: "",
  bio: "",
  whyGoodFit: [],
  baseLocation: "",
  travelRange: "10 km",
  availabilitySummary: "",
  certificates: [],
};

export default function BecomeAProviderPage() {
  const router = useRouter();
  const { setDraftProvider } = useProviderFlow();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    if (step === 0 && (!draft.fullName || !draft.primaryPhone || !draft.secondaryPhone)) {
      setError("Please add your name and two phone numbers to continue.");
      return;
    }
    if (step === 1 && (!draft.service || draft.skills.length === 0 || !draft.experienceYears)) {
      setError("Add at least one skill and your years of experience.");
      return;
    }
    if (step === 1 && draft.service === OTHER_SERVICE_CATEGORY && !draft.customService.trim()) {
      setError("Tell us what your role is.");
      return;
    }
    if (step === 2 && !draft.baseLocation) {
      setError("Add your base location to continue.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish() {
    const initials = draft.fullName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setDraftProvider({
      id: `prov_you_${Date.now()}`,
      name: draft.fullName,
      initials: initials || "?",
      avatarColor: "bg-brand",
      service: draft.service,
      customService: draft.customService,
      skills: draft.skills,
      professionalExperienceYears: Number(draft.experienceYears) || 0,
      platformJobsCompleted: 0,
      rating: null,
      isNewProvider: true,
      identityVerified: draft.identityVerified,
      serviceArea: draft.baseLocation,
      travelRangeKm: travelRangeKmForLabel(draft.travelRange),
      availabilitySummary: draft.availabilitySummary || "Availability not yet set",
      bio: draft.bio,
      whyGoodFit: draft.whyGoodFit,
      certificates: draft.certificates,
      fitProfile: { skills: 78, availability: 75, location: 72 },
    });

    router.push("/provider/dashboard");
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10 lg:py-14">
      <h1 className="font-display text-[26px] font-bold text-ink">Become a provider</h1>
      <p className="mt-2 text-[14.5px] text-ink-muted">
        A few short steps to set up your GigMatch profile.
      </p>

      <div className="mt-7">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="mt-8">
        {step === 0 && <BasicDetailsStep draft={draft} update={update} />}
        {step === 1 && <ServicesStep draft={draft} update={update} />}
        {step === 2 && <LocationStep draft={draft} update={update} />}
        {step === 3 && <QualificationsStep draft={draft} update={update} />}
      </div>

      {error && <p className="mt-4 text-[13px] font-medium text-accent-hover">{error}</p>}

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="text-[13.5px] font-semibold text-ink-muted hover:text-ink disabled:opacity-0"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={finish}>Finish &amp; view profile</Button>
        )}
      </div>

      {step === 0 && (
        <div className="mt-6">
          <AuthPrompt context="provider" />
        </div>
      )}
    </div>
  );
}

function BasicDetailsStep({ draft, update }: { draft: Draft; update: <K extends keyof Draft>(k: K, v: Draft[K]) => void }) {
  const [verifying, setVerifying] = useState(false);

  function verify() {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      update("identityVerified", true);
    }, 900);
  }

  return (
    <div className="flex flex-col gap-6">
      <Field label="Full name">
        <Input value={draft.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full name" />
      </Field>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Primary phone number">
          <Input type="tel" value={draft.primaryPhone} onChange={(e) => update("primaryPhone", e.target.value)} placeholder="10-digit mobile number" />
        </Field>
        <Field label="Secondary phone number" hint="A second number helps customers reach you.">
          <Input type="tel" value={draft.secondaryPhone} onChange={(e) => update("secondaryPhone", e.target.value)} placeholder="Alternate contact number" />
        </Field>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-ink">
          <ShieldCheck size={16} className="text-brand" />
          Identity verification
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
          GigMatch verifies provider identity before profiles go live. This prototype simulates that
          check — no ID numbers or documents are collected or stored here.
        </p>
        <div className="mt-3.5">
          {draft.identityVerified ? (
            <Badge tone="brand">Verified (prototype)</Badge>
          ) : (
            <button
              type="button"
              onClick={verify}
              disabled={verifying}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-[13px] font-semibold text-ink-muted hover:border-brand/40 hover:text-ink disabled:opacity-70"
            >
              {verifying && <Loader2 size={14} className="animate-spin" />}
              {verifying ? "Verifying…" : "Verify identity"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ServicesStep({ draft, update }: { draft: Draft; update: <K extends keyof Draft>(k: K, v: Draft[K]) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="What do you do?" hint="Search or pick from the list — choose Others if your role isn't listed.">
        <SearchableSelect
          options={SERVICE_CATEGORIES as unknown as string[]}
          value={draft.service}
          onChange={(v) => update("service", v as ServiceCategory)}
          otherOption={OTHER_SERVICE_CATEGORY}
          otherLabel="Others"
          customValue={draft.customService}
          onCustomChange={(v) => update("customService", v)}
          customPlaceholder="Tell us your job or service role"
          searchPlaceholder="Search job or service role"
        />
      </Field>

      <Field label="Your skills" hint="Add each skill and press Enter.">
        <TagInput values={draft.skills} onChange={(v) => update("skills", v)} placeholder="e.g. Mobility assistance" />
      </Field>

      <Field label="Years of professional experience" hint="How long you've done this work — not how long you've used GigMatch.">
        <Input
          type="number"
          min={0}
          value={draft.experienceYears}
          onChange={(e) => update("experienceYears", e.target.value)}
          placeholder="e.g. 4"
        />
      </Field>

      <Field label="About you" optional>
        <Textarea
          value={draft.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="A couple of sentences customers will see on your profile."
        />
      </Field>

      <Field label="Why are you a good fit?" optional hint="Pick what applies, or add your own.">
        <SuggestionChipInput
          values={draft.whyGoodFit}
          onChange={(v) => update("whyGoodFit", v)}
          suggestions={GOOD_FIT_SUGGESTIONS}
          placeholder="Add your own reason"
        />
      </Field>
    </div>
  );
}

function LocationStep({ draft, update }: { draft: Draft; update: <K extends keyof Draft>(k: K, v: Draft[K]) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Base location">
        <Input
          value={draft.baseLocation}
          onChange={(e) => update("baseLocation", e.target.value)}
          placeholder="Neighbourhood or area"
        />
      </Field>

      <Field label="Travel range" hint="How far you're willing to travel for a job.">
        <PillGroup name="Travel range" options={TRAVEL_OPTIONS} value={draft.travelRange} onChange={(v) => update("travelRange", v)} />
      </Field>

      <Field label="Availability" optional hint="e.g. Weekday mornings, flexible weekends">
        <Input
          value={draft.availabilitySummary}
          onChange={(e) => update("availabilitySummary", e.target.value)}
          placeholder="When are you usually available?"
        />
      </Field>
    </div>
  );
}

function QualificationsStep({ draft, update }: { draft: Draft; update: <K extends keyof Draft>(k: K, v: Draft[K]) => void }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");

  function addCertificate() {
    if (!name.trim()) return;
    update("certificates", [
      ...draft.certificates,
      { id: `cert_${Date.now()}`, name: name.trim(), institution: institution.trim() || "Not specified", verified: false },
    ]);
    setName("");
    setInstitution("");
    setAdding(false);
  }

  return (
    <div>
      <h2 className="text-[15px] font-semibold text-ink">Strengthen your profile</h2>
      <p className="mt-1 text-[13.5px] text-ink-muted">
        Optional. Many great providers rely on hands-on experience rather than formal certificates —
        skip this if it doesn&apos;t apply to you.
      </p>

      {draft.certificates.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {draft.certificates.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-[13.5px]">
              <span>
                <span className="font-medium text-ink">{c.name}</span>
                <span className="text-ink-muted"> · {c.institution}</span>
              </span>
              <Badge tone="neutral">Pending verification</Badge>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border p-4">
          <Input placeholder="Certificate or qualification name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Issuing institution" value={institution} onChange={(e) => setInstitution(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={addCertificate}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-4 text-[13.5px] font-semibold text-brand hover:underline"
        >
          + Add Certificate
        </button>
      )}
    </div>
  );
}
