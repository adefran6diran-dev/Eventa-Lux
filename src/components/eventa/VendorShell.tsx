import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { GoldLine } from "./GoldLine";

interface VendorShellProps {
  children: ReactNode;
  title: string;
}

const navItems = [
  { label: "Dashboard", to: "/vendor/dashboard", icon: "◆" },
  { label: "Bookings", to: "/vendor/bookings", icon: "◇" },
  { label: "Messages", to: "/vendor/messages", icon: "✉" },
  { label: "Profile", to: "/vendor/profile", icon: "◎" },
];

export function VendorShell({ children, title }: VendorShellProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[var(--color-obsidian)]">
      <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-56 flex-col border-r border-[var(--color-border)] bg-[var(--color-obsidian-2)]">
        <div className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-all",
                  active
                    ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                    : "text-[var(--color-smoke)] hover:text-[var(--color-gold)]",
                )}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="border-t border-[var(--color-border)] p-4">
          <Link
            to="/"
            className="text-xs text-[var(--color-smoke)] hover:text-[var(--color-gold)] transition-colors"
          >
            &larr; Back to Eventa
          </Link>
        </div>
      </aside>
      <main className="ml-56 flex-1 px-8 py-8">
        <div className="mb-8">
          <span className="label-eyebrow">Vendor Portal</span>
          <h1 className="font-display mt-1 text-2xl text-[var(--color-ivory)]">{title}</h1>
          <GoldLine className="mt-3" />
        </div>
        {children}
      </main>
    </div>
  );
}
