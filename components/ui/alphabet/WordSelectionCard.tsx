"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export interface WordSelectionCardProps {
  word: VocabularyWord;
  selected: boolean;
  /** null = not yet validated; else shows ring + icon. */
  status: "idle" | "correct" | "wrong" | "missed";
  disabled?: boolean;
  onClick: () => void;
  index?: number;
}

/**
 * A tappable word card for Zone 5. Shows emoji + word (fully vowelized),
 * with a clear selected state and post-validation status rings.
 *
 * No target-letter highlighting here — the challenge is to find words
 * that contain the letter, so showing the highlight would defeat the
 * exercise.
 */
export default function WordSelectionCard({
  word,
  selected,
  status,
  disabled = false,
  onClick,
  index = 0,
}: WordSelectionCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : status === "missed"
          ? "ring-4 ring-amber-400 ring-dashed"
          : selected
            ? "ring-4 ring-gray-900"
            : "ring-1 ring-black/5";

  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;
  const celebrate =
    status === "correct" && !prefersReducedMotion
      ? { scale: [1, 1.08, 1] }
      : undefined;

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={`${word.word} — ${word.translit}`}
      aria-pressed={selected}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={shake ?? celebrate ?? { opacity: 1, y: 0 }}
      whileHover={
        !disabled && !prefersReducedMotion ? { y: -3, scale: 1.03 } : undefined
      }
      whileTap={
        !disabled && !prefersReducedMotion ? { scale: 0.96 } : undefined
      }
      transition={
        shake || celebrate
          ? { duration: 0.45, ease: "easeInOut" }
          : {
              delay: index * 0.03,
              type: "spring",
              stiffness: 220,
              damping: 22,
            }
      }
      className={`relative flex min-w-[9rem] flex-col items-center gap-3 rounded-[28px] bg-white p-5 text-center shadow-lg transition-shadow ${
        disabled ? "cursor-default opacity-80" : "cursor-pointer hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
      } ${ring}`}
      lang="ar"
      dir="rtl"
    >
      <span className="text-6xl" aria-hidden>
        {word.emoji}
      </span>
      <span
        className="text-3xl font-black leading-snug text-gray-900 sm:text-4xl"
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
        }}
      >
        {word.word}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {word.translit}
      </span>
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
      {status === "missed" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-base text-gray-900 shadow-lg"
        >
          !
        </span>
      )}
    </motion.button>
  );
}
