"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface LetterGlyphProps {
  /** Pre-combined display string (e.g. "بَ", "ب", "ـبـ"). Harakat preserved. */
  glyph: string;
  /** Fill colour for the glyph text. `null` = grey outline. */
  fill?: string | null;
  /** Validation / selection status. */
  status?: "idle" | "selected" | "correct" | "wrong";
  /** Disable interaction (passive letter in a word, already coloured, etc.). */
  disabled?: boolean;
  /** Arabic ARIA label (e.g. "حَرْفُ بَاءٍ"). */
  ariaLabel: string;
  onClick?: () => void;
  /** Stagger index for entrance animation. */
  index?: number;
  /** Visual size preset. */
  size?: "md" | "lg";
}

const SIZE_MAP: Record<NonNullable<LetterGlyphProps["size"]>, {
  pad: string;
  min: string;
  text: string;
}> = {
  md: {
    pad: "p-3",
    min: "min-h-16 min-w-16",
    text: "text-5xl sm:text-6xl",
  },
  lg: {
    pad: "p-5",
    min: "min-h-20 min-w-20",
    text: "text-7xl sm:text-8xl",
  },
};

/**
 * Tappable Arabic letter button. Accepts the pre-combined `glyph` string
 * (base + harakat already joined by the seed) so no runtime Unicode
 * splitting happens. Used across zones 1/3/4 wherever the child has to
 * interact with a single letter.
 */
export default function LetterGlyph({
  glyph,
  fill = null,
  status = "idle",
  disabled = false,
  ariaLabel,
  onClick,
  index = 0,
  size = "lg",
}: LetterGlyphProps) {
  const prefersReducedMotion = useReducedMotion();
  const coloured = !!fill;
  const sizeCls = SIZE_MAP[size];
  const interactive = !disabled && typeof onClick === "function";

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : status === "selected"
          ? "ring-4 ring-gray-900"
          : coloured
            ? "ring-2 ring-gray-300"
            : "ring-2 ring-gray-200";

  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;
  const celebrate =
    status === "correct" && !prefersReducedMotion
      ? { scale: [1, 1.12, 1] }
      : undefined;
  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [12, 0] };

  const transition =
    shake || celebrate
      ? { duration: 0.45, ease: "easeInOut" as const }
      : {
          delay: index * 0.03,
          type: "spring" as const,
          stiffness: 220,
          damping: 22,
        };

  return (
    <motion.button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      aria-label={ariaLabel}
      aria-pressed={coloured || status === "selected"}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        interactive && !prefersReducedMotion
          ? { y: -3, scale: 1.05 }
          : undefined
      }
      whileTap={
        interactive && !prefersReducedMotion ? { scale: 0.94 } : undefined
      }
      transition={transition}
      className={`relative flex items-center justify-center rounded-3xl bg-white shadow-lg transition-shadow ${
        interactive
          ? "hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 cursor-pointer"
          : "opacity-80 cursor-default"
      } ${ring} ${sizeCls.pad} ${sizeCls.min}`}
      lang="ar"
      dir="rtl"
    >
      <span
        className={`font-black leading-none transition-colors ${sizeCls.text}`}
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
          color: fill ?? "#9ca3af",
          WebkitTextStroke: coloured ? "0" : "2px #1f2937",
        }}
      >
        {glyph}
      </span>
      {status === "correct" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm text-white shadow-lg"
        >
          ✓
        </span>
      )}
      {status === "wrong" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm text-white shadow-lg"
        >
          ✕
        </span>
      )}
    </motion.button>
  );
}
