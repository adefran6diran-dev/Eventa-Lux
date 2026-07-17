import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-3xl tracking-wider text-[var(--color-ivory)]">
              Eventa<span className="text-[var(--color-gold)] italic">.</span>
            </h1>
          </Link>
          <div className="mt-4 space-y-2">
            <h2 className="font-display text-2xl text-[var(--color-ivory)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[var(--color-smoke)]">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
