"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import FeedbackOverlay from "./FeedbackOverlay";
import NumberCard from "./NumberCard";
import QuantityVisual from "./QuantityVisual";
import { useAudio } from "@/lib/useAudio";
import type {
  MatchingZone as MatchingZoneData,
  NumberItem,
} from "@/lib/types/numbersLesson.types";

export interface MatchingZoneProps {
  numbers: NumberItem[];
  zone: MatchingZoneData;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

// Fisher-Yates shuffle — deterministic from input, ok to re-run client-side.
function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MatchingZone({
  numbers,
  zone,
  onComplete,
  onAdvance,
}: MatchingZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const values = useMemo(() => zone.pairs.map((p) => p.value), [zone.pairs]);

  // Initial render uses sorted order (deterministic) — shuffled after mount
  // via useEffect so SSR and first-client-render match, preventing hydration
  // errors.
  const [leftOrder, setLeftOrder] = useState<number[]>(values);
  const [rightOrder, setRightOrder] = useState<number[]>(values);

  useEffect(() => {
    setLeftOrder(shuffle(values));
    setRightOrder(shuffle(values));
  }, [values]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);

  const total = zone.pairs.length;

  const numberByValue = useMemo(() => {
    const m = new Map<number, NumberItem>();
    for (const n of numbers) m.set(n.value, n);
    return m;
  }, [numbers]);

  const emojiByValue = useMemo(() => {
    const m = new Map<number, string>();
    for (const p of zone.pairs) m.set(p.value, p.emoji);
    return m;
  }, [zone.pairs]);

  // Auto-check whenever both columns have a selection.
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;
    if (selectedLeft === selectedRight) {
      // Match!
      const value = selectedLeft;
      setMatched((prev) => {
        const next = new Set(prev);
        next.add(value);
        return next;
      });
      setFeedback("correct");
      setSelectedLeft(null);
      setSelectedRight(null);
      const item = numberByValue.get(value);
      if (item) playAudio(item.audioUrl, item.audioText ?? item.nameAr);
    } else {
      // Wrong — flash both, then reset.
      const a = selectedLeft;
      const b = selectedRight;
      setWrongFlash(new Set([a, b]));
      setFeedback("wrong");
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      window.setTimeout(() => {
        setWrongFlash(new Set());
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeft, selectedRight]);

  // Notify parent once, when everything is matched.
  useEffect(() => {
    if (matched.size === total && total > 0 && !notified) {
      setNotified(true);
      onComplete?.({ correct: total, total });
    }
  }, [matched, total, notified, onComplete]);

  const pickLeft = (value: number) => {
    if (matched.has(value)) return;
    if (wrongFlash.size > 0) return;
    setSelectedLeft(value);
  };

  const pickRight = (value: number) => {
    if (matched.has(value)) return;
    if (wrongFlash.size > 0) return;
    setSelectedRight(value);
  };

  const restart = () => {
    setLeftOrder(shuffle(values));
    setRightOrder(shuffle(values));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrongFlash(new Set());
    setFeedback(null);
    setNotified(false);
  };

  const allDone = matched.size === total && total > 0;

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="matching-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="matching-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "طَابِقْ"}
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
          <span aria-hidden>⭐</span>
          <span className="tabular-nums">
            {matched.size} / {total}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!allDone ? (
          <motion.div
            key="playing"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Left column — digits */}
              <div
                role="radiogroup"
                aria-label="Digits column"
                className="flex flex-col gap-3"
              >
                {leftOrder.map((v, i) => {
                  const item = numberByValue.get(v);
                  if (!item) return null;
                  const isMatched = matched.has(v);
                  const isSelected = selectedLeft === v;
                  const isWrong = wrongFlash.has(v) && isSelected;
                  const status =
                    isMatched || isWrong ? (isMatched ? "correct" : "wrong") : null;
                  return (
                    <div key={`L-${v}`} role="radio" aria-checked={isSelected}>
                      <NumberCard
                        number={item}
                        size="sm"
                        index={i}
                        onClick={() => pickLeft(v)}
                        disabled={isMatched}
                        selected={isSelected && !isMatched}
                        status={status}
                        showArabicName={false}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right column — quantity visuals */}
              <div
                role="radiogroup"
                aria-label="Quantity column"
                className="flex flex-col gap-3"
              >
                {rightOrder.map((v, i) => {
                  const emoji = emojiByValue.get(v);
                  if (!emoji) return null;
                  const isMatched = matched.has(v);
                  const isSelected = selectedRight === v;
                  const isWrong = wrongFlash.has(v) && isSelected;
                  const ring = isMatched
                    ? "ring-4 ring-emerald-500"
                    : isWrong
                      ? "ring-4 ring-rose-500"
                      : isSelected
                        ? "ring-4 ring-gray-900"
                        : "ring-1 ring-black/5";
                  return (
                    <motion.button
                      key={`R-${v}`}
                      type="button"
                      onClick={() => pickRight(v)}
                      disabled={isMatched || wrongFlash.size > 0}
                      whileHover={
                        !prefersReducedMotion && !isMatched
                          ? { y: -3, scale: 1.03 }
                          : undefined
                      }
                      whileTap={
                        !prefersReducedMotion && !isMatched
                          ? { scale: 0.97 }
                          : undefined
                      }
                      animate={
                        isWrong && !prefersReducedMotion
                          ? { x: [0, -6, 6, -4, 4, 0] }
                          : isMatched && !prefersReducedMotion
                            ? { rotate: [0, -3, 3, 0] }
                            : undefined
                      }
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Group of ${v}`}
                      className={`relative flex min-h-[6rem] items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed ${ring}`}
                    >
                      {isMatched && (
                        <span
                          aria-hidden
                          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-base text-white shadow-lg"
                        >
                          ✓
                        </span>
                      )}
                      <QuantityVisual count={v} emoji={emoji} size="md" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <div className="text-6xl" aria-hidden>
              🏆
            </div>
            <p className="mt-3 text-2xl font-black text-gray-900 tabular-nums">
              {total} / {total}
            </p>
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ!
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
