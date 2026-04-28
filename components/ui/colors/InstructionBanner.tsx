"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ArabicColor } from "@/lib/types/colorsLesson.types";

export interface InstructionBannerProps {
  /** The colour the child must apply. */
  color: ArabicColor;
  /** Optional vowelized Arabic prefix — defaults to "لَوِّنْ". */
  prefixAr?: string;
  /** Arabic label of the target glyph, fully vowelized. */
  targetArabicLabel: string;
  /** Western label (e.g. the digit "3"). Rendered LTR inside the RTL prefix. */
  targetDisplay: string;
  /** Currently active instruction? Highlighted vs muted. */
  active?: boolean;
  /** Completed instruction? Shows ✓. */
  done?: boolean;
  /** Replay audio handler. */
  onPlay?: () => void;
  /** Stagger index. */
  index?: number;
}

/**
 * One "colour X with the colour Y" instruction line.
 *
 * Arabic instructions keep harakat. Western digits are wrapped in
 * `<bdi dir="ltr">` so they render in natural reading order even inside
 * the RTL phrase.
 */
export default function InstructionBanner({
  color,
  prefixAr = "لَوِّنْ",
  targetArabicLabel,
  targetDisplay,
  active = false,
  done = false,
  onPlay,
  index = 0,
}: InstructionBannerProps) {
  const prefersReducedMotion = useReducedMotion();

  const state = done ? "done" : active ? "active" : "idle";
  const ring =
    state === "done"
      ? "ring-4 ring-emerald-400"
      : state === "active"
        ? "ring-4 ring-gray-900"
        : "ring-1 ring-black/5";

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
      animate={
        prefersReducedMotion
          ? undefined
          : state === "active"
            ? { opacity: 1, y: 0, scale: [1, 1.02, 1] }
            : { opacity: 1, y: 0 }
      }
      transition={
        state === "active" && !prefersReducedMotion
          ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          : { delay: index * 0.06, duration: 0.4, ease: "easeOut" }
      }
      className={`flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md ${ring} ${state === "idle" ? "opacity-60" : ""}`}
    >
      <div
        aria-hidden
        className="h-10 w-10 shrink-0 rounded-2xl ring-2 ring-white shadow-inner"
        style={{ backgroundColor: color.hex }}
      />
      <p
        lang="ar"
        dir="rtl"
        className="flex-1 text-lg font-black text-gray-900 sm:text-xl"
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
        }}
      >
        {prefixAr}{" "}
        <span className="text-amber-600">{targetArabicLabel}</span>{" "}
        <bdi dir="ltr" className="mx-1 tabular-nums text-gray-900">
          {targetDisplay}
        </bdi>{" "}
        بِاللَّوْنِ{" "}
        <span style={{ color: color.hex }}>{color.nameAr}</span>
        <span className="ms-1" aria-hidden>
          {color.emoji}
        </span>
      </p>
      <AnimatePresence>
        {state === "done" ? (
          <motion.span
            key="done"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-base font-black text-white shadow-lg"
            aria-hidden
          >
            ✓
          </motion.span>
        ) : (
          onPlay && (
            <motion.button
              key="play"
              type="button"
              onClick={onPlay}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              aria-label="Play the instruction"
              className="flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
            >
              🔊
            </motion.button>
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
}
