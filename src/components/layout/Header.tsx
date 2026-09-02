"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Become a Provider", href: "/become-a-provider" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Matching Intelligence", href: "/matching-intelligence" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-display text-[18px] font-extrabold tracking-tight text-brand-ink">
            GIGMATCH
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[14px] font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/find-a-service"
            className="hidden h-10 items-center rounded-full bg-accent px-5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover lg:inline-flex"
          >
            Find a Service
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-surface-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <Link
              href="/find-a-service"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-[14.5px] font-semibold text-white"
            >
              Find a Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
