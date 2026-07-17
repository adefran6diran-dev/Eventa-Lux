import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const icons: Record<string, ReactNode> = {
  venue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  ),
  catering: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  photography: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  decoration: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" />
      <path d="M12 14v8" />
      <path d="M9 22h6" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  makeup: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <path d="M14 6h-4" />
      <rect x="4" y="14" width="7" height="8" rx="1.5" />
      <rect x="14" y="14" width="7" height="8" rx="1.5" />
    </svg>
  ),
  fashion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 2l3 4h2l-3 6h-2l-3-6h2z" />
      <path d="M18 2l-3 4h-2l3 6h2l3-6h-2z" />
      <path d="M3 22v-6c0-2 1-4 3-4h12c2 0 3 2 3 4v6" />
    </svg>
  ),
  planning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  ),
  transportation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M5 17h14" />
      <path d="M5 17a2 2 0 1 1-4 0V8l3-4h12l3 4v9a2 2 0 1 1-4 0" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M8 4h8" />
      <path d="M5 8h14" />
    </svg>
  ),
  jewelry: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l3 4-3 6-3-6z" />
      <path d="M6 10l6 12 6-12" />
      <path d="M2 16l4-2 2 4" />
      <path d="M22 16l-4-2-2 4" />
    </svg>
  ),
};

export function CategoryIcon({ category, className, size = "md" }: CategoryIconProps) {
  const icon = icons[category.toLowerCase()];

  if (!icon) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-obsidian)] text-[var(--color-gold)]",
          size === "sm" && "h-8 w-8",
          size === "md" && "h-10 w-10",
          size === "lg" && "h-14 w-14",
          className,
        )}
        role="img"
        aria-label={category}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border transition-all duration-300",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-14 w-14",
        "border-[var(--color-gold)]/30 bg-[var(--color-obsidian)] text-[var(--color-gold)]",
        "group-hover:bg-[var(--color-gold)]/10 group-hover:border-[var(--color-gold)] group-hover:shadow-[0_0_20px_-4px_var(--color-gold)]",
        className,
      )}
      role="img"
      aria-label={category}
    >
      {icon}
    </span>
  );
}
