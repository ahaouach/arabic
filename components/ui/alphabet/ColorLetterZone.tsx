"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import LetterGlyph from "./LetterGlyph";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import {
  generateRoundSeed,
  mulberry32,
  pickOne,
  pickRandom,
  randomInt,
  shuffle,
} from "@/lib/utils/random";
import type {
  ArabicLetter,
  ColorLetterZone as ColorLetterZoneType,
  LetterForm,
} from "@/lib/types/alphabetLesson.types";

export interface ColorLetterZoneProps {
  letter: ArabicLetter;
  /** All 28 letters — distractors are drawn from this pool minus `letter`. */
  allLetters: ArabicLetter[];
  zone: ColorLetterZoneType;
  onComplete?: () => void;
  onAdvance?: () => void;
}

/** Named → hex mapping for the `targetColor` config. Unknown names fall back to red. */
const NAMED_COLORS: Record<string, string> = {
  red: "#DC2626",
  blue: "#2563EB",
  green: "#16A34A",
  yellow: "#CA8A04",
  purple: "#9333EA",
  orange: "#F97316",
  pink: "#DB2777",
};

const RANDOMISABLE_COLORS = Object.keys(NAMED_COLORS);

interface Cell {
  /** Letter this cell belongs to (lets us match `letter.char`). */
  letter: ArabicLetter;
  /** Pre-rendered display form (isolated or any connected form when `mixForms`). */
  display: string;
  /** Stable key for React. */
  id: string;
  isTarget: boolean;
}

function resolveColor(configValue: string, seed: number): string {
  if (configValue === "random") {
    const rand = mulberry32(seed);
    const idx = Math.floor(rand() * RANDOMISABLE_COLORS.length);
    return NAMED_COLORS[RANDOMISABLE_COLORS[idx]];
  }
  return NAMED_COLORS[configValue] ?? NAMED_COLORS.red;
}

function buildGrid(
  letter: ArabicLetter,
  allLetters: ArabicLetter[],
  zone: ColorLetterZoneType,
  seed: number,
): Cell[] {
  const cells = zone.gridCols * zone.gridRows;
  const rand = mulberry32(seed);

  const targetCount = Math.min(
    randomInt(zone.targetCountMin, zone.targetCountMax, seed),
    cells - 1,
  );

  const distractorPool = allLetters.filter((l) => l.key !== letter.key);
  const distractorCount = cells - targetCount;

  const pickForm = (l: ArabicLetter): string => {
    if (!zone.mixForms) return l.forms.isolated;
    const keys: (keyof LetterForm)[] = ["isolated", "initial", "medial", "final"];
    const k = keys[Math.floor(rand() * keys.length)];
    return l.forms[k];
  };

  const targetCells: Cell[] = Array.from({ length: targetCount }, (_, i) => ({
    letter,
    display: pickForm(letter),
    id: `t-${i}`,
    isTarget: true,
  }));

  const distractorCells: Cell[] = Array.from(
    { length: distractorCount },
    (_, i) => {
      const d = pickOne(distractorPool, seed + i * 17 + 1);
      return {
        letter: d,
        display: pickForm(d),
        id: `d-${i}`,
        isTarget: false,
      };
    },
  );

  return shuffle([...targetCells, ...distractorCells], seed + 2);
}

export default function ColorLetterZone({
  letter,
  allLetters,
  zone,
  onComplete,
  onAdvance,
}: ColorLetterZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const grid = useMemo<Cell[]>(() => {
    if (seed === null) return [];
    return buildGrid(letter, allLetters, zone, seed);
  }, [letter, allLetters, zone, seed]);

  const targetColor = useMemo(
    () => (seed === null ? NAMED_COLORS.red : resolveColor(zone.targetColor, seed)),
    [zone.targetColor, seed],
  );

  const [coloured, setColoured] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);

  const targetIds = useMemo(
    () => grid.filter((c) => c.isTarget).map((c) => c.id),
    [grid],
  );
  const total = targetIds.length;
  const done = coloured.size;
  const allDone = total > 0 && done >= total;

  useEffect(() => {
    if (allDone && !notified) {
      setNotified(true);
      onComplete?.();
    }
  }, [allDone, notified, onComplete]);

  const onTapCell = useCallback(
    (cell: Cell) => {
      if (coloured.has(cell.id)) return;
      if (cell.isTarget) {
        setColoured((prev) => {
          const next = new Set(prev);
          next.add(cell.id);
          return next;
        });
        setFeedback("correct");
        playAudio(undefined, letter.nameAr);
      } else {
        setWrongId(cell.id);
        setFeedback("wrong");
        playAudio(undefined, "لَيْسَ هَذَا الْحَرْفَ");
        window.setTimeout(() => setWrongId(null), 600);
      }
    },
    [coloured, letter.nameAr, playAudio],
  );

  const replay = () => {
    setSeed(generateRoundSeed());
    setColoured(new Set());
    setWrongId(null);
    setFeedback(null);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="alphabet-color-letter-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="alphabet-color-letter-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "لَوِّنِ الْحَرْفَ"}
          </h3>
          {zone.description && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {zone.description}
            </p>
          )}
        </div>
        <div
          aria-live="polite"
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          <span aria-hidden>⭐</span>
          <span className="tabular-nums">
            {done} / {total}
          </span>
        </div>
      </div>

      {/* Instruction banner */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
        <div
          aria-hidden
          className="h-10 w-10 rounded-2xl ring-2 ring-white shadow-inner"
          style={{ backgroundColor: targetColor }}
        />
        <p
          lang="ar"
          dir="rtl"
          className="text-lg font-black text-gray-900 sm:text-xl"
          style={{
            fontFamily:
              '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
          }}
        >
          لَوِّنْ كُلَّ حَرْفِ{" "}
          <span className="text-amber-600">{letter.char}</span>
        </p>
        <motion.button
          type="button"
          onClick={() => playAudio(undefined, letter.nameAr)}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          aria-label="Play the letter name"
          className="ms-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
        >
          🔊
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!allDone ? (
          <motion.div
            key={seed ?? "grid"}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mx-auto grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${zone.gridCols}, minmax(0, 1fr))`,
              maxWidth: `${zone.gridCols * 96}px`,
            }}
          >
            {grid.map((cell, i) => {
              const isDone = coloured.has(cell.id);
              const isWrong = wrongId === cell.id;
              const status: "idle" | "correct" | "wrong" = isWrong
                ? "wrong"
                : isDone
                  ? "correct"
                  : "idle";
              return (
                <LetterGlyph
                  key={cell.id}
                  glyph={cell.display}
                  fill={isDone ? targetColor : null}
                  status={status}
                  disabled={isDone}
                  ariaLabel={`${cell.letter.nameAr} — ${cell.letter.transliteration}`}
                  onClick={() => onTapCell(cell)}
                  index={i}
                  size="md"
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <div className="text-6xl" aria-hidden>
              🏆
            </div>
            <p
              className="mt-3 text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ!
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <ReplayButton onClick={replay} size="sm" />
              {onAdvance && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="min-h-12 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  الْمِنْطَقَةُ التَّالِيَةُ →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!allDone && (
        <div className="mt-6 flex items-center justify-center">
          <ReplayButton onClick={replay} size="sm" label="أَعِدْ مَرَّةً أُخْرَى" />
        </div>
      )}
    </section>
  );
}
