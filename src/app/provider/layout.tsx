"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Dashboard", href: "/provider/dashboard" },
  { label: "Opportunities", href: "/provider/opportunities" },
  { label: "Profile", href: "/provider/profile" },
  { label: "Job History", href: "/provider/history" },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-6 lg:px-10">
          {TABS.map((tab) => {
            const active = pathname === tab.href || (tab.href !== "/provider/dashboard" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-3.5 text-[13.5px] font-semibold transition-colors",
                  active ? "border-brand text-ink" : "border-transparent text-ink-muted hover:text-ink"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">{children}</div>
    </div>
  );
}
