"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Provider } from "@/lib/types";
import { currentProviderId, getProviderById } from "@/lib/mock/providers";

type ProviderFlowState = {
  provider: Provider;
  setDraftProvider: (p: Provider) => void;
  hasOnboarded: boolean;
};

const ProviderFlowContext = createContext<ProviderFlowState | null>(null);

const fallbackProvider = getProviderById(currentProviderId)!;

export function ProviderFlowProvider({ children }: { children: ReactNode }) {
  const [draftProvider, setDraftProvider] = useState<Provider | null>(null);

  return (
    <ProviderFlowContext.Provider
      value={{
        provider: draftProvider ?? fallbackProvider,
        setDraftProvider,
        hasOnboarded: draftProvider !== null,
      }}
    >
      {children}
    </ProviderFlowContext.Provider>
  );
}

export function useProviderFlow() {
  const ctx = useContext(ProviderFlowContext);
  if (!ctx) throw new Error("useProviderFlow must be used within ProviderFlowProvider");
  return ctx;
}
