"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export interface VocabularyCardProps {
  word: VocabularyWord;
  /** Stagger index. */
  index?: number;
  /** Hover/focus handler — typically `playAudio(word)`. */
  onHover?: () => void;
  /** Click handler — typically `playAudio(word)` + `playAudio(letterName)`. */
  onClick?: () => void;
}

/**
 * A vocabulary word card: big emoji + the fully-vowelized word with the
 * target letter occurrences visually highlighted (amber). Harakat are
 * preserved because we render the seed-authored `display` strings,
 * never splitting Unicode at runtime.
 */
export default function VocabularyCard({
  word,
  index = 0,
  onHover,
  onClick,
}: VocabularyCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const interactive = typeof onClick === "function";

  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [16, 0] };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      aria-label={`${word.word} — ${word.translit}`}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={entrance}
      whileHover={
        interactive && !prefersReducedMotion
          ? { y: -3, scale: 1.03 }
          : undefined
      }
      whileTap={
        interactive && !prefersReducedMotion ? { scale: 0.96 } : undefined
      }
      transition={{
        delay: index * 0.04,
        type: "spring",
        stiffness: 200,
        damping: 22,
      }}
      className="relative flex min-w-[9rem] flex-col items-center gap-3 rounded-[28px] bg-white p-5 text-center shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
      lang="ar"
      dir="rtl"
    >
      <span className="text-6xl" aria-hidden>
        {word.emoji}
      </span>

      {/* Word with targeted letters highlighted */}
      <span
        className="flex items-baseline justify-center gap-[2px] text-4xl font-black leading-snug text-gray-900 sm:text-5xl"
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
        }}
      >
        {word.letters.map((ll, i) => (
          <span
            key={i}
            className={ll.isTarget ? "text-amber-600 underline decoration-amber-400 underline-offset-4" : ""}
          >
            {ll.display}
          </span>
        ))}
      </span>

      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {word.translit}
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base shadow"
      >
        🔊
      </span>
    </motion.button>
  );
}
