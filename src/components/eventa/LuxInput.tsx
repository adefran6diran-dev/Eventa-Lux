import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface LuxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const LuxInput = forwardRef<HTMLInputElement, LuxInputProps>(
  ({ className, label, error, id, type, showPasswordToggle, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const [visible, setVisible] = useState(false);
    const isPasswordWithToggle = type === "password" && showPasswordToggle !== false;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="label-eyebrow block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPasswordWithToggle && visible ? "text" : type}
            className={cn(
              "w-full rounded-md border bg-[var(--color-obsidian)] px-4 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-smoke)] transition-colors duration-200",
              "border-[var(--color-border)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]",
              error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
              isPasswordWithToggle && "pr-10",
              className,
            )}
            {...props}
          />
          {isPasswordWithToggle && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-smoke)] hover:text-[var(--color-ivory)] transition-colors"
              tabIndex={-1}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  },
);

LuxInput.displayName = "LuxInput";
