import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface LuxCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function LuxCard({ children, className, hover, glow, ...props }: LuxCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-6",
        hover && "transition-all duration-300 hover:border-[var(--color-gold)] hover:shadow-[0_0_24px_-4px_rgba(201,168,76,0.15)]",
        glow && "radial-gold-glow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
