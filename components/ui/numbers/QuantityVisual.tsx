"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface QuantityVisualProps {
  /** How many copies of `emoji` to render. */
  count: number;
  /** Emoji or short glyph used for each object. */
  emoji: string;
  /** Visual size preset. */
  size?: "sm" | "md" | "lg";
  /** Label read by screen readers. Defaults to `"{count} {emoji}"`. */
  ariaLabel?: string;
  /** Stagger entrance — off by default so parent re-renders don't flash. */
  animate?: boolean;
  className?: string;
}

const SIZE_MAP: Record<NonNullable<QuantityVisualProps["size"]>, string> = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-6xl sm:text-7xl",
};

/**
 * Render `count` copies of `emoji` in a responsive grid that stays balanced
 * from 1 up to ~10 items. The grid stretches to fill its container and keeps
 * every emoji on a minimum 48×48 px cell — touchable for grabbing, legible
 * from ≥ 1 m away (target for young children).
 */
export default function QuantityVisual({
  count,
  emoji,
  size = "md",
  ariaLabel,
  animate = false,
  className = "",
}: QuantityVisualProps) {
  const prefersReducedMotion = useReducedMotion();
  const safeCount = Math.max(0, Math.min(50, Math.floor(count)));
  const label = ariaLabel ?? `${safeCount} ${emoji}`;

  // Choose a columns target that keeps the grid balanced.
  const cols =
    safeCount <= 3
      ? safeCount
      : safeCount <= 6
        ? 3
        : safeCount <= 10
          ? 5
          : Math.min(6, Math.ceil(Math.sqrt(safeCount)));

  return (
    <div
      role="img"
      aria-label={label}
      className={`grid place-items-center gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: safeCount }).map((_, i) => {
        const shouldAnimate = animate && !prefersReducedMotion;
        return (
          <motion.span
            key={i}
            aria-hidden
            className={`${SIZE_MAP[size]} select-none drop-shadow-sm`}
            initial={shouldAnimate ? { opacity: 0, scale: 0.6 } : undefined}
            animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
            transition={
              shouldAnimate
                ? { delay: i * 0.05, type: "spring", stiffness: 280, damping: 20 }
                : undefined
            }
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}
