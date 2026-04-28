"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ScatteredShapesCanvas, {
  type PlacedShape,
} from "./ScatteredShapesCanvas";
import NumberPad from "@/components/ui/numbers/NumberPad";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import { useAudio } from "@/lib/useAudio";
import {
  generateRoundSeed,
  mulberry32,
  pickOne,
  randomInt,
  shuffle,
} from "@/lib/utils/random";
import type {
  ArabicColor,
  ArabicShape,
  CountShapesZone as CountShapesZoneType,
} from "@/lib/types/shapesLesson.types";

export interface CountShapesZoneProps {
  shapes: ArabicShape[];
  colors: ArabicColor[];
  zone: CountShapesZoneType;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Round {
  target: ArabicShape;
  targetCount: number;
  placed: PlacedShape[];
}

const CANVAS_W = 400;
const CANVAS_H = 300;
const MARGIN = 40;
const MIN_SIZE = 42;
const MAX_SIZE = 72;
const PADDING_BETWEEN = 6;

/**
 * Builds a round by scattering `target × count` + distractor shapes
 * non-overlappingly on a fixed coordinate plane. Retry cap per shape is
 * bounded (~240 attempts) to keep worst-case layout time trivial even on
 * a dense grid.
 */
function buildRound(
  shapes: ArabicShape[],
  colors: ArabicColor[],
  zone: CountShapesZoneType,
  seed: number,
): Round | null {
  if (shapes.length < 2 || colors.length === 0) return null;
  const rand = mulberry32(seed);
  const target = pickOne(shapes, seed);
  const targetCount = randomInt(
    zone.minTargetCount,
    Math.min(zone.maxTargetCount, zone.maxShapes - 1),
    seed + 1,
  );

  const totalShapes = randomInt(
    Math.max(zone.minShapes, targetCount + 1),
    zone.maxShapes,
    seed + 2,
  );
  const distractorCount = totalShapes - targetCount;

  const distractorPool = shapes.filter((s) => s.key !== target.key);

  // Build a flat list of shape instances then shuffle for scatter order.
  const instances: ArabicShape[] = [];
  for (let i = 0; i < targetCount; i++) instances.push(target);
  for (let i = 0; i < distractorCount; i++) {
    const idx = Math.floor(rand() * distractorPool.length);
    instances.push(distractorPool[idx]);
  }
  const shuffled = shuffle(instances, seed + 3);

  const placed: PlacedShape[] = [];
  for (const shape of shuffled) {
    const size = Math.floor(MIN_SIZE + rand() * (MAX_SIZE - MIN_SIZE));
    const fill = colors[Math.floor(rand() * colors.length)].hex;
    let attempts = 0;
    while (attempts < 240) {
      const x = MARGIN + rand() * (CANVAS_W - 2 * MARGIN);
      const y = MARGIN + rand() * (CANVAS_H - 2 * MARGIN);
      const overlaps = placed.some((p) => {
        const dx = x - p.x;
        const dy = y - p.y;
        const minDist = size / 2 + p.size / 2 + PADDING_BETWEEN;
        return Math.hypot(dx, dy) < minDist;
      });
      if (!overlaps) {
        placed.push({ shape, shapeKey: shape.key, x, y, size, fill });
        break;
      }
      attempts++;
    }
  }
  return { target, targetCount, placed };
}

export default function CountShapesZone({
  shapes,
  colors,
  zone,
  onComplete,
  onAdvance,
}: CountShapesZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(() => {
    if (seed === null) return [];
    const out: Round[] = [];
    for (let i = 0; i < zone.rounds; i++) {
      const r = buildRound(shapes, colors, zone, seed + i * 2017);
      if (r) out.push(r);
    }
    return out;
  }, [seed, shapes, colors, zone]);

  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [notified, setNotified] = useState(false);

  const total = rounds.length;
  const round = rounds[step];
  const finished = total > 0 && step >= total;

  const askQuestion = useCallback(() => {
    if (!round) return;
    // "كَمْ <nameAr> تَرَى؟"
    playAudio(undefined, `كَمْ ${round.target.nameAr} تَرَى؟`);
  }, [playAudio, round]);

  useEffect(() => {
    if (!round) return;
    const id = window.setTimeout(askQuestion, 250);
    return () => window.clearTimeout(id);
  }, [round, askQuestion]);

  const submit = useCallback(() => {
    if (!round || !input) return;
    const parsed = Number.parseInt(input, 10);
    if (!Number.isFinite(parsed)) return;

    if (parsed === round.targetCount) {
      setScore((s) => s + 1);
      setFeedback("correct");
      playAudio(undefined, "أَحْسَنْتَ");
      window.setTimeout(() => {
        setInput("");
        setAttempts(0);
        setFeedback(null);
        setShowHint(false);
        setStep((s) => s + 1);
      }, 1300);
    } else {
      setFeedback("wrong");
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      // After 2 wrong tries, light up the targets as a hint.
      if (nextAttempts >= 2) setShowHint(true);
      window.setTimeout(() => {
        setInput("");
        setFeedback(null);
      }, 1100);
    }
  }, [round, input, attempts, playAudio]);

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  }, [finished, notified, onComplete, score, total]);

  const replay = () => {
    setSeed(generateRoundSeed());
    setStep(0);
    setInput("");
    setAttempts(0);
    setFeedback(null);
    setShowHint(false);
    setScore(0);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="shapes-count-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="shapes-count-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "عُدَّ الْأَشْكَالَ"}
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <p
                lang="ar"
                dir="rtl"
                className="text-lg font-black text-gray-900 sm:text-xl"
                style={{
                  fontFamily:
                    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                }}
              >
                كَمْ{" "}
                <span className="text-amber-600">{round.target.nameAr}</span>{" "}
                تَرَى؟
                <span className="ms-1" aria-hidden>
                  {round.target.emoji}
                </span>
              </p>
              <motion.button
                type="button"
                onClick={askQuestion}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                aria-label="Replay the question"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                🔊
              </motion.button>
            </div>

            <div className="mx-auto mt-5 max-w-2xl">
              <ScatteredShapesCanvas
                placed={round.placed}
                hintTargetKey={showHint ? round.target.key : null}
                viewWidth={CANVAS_W}
                viewHeight={CANVAS_H}
                ariaLabel={`Scene containing shapes including ${round.target.transliteration}`}
              />
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <NumberPad
                value={input}
                onChange={setInput}
                onSubmit={submit}
                maxLength={2}
                disabled={feedback === "correct"}
              />
              {showHint && (
                <p
                  className="text-xs font-medium text-amber-700"
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontFamily: '"Amiri", "Noto Naskh Arabic", serif',
                  }}
                >
                  الْأَشْكَالُ الْمَطْلُوبَةُ تَنْبُضُ الْآنَ — عُدَّهَا جَيِّدًا!
                </p>
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
