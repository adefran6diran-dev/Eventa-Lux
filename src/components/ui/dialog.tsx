import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const DialogOverlay = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-[var(--color-obsidian)]/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  ),
);
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-obsidian-2)] p-6 shadow-2xl",
        className,
      )}
      {...props}
    />
  ),
);
DialogContent.displayName = "DialogContent";
