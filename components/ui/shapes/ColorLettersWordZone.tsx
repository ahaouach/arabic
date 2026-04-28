"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import LetterGlyph from "./LetterGlyph";
import ShapeSvg from "./ShapeSvg";
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
  ColorLettersWordZone as ColorLettersWordZoneType,
  ShapeWord,
} from "@/lib/types/shapesLesson.types";

export interface ColorLettersWordZoneProps {
  shapes: ArabicShape[];
  shapeWords: ShapeWord[];
  colors: ArabicColor[];
  zone: ColorLettersWordZoneType;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Instruction {
  /** Index of the letter within the word. Primary identifier. */
  position: number;
  color: ArabicColor;
}

interface Round {
  shape: ArabicShape;
  word: ShapeWord;
  instructions: Instruction[];
}

/**
 * Pick shapes for each round without replacement (so the child sees
 * varied words), bounded by the catalogue size.
 */
function pickShapesForRounds(
  shapes: ArabicShape[],
  rounds: number,
  seed: number,
): ArabicShape[] {
  const out: ArabicShape[] = [];
  let remaining = shuffle(shapes, seed);
  while (out.length < rounds) {
    if (remaining.length === 0) remaining = shuffle(shapes, seed + out.length);
    const next = remaining.pop();
    if (next) out.push(next);
  }
  return out;
}

function buildRounds(
  shapes: ArabicShape[],
  shapeWords: ShapeWord[],
  colors: ArabicColor[],
  zone: ColorLettersWordZoneType,
  seed: number,
): Round[] {
  const wordByKey = new Map(shapeWords.map((w) => [w.shapeKey, w]));
  const chosenShapes = pickShapesForRounds(
    shapes.filter((s) => wordByKey.has(s.key)),
    zone.rounds,
    seed,
  );

  return chosenShapes.map((shape, i): Round => {
    const word = wordByKey.get(shape.key);
    // `word` is guaranteed by the filter above, but TS still needs the guard.
    if (!word) {
      throw new Error(`Missing ShapeWord for shape "${shape.key}"`);
    }
    const max = Math.min(
      zone.maxLettersToColor,
      word.letters.length,
      colors.length,
    );
    const min = Math.min(zone.minLettersToColor, max);
    const n = randomInt(min, max, seed + i * 101 + 1);
    const positions = pickRandom(
      word.letters.map((_, idx) => idx),
      n,
      seed + i * 101 + 2,
    ).sort((a, b) => a - b);
    const chosenColors = pickRandom(colors, n, seed + i * 101 + 3);
    const instructions = positions.map<Instruction>((position, k) => ({
      position,
      color: chosenColors[k],
    }));
    return { shape, word, instructions };
  });
}

export default function ColorLettersWordZone({
  shapes,
  shapeWords,
  colors,
  zone,
  onComplete,
  onAdvance,
}: ColorLettersWordZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(() => {
    if (seed === null) return [];
    return buildRounds(shapes, shapeWords, colors, zone, seed);
  }, [shapes, shapeWords, colors, zone, seed]);

  const [step, setStep] = useState(0);
  const [donePositions, setDonePositions] = useState<Set<number>>(new Set());
  const [fillByPosition, setFillByPosition] = useState<Record<number, string>>(
    {},
  );
  const [wrongPosition, setWrongPosition] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [notified, setNotified] = useState(false);

  const total = rounds.length;
  const round = rounds[step];
  const finished = total > 0 && step >= total;

  const activeInstructionIndex = useMemo(() => {
    if (!round) return -1;
    return round.instructions.findIndex(
      (inst) => !donePositions.has(inst.position),
    );
  }, [round, donePositions]);

  const activeInstruction =
    round && activeInstructionIndex >= 0
      ? round.instructions[activeInstructionIndex]
      : null;

  const targetPositions = useMemo(
    () => new Set(round?.instructions.map((i) => i.position) ?? []),
    [round],
  );

  // Advance round when all instructions of the current round are done.
  const allDoneInRound =
    round && donePositions.size >= round.instructions.length;
  useEffect(() => {
    if (!round || !allDoneInRound) return;
    setScore((s) => s + 1);
    const id = window.setTimeout(() => {
      setDonePositions(new Set());
      setFillByPosition({});
      setWrongPosition(null);
      setStep((s) => s + 1);
    }, 1300);
    return () => window.clearTimeout(id);
  }, [round, allDoneInRound]);

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  }, [finished, notified, onComplete, score, total]);

  const onTapLetter = useCallback(
    (position: number) => {
      if (!round || !activeInstruction) return;
      if (donePositions.has(position)) return;
      if (!targetPositions.has(position)) return;

      const letter = round.word.letters[position];
      if (position === activeInstruction.position) {
        setFillByPosition((prev) => ({
          ...prev,
          [position]: activeInstruction.color.hex,
        }));
        setDonePositions((prev) => {
          const next = new Set(prev);
          next.add(position);
          return next;
        });
        setFeedback("correct");
        playAudio(undefined, letter.name);
      } else {
        setWrongPosition(position);
        setFeedback("wrong");
        playAudio(undefined, "لَيْسَ هَذَا الْحَرْفَ");
        window.setTimeout(() => setWrongPosition(null), 600);
      }
    },
    [round, activeInstruction, donePositions, targetPositions, playAudio],
  );

  const playActiveInstruction = useCallback(() => {
    if (!round || !activeInstruction) return;
    playAudio(
      activeInstruction.color.audioUrl,
      activeInstruction.color.audioText,
    );
  }, [round, activeInstruction, playAudio]);

  const replay = () => {
    setSeed(generateRoundSeed());
    setStep(0);
    setDonePositions(new Set());
    setFillByPosition({});
    setWrongPosition(null);
    setFeedback(null);
    setScore(0);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="shapes-letters-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="shapes-letters-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "لَوِّنْ حُرُوفَ الْكَلِمَةِ"}
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
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            {/* Shape preview + instruction */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16">
                  <ShapeSvg
                    shape={round.shape}
                    fill="#FCD34D"
                    className="h-full w-full"
                  />
                </div>
                <div
                  lang="ar"
                  dir="rtl"
                  className="text-xl font-black text-gray-900"
                  style={{
                    fontFamily:
                      '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                  }}
                >
                  {round.shape.nameAr}
                </div>
              </div>
              {activeInstruction && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 px-4 py-2 ring-1 ring-black/5">
                  <div
                    aria-hidden
                    className="h-10 w-10 rounded-2xl ring-2 ring-white shadow-inner"
                    style={{ backgroundColor: activeInstruction.color.hex }}
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
                    لَوِّنْ حَرْفَ{" "}
                    <span className="text-amber-600">
                      {round.word.letters[activeInstruction.position].base}
                    </span>{" "}
                    بِاللَّوْنِ{" "}
                    <span style={{ color: activeInstruction.color.hex }}>
                      {activeInstruction.color.nameAr}
                    </span>
                    <span className="ms-1" aria-hidden>
                      {activeInstruction.color.emoji}
                    </span>
                  </p>
                  <motion.button
                    type="button"
                    onClick={playActiveInstruction}
                    whileHover={
                      prefersReducedMotion ? undefined : { scale: 1.06 }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.94 }
                    }
                    aria-label="Replay the instruction"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                  >
                    🔊
                  </motion.button>
                </div>
              )}
            </div>

            {/* Word as individually tappable letters (RTL) */}
            <div
              className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white p-6 shadow-inner ring-1 ring-black/5"
              dir="rtl"
              lang="ar"
              role="group"
              aria-label={`Letters of ${round.word.word}`}
            >
              {round.word.letters.map((letter, position) => {
                const isTarget = targetPositions.has(position);
                const isDone = donePositions.has(position);
                const isWrong = wrongPosition === position;
                const status = isWrong
                  ? "wrong"
                  : isDone
                    ? "correct"
                    : isTarget
                      ? "idle"
                      : "disabled";
                return (
                  <LetterGlyph
                    key={position}
                    letter={letter}
                    fill={fillByPosition[position] ?? null}
                    status={status}
                    disabled={!isTarget || isDone}
                    ariaLabel={`حَرْفُ ${letter.name}`}
                    onClick={() => onTapLetter(position)}
                    index={position}
                  />
                );
              })}
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
              {score === total ? "أَحْسَنْتَ!" : "جَيِّدٌ جِدًّا!"}
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
