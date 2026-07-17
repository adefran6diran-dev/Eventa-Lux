import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] transition-colors focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
