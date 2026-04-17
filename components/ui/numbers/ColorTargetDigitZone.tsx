"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import Confetti from "@/components/ui/Confetti";
import DigitGrid, { type DigitCellState } from "./DigitGrid";
import FeedbackOverlay from "./FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import type {
  ColorTargetDigitZone as ColorTargetDigitZoneData,
  NumberItem,
} from "@/lib/types/numbersLesson.types";

export interface ColorTargetDigitZoneProps {
  numbers: NumberItem[];
  zone: ColorTargetDigitZoneData;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

const NAMED_COLOR_HEX: Record<string, string> = {
  red: "#DC2626",
  blue: "#2563EB",
  green: "#16A34A",
  yellow: "#EAB308",
  purple: "#9333EA",
  orange: "#EA580C",
  pink: "#DB2777",
};

function resolveHex(colorInput: string): string {
  if (colorInput.startsWith("#")) return colorInput;
  return NAMED_COLOR_HEX[colorInput] ?? "#DC2626";
}

/* -------------------------------------------------------------------------- */
/*  Deterministic PRNG so we can optionally reproduce a grid in tests.        */
/*  When `seed` is undefined we use Math.random.                              */
/* -------------------------------------------------------------------------- */
function makeRng(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Layout {
  digits: number[];
  targetIndexes: Set<number>;
}

function generateLayout(zone: ColorTargetDigitZoneData, rngSeed?: number): Layout {
  const total = zone.gridCols * zone.gridRows;
  const rng = makeRng(rngSeed ?? zone.shuffleSeed);

  // Pick `targetCount` distinct positions for the target digit.
  const positions = Array.from({ length: total }, (_, i) => i);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const targetIndexes = new Set(positions.slice(0, zone.targetCount));

  const digits = Array.from({ length: total }, (_, i) => {
    if (targetIndexes.has(i)) return zone.targetDigit;
    const idx = Math.floor(rng() * zone.distractorDigits.length);
    return zone.distractorDigits[idx];
  });

  return { digits, targetIndexes };
}

export default function ColorTargetDigitZone({
  numbers,
  zone,
  onComplete,
  onAdvance,
}: ColorTargetDigitZoneProps) {
  const { playAudio, isMuted, toggleMute } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  // Build the layout on the client — deferred to useEffect to avoid SSR /
  // hydration mismatch on the random digit positions.
  const [layout, setLayout] = useState<Layout>(() => ({
    digits: [],
    targetIndexes: new Set<number>(),
  }));
  const [rerollTick, setRerollTick] = useState(0);

  useEffect(() => {
    setLayout(generateLayout(zone));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, rerollTick]);

  const [colored, setColored] = useState<Set<number>>(new Set());
  const [wrongAt, setWrongAt] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);
  // Wrong-tap counter kept internal — never shown to the child so they're
  // never discouraged; available via onComplete for future analytics.
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const colouredHex = useMemo(() => resolveHex(zone.targetColor), [zone.targetColor]);

  const stateByIndex = useMemo<Record<number, DigitCellState>>(() => {
    const map: Record<number, DigitCellState> = {};
    colored.forEach((i) => (map[i] = "colored"));
    if (wrongAt !== null) map[wrongAt] = "wrong-flash";
    return map;
  }, [colored, wrongAt]);

  const allDone =
    layout.targetIndexes.size > 0 && colored.size === layout.targetIndexes.size;

  const numberByValue = useMemo(() => {
    const m = new Map<number, NumberItem>();
    for (const n of numbers) m.set(n.value, n);
    return m;
  }, [numbers]);

  const targetArabicName = useMemo(() => {
    const item = numberByValue.get(zone.targetDigit);
    return item?.audioText ?? item?.nameAr ?? String(zone.targetDigit);
  }, [numberByValue, zone.targetDigit]);

  const ariaLabelForDigit = useCallback(
    (digit: number) =>
      digit === zone.targetDigit ? `الرَّقْمُ ${targetArabicName}` : "رَقْمٌ آخَرُ",
    [zone.targetDigit, targetArabicName],
  );

  const playInstruction = useCallback(() => {
    playAudio(
      undefined,
      zone.title ?? "لَوِّنِ الرَّقْمَ الْمَطْلُوبَ",
    );
  }, [playAudio, zone.title]);

  const onTap = useCallback(
    (index: number) => {
      if (allDone) return;
      if (colored.has(index)) return;

      if (layout.targetIndexes.has(index)) {
        setColored((prev) => {
          const next = new Set(prev);
          next.add(index);
          return next;
        });
        setFeedback("correct");
        playAudio(undefined, targetArabicName);
      } else {
        setWrongAttempts((n) => n + 1);
        setWrongAt(index);
        setFeedback("wrong");
        playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
        window.setTimeout(() => setWrongAt(null), 600);
      }
    },
    [allDone, colored, layout.targetIndexes, playAudio, targetArabicName],
  );

  // Fire onComplete once when the child colours the last target.
  useEffect(() => {
    if (allDone && !notified) {
      setNotified(true);
      setConfettiKey((k) => k + 1);
      playAudio(undefined, `أَحْسَنْتَ ${targetArabicName}`);
      onComplete?.({
        correct: layout.targetIndexes.size,
        total: layout.targetIndexes.size,
      });
    }
  }, [allDone, notified, onComplete, layout.targetIndexes.size, playAudio, targetArabicName]);

  const replay = useCallback(() => {
    setColored(new Set());
    setWrongAt(null);
    setFeedback(null);
    setNotified(false);
    setWrongAttempts(0);
    setRerollTick((n) => n + 1);
  }, []);

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="color-target-title"
    >
      <Confetti trigger={confettiKey} />
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            id="color-target-title"
            className="flex flex-wrap items-center gap-2 text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            <span aria-hidden>🎯</span>
            {zone.title ?? "لَوِّنِ الرَّقْمَ الْمَطْلُوبَ"}
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playInstruction}
            aria-label="Play the instruction"
            className="inline-flex h-12 min-w-12 items-center justify-center gap-1 rounded-full bg-white px-3 text-sm font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
          >
            🔊
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-white px-3 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Progress chip — live-updated. Counter stays LTR inside RTL. */}
      <div className="mb-4 flex items-center justify-center">
        <div
          aria-live="polite"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          <motion.span
            aria-hidden
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ⭐
          </motion.span>
          <span className="tabular-nums" dir="ltr">
            {colored.size} / {layout.targetIndexes.size || zone.targetCount}
          </span>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {!allDone ? (
          <motion.div
            key="grid"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <DigitGrid
              digits={layout.digits}
              cols={zone.gridCols}
              rows={zone.gridRows}
              stateByIndex={stateByIndex}
              coloredColor={colouredHex}
              onTap={onTap}
              disabled={allDone}
              ariaLabelForDigit={ariaLabelForDigit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
            data-wrong-attempts={wrongAttempts}
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
              أَحْسَنْتَ! لَقَدْ وَجَدْتَ كُلَّ الْأَرْقَامِ!
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={replay}
                className="min-h-16 rounded-full bg-white px-6 py-2.5 text-sm font-black text-gray-800 shadow ring-1 ring-black/5 hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                ↺ أَعِدِ اللُّعْبَةَ
              </button>
              {onAdvance && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="min-h-16 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
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
