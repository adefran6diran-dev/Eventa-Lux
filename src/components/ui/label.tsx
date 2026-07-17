import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";
