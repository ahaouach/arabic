"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArabicColor } from "@/lib/types/colorsLesson.types";

export interface MemoryCardProps {
  /** Color this card represents (revealed when flipped). */
  color: ArabicColor;
  /** Face-up iff true — otherwise shows the cover. */
  flipped: boolean;
  /** Permanently matched: stays face-up + emerald ring. */
  matched: boolean;
  /** Disable interaction (flip animations running, or game over). */
  disabled?: boolean;
  /** Arabic ARIA label, e.g. "بِطَاقَةٌ مَقْلُوبَةٌ" or "بِطَاقَةٌ: أَحْمَرُ". */
  ariaLabel: string;
  onClick?: () => void;
  /** Stagger index for entrance animation. */
  index?: number;
}

/**
 * A single memory-game card. Uses a CSS 3D flip on the interactive
 * `<motion.button>` — front face is the cover, back face shows the
 * colour block + fully-vowelized Arabic name.
 *
 * Reduced-motion fallback: no rotation, just toggles which face is
 * visible via `opacity` (same React tree, no layout shift).
 *
 * Minimum tap target ≥96×96 so the face-down cover is comfortable
 * even with the full 6×6 grid on mobile.
 */
export default function MemoryCard({
  color,
  flipped,
  matched,
  disabled = false,
  ariaLabel,
  onClick,
  index = 0,
}: MemoryCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const showBack = flipped || matched;

  const ring = matched
    ? "ring-4 ring-emerald-500"
    : "ring-1 ring-black/5";

  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [12, 0] };
  const celebrate =
    matched && !prefersReducedMotion ? { scale: [1, 1.08, 1] } : undefined;

  const transition = celebrate
    ? { duration: 0.4, ease: "easeInOut" as const }
    : {
        delay: index * 0.03,
        type: "spring" as const,
        stiffness: 220,
        damping: 22,
      };

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={showBack}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={celebrate ?? entrance}
      whileHover={
        !disabled && !showBack && !prefersReducedMotion
          ? { y: -3, scale: 1.04 }
          : undefined
      }
      whileTap={
        !disabled && !prefersReducedMotion ? { scale: 0.96 } : undefined
      }
      transition={transition}
      className={`relative min-h-24 min-w-24 rounded-3xl bg-transparent transition-shadow ${ring} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
      }`}
      style={{ perspective: "800px", aspectRatio: "1 / 1" }}
    >
      {prefersReducedMotion ? (
        <ReducedFaces showBack={showBack} color={color} />
      ) : (
        <Flipper showBack={showBack}>
          <Face side="front">
            <CoverFace />
          </Face>
          <Face side="back">
            <ColorFace color={color} />
          </Face>
        </Flipper>
      )}
    </motion.button>
  );
}

function Flipper({
  showBack,
  children,
}: {
  showBack: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative h-full w-full"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: showBack ? 180 : 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function Face({
  side,
  children,
}: {
  side: "front" | "back";
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-3xl"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: side === "back" ? "rotateY(180deg)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

function ReducedFaces({
  showBack,
  color,
}: {
  showBack: boolean;
  color: ArabicColor;
}) {
  return (
    <div className="relative h-full w-full">
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-3xl transition-opacity duration-200 ${
          showBack ? "opacity-0" : "opacity-100"
        }`}
      >
        <CoverFace />
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-3xl transition-opacity duration-200 ${
          showBack ? "opacity-100" : "opacity-0"
        }`}
      >
        <ColorFace color={color} />
      </div>
    </div>
  );
}

function CoverFace() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-5xl text-white shadow-inner">
      <span aria-hidden>❓</span>
    </div>
  );
}

function ColorFace({ color }: { color: ArabicColor }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white p-3 shadow-inner">
      <div
        aria-hidden
        className="h-14 w-14 rounded-2xl ring-4 ring-white/80 sm:h-16 sm:w-16"
        style={{ backgroundColor: color.hex }}
      />
      <div
        lang="ar"
        dir="rtl"
        className="text-base font-black leading-tight text-gray-900 sm:text-lg"
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
        }}
      >
        {color.nameAr}
      </div>
    </div>
  );
}
