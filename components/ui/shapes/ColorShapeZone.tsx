"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ShapeSvg from "./ShapeSvg";
import InstructionBanner from "@/components/ui/colors/InstructionBanner";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import {
  generateRoundSeed,
  pickRandom,
  randomInt,
  shuffle,
} from "@/lib/utils/random";
import type {
  ArabicColor,
  ArabicShape,
  ColorShapeZone as ColorShapeZoneType,
} from "@/lib/types/shapesLesson.types";

export interface ColorShapeZoneProps {
  shapes: ArabicShape[];
  colors: ArabicColor[];
  zone: ColorShapeZoneType;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Instruction {
  shape: ArabicShape;
  color: ArabicColor;
}

interface Round {
  instructions: Instruction[];
  /** Screen order, independent from instruction order. */
  layout: ArabicShape[];
}

function buildRound(
  shapes: ArabicShape[],
  colors: ArabicColor[],
  min: number,
  max: number,
  seed: number,
): Round {
  const n = Math.min(randomInt(min, max, seed), shapes.length, colors.length);
  const chosenShapes = pickRandom(shapes, n, seed + 1);
  const chosenColors = pickRandom(colors, n, seed + 2);
  const instructions: Instruction[] = chosenShapes.map((shape, i) => ({
    shape,
    color: chosenColors[i],
  }));
  const layout = shuffle(chosenShapes, seed + 3);
  return { instructions, layout };
}

export default function ColorShapeZone({
  shapes,
  colors,
  zone,
  onComplete,
  onAdvance,
}: ColorShapeZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const round = useMemo<Round | null>(
    () =>
      seed === null
        ? null
        : buildRound(
            shapes,
            colors,
            zone.minInstructions,
            zone.maxInstructions,
            seed,
          ),
    [shapes, colors, zone.minInstructions, zone.maxInstructions, seed],
  );

  const [doneKeys, setDoneKeys] = useState<Set<string>>(new Set());
  const [fillByKey, setFillByKey] = useState<Record<string, string>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);

  const activeIndex = useMemo(() => {
    if (!round) return -1;
    return round.instructions.findIndex(
      (inst) => !doneKeys.has(inst.shape.key),
    );
  }, [round, doneKeys]);

  const total = round?.instructions.length ?? 0;
  const allDone = total > 0 && doneKeys.size === total;

  useEffect(() => {
    if (allDone && !notified) {
      setNotified(true);
      onComplete?.({ correct: total, total });
    }
  }, [allDone, notified, onComplete, total]);

  const onTapShape = useCallback(
    (key: string) => {
      if (!round || allDone) return;
      if (doneKeys.has(key)) return;
      const active = round.instructions[activeIndex];
      if (!active) return;

      if (active.shape.key === key) {
        setFillByKey((prev) => ({ ...prev, [key]: active.color.hex }));
        setDoneKeys((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
        setFeedback("correct");
        playAudio(active.shape.audioUrl, active.shape.audioText);
      } else {
        setWrongKey(key);
        setFeedback("wrong");
        playAudio(undefined, "لَيْسَ هَذَا الشَّكْلَ");
        window.setTimeout(() => setWrongKey(null), 600);
      }
    },
    [round, allDone, activeIndex, doneKeys, playAudio],
  );

  const playInstruction = useCallback(
    (idx: number) => {
      if (!round) return;
      const inst = round.instructions[idx];
      if (!inst) return;
      playAudio(inst.color.audioUrl, inst.color.audioText);
    },
    [round, playAudio],
  );

  const replay = () => {
    setSeed(generateRoundSeed());
    setDoneKeys(new Set());
    setFillByKey({});
    setWrongKey(null);
    setFeedback(null);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-50 via-white to-sky-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="shapes-color-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="shapes-color-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "لَوِّنِ الشَّكْلَ الْمَطْلُوبَ"}
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
            {doneKeys.size} / {total || 0}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {round && !allDone ? (
          <motion.div
            key={seed ?? "round"}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid gap-6 lg:grid-cols-[1fr_22rem]"
          >
            {/* Shape canvas */}
            <div className="flex min-h-64 flex-wrap items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-inner ring-1 ring-black/5">
              {round.layout.map((shape, i) => {
                const isDone = doneKeys.has(shape.key);
                const isWrong = wrongKey === shape.key;
                const activeShape =
                  activeIndex >= 0
                    ? round.instructions[activeIndex]?.shape
                    : null;
                const isActive = activeShape?.key === shape.key;
                const fill = fillByKey[shape.key] ?? null;

                const ring = isWrong
                  ? "ring-4 ring-rose-500"
                  : isDone
                    ? "ring-4 ring-emerald-500"
                    : isActive
                      ? "ring-4 ring-gray-900"
                      : "ring-1 ring-black/5";

                const shake =
                  isWrong && !prefersReducedMotion
                    ? { x: [0, -6, 6, -4, 4, 0] }
                    : undefined;
                const celebrate =
                  isDone && !prefersReducedMotion
                    ? { scale: [1, 1.08, 1] }
                    : undefined;

                return (
                  <motion.button
                    key={shape.key}
                    type="button"
                    onClick={() => onTapShape(shape.key)}
                    disabled={isDone}
                    aria-label={`${shape.nameAr} — ${shape.transliteration}`}
                    aria-pressed={isDone}
                    initial={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, y: 16 }
                    }
                    animate={shake ?? celebrate ?? { opacity: 1, y: 0 }}
                    whileHover={
                      !isDone && !prefersReducedMotion
                        ? { y: -3, scale: 1.04 }
                        : undefined
                    }
                    whileTap={
                      !isDone && !prefersReducedMotion
                        ? { scale: 0.95 }
                        : undefined
                    }
                    transition={
                      shake || celebrate
                        ? { duration: 0.45, ease: "easeInOut" }
                        : {
                            delay: i * 0.05,
                            type: "spring",
                            stiffness: 200,
                            damping: 22,
                          }
                    }
                    className={`relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white p-3 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed ${ring}`}
                  >
                    <ShapeSvg
                      shape={shape}
                      fill={fill}
                      stroke="#1f2937"
                      strokeWidth={4}
                      className="h-full w-full"
                    />
                    {isDone && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm text-white shadow-lg"
                      >
                        ✓
                      </span>
                    )}
                    {isWrong && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm text-white shadow-lg"
                      >
                        ✕
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Instructions rail */}
            <div className="flex flex-col gap-3">
              {round.instructions.map((inst, i) => (
                <InstructionBanner
                  key={`${inst.shape.key}-${i}`}
                  color={inst.color}
                  prefixAr="لَوِّنْ"
                  targetArabicLabel={inst.shape.nameAr}
                  targetDisplay={inst.shape.emoji}
                  active={i === activeIndex}
                  done={doneKeys.has(inst.shape.key)}
                  onPlay={
                    i === activeIndex ? () => playInstruction(i) : undefined
                  }
                  index={i}
                />
              ))}
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
            <motion.div
              aria-hidden
              animate={
                prefersReducedMotion ? undefined : { rotate: [0, -6, 6, 0] }
              }
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              🏆
            </motion.div>
            <p
              className="mt-3 text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ! لَقَدْ لَوَّنْتَ كُلَّ شَيْءٍ!
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

      {round && !allDone && (
        <div className="mt-6 flex items-center justify-center">
          <ReplayButton
            onClick={replay}
            size="sm"
            label="أَعِدْ مَرَّةً أُخْرَى"
          />
        </div>
      )}
    </section>
  );
}
