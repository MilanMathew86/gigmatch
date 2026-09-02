import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "new" | "urgent";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-muted",
  brand: "bg-brand-tint text-brand-ink",
  new: "bg-accent-tint text-accent-hover",
  urgent: "bg-accent text-white",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-semibold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
