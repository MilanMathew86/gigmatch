"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DURATIONS,
  OTHER_SERVICE_CATEGORY,
  SERVICE_CATEGORIES,
  URGENCY_LEVELS,
  emptyServiceRequest,
  type ServiceRequest,
} from "@/lib/types";
import { providers } from "@/lib/mock/providers";
import { useCustomerFlow } from "@/lib/customer-flow-context";
import { Field, Input, Select, Textarea, PillGroup, ChipInput, SearchableSelect } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { AuthPrompt } from "@/components/ui/AuthPrompt";

const LANGUAGES = ["No preference", "English", "Hindi", "Kannada", "Tamil", "Telugu", "Malayalam"];

export default function FindAServicePage() {
  const router = useRouter();
  const { setRequest } = useCustomerFlow();
  const [form, setForm] = useState<ServiceRequest>(emptyServiceRequest());

  const skillSuggestions = useMemo(() => {
    const set = new Set<string>();
    providers.filter((p) => p.service === form.service).forEach((p) => p.skills.forEach((s) => set.add(s)));
    return Array.from(set).slice(0, 8);
  }, [form.service]);

  function update<K extends keyof ServiceRequest>(key: K, value: ServiceRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRequest(form);
    router.push("/find-a-service/results");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
      <h1 className="font-display text-[28px] font-bold text-ink">Find a service</h1>
      <p className="mt-2 text-[14.5px] text-ink-muted">
        Tell us what you need — we&apos;ll show suitable providers ranked by fit.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Field label="Service" hint="Search or pick from the list — choose Others if it isn't listed.">
          <SearchableSelect
            options={SERVICE_CATEGORIES as unknown as string[]}
            value={form.service}
            onChange={(v) => update("service", v as ServiceRequest["service"])}
            otherOption={OTHER_SERVICE_CATEGORY}
            otherLabel="Others"
            customValue={form.customService ?? ""}
            onCustomChange={(v) => update("customService", v)}
            customPlaceholder="Tell us what you need"
            searchPlaceholder="Search job or service role"
          />
        </Field>

        <Field label="Describe what you need" hint="A sentence or two is enough.">
          <Textarea
            required
            placeholder="e.g. I need someone to provide elder care for my mother during the day."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <Field label="Location">
          <Input
            required
            placeholder="Neighbourhood or address"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Field label="Date">
            <Input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} />
          </Field>
          <Field label="Start time">
            <Input type="time" required value={form.startTime} onChange={(e) => update("startTime", e.target.value)} />
          </Field>
          <Field label="End time">
            <Input type="time" required value={form.endTime} onChange={(e) => update("endTime", e.target.value)} />
          </Field>
        </div>

        <Field label="Duration">
          <PillGroup name="Duration" options={DURATIONS} value={form.duration} onChange={(v) => update("duration", v)} />
        </Field>

        <Field label="Urgency">
          <PillGroup name="Urgency" options={URGENCY_LEVELS} value={form.urgency} onChange={(v) => update("urgency", v)} />
        </Field>

        {skillSuggestions.length > 0 && (
          <Field label="Required skills" optional hint="Only pick these if a specific skill matters for this request.">
            <ChipInput
              values={form.requiredSkills}
              onChange={(v) => update("requiredSkills", v)}
              suggestions={skillSuggestions}
              placeholder="No specific skills required — we'll match on overall fit."
            />
          </Field>
        )}

        <Field label="Language preference" optional>
          <Select value={form.languagePreference} onChange={(e) => update("languagePreference", e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Other preferences" optional>
          <Textarea
            placeholder="Anything else GigMatch should know"
            value={form.otherPreferences}
            onChange={(e) => update("otherPreferences", e.target.value)}
          />
        </Field>

        <div className="mt-2 flex flex-col gap-4 border-t border-border pt-6">
          <Button type="submit" size="md" className="w-full sm:w-auto">
            Find Suitable Providers
          </Button>
          <AuthPrompt context="customer" />
        </div>
      </form>
    </div>
  );
}
