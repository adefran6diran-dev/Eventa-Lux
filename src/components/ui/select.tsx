import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] transition-colors focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
