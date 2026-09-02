import { cn } from "@/lib/utils";

/** A plain, listing-style match badge — deliberately not a radial "AI"
 * progress ring, so it reads as ordinary marketplace UI. */
export function MatchScore({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border border-brand/20 bg-brand-tint px-2 py-1 font-mono text-[12.5px] font-semibold text-brand-ink",
        className
      )}
    >
      {score}% match
    </span>
  );
}
