"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCustomerFlow } from "@/lib/customer-flow-context";

export function RequestProviderButton({ providerId }: { providerId: string }) {
  const router = useRouter();
  const { request, setSelectedProviderId } = useCustomerFlow();

  // A provider profile can be reached directly (a shared link, a bookmark)
  // without an active service request in context. Rather than letting
  // "Request Provider" dead-end on the confirm page, send that visitor to
  // start a request first — their provider choice is still remembered.
  if (!request) {
    return (
      <div>
        <Button
          size="md"
          className="w-full sm:w-auto"
          onClick={() => {
            setSelectedProviderId(providerId);
            router.push("/find-a-service");
          }}
        >
          Start a Request to Book
        </Button>
        <p className="mt-2 text-[12.5px] text-ink-faint">
          Tell us what you need first — we&apos;ll keep this provider in mind.
        </p>
      </div>
    );
  }

  return (
    <Button
      size="md"
      className="w-full sm:w-auto"
      onClick={() => {
        setSelectedProviderId(providerId);
        router.push("/find-a-service/confirm");
      }}
    >
      Request Provider
    </Button>
  );
}
