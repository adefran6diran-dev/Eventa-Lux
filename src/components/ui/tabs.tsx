import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-obsidian)] p-1",
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = "TabsList";

export const TabsTrigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-smoke)] transition-all hover:text-[var(--color-gold)] data-[state=active]:bg-[var(--color-gold)]/10 data-[state=active]:text-[var(--color-gold)]",
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props} />
  ),
);
TabsContent.displayName = "TabsContent";
