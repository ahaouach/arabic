"use client";

/**
 * Reusable vocabulary item card: icon glyph + vowelised name +
 * optional transliteration + idle animation.
 *
 * 5 visual states: idle / selected / correct / wrong / locked.
 * Idle animation is applied to the icon glyph only (so the text label
 * stays readable). Reduced-motion users get a still card.
 *
 * Mirrors `FamilyMemberCard` but generic over vocabulary items.
 */

import { motion, useReducedMotion } from "framer-motion";
import VocabularyRenderer from "./VocabularyRenderer";
import { getIdleAnimation } from "@/lib/utils/idleAnimations";
import type { VocabularyItem } from "@/lib/types/vocabularyLesson.types";

export type VocabularyCardStatus = "idle" | "selected" | "correct" | "wrong" | "locked";

interface VocabularyCardProps {
  item: VocabularyItem;
  /** Theme slug, forwarded to the icon registry resolver. */
  theme: string;
  status?: VocabularyCardStatus;
  onClick?: () => void;
  /** Stagger / entrance delay, in index units. */
  index?: number;
  /** Shorter card, no transliteration. */
  compact?: boolean;
  /** Render the icon in outlined (grey) state. */
  outlined?: boolean;
  /** Dynamic fill applied to the icon stroke. */
  fillColor?: string;
  /** Visual size for the inner icon. */
  iconSize?: number;
  /** Optional secondary caption override (`null` hides). */
  captionOverride?: string | null;
  /** Suppress the per-item idle animation (e.g. inside a Listen-Pick row). */
  disableIdle?: boolean;
  disabled?: boolean;
}

export default function VocabularyCard({
  item,
  theme,
  status = "idle",
  onClick,
  index = 0,
  compact = false,
  outlined = false,
  fillColor,
  iconSize,
  captionOverride,
  disableIdle = false,
  disabled,
}: VocabularyCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const interactive = !disabled && typeof onClick === "function" && status !== "locked";

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : status === "selected"
          ? "ring-4 ring-violet-500"
          : status === "locked"
            ? "ring-2 ring-gray-200"
            : "ring-2 ring-gray-200 hover:ring-violet-300";

  // Card-level entrance / shake / celebrate animations.
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

  const transition =
    shake || celebrate
      ? { duration: 0.45, ease: "easeInOut" as const }
      : {
          delay: index * 0.05,
          type: "spring" as const,
          stiffness: 240,
          damping: 22,
        };

  // Idle animation — applied to the glyph only, paused when the card
  // is in a non-idle state so feedback animations don't fight the loop.
  const idleEnabled =
    !disableIdle && status === "idle" && !disabled && !prefersReducedMotion;
  const idle = getIdleAnimation(
    idleEnabled ? item.idleAnimation : undefined,
    !idleEnabled,
  );

  return (
    <motion.button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      aria-label={item.nameAr}
      aria-pressed={status === "selected" || status === "correct"}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        interactive && !prefersReducedMotion ? { y: -4, scale: 1.03 } : undefined
      }
      whileTap={interactive && !prefersReducedMotion ? { scale: 0.97 } : undefined}
      transition={transition}
      className={`relative flex flex-col items-center gap-3 rounded-3xl bg-white p-4 shadow-md transition-shadow ${
        interactive
          ? "hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70 cursor-pointer"
          : "opacity-90 cursor-default"
      } ${status === "locked" ? "opacity-60" : ""} ${ring}`}
    >
      <motion.div
        className="flex items-center justify-center"
        animate={idle.animate}
        transition={idle.transition}
      >
        <VocabularyRenderer
          theme={theme}
          iconKey={item.iconKey}
          size={iconSize ?? (compact ? 96 : 140)}
          outlined={outlined}
          fillColor={fillColor}
          aria-label={item.nameAr}
        />
      </motion.div>

      <div className="flex flex-col items-center gap-0.5" dir="rtl" lang="ar">
        <span
          className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} font-black text-gray-900 leading-tight`}
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {item.nameAr}
        </span>
        {!compact && captionOverride !== null && (
          <span
            className="text-sm text-gray-500"
            style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
            dir="ltr"
          >
            {captionOverride ?? item.transliteration}
          </span>
        )}
      </div>

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
