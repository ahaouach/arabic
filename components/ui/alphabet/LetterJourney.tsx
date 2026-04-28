"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import ZoneNavigator, { type ZoneResult } from "./ZoneNavigator";
import Confetti from "@/components/ui/Confetti";
import ScoreTracker from "@/components/ui/numbers/ScoreTracker";
import { useLessonProgress } from "@/lib/hooks/useLessonProgress";
import { useLetterProgress } from "@/lib/hooks/useLetterProgress";
import type {
  AlphabetLessonZone,
  ArabicLetter,
  VocabularyWord,
} from "@/lib/types/alphabetLesson.types";

export interface LetterJourneyProps {
  letter: ArabicLetter;
  allLetters: ArabicLetter[];
  vocabulary: VocabularyWord[];
  zones: AlphabetLessonZone[];
  /** Suggested next letter for the end screen. */
  nextLetter: ArabicLetter | null;
  onBack: () => void;
  onSelectLetter: (key: string) => void;
}

/**
 * Five-zone flow for a single letter: intro → zones[0..N-1] → complete.
 *
 * Progress is tracked in two layers:
 *   - `useLessonProgress`: in-journey state machine + star count (ephemeral).
 *   - `useLetterProgress`: per-letter zone completion in localStorage
 *     (persistent). Each zone completion writes through to both.
 *
 * The parent remounts this component with a new `key={letter.key}` when
 * the URL letter changes, so internal state resets cleanly.
 */
export default function LetterJourney({
  letter,
  allLetters,
  vocabulary,
  zones,
  nextLetter,
  onBack,
  onSelectLetter,
}: LetterJourneyProps) {
  const prefersReducedMotion = useReducedMotion();
  const totalZones = zones.length;
  const {
    phase,
    stars,
    confettiKey,
    totals,
    start,
    completeZone,
    advanceZone,
  } = useLessonProgress(totalZones);
  const { markZoneComplete } = useLetterProgress();

  const currentZone = phase.kind === "zone" ? zones[phase.index] : null;

  const header = useMemo(() => {
    if (phase.kind !== "zone") return null;
    return (
      <ScoreTracker
        zoneIndex={phase.index}
        totalZones={totalZones}
        zoneTitle={currentZone?.title}
        stars={stars}
      />
    );
  }, [phase, totalZones, currentZone, stars]);

  const handleComplete = (zoneIndex: number, result?: ZoneResult) => {
    completeZone(zoneIndex, result);
    const zoneKind = zones[zoneIndex]?.kind;
    if (zoneKind) markZoneComplete(letter.key, zoneKind);
  };

  return (
    <div className="relative">
      <Confetti trigger={confettiKey} />

      {/* Sticky journey header */}
      <div className="sticky top-0 z-30 -mx-4 mb-6 bg-gradient-to-b from-white/95 to-white/70 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            <span aria-hidden>←</span> كُلُّ الْحُرُوفِ
          </button>
          <div
            className="flex items-baseline gap-2"
            lang="ar"
            dir="rtl"
            style={{
              fontFamily:
                '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
            }}
          >
            <span className="text-4xl font-black text-gray-900">
              {letter.forms.isolated}
            </span>
            <span className="text-sm font-black text-gray-700">
              {letter.nameAr}
            </span>
          </div>
        </div>
        {header && <div className="mt-3">{header}</div>}
      </div>

      <AnimatePresence mode="wait">
        {phase.kind === "intro" && (
          <motion.section
            key="intro"
            initial={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: 30, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="relative overflow-hidden rounded-[36px] bg-white p-8 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
          >
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-rose-400 to-sky-500 shadow-xl ring-4 ring-white">
              <span
                className="text-7xl font-black text-white"
                lang="ar"
                dir="rtl"
                style={{
                  fontFamily:
                    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                }}
              >
                {letter.forms.isolated}
              </span>
            </div>
            <h1
              className="mt-5 text-3xl font-black text-gray-900 sm:text-4xl"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              حَرْفُ {letter.nameAr}
            </h1>
            <p className="mt-1 text-sm font-medium uppercase tracking-widest text-gray-500">
              {letter.transliteration}
            </p>
            <p
              className="mx-auto mt-6 max-w-md text-sm font-medium text-gray-500"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              خَمْسُ مَنَاطِقَ لِنَكْتَشِفَ هَذَا الْحَرْفَ مَعًا!
            </p>
            <motion.button
              type="button"
              onClick={start}
              whileHover={
                prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="mt-6 inline-flex min-h-16 items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 px-8 py-4 text-base font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              هَيَّا نَبْدَأْ 🚀
            </motion.button>
          </motion.section>
        )}

        {phase.kind === "zone" && currentZone && (
          <motion.div
            key={`zone-${phase.index}`}
            initial={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, x: 40, scale: 0.97 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }
            }
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            <ZoneNavigator
              zone={currentZone}
              letter={letter}
              allLetters={allLetters}
              vocabulary={vocabulary}
              onComplete={(r) => handleComplete(phase.index, r)}
              onAdvance={() => advanceZone(phase.index)}
            />
          </motion.div>
        )}

        {phase.kind === "complete" && (
          <motion.section
            key="complete"
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="relative overflow-hidden rounded-[36px] bg-white p-10 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-16"
          >
            <motion.div
              aria-hidden
              animate={
                prefersReducedMotion
                  ? undefined
                  : { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-rose-400 text-7xl shadow-2xl ring-4 ring-white"
            >
              🏆
            </motion.div>
            <h2
              className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ!
            </h2>
            <p
              className="mt-2 text-base font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَكْمَلْتَ حَرْفَ{" "}
              <span className="font-black text-gray-900">{letter.nameAr}</span>
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 px-6 py-3 shadow-inner">
              <span className="text-3xl" aria-hidden>
                ⭐
              </span>
              <span className="text-2xl font-black text-amber-700 tabular-nums">
                {stars} / {totalZones} stars
              </span>
            </div>
            {totals.total > 0 && (
              <p className="mt-2 text-sm font-medium text-gray-500 tabular-nums">
                Quiz score: {totals.correct} / {totals.total}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                <span aria-hidden>←</span> كُلُّ الْحُرُوفِ
              </button>
              {nextLetter && (
                <button
                  type="button"
                  onClick={() => onSelectLetter(nextLetter.key)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  التَّالِي: {nextLetter.nameAr} <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
