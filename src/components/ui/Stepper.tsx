import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number; // 0-indexed
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold",
                  done && "bg-brand text-white",
                  active && "bg-brand-tint text-brand-ink ring-2 ring-brand/30",
                  !done && !active && "bg-surface-2 text-ink-faint"
                )}
              >
                {done ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[13px] font-medium sm:inline",
                  active ? "text-ink" : "text-ink-faint"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={cn("mx-1 h-px flex-1", done ? "bg-brand" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
