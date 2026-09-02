"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ServiceRequest } from "@/lib/types";

type CustomerFlowState = {
  request: ServiceRequest | null;
  setRequest: (r: ServiceRequest) => void;
  selectedProviderId: string | null;
  setSelectedProviderId: (id: string | null) => void;
};

const CustomerFlowContext = createContext<CustomerFlowState | null>(null);

export function CustomerFlowProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  return (
    <CustomerFlowContext.Provider value={{ request, setRequest, selectedProviderId, setSelectedProviderId }}>
      {children}
    </CustomerFlowContext.Provider>
  );
}

export function useCustomerFlow() {
  const ctx = useContext(CustomerFlowContext);
  if (!ctx) throw new Error("useCustomerFlow must be used within CustomerFlowProvider");
  return ctx;
}
