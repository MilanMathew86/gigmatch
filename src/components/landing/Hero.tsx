import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProviderCard } from "@/components/provider/ProviderCard";
import { providers } from "@/lib/mock/providers";

const exampleProvider = providers.find((p) => p.id === "prov_anjali_thomas")!;

export function Hero() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.85fr] lg:gap-10 lg:py-24">
        <div>
          <h1 className="max-w-lg font-display text-[38px] font-bold leading-[1.12] text-ink sm:text-[46px]">
            Find the right person for the right job.
          </h1>

          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-muted">
            Tell us what you need. GigMatch shows you suitable, verified
            professionals nearby — ranked by fit, not just who&apos;s been around
            longest.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/find-a-service" size="md">
              Find a Service
              <ArrowRight size={17} />
            </Button>
            <Button href="/become-a-provider" variant="secondary" size="md">
              Become a Provider
            </Button>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-[12px] font-medium text-ink-faint">
            Example result for &ldquo;Elder care, tomorrow&rdquo;
          </span>
          <ProviderCard provider={exampleProvider} matchScore={94} />
        </div>
      </div>
    </section>
  );
}
