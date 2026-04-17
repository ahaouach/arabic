"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type DigitCellState = "idle" | "colored" | "wrong-flash";

export interface DigitGridProps {
  /** Digit to display at each cell index. Length must equal cols × rows. */
  digits: ReadonlyArray<number>;
  cols: number;
  rows: number;
  /** Per-cell state. Missing entries default to "idle". */
  stateByIndex?: Record<number, DigitCellState>;
  /** Colour applied to cells in the "colored" state (already resolved to hex). */
  coloredColor?: string;
  /** Tap handler; the grid is disabled if omitted. */
  onTap?: (index: number) => void;
  /** Disable all cells (e.g. while feedback plays). */
  disabled?: boolean;
  /**
   * Returns the aria-label for a given digit. Kept pluggable so different
   * callers can say things like "الرَّقْمُ تِسْعَةٌ" vs "رَقْمٌ آخَرُ".
   */
  ariaLabelForDigit?: (digit: number, index: number) => string;
}

/**
 * Reusable grid of Western Arabic digits. Every cell is a `<button>` with
 * a min 64 × 64 px hit box, keyboard accessible by default (Tab to move,
 * Enter / Space to activate). Cells in the "wrong-flash" state shake once
 * and show a red ✕ overlay (or fade, when reduced motion is preferred).
 *
 * Does not own any state — the parent zone decides which cells are
 * coloured or in flash state, so the grid stays reusable for future
 * variants (e.g. "color all the 5s in blue").
 */
export default function DigitGrid({
  digits,
  cols,
  rows,
  stateByIndex,
  coloredColor = "#DC2626",
  onTap,
  disabled = false,
  ariaLabelForDigit,
}: DigitGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const total = cols * rows;
  const safeDigits = digits.slice(0, total);

  return (
    <div
      role="grid"
      aria-rowcount={rows}
      aria-colcount={cols}
      className="grid gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {safeDigits.map((digit, i) => {
        const state = stateByIndex?.[i] ?? "idle";
        const isColored = state === "colored";
        const isWrong = state === "wrong-flash";

        const baseCls =
          "relative flex min-h-16 min-w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-black/5 text-5xl font-black tabular-nums transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed";

        const stateCls = isWrong
          ? "bg-rose-50"
          : isColored
            ? "bg-white"
            : "hover:shadow-lg";

        // Shake on wrong-flash (tween), bounce on colored (tween).
        const animate: Record<string, number[]> | undefined =
          isWrong && !prefersReducedMotion
            ? { x: [0, -5, 5, -3, 3, 0] }
            : isColored && !prefersReducedMotion
              ? { scale: [1, 1.2, 1] }
              : undefined;

        // Fade-only fallback for reduced motion.
        const fadeAnimate =
          prefersReducedMotion && (isWrong || isColored)
            ? { opacity: [0.6, 1] }
            : undefined;

        const label =
          ariaLabelForDigit?.(digit, i) ?? `Digit ${digit}`;

        return (
          <motion.button
            key={i}
            type="button"
            role="gridcell"
            aria-label={label}
            aria-pressed={isColored}
            onClick={() => !disabled && onTap?.(i)}
            disabled={disabled || isColored}
            animate={animate ?? fadeAnimate}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            whileHover={
              !disabled && !isColored && !prefersReducedMotion
                ? { y: -2, scale: 1.02 }
                : undefined
            }
            whileTap={
              !disabled && !isColored && !prefersReducedMotion
                ? { scale: 0.95 }
                : undefined
            }
            className={`${baseCls} ${stateCls}`}
            style={{
              // Western digits stay LTR regardless of parent direction.
              direction: "ltr",
              fontFamily: '"Nunito", system-ui, sans-serif',
              color: isColored ? coloredColor : "#1f2937",
            }}
          >
            {digit}
            {isWrong && (
              <WrongBadge prefersReducedMotion={!!prefersReducedMotion} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function WrongBadge({ prefersReducedMotion }: { prefersReducedMotion: boolean }): ReactNode {
  return (
    <motion.span
      aria-hidden
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-sm font-black text-white shadow-lg"
    >
      ✕
    </motion.span>
  );
}
