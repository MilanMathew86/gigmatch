import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SupportingSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-10 sm:flex-row sm:items-center">
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Match based on what actually matters — skills, availability,
          location and experience.
        </p>
        <Link
          href="/how-it-works"
          className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-brand"
        >
          How it works
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
