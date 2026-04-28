"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LetterGlyph as LetterGlyphType } from "@/lib/types/shapesLesson.types";

export interface LetterGlyphProps {
  /** The pre-split letter tuple (base + harakat + combined display + name). */
  letter: LetterGlyphType;
  /** Hex fill colour for the glyph text. `null` → muted grey outline. */
  fill?: string | null;
  /** Validation / selection status. */
  status?: "idle" | "correct" | "wrong" | "disabled";
  /** Disable interaction. Passive letters (not in the to-colour set) pass true. */
  disabled?: boolean;
  /** Arabic ARIA label (e.g. "حَرْفُ دَالٌ"). */
  ariaLabel: string;
  onClick?: () => void;
  /** Stagger index for entrance animation. */
  index?: number;
}

/**
 * A single tappable Arabic letter rendered at a large size with its
 * harakat preserved. The `display` string ("دَ", "ئِ", "ةٌ"…) is authored
 * in the seed so the combining marks are already joined — we never split
 * Unicode at runtime.
 *
 * Minimum tap target is 80×80 per spec. Text is `text-8xl` + Amiri so
 * the harakat stay legible for a 4-7 year old.
 */
export default function LetterGlyph({
  letter,
  fill = null,
  status = "idle",
  disabled = false,
  ariaLabel,
  onClick,
  index = 0,
}: LetterGlyphProps) {
  const prefersReducedMotion = useReducedMotion();
  const coloured = !!fill;

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : status === "disabled"
          ? "ring-1 ring-gray-200"
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
    : { opacity: [0, 1], y: [16, 0] };

  const interactive = !disabled && typeof onClick === "function";

  return (
    <motion.button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      aria-label={ariaLabel}
      aria-pressed={coloured}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        interactive && !prefersReducedMotion
          ? { y: -3, scale: 1.05 }
          : undefined
      }
      whileTap={interactive && !prefersReducedMotion ? { scale: 0.94 } : undefined}
      transition={
        shake || celebrate
          ? { duration: 0.45, ease: "easeInOut" }
          : { delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }
      }
      className={`relative flex min-h-20 min-w-20 items-center justify-center rounded-3xl bg-white p-5 shadow-lg transition-shadow ${!interactive ? "opacity-80 cursor-default" : "hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"} ${ring}`}
      lang="ar"
      dir="rtl"
    >
      <span
        className="text-7xl font-black leading-none transition-colors sm:text-8xl"
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
          color: fill ?? "#9ca3af",
          WebkitTextStroke: coloured ? "0" : "2px #1f2937",
        }}
      >
        {letter.display}
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
