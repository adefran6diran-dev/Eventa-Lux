import { cn } from "../../utils/cn";

interface DiamondRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function DiamondRating({ rating, max = 5, size = "sm", className }: DiamondRatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={cn(
            size === "sm" ? "h-3 w-3" : "h-4 w-4",
            i < Math.round(rating) ? "text-[var(--color-gold)]" : "text-[var(--color-smoke)]",
          )}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
