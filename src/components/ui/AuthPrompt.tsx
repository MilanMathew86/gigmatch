"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";

/** Contextual, lightweight auth touchpoint — shown inside a flow rather than
 * as a global Sign In button. Prototype-only: it never blocks the flow. */
export function AuthPrompt({ context }: { context: "customer" | "provider" }) {
  const [mode, setMode] = useState<"signin" | "create" | null>(null);

  return (
    <>
      <p className="text-[13px] text-ink-muted">
        Already have an account?{" "}
        <button type="button" onClick={() => setMode("signin")} className="font-semibold text-brand hover:underline">
          Sign in
        </button>{" "}
        · New to GigMatch?{" "}
        <button type="button" onClick={() => setMode("create")} className="font-semibold text-brand hover:underline">
          Create account
        </button>
      </p>

      {mode && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            aria-label="Close"
            onClick={() => setMode(null)}
            className="absolute inset-0 bg-ink/30"
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-2"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <h3 className="font-display text-[17px] font-semibold text-ink">
              {mode === "signin" ? "Sign in" : "Create your account"}
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted">
              {context === "customer" ? "Customer account" : "Provider account"} · prototype only
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Input type="email" placeholder="Email address" defaultValue="" />
              <Input type="password" placeholder="Password" defaultValue="" />
              <Button type="button" onClick={() => setMode(null)} className="mt-1 w-full">
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
              <p className="text-center text-[12px] text-ink-faint">
                This is a prototype — no account is actually created.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
