"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import FeedbackOverlay from "./FeedbackOverlay";
import NumberCard from "./NumberCard";
import { useAudio } from "@/lib/useAudio";
import type {
  ListenPickZone as ListenPickZoneData,
  NumberItem,
} from "@/lib/types/numbersLesson.types";

export interface ListenPickZoneProps {
  numbers: NumberItem[];
  zone: ListenPickZoneData;
  /** Fired once when the child reaches the end screen. */
  onComplete?: (result: { correct: number; total: number }) => void;
  /** Fired when the child presses "Next zone". */
  onAdvance?: () => void;
}

export default function ListenPickZone({
  numbers,
  zone,
  onComplete,
  onAdvance,
}: ListenPickZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);

  const total = zone.rounds.length;
  const round = zone.rounds[step];
  const finished = step >= total;

  // O(1) lookup for a NumberItem by value.
  const numberByValue = useMemo(() => {
    const m = new Map<number, NumberItem>();
    for (const n of numbers) m.set(n.value, n);
    return m;
  }, [numbers]);

  const answerItem = round ? numberByValue.get(round.answer) : undefined;

  const playPrompt = () => {
    if (!answerItem) return;
    playAudio(answerItem.audioUrl, answerItem.audioText ?? answerItem.nameAr);
  };

  const pick = (value: number) => {
    if (revealed) return;
    setSelected(value);
  };

  const check = () => {
    if (selected === null || !round) return;
    setRevealed(true);
    if (selected === round.answer) {
      setScore((s) => s + 1);
      setFeedback("correct");
      playAudio(undefined, "أَحْسَنْتَ");
    } else {
      setFeedback("wrong");
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
    }
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setFeedback(null);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= total && !notified) {
      setNotified(true);
      onComplete?.({
        correct: score + (revealed && selected === round?.answer ? 0 : 0),
        total,
      });
    }
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setRevealed(false);
    setFeedback(null);
    setScore(0);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="listen-pick-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="listen-pick-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "اِسْمَعْ وَاخْتَرْ"}
          </h3>
          {zone.instructions && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {zone.instructions}
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
              {step + 1} / {total}
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
            {/* Play prompt */}
            <div className="flex items-center justify-center">
              <motion.button
                type="button"
                onClick={playPrompt}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                className="inline-flex min-h-16 items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                aria-label="Play the number"
              >
                <span aria-hidden className="text-2xl">
                  ▶
                </span>
                Play sound
              </motion.button>
            </div>

            {/* Option cards — western digits only */}
            <div
              className={`mt-6 grid gap-4 place-items-center ${
                round.options.length <= 3
                  ? "grid-cols-2 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              }`}
              role="radiogroup"
              aria-label="Choose the correct digit"
            >
              {round.options.map((opt, i) => {
                const item = numberByValue.get(opt);
                if (!item) return null;
                const isSelected = selected === opt;
                const isAnswer = opt === round.answer;
                const status =
                  revealed && isAnswer
                    ? "correct"
                    : revealed && isSelected && !isAnswer
                      ? "wrong"
                      : null;
                return (
                  <div key={opt} role="radio" aria-checked={isSelected}>
                    <NumberCard
                      number={item}
                      size="md"
                      index={i}
                      onClick={() => pick(opt)}
                      onHover={() => pick(opt)}
                      showArabicName={false}
                      showTransliteration={false}
                      showEasternDigit={false}
                      selected={!revealed && isSelected}
                      status={status}
                      disabled={revealed}
                    />
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {!revealed ? (
                <button
                  type="button"
                  disabled={selected === null}
                  onClick={check}
                  className="min-h-16 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                >
                  Check answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="min-h-16 rounded-full bg-gray-900 px-8 py-3 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400"
                >
                  {step + 1 === total ? "See score →" : "Next →"}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
            onAnimationComplete={() => {
              if (!notified) {
                setNotified(true);
                onComplete?.({ correct: score, total });
              }
            }}
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
              <button
                type="button"
                onClick={restart}
                className="min-h-12 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow ring-1 ring-black/5 hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                ↺ Play again
              </button>
              {onAdvance && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="min-h-12 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
                >
                  Next zone →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
