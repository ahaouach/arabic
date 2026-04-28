"use client";

/**
 * Generic orchestrator for any `vocabulary_lesson` section.
 *
 * Drives the outer state machine (intro → zone[0..N-1] → complete),
 * sticky progress header, completion screen, replay. Zone-local state
 * (round composition, scene layout, randomisation seed) lives inside
 * each zone — this component only passes data through.
 *
 * Renders one of 13 themed backgrounds based on `content.theme`.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ThemedBackground from "./ThemedBackground";
import ZoneNavigator from "./ZoneNavigator";
import Confetti from "@/components/ui/Confetti";
import LessonShell from "@/lib/components/arabic/LessonShell";
import { useLessonProgress, type ZoneResult } from "@/lib/hooks/useLessonProgress";
import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";

export interface VocabularyLessonPageProps {
  content: VocabularyLessonSection;
  theme: { name: string; title: string };
  lessonTitle: string;
  nextLesson: { slug: string; title: string } | null;
}

const THEME_GRADIENTS: Record<string, string> = {
  fruits: "from-orange-300 via-rose-400 to-amber-500",
  vegetables: "from-emerald-300 via-lime-400 to-amber-400",
  "body-parts": "from-pink-300 via-violet-400 to-sky-500",
  clothes: "from-fuchsia-300 via-rose-400 to-amber-400",
  jobs: "from-sky-300 via-indigo-400 to-violet-500",
  transport: "from-sky-300 via-cyan-400 to-emerald-500",
  days: "from-violet-300 via-indigo-400 to-sky-500",
  seasons: "from-orange-300 via-rose-400 to-emerald-500",
  weather: "from-sky-300 via-blue-400 to-slate-500",
  emotions: "from-rose-300 via-pink-400 to-amber-500",
  food: "from-amber-300 via-orange-400 to-rose-500",
  instruments: "from-violet-300 via-fuchsia-400 to-rose-500",
  animals: "from-emerald-300 via-amber-400 to-sky-500",
};

const THEME_INTRO_GLYPHS: Record<string, string> = {
  fruits: "🍎",
  vegetables: "🥕",
  "body-parts": "🧒",
  clothes: "👕",
  jobs: "🧑‍💼",
  transport: "🚗",
  days: "📅",
  seasons: "🍂",
  weather: "☀️",
  emotions: "😊",
  food: "🍞",
  instruments: "🎵",
  animals: "🐾",
};

export default function VocabularyLessonPage({
  content,
  theme,
  lessonTitle,
  nextLesson,
}: VocabularyLessonPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const totalZones = content.zones.length;
  const themeKey = content.theme;

  const {
    phase,
    stars,
    confettiKey,
    totals,
    start,
    completeZone,
    advanceZone,
    reset,
  } = useLessonProgress(totalZones);

  const currentZone = phase.kind === "zone" ? content.zones[phase.index] : null;

  const handleComplete = (zoneIndex: number, result?: ZoneResult) => {
    completeZone(zoneIndex, result);
  };

  const introGradient =
    THEME_GRADIENTS[themeKey] ?? "from-violet-400 to-rose-400";
  const introGlyph = THEME_INTRO_GLYPHS[themeKey] ?? "📚";

  return (
    <LessonShell
      theme={theme}
      lessonTitle={lessonTitle}
      background={<ThemedBackground theme={themeKey} />}
    >
      <Confetti trigger={confettiKey} />

      {phase.kind === "zone" && currentZone && (
        <div className="sticky top-0 z-30 -mx-4 mb-4 bg-gradient-to-b from-white/95 to-white/70 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <div
              className="flex items-baseline gap-2"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              <span className="text-sm font-black text-gray-600">الْمِنْطَقَةُ</span>
              <span className="text-2xl font-black text-gray-900 tabular-nums">
                {phase.index + 1} / {totalZones}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-amber-700 shadow-inner ring-1 ring-amber-200">
              <span aria-hidden>⭐</span>
              <span className="text-sm font-black tabular-nums">
                {stars} / {totalZones}
              </span>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase.kind === "intro" && (
          <motion.section
            key="vocab-intro"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="relative mx-auto mt-4 max-w-3xl overflow-hidden rounded-[36px] bg-white p-8 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
          >
            <div
              className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${introGradient} text-6xl shadow-xl ring-4 ring-white`}
            >
              {introGlyph}
            </div>
            <h1
              className="mt-6 text-3xl sm:text-4xl font-black text-gray-900"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {content.title ?? lessonTitle}
            </h1>
            <p
              className="mx-auto mt-4 max-w-md text-base font-medium text-gray-600"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {content.zones.length === 5
                ? "خَمْسُ مَنَاطِقَ مَمْتِعَةٌ لِنَتَعَلَّمَ مَعًا"
                : `${content.zones.length} مَنَاطِقَ مَمْتِعَةٌ لِنَتَعَلَّمَ مَعًا`}
            </p>
            <motion.button
              type="button"
              onClick={start}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="mt-8 inline-flex min-h-16 items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 px-8 py-4 text-lg font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              هَيَّا نَبْدَأْ 🚀
            </motion.button>
          </motion.section>
        )}

        {phase.kind === "zone" && currentZone && (
          <motion.div
            key={`vocab-zone-${phase.index}`}
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            <ZoneNavigator
              zone={currentZone}
              theme={themeKey}
              items={content.items}
              words={content.words}
              colors={content.colors}
              onComplete={(r) => handleComplete(phase.index, r)}
              onAdvance={() => advanceZone(phase.index)}
            />
          </motion.div>
        )}

        {phase.kind === "complete" && (
          <motion.section
            key="vocab-complete"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="relative mx-auto mt-4 max-w-3xl overflow-hidden rounded-[36px] bg-white p-10 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-16"
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
              className="mt-6 text-3xl sm:text-4xl font-black text-gray-900"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ!
            </h2>
            <p
              className="mt-2 text-base font-medium text-gray-600"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَكْمَلْتَ الدَّرْسَ
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
                Score: {totals.correct} / {totals.total}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition hover:bg-violet-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70"
                dir="rtl"
                lang="ar"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                <span aria-hidden>🔁</span> إِعَادَةٌ
              </button>
              {nextLesson && (
                <a
                  href={`/dashboard/courses/${encodeURIComponent(theme.name)}/${encodeURIComponent(nextLesson.slug)}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70"
                  dir="rtl"
                  lang="ar"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  الدَّرْسُ التَّالِي <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </LessonShell>
  );
}
