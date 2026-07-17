import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Separator = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn("border-[var(--color-border)]", className)}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";
