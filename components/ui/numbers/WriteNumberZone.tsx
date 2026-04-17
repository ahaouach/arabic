"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import FeedbackOverlay from "./FeedbackOverlay";
import NumberPad from "./NumberPad";
import QuantityVisual from "./QuantityVisual";
import { useAudio } from "@/lib/useAudio";
import type {
  NumberItem,
  WriteNumberZone as WriteNumberZoneData,
} from "@/lib/types/numbersLesson.types";

export interface WriteNumberZoneProps {
  numbers: NumberItem[];
  zone: WriteNumberZoneData;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

export default function WriteNumberZone({
  numbers,
  zone,
  onComplete,
  onAdvance,
}: WriteNumberZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [padValue, setPadValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [notified, setNotified] = useState(false);

  const total = zone.rounds.length;
  const round = zone.rounds[step];
  const finished = step >= total;

  const numberByValue = useMemo(() => {
    const m = new Map<number, NumberItem>();
    for (const n of numbers) m.set(n.value, n);
    return m;
  }, [numbers]);

  const submit = () => {
    if (revealed || !round) return;
    const typed = Number.parseInt(padValue, 10);
    if (!Number.isFinite(typed)) return;
    setRevealed(true);
    if (typed === round.answer) {
      setScore((s) => s + 1);
      setFeedback("correct");
      const item = numberByValue.get(round.answer);
      if (item) playAudio(item.audioUrl, item.audioText ?? item.nameAr);
    } else {
      setFeedback("wrong");
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      // Reset the pad shortly so the child can retry the same round.
      window.setTimeout(() => {
        setPadValue("");
        setRevealed(false);
      }, 1300);
    }
  };

  const next = () => {
    setPadValue("");
    setRevealed(false);
    setFeedback(null);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= total && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  };

  const restart = () => {
    setStep(0);
    setPadValue("");
    setRevealed(false);
    setFeedback(null);
    setScore(0);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="write-number-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="write-number-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "اُكْتُبِ الرَّقْمَ"}
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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Visual canvas */}
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-inner ring-1 ring-black/5">
                {round.prompt && (
                  <p
                    className="text-sm font-black uppercase tracking-widest text-fuchsia-600"
                    lang="ar"
                    dir="rtl"
                    style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                  >
                    {round.prompt}
                  </p>
                )}
                <QuantityVisual
                  count={round.answer}
                  emoji={round.visualEmoji}
                  size="lg"
                  animate
                />
              </div>

              {/* Number pad */}
              <div className="flex items-center justify-center rounded-3xl bg-white/60 p-6 shadow-inner ring-1 ring-black/5">
                <NumberPad
                  value={padValue}
                  onChange={setPadValue}
                  onSubmit={submit}
                  disabled={revealed}
                  maxLength={2}
                />
              </div>
            </div>

            {/* Controls (shown after reveal when correct, to advance) */}
            {revealed && (
              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={next}
                  className="min-h-16 rounded-full bg-gray-900 px-8 py-3 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400"
                >
                  {step + 1 === total ? "See score →" : "Next →"}
                </button>
              </div>
            )}
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
