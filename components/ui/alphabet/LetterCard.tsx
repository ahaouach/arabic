"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArabicLetter } from "@/lib/types/alphabetLesson.types";

export interface LetterCardProps {
  letter: ArabicLetter;
  /** Zones completed for this letter (0..totalZones). */
  completed: number;
  /** Total zones in the journey (for the progress ring denominator). */
  totalZones: number;
  /** Animation stagger index. */
  index?: number;
  onClick?: () => void;
  /** Card size preset. */
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP: Record<NonNullable<LetterCardProps["size"]>, {
  pad: string;
  char: string;
  name: string;
  ring: number; // radius
}> = {
  sm: { pad: "p-3", char: "text-5xl sm:text-6xl", name: "text-sm", ring: 18 },
  md: {
    pad: "p-5",
    char: "text-7xl sm:text-8xl",
    name: "text-xl",
    ring: 22,
  },
  lg: { pad: "p-6", char: "text-8xl", name: "text-2xl", ring: 26 },
};

/**
 * Entry-grid card for a single Arabic letter: big isolated glyph + the
 * letter's fully-vowelized name + a tiny progress ring (top-right).
 *
 * The ring uses a standard `stroke-dasharray` / `stroke-dashoffset`
 * technique so progress animates smoothly without extra JS.
 */
export default function LetterCard({
  letter,
  completed,
  totalZones,
  index = 0,
  onClick,
  size = "md",
}: LetterCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const sizeCls = SIZE_MAP[size];
  const complete = totalZones > 0 && completed >= totalZones;

  const ariaLabel = `${letter.nameAr} — ${letter.transliteration}. ${
    totalZones > 0 ? `${completed} of ${totalZones} zones complete` : ""
  }`;

  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [16, 0] };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={entrance}
      whileHover={
        prefersReducedMotion ? undefined : { y: -4, scale: 1.04 }
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      transition={{
        delay: index * 0.02,
        type: "spring",
        stiffness: 200,
        damping: 22,
      }}
      className={`relative flex min-w-[8rem] flex-col items-center gap-2 rounded-[32px] bg-white text-center shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
        complete ? "ring-4 ring-emerald-400" : "ring-1 ring-black/5"
      } ${sizeCls.pad}`}
      lang="ar"
      dir="rtl"
    >
      <ProgressRing
        completed={completed}
        total={totalZones}
        radius={sizeCls.ring}
      />

      <span
        className={`font-black leading-none text-gray-900 ${sizeCls.char}`}
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
        }}
      >
        {letter.forms.isolated}
      </span>
      <span
        className={`font-black text-gray-800 ${sizeCls.name}`}
        style={{
          fontFamily:
            '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
        }}
      >
        {letter.nameAr}
      </span>
      <span className="text-[0.7rem] font-medium uppercase tracking-widest text-gray-500">
        {letter.transliteration}
      </span>
    </motion.button>
  );
}

function ProgressRing({
  completed,
  total,
  radius,
}: {
  completed: number;
  total: number;
  radius: number;
}) {
  const stroke = 4;
  const cx = radius + stroke;
  const cy = radius + stroke;
  const r = radius;
  const size = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * r;
  const progress = total === 0 ? 0 : Math.min(1, completed / total);
  const dashOffset = circumference * (1 - progress);
  const color =
    progress === 1 ? "#10b981" : progress > 0 ? "#0ea5e9" : "#e5e7eb";

  return (
    <span
      aria-hidden
      className="absolute left-2 top-2 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.2s" }}
        />
      </svg>
      <span className="absolute text-[0.65rem] font-black tabular-nums text-gray-700">
        {completed}/{total}
      </span>
    </span>
  );
}
