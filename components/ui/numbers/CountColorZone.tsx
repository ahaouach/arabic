"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import FeedbackOverlay from "./FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import type {
  CountColorZone as CountColorZoneData,
  NumberItem,
} from "@/lib/types/numbersLesson.types";

export interface CountColorZoneProps {
  numbers: NumberItem[];
  zone: CountColorZoneData;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

export default function CountColorZone({
  numbers,
  zone,
  onComplete,
  onAdvance,
}: CountColorZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
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

  const toggle = (idx: number) => {
    if (revealed) return;
    setTapped((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const check = () => {
    if (revealed || !round) return;
    setRevealed(true);
    if (tapped.size === round.target) {
      setScore((s) => s + 1);
      setFeedback("correct");
      // Reinforce the target number by speaking its vowelized Arabic name.
      const item = numberByValue.get(round.target);
      if (item) playAudio(item.audioUrl, item.audioText ?? item.nameAr);
    } else {
      setFeedback("wrong");
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      // Reset wrong attempt shortly so the child can retry the same round.
      window.setTimeout(() => {
        setTapped(new Set());
        setRevealed(false);
      }, 1300);
    }
  };

  const next = () => {
    setTapped(new Set());
    setRevealed(false);
    setFeedback(null);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= total && !notified) {
      setNotified(true);
      onComplete?.({ correct: score + 1, total }); // score was already incremented at `check`
    }
  };

  const restart = () => {
    setStep(0);
    setTapped(new Set());
    setRevealed(false);
    setFeedback(null);
    setScore(0);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="count-color-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="count-color-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "عُدَّ وَلَوِّنْ"}
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
            {/* Target prompt */}
            <div className="flex flex-col items-center gap-2">
              <p
                className="text-sm font-black uppercase tracking-widest text-fuchsia-600"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                اِضْغَطْ عَلَى
              </p>
              <div
                dir="ltr"
                className="text-6xl font-black tracking-tight text-gray-900 tabular-nums sm:text-7xl"
                style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
              >
                {round.target}
              </div>
              <div
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-gray-700 shadow ring-1 ring-black/5"
                aria-live="polite"
              >
                <span aria-hidden>👆</span>
                <span className="tabular-nums">
                  {tapped.size} / {round.target}
                </span>
              </div>
            </div>

            {/* Object board */}
            <div
              className="mt-6 grid gap-3 place-items-center"
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  round.totalObjects,
                  5,
                )}, minmax(0, 1fr))`,
              }}
              role="group"
              aria-label={`Tap exactly ${round.target} of ${round.totalObjects} items`}
            >
              {Array.from({ length: round.totalObjects }).map((_, i) => {
                const isOn = tapped.has(i);
                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    disabled={revealed}
                    whileHover={
                      !revealed && !prefersReducedMotion ? { y: -4, scale: 1.06 } : undefined
                    }
                    whileTap={
                      !revealed && !prefersReducedMotion ? { scale: 0.94 } : undefined
                    }
                    animate={
                      isOn && !prefersReducedMotion
                        ? { rotate: [0, -6, 6, 0] }
                        : undefined
                    }
                    transition={{ duration: 0.35 }}
                    aria-pressed={isOn}
                    aria-label={
                      isOn ? `Item ${i + 1} selected` : `Item ${i + 1} not selected`
                    }
                    className={`flex h-20 w-20 items-center justify-center rounded-3xl text-5xl shadow-md transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed sm:h-24 sm:w-24 ${
                      isOn
                        ? "bg-gradient-to-br from-amber-200 to-pink-200 ring-4 ring-amber-400"
                        : "bg-white/70 ring-1 ring-black/5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                    }`}
                  >
                    <span aria-hidden>{round.objectEmoji}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setTapped(new Set())}
                disabled={revealed || tapped.size === 0}
                className="min-h-12 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                ↺ Clear
              </button>
              <button
                type="button"
                onClick={revealed && tapped.size === round.target ? next : check}
                disabled={tapped.size === 0}
                className="min-h-16 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                {revealed && tapped.size === round.target
                  ? step + 1 === total
                    ? "See score →"
                    : "Next →"
                  : "Check answer"}
              </button>
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
