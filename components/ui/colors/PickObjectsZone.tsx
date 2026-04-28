"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ColoredShape from "./ColoredShape";
import ReplayButton from "./ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import {
  generateRoundSeed,
  mulberry32,
  pickRandom,
  randomInt,
  shuffle,
} from "@/lib/utils/random";
import type {
  ArabicColor,
  PickObjectsZone as PickObjectsZoneType,
  ShapeKind,
} from "@/lib/types/colorsLesson.types";

export interface PickObjectsZoneProps {
  colors: ArabicColor[];
  zone: PickObjectsZoneType;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Cell {
  color: ArabicColor;
  shape: ShapeKind;
  isTarget: boolean;
}

interface Round {
  target: ArabicColor;
  cells: Cell[];
}

/**
 * Build `totalRounds` rounds. Target colours are sampled without
 * replacement (every colour appears at least once before repeats). For
 * each round, a random number of target cells (between targetCountMin
 * and targetCountMax, capped by the grid size) is placed; the rest are
 * filled with distractors drawn from the remaining palette. Shapes are
 * picked independently from `shapePool` per cell.
 */
function buildRounds(
  colors: ArabicColor[],
  shapePool: ShapeKind[],
  totalRounds: number,
  gridSize: number,
  targetCountMin: number,
  targetCountMax: number,
  seed: number,
): Round[] {
  const targets: ArabicColor[] = [];
  let remaining = shuffle(colors, seed);
  while (targets.length < totalRounds) {
    if (remaining.length === 0) {
      remaining = shuffle(colors, seed + targets.length + 1);
    }
    const next = remaining.pop();
    if (next) targets.push(next);
  }

  return targets.map((target, i) => {
    const roundSeed = seed + (i + 1) * 997;
    const rand = mulberry32(roundSeed);

    const maxTargets = Math.min(targetCountMax, gridSize - 1);
    const minTargets = Math.min(targetCountMin, maxTargets);
    const targetCount = randomInt(minTargets, maxTargets, roundSeed);

    const distractorPool = colors.filter((c) => c.key !== target.key);
    const distractorCount = gridSize - targetCount;
    const distractors: ArabicColor[] = [];
    for (let d = 0; d < distractorCount; d++) {
      const idx = Math.floor(rand() * distractorPool.length);
      distractors.push(distractorPool[idx]);
    }

    const rawCells: Cell[] = [
      ...Array.from({ length: targetCount }, () => ({
        color: target,
        shape: shapePool[Math.floor(rand() * shapePool.length)],
        isTarget: true,
      })),
      ...distractors.map<Cell>((c) => ({
        color: c,
        shape: shapePool[Math.floor(rand() * shapePool.length)],
        isTarget: false,
      })),
    ];
    const cells = shuffle(rawCells, roundSeed + 1);
    return { target, cells };
  });
}

type CellStatus = "idle" | "selected" | "correct" | "wrong" | "missed";

export default function PickObjectsZone({
  colors,
  zone,
  onComplete,
  onAdvance,
}: PickObjectsZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const gridSize = zone.gridCols * zone.gridRows;

  const rounds = useMemo<Round[]>(() => {
    if (seed === null) return [];
    const pool = zone.shapePool.length
      ? zone.shapePool
      : (["circle"] as ShapeKind[]);
    const distinctShapes = pickRandom(pool, pool.length, seed);
    return buildRounds(
      colors,
      distinctShapes,
      zone.rounds,
      gridSize,
      zone.targetCountMin,
      zone.targetCountMax,
      seed,
    );
  }, [
    seed,
    colors,
    zone.shapePool,
    zone.rounds,
    zone.targetCountMin,
    zone.targetCountMax,
    gridSize,
  ]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);

  const total = rounds.length;
  const round = rounds[step];
  const finished = total > 0 && step >= total;

  const playTarget = useCallback(() => {
    if (!round) return;
    playAudio(round.target.audioUrl, round.target.audioText);
  }, [playAudio, round]);

  useEffect(() => {
    if (!round || revealed) return;
    // Announce the target once per round.
    const id = window.setTimeout(() => playTarget(), 200);
    return () => window.clearTimeout(id);
  }, [round, revealed, playTarget]);

  const toggle = (index: number) => {
    if (revealed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const check = () => {
    if (!round) return;
    const wrongPicks = Array.from(selected).filter(
      (i) => !round.cells[i].isTarget,
    );
    const targetIndices = round.cells
      .map((c, i) => (c.isTarget ? i : -1))
      .filter((i) => i >= 0);
    const missed = targetIndices.filter((i) => !selected.has(i));
    const perfect = wrongPicks.length === 0 && missed.length === 0;

    setRevealed(true);

    if (perfect) {
      setScore((s) => s + 1);
      setFeedback("correct");
      playAudio(undefined, "أَحْسَنْتَ");
      window.setTimeout(() => {
        setSelected(new Set());
        setRevealed(false);
        setFeedback(null);
        setStep((s) => s + 1);
      }, 1200);
    } else {
      setFeedback("wrong");
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
    }
  };

  const nextRound = () => {
    setSelected(new Set());
    setRevealed(false);
    setFeedback(null);
    setStep((s) => s + 1);
  };

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  }, [finished, notified, onComplete, score, total]);

  const replay = () => {
    setSeed(generateRoundSeed());
    setStep(0);
    setSelected(new Set());
    setRevealed(false);
    setScore(0);
    setFeedback(null);
    setNotified(false);
  };

  const cellStatus = (cell: Cell, index: number): CellStatus => {
    if (!revealed) return selected.has(index) ? "selected" : "idle";
    if (selected.has(index) && cell.isTarget) return "correct";
    if (selected.has(index) && !cell.isTarget) return "wrong";
    if (!selected.has(index) && cell.isTarget) return "missed";
    return "idle";
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="colors-pick-objects-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="colors-pick-objects-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "اِخْتَرِ الْأَشْيَاءَ حَسَبَ اللَّوْنِ"}
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
          {finished ? (
            <>
              <span aria-hidden>⭐</span>
              <span className="tabular-nums">
                {score} / {total}
              </span>
            </>
          ) : (
            <span className="tabular-nums">
              {step + 1} / {total || zone.rounds}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished && round ? (
          <motion.div
            key={step}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <div
                aria-hidden
                className="h-12 w-12 rounded-2xl ring-4 ring-white shadow-inner"
                style={{ backgroundColor: round.target.hex }}
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
                اِخْتَرْ كُلَّ{" "}
                <span style={{ color: round.target.hex }}>
                  {round.target.nameAr}
                </span>
                <span className="ms-1" aria-hidden>
                  {round.target.emoji}
                </span>
              </p>
              <motion.button
                type="button"
                onClick={playTarget}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                aria-label="Play the target colour name"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                🔊
              </motion.button>
            </div>

            <div
              role="group"
              aria-label="Tap every shape with the target colour"
              className="mx-auto mt-6 grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${zone.gridCols}, minmax(0, 1fr))`,
                maxWidth: `${zone.gridCols * 96}px`,
              }}
            >
              {round.cells.map((cell, i) => (
                <ColoredShape
                  key={`${step}-${i}`}
                  kind={cell.shape}
                  fill={cell.color.hex}
                  status={cellStatus(cell, i)}
                  index={i}
                  ariaLabel={`${cell.color.nameAr} — ${cell.color.transliteration}`}
                  onClick={() => toggle(i)}
                  disabled={revealed}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {!revealed ? (
                <button
                  type="button"
                  onClick={check}
                  disabled={selected.size === 0}
                  className="min-h-16 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontFamily: '"Amiri", "Noto Naskh Arabic", serif',
                  }}
                >
                  تَحَقَّقْ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextRound}
                  className="min-h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontFamily: '"Amiri", "Noto Naskh Arabic", serif',
                  }}
                >
                  تَابِعْ →
                </button>
              )}
            </div>
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
              {score === total ? "🏆" : score > 0 ? "🌟" : "💪"}
            </div>
            <p className="mt-3 text-2xl font-black text-gray-900 tabular-nums">
              {score} / {total}
            </p>
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {score === total ? "أَحْسَنْتَ!" : "حَاوِلْ مَرَّةً أُخْرَى"}
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
    </section>
  );
}
