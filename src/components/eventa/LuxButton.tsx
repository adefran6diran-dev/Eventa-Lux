import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface LuxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const LuxButton = forwardRef<HTMLButtonElement, LuxButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)] disabled:pointer-events-none disabled:opacity-50",
          size === "sm" && "gap-1.5 rounded px-3 py-1.5 text-xs",
          size === "md" && "gap-2 rounded-md px-5 py-2.5 text-sm",
          size === "lg" && "gap-2.5 rounded-md px-7 py-3.5 text-base",
          variant === "solid" &&
            "bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-2)]",
          variant === "outline" &&
            "border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-obsidian)]",
          variant === "ghost" &&
            "text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10",
          className,
        )}
        {...props}
      />
    );
  },
);

LuxButton.displayName = "LuxButton";
