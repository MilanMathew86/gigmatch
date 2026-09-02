import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  color,
  size = 48,
  verified = false,
}: {
  initials: string;
  color: string; // solid Tailwind bg-* token, e.g. "bg-brand"
  size?: number;
  verified?: boolean;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full font-display font-semibold text-white",
          color
        )}
        style={{ fontSize: size * 0.36 }}
      >
        {initials}
      </div>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-brand ring-2 ring-surface">
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5L4.75 8.75L9.5 3.5"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}
