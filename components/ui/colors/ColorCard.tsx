"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArabicColor } from "@/lib/types/colorsLesson.types";

export interface ColorCardProps {
  color: ArabicColor;
  /** Visual size preset. */
  size?: "sm" | "md" | "lg";
  /** Animation stagger index. */
  index?: number;
  /** Click handler. If provided the card becomes a button. */
  onClick?: () => void;
  /** Hover handler (typically `playAudio`). */
  onHover?: () => void;
  /** Mark as selected. Adds a ring. */
  selected?: boolean;
  /** Status after validation — rings + glyph. */
  status?: "correct" | "wrong" | null;
  /** Disable interaction (pointer + keyboard). */
  disabled?: boolean;
  /** Hide the Arabic name (used in Listen & Pick to avoid spoiling). */
  hideName?: boolean;
}

const SIZE_MAP: Record<NonNullable<ColorCardProps["size"]>, { pad: string; block: string; name: string }> = {
  sm: { pad: "p-3", block: "h-16 w-16", name: "text-xl" },
  md: { pad: "p-5", block: "h-28 w-28 sm:h-32 sm:w-32", name: "text-2xl sm:text-3xl" },
  lg: { pad: "p-6", block: "h-40 w-40", name: "text-4xl" },
};

/**
 * A pastel color card: big colored block + fully-vowelized Arabic name
 * + emoji + transliteration. Reused across every zone.
 *
 * `color.hex` is validated upstream by Zod (hex regex), so applying it
 * inline as `style={{ backgroundColor }}` cannot inject CSS.
 */
export default function ColorCard({
  color,
  size = "md",
  index = 0,
  onClick,
  onHover,
  selected = false,
  status = null,
  disabled = false,
  hideName = false,
}: ColorCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const sizeCls = SIZE_MAP[size];
  const interactive = typeof onClick === "function";

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : selected
          ? "ring-4 ring-gray-900"
          : "ring-1 ring-black/5";

  const ariaLabel = `${color.nameAr} — ${color.transliteration}`;

  const content = (
    <>
      <div
        aria-hidden
        className={`${sizeCls.block} rounded-3xl shadow-inner ring-4 ring-white/80`}
        style={{ backgroundColor: color.hex }}
      />
      {!hideName && (
        <div
          lang="ar"
          dir="rtl"
          className={`font-black leading-relaxed text-gray-900 ${sizeCls.name}`}
          style={{
            fontFamily:
              '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
          }}
        >
          {color.nameAr}
        </div>
      )}
      {!hideName && (
        <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500">
          <span aria-hidden>{color.emoji}</span>
          <span>{color.transliteration}</span>
        </div>
      )}

      {status === "correct" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-base text-white shadow-lg"
        >
          ✓
        </span>
      )}
      {status === "wrong" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-base text-white shadow-lg"
        >
          ✕
        </span>
      )}
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base shadow"
        >
          🔊
        </span>
      )}
    </>
  );

  const baseCls = `relative flex min-w-[8rem] flex-col items-center gap-3 rounded-[32px] bg-white shadow-lg transition-shadow text-center ${sizeCls.pad} ${ring}`;

  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;
  const celebrate =
    status === "correct" && !prefersReducedMotion
      ? { scale: [1, 1.08, 1] }
      : undefined;

  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [16, 0] };

  const transition = shake || celebrate
    ? { duration: 0.45, ease: "easeInOut" as const }
    : { delay: index * 0.05, type: "spring" as const, stiffness: 200, damping: 20 };

  if (!interactive) {
    return (
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={baseCls}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onHover}
      onFocus={disabled ? undefined : onHover}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        !disabled && !prefersReducedMotion ? { y: -4, scale: 1.04 } : undefined
      }
      whileTap={
        !disabled && !prefersReducedMotion ? { scale: 0.96 } : undefined
      }
      transition={transition}
      className={`${baseCls} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"}`}
    >
      {content}
    </motion.button>
  );
}
