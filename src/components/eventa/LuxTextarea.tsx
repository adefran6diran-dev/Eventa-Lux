import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface LuxTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const LuxTextarea = forwardRef<HTMLTextAreaElement, LuxTextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="label-eyebrow block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-md border bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] transition-colors duration-200 resize-y min-h-[100px]",
            "border-[var(--color-border)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]",
            error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  },
);

LuxTextarea.displayName = "LuxTextarea";
