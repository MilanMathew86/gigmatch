import Link from "next/link";

const LINKS = [
  { label: "Find a Service", href: "/find-a-service" },
  { label: "Become a Provider", href: "/become-a-provider" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Matching Intelligence", href: "/matching-intelligence" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span className="font-display text-[16px] font-extrabold tracking-tight text-brand-ink">
          GIGMATCH
        </span>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13.5px] text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="text-[13px] text-ink-faint">&copy; {new Date().getFullYear()} GigMatch</span>
      </div>
    </footer>
  );
}
