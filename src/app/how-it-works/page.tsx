import Link from "next/link";
import { Button } from "@/components/ui/Button";

const CUSTOMER_STEPS = [
  { title: "Tell us what you need", body: "Service, location, timing, and any specific skills — a two-minute form." },
  { title: "See suitable providers", body: "GigMatch filters to providers who genuinely fit the job, then ranks them." },
  { title: "Choose and confirm", body: "Review profiles, pick who you trust, and send the request directly." },
];

const PROVIDER_STEPS = [
  { title: "Build your profile", body: "Add your skills, experience, location, and any qualifications — takes a few minutes." },
  { title: "Get matched to opportunities", body: "GigMatch surfaces requests that fit your profile, even before you have platform history." },
  { title: "Accept and get to work", body: "Accept opportunities you want; each completed job builds your track record." },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8 lg:py-20">
      <span className="text-[13px] font-semibold uppercase tracking-wide text-accent">How It Works</span>
      <h1 className="mt-2 font-display text-[32px] font-bold text-ink sm:text-[38px]">
        From request to the right person for the job.
      </h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-muted">
        GigMatch connects customers with service providers in two steps: first we find who&apos;s actually suitable,
        then we decide who gets the opportunity. Here&apos;s what that means for both sides.
      </p>

      <section className="mt-12">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">If you&apos;re hiring</h2>
        <ol className="mt-4 flex flex-col gap-5">
          {CUSTOMER_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[13px] font-bold text-brand-ink">
                {i + 1}
              </span>
              <div>
                <div className="text-[15px] font-semibold text-ink">{s.title}</div>
                <p className="mt-0.5 text-[14px] leading-relaxed text-ink-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-11 border-t border-border pt-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">If you provide services</h2>
        <ol className="mt-4 flex flex-col gap-5">
          {PROVIDER_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[13px] font-bold text-brand-ink">
                {i + 1}
              </span>
              <div>
                <div className="text-[15px] font-semibold text-ink">{s.title}</div>
                <p className="mt-0.5 text-[14px] leading-relaxed text-ink-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-11 rounded-2xl border border-brand/20 bg-brand-tint p-6 lg:p-7">
        <h2 className="font-display text-[19px] font-bold text-brand-ink">How GigMatch decides who to show</h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-brand-ink">
          Matching happens in two layers. First, <strong>suitability</strong>: we filter to providers who genuinely
          fit the request — right skills, right area, right availability. Only relevant, trustworthy providers ever
          reach a customer. Second, <strong>opportunity allocation</strong>: among those suitable providers, GigMatch
          balances known performance against uncertainty, so new providers with limited platform history still get a
          fair chance to be seen — not chosen at random, and never instead of a better-fitting provider.
        </p>
        <p className="mt-3 text-[14.5px] font-semibold text-brand-ink">
          Lack of platform history should not automatically be treated as lack of ability.
        </p>
        <Link href="/matching-intelligence" className="mt-4 inline-block text-[13.5px] font-semibold text-brand-ink underline underline-offset-2">
          See the research behind this →
        </Link>
      </section>

      <div className="mt-11 flex flex-wrap gap-3 border-t border-border pt-9">
        <Button href="/find-a-service">Find a Service</Button>
        <Button href="/become-a-provider" variant="secondary">
          Become a Provider
        </Button>
      </div>
    </div>
  );
}
