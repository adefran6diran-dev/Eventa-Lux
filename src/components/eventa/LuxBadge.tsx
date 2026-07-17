import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface LuxBadgeProps {
  children: ReactNode;
  variant?: "default" | "gold" | "success" | "error";
  className?: string;
}

export function LuxBadge({ children, variant = "default", className }: LuxBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        variant === "default" &&
          "border border-[var(--color-border)] text-[var(--color-smoke)]",
        variant === "gold" &&
          "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30",
        variant === "success" &&
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
        variant === "error" &&
          "bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/30",
        className,
      )}
    >
      {children}
    </span>
  );
}
