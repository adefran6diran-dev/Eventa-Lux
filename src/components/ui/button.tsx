import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-obsidian)] transition-colors hover:bg-[var(--color-gold-2)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-obsidian)] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
