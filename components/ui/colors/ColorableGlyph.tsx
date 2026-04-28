"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface ColorableGlyphProps {
  /** Glyph to render. Can be a Western digit ("3") or an Arabic letter. */
  glyph: string;
  /** `"digit"` keeps the glyph LTR + Nunito; `"letter"` is RTL + Amiri. */
  variant: "digit" | "letter";
  /** Hex colour to fill with once tapped. Falls back to grey outline. */
  fill?: string | null;
  /** Status after a tap. */
  status?: "correct" | "wrong" | "idle";
  /** Disable interaction. */
  disabled?: boolean;
  /** Arabic ARIA label (e.g. "الرَّقْمُ ثَلَاثَةٌ" or "حَرْفُ السِّينِ"). */
  ariaLabel: string;
  onClick?: () => void;
  /** Stagger index for entrance animation. */
  index?: number;
}

/**
 * A single colourable digit or letter. Pure presentational — state lives
 * in the parent zone. Used by `ColorDigitsZone` (variant="digit") and
 * `ColorLettersZone` (variant="letter").
 */
export default function ColorableGlyph({
  glyph,
  variant,
  fill,
  status = "idle",
  disabled = false,
  ariaLabel,
  onClick,
  index = 0,
}: ColorableGlyphProps) {
  const prefersReducedMotion = useReducedMotion();
  const coloured = !!fill;

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : coloured
          ? "ring-2 ring-gray-300"
          : "ring-2 ring-gray-200";

  const fontFamily =
    variant === "letter"
      ? '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif'
      : '"Nunito", system-ui, sans-serif';

  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;
  const celebrate =
    status === "correct" && !prefersReducedMotion
      ? { scale: [1, 1.15, 1] }
      : undefined;
  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [16, 0] };

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={coloured}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        !disabled && !prefersReducedMotion ? { y: -3, scale: 1.04 } : undefined
      }
      whileTap={
        !disabled && !prefersReducedMotion ? { scale: 0.94 } : undefined
      }
      transition={
        shake || celebrate
          ? { duration: 0.45, ease: "easeInOut" }
          : { delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }
      }
      className={`relative flex min-h-20 min-w-20 items-center justify-center rounded-3xl bg-white p-5 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed ${ring}`}
      lang={variant === "letter" ? "ar" : undefined}
      dir={variant === "letter" ? "rtl" : "ltr"}
    >
      <span
        className="text-7xl font-black leading-none transition-colors sm:text-8xl"
        style={{
          fontFamily,
          color: fill ?? "#9ca3af",
          WebkitTextStroke: coloured ? "0" : "2px #1f2937",
        }}
      >
        {glyph}
      </span>
    </motion.button>
  );
}
