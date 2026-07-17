import { cn } from "../../utils/cn";

interface GoldLineProps {
  thick?: boolean;
  shimmer?: boolean;
  className?: string;
}

export function GoldLine({ thick, shimmer, className }: GoldLineProps) {
  return (
    <hr
      className={cn(
        "gold-line",
        thick && "thick",
        shimmer && "shimmer-line",
        className,
      )}
      aria-hidden
    />
  );
}
