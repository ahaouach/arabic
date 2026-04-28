"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ShapeCard from "./ShapeCard";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, pickRandom, shuffle } from "@/lib/utils/random";
import type {
  ArabicShape,
  ShapesListenPickZone,
} from "@/lib/types/shapesLesson.types";

export interface ListenPickZoneProps {
  shapes: ArabicShape[];
  zone: ShapesListenPickZone;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Round {
  target: ArabicShape;
  options: ArabicShape[];
}

/**
 * Build N rounds: targets are sampled without replacement first, then
 * each round draws distractors from the remaining pool and shuffles the
 * options independently so the correct position varies.
 */
function buildRounds(
  shapes: ArabicShape[],
  totalRounds: number,
  optionsPerRound: number,
  seed: number,
): Round[] {
  const targets: ArabicShape[] = [];
  let remaining = shuffle(shapes, seed);
  while (targets.length < totalRounds) {
    if (remaining.length === 0) {
      remaining = shuffle(shapes, seed + targets.length);
    }
    const next = remaining.pop();
    if (next) targets.push(next);
  }

  return targets.map((target, i) => {
    const distractorPool = shapes.filter((s) => s.key !== target.key);
    const distractors = pickRandom(
      distractorPool,
      optionsPerRound - 1,
      seed + i + 1,
    );
    const options = shuffle([target, ...distractors], seed + i + 2);
    return { target, options };
  });
}

export default function ListenPickZone({
  shapes,
  zone,
  onComplete,
  onAdvance,
}: ListenPickZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(() => {
    if (seed === null) return [];
    return buildRounds(shapes, zone.rounds, zone.optionsPerRound, seed);
  }, [shapes, zone.rounds, zone.optionsPerRound, seed]);

  const [step, setStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
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

  const check = useCallback(() => {
    if (!round || !selectedKey) return;
    setRevealed(true);
    if (selectedKey === round.target.key) {
      setScore((s) => s + 1);
      setFeedback("correct");
      playAudio(undefined, "أَحْسَنْتَ");
      window.setTimeout(() => {
        setSelectedKey(null);
        setRevealed(false);
        setFeedback(null);
        setStep((s) => s + 1);
      }, 1200);
    } else {
      setFeedback("wrong");
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      window.setTimeout(() => {
        setSelectedKey(null);
        setRevealed(false);
        setFeedback(null);
        playTarget();
      }, 1100);
    }
  }, [round, selectedKey, playAudio, playTarget]);

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  }, [finished, notified, onComplete, score, total]);

  const replay = () => {
    setSeed(generateRoundSeed());
    setStep(0);
    setSelectedKey(null);
    setRevealed(false);
    setScore(0);
    setFeedback(null);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="shapes-listen-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="shapes-listen-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "اِسْتَمِعْ وَاخْتَرِ الشَّكْلَ"}
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
            <div className="flex items-center justify-center">
              <motion.button
                type="button"
                onClick={playTarget}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                className="inline-flex min-h-16 items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                aria-label="Play the shape name"
              >
                <span aria-hidden className="text-2xl">
                  ▶
                </span>
                Play sound
              </motion.button>
            </div>

            <div
              role="radiogroup"
              aria-label="Choose the shape"
              className="mt-6 grid place-items-center gap-4 sm:grid-cols-3"
            >
              {round.options.map((opt, i) => {
                const isSelected = selectedKey === opt.key;
                const isAnswer = opt.key === round.target.key;
                const status =
                  revealed && isAnswer
                    ? "correct"
                    : revealed && isSelected && !isAnswer
                      ? "wrong"
                      : null;
                return (
                  <div key={opt.key} role="radio" aria-checked={isSelected}>
                    <ShapeCard
                      shape={opt}
                      size="md"
                      index={i}
                      onClick={() => !revealed && setSelectedKey(opt.key)}
                      selected={!revealed && isSelected}
                      status={status}
                      disabled={revealed}
                      hideName
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                disabled={!selectedKey || revealed}
                onClick={check}
                className="min-h-16 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                Check answer
              </button>
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
