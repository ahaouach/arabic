"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { NumberItem } from "@/lib/types/numbersLesson.types";

export type NumberCardSize = "sm" | "md" | "lg";

export interface NumberCardProps {
  number: NumberItem;
  /** Visual size — controls digit + card dimensions. */
  size?: NumberCardSize;
  /** Click handler. If provided, the card becomes a button. */
  onClick?: () => void;
  /** Hover handler. Commonly wired to `playAudio`. */
  onHover?: () => void;
  /** Visual state: pressed/selected. Adds a ring. */
  selected?: boolean;
  /** Status after validation (wraps the card in a coloured ring + icon). */
  status?: "correct" | "wrong" | null;
  /** Show the fully-vowelized Arabic name. Default: true. */
  showArabicName?: boolean;
  /** Show the romanised pronunciation. Default: false. */
  showTransliteration?: boolean;
  /** Show the Eastern-Arabic digit as a small footnote. Default: false. */
  showEasternDigit?: boolean;
  /** Disable interaction (pointer + keyboard). */
  disabled?: boolean;
  /** Stagger index for entrance animations. */
  index?: number;
}

const SIZE_MAP: Record<NumberCardSize, { digit: string; name: string; pad: string; box: string }> = {
  sm: { digit: "text-5xl sm:text-6xl", name: "text-xl", pad: "p-3", box: "min-h-[6rem]" },
  md: { digit: "text-7xl", name: "text-3xl", pad: "p-5", box: "min-h-[10rem]" },
  lg: { digit: "text-8xl sm:text-9xl", name: "text-4xl sm:text-5xl", pad: "p-6", box: "min-h-[14rem]" },
};

export default function NumberCard({
  number,
  size = "md",
  onClick,
  onHover,
  selected = false,
  status = null,
  showArabicName = true,
  showTransliteration = false,
  showEasternDigit = false,
  disabled = false,
  index = 0,
}: NumberCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const sizeCls = SIZE_MAP[size];
  const interactive = typeof onClick === "function";

  // Status wins over `selected`; both override the idle ring.
  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : selected
          ? "ring-4 ring-gray-900"
          : "ring-1 ring-black/5";

  const ariaLabel = `${number.nameAr} — ${number.display}`;

  const content = (
    <>
      {/* Western digit — kept LTR regardless of parent dir */}
      <span
        dir="ltr"
        className={`block font-black leading-none tracking-tight ${sizeCls.digit}`}
        style={{ fontFamily: '"Nunito", system-ui, sans-serif', color: number.colorTheme.text ?? "#111827" }}
      >
        {number.display}
      </span>

      {showArabicName && (
        <span
          lang="ar"
          dir="rtl"
          className={`mt-3 block font-black leading-relaxed ${sizeCls.name}`}
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif' }}
        >
          {number.nameAr}
        </span>
      )}

      {showTransliteration && (
        <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
          {number.transliteration}
        </span>
      )}

      {showEasternDigit && (
        <span
          lang="ar"
          dir="rtl"
          className="mt-2 block text-sm font-medium text-gray-500"
        >
          {number.displayEastern}
        </span>
      )}

      {/* Visible audio affordance — deaf/HoH still know the card speaks */}
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base shadow"
        >
          🔊
        </span>
      )}

      {/* Status icon — colour is paired with glyph for colour-blind accessibility */}
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
    </>
  );

  const baseCls = `relative flex flex-col items-center justify-center min-w-[4rem] min-h-[4rem] rounded-3xl shadow-lg transition-shadow text-center ${sizeCls.pad} ${sizeCls.box} ${ring}`;

  // Idle float — skip entirely if the user prefers reduced motion.
  const floatAnim = prefersReducedMotion
    ? undefined
    : { y: [0, -6, 0] };

  const animateShake =
    status === "wrong" && !prefersReducedMotion ? { x: [0, -6, 6, -4, 4, 0] } : undefined;
  const animateCelebrate =
    status === "correct" && !prefersReducedMotion ? { rotate: [0, -3, 3, 0] } : undefined;

  const initial = prefersReducedMotion
    ? undefined
    : { opacity: 0, y: 20, scale: 0.95 };
  const animate = prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 };

  if (!interactive) {
    return (
      <motion.div
        initial={initial}
        animate={animate}
        transition={{ delay: index * 0.06, type: "spring", stiffness: 200, damping: 20 }}
        className={baseCls}
        style={{ backgroundColor: number.colorTheme.bg }}
      >
        {content}
      </motion.div>
    );
  }

  // Multi-keyframe shake/celebrate must use tween, not spring (Framer Motion
  // spring only supports 2 keyframes). The entrance spring is separate.
  const isMultiFrame = Boolean(animateShake ?? animateCelebrate);
  const activeAnimate = animateShake ?? animateCelebrate ?? animate;
  const activeTransition = isMultiFrame
    ? { duration: 0.5, ease: "easeInOut" as const }
    : { delay: index * 0.06, type: "spring" as const, stiffness: 200, damping: 20 };

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onHover}
      onFocus={disabled ? undefined : onHover}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
      initial={initial}
      animate={activeAnimate}
      whileHover={!disabled && !prefersReducedMotion ? { y: -4, scale: 1.04 } : undefined}
      whileTap={!disabled && !prefersReducedMotion ? { scale: 0.96 } : undefined}
      transition={activeTransition}
      className={`${baseCls} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"}`}
      style={{ backgroundColor: number.colorTheme.bg }}
    >
      {/* Subtle idle float — separate wrapper so it doesn't fight with status animations */}
      {floatAnim && status === null && !selected ? (
        <motion.div
          className="contents"
          animate={floatAnim}
          transition={{ duration: 3 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </motion.button>
  );
}
