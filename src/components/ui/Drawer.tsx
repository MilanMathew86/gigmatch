"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function Drawer({
  trigger,
  title,
  children,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        {trigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h3 className="font-display text-[18px] font-semibold text-ink">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-2"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
