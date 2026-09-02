import { useMemo, useRef, useState, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold text-ink">{label}</span>
        {optional && <span className="text-[12px] text-ink-faint">Optional</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-[12.5px] text-ink-faint">{hint}</span>}
    </label>
  );
}

const fieldClasses =
  "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-[14.5px] text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClasses, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(fieldClasses, "h-auto min-h-24 resize-y py-3", props.className)}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(fieldClasses, "appearance-none bg-[right_0.9rem_center] bg-no-repeat pr-9", props.className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235B6058' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      }}
    >
      {props.children}
    </select>
  );
}

export function PillGroup<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly T[] | T[];
  value: T;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "h-10 rounded-full border px-4 text-[13.5px] font-medium transition-colors",
              active
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function ChipInput({
  values,
  onChange,
  suggestions,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const toggle = (s: string) => {
    onChange(values.includes(s) ? values.filter((v) => v !== s) : [...values, s]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => {
          const active = values.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
                active
                  ? "border-brand bg-brand-tint text-brand-ink"
                  : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
      {placeholder && values.length === 0 && (
        <p className="mt-2 text-[12.5px] text-ink-faint">{placeholder}</p>
      )}
    </div>
  );
}

/** Free-text tag input — used where the person names their own items (e.g.
 * a provider listing their own skills) rather than picking from a fixed list. */
export function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  }

  return (
    <div>
      {values.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pl-3 pr-2 text-[13px] font-medium text-ink"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="flex h-4 w-4 items-center justify-center rounded-full text-ink-faint hover:text-ink"
                aria-label={`Remove ${v}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="h-11 shrink-0 rounded-lg border border-border px-4 text-[13.5px] font-semibold text-ink-muted hover:border-brand/40 hover:text-ink"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/** A "select" that opens a searchable list — used anywhere someone picks a
 * job/service role from a longer list. Includes an optional trailing
 * "other" entry (shown under its own label, e.g. "Others") that reveals a
 * free-text field for a role that isn't in the list. */
export function SearchableSelect({
  options,
  value,
  onChange,
  otherOption,
  otherLabel = "Others",
  customValue = "",
  onCustomChange,
  customPlaceholder = "Tell us your role",
  searchPlaceholder = "Search…",
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  otherOption?: string;
  otherLabel?: string;
  customValue?: string;
  onCustomChange?: (v: string) => void;
  customPlaceholder?: string;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const suppressReopenUntil = useRef(0);

  const items = useMemo(
    () => options.map((o) => ({ value: o, label: o === otherOption ? otherLabel : o })),
    [options, otherOption, otherLabel]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const selectedLabel =
    value === otherOption ? customValue.trim() || otherLabel : items.find((i) => i.value === value)?.label ?? value;

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            // Guards against a stray re-open: some browsers replay a click
            // at this element's new position immediately after an option
            // selection collapses the panel underneath the pointer.
            if (Date.now() < suppressReopenUntil.current) return;
            setOpen((v) => !v);
          }}
          className={cn(fieldClasses, "flex items-center justify-between text-left")}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown size={15} className={cn("shrink-0 text-ink-faint transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-md">
              <div className="flex items-center gap-2 border-b border-border px-3">
                <Search size={14} className="shrink-0 text-ink-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-11 w-full bg-transparent text-[14px] text-ink placeholder:text-ink-faint outline-none"
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1.5">
                {filtered.length === 0 && (
                  <p className="px-3 py-2.5 text-[13px] text-ink-faint">No matching roles.</p>
                )}
                {filtered.map((i) => {
                  const active = i.value === value;
                  return (
                    <button
                      key={i.value}
                      type="button"
                      onClick={() => {
                        onChange(i.value);
                        setOpen(false);
                        setQuery("");
                        suppressReopenUntil.current = Date.now() + 400;
                      }}
                      className={cn(
                        "block w-full rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors",
                        active ? "bg-brand-tint font-medium text-brand-ink" : "text-ink hover:bg-surface-2"
                      )}
                    >
                      {i.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {value === otherOption && onCustomChange && (
        <div className="mt-2.5">
          <Input
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder={customPlaceholder}
          />
        </div>
      )}
    </div>
  );
}

/** Suggested chips the person can toggle, plus room to add their own —
 * used for "Why are you a good fit?" and similar open-ended-but-guided
 * questions. Builds a single values[] combining both. */
export function SuggestionChipInput({
  values,
  onChange,
  suggestions,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const customValues = values.filter((v) => !suggestions.includes(v));

  const toggle = (s: string) => {
    onChange(values.includes(s) ? values.filter((v) => v !== s) : [...values, s]);
  };

  function addCustom() {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => {
          const active = values.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
                active
                  ? "border-brand bg-brand-tint text-brand-ink"
                  : "border-border bg-surface text-ink-muted hover:border-brand/40 hover:text-ink"
              )}
            >
              {s}
            </button>
          );
        })}
      </div>

      {customValues.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {customValues.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pl-3 pr-2 text-[13px] font-medium text-ink"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="flex h-4 w-4 items-center justify-center rounded-full text-ink-faint hover:text-ink"
                aria-label={`Remove ${v}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={placeholder ?? "Add your own reason"}
        />
        <button
          type="button"
          onClick={addCustom}
          className="h-11 shrink-0 rounded-lg border border-border px-4 text-[13.5px] font-semibold text-ink-muted hover:border-brand/40 hover:text-ink"
        >
          Add
        </button>
      </div>
    </div>
  );
}
