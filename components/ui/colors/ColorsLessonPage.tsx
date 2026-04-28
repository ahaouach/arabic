"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import ColorsBackground from "./ColorsBackground";
import ZoneNavigator from "./ZoneNavigator";
import Confetti from "@/components/ui/Confetti";
import ScoreTracker from "@/components/ui/numbers/ScoreTracker";
import LessonShell from "@/lib/components/arabic/LessonShell";
import { useLessonProgress } from "@/lib/hooks/useLessonProgress";
import type { ColorsLessonSection } from "@/lib/types/colorsLesson.types";

export interface ColorsLessonPageProps {
  content: ColorsLessonSection;
  theme: { name: string; title: string };
  lessonTitle: string;
  nextLesson: { slug: string; title: string } | null;
}

/**
 * Self-contained orchestrator for the `colors_lesson` section.
 *
 * Phases: `intro` → `zone[0..N-1]` → `complete`.
 * Reuses the Phase 3 shared utilities (`useLessonProgress`, `LessonShell`)
 * and the `ScoreTracker` / `Confetti` atoms shared with the numbers
 * lesson. Zero duplication of lesson-level chrome.
 */
export default function ColorsLessonPage({
  content,
  theme,
  lessonTitle,
  nextLesson,
}: ColorsLessonPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const totalZones = content.zones.length;
  const {
    phase,
    stars,
    confettiKey,
    totals,
    start,
    completeZone,
    advanceZone,
  } = useLessonProgress(totalZones);

  const currentZone =
    phase.kind === "zone" ? content.zones[phase.index] : null;

  return (
    <LessonShell
      theme={theme}
      lessonTitle={lessonTitle}
      background={<ColorsBackground />}
      overlay={<Confetti trigger={confettiKey} />}
      header={
        phase.kind === "zone" ? (
          <ScoreTracker
            zoneIndex={phase.index}
            totalZones={totalZones}
            zoneTitle={currentZone?.title}
            stars={stars}
          />
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {phase.kind === "intro" && (
          <motion.section
            key="intro"
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, y: 30, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="relative overflow-hidden rounded-[36px] bg-white p-8 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-pink-400 to-fuchsia-500 text-6xl shadow-xl ring-4 ring-white">
              🌈
            </div>
            <h1
              className="mt-5 text-3xl font-black text-gray-900 sm:text-4xl"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {lessonTitle}
            </h1>
            {content.title && content.title !== lessonTitle && (
              <p
                className="mx-auto mt-2 max-w-xl text-base text-gray-600"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {content.title}
              </p>
            )}
            <p
              className="mx-auto mt-6 max-w-md text-sm font-medium text-gray-500"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              هَيَّا بِنَا نَتَعَلَّمُ الْأَلْوَانَ!
            </p>
            <motion.button
              type="button"
              onClick={start}
              whileHover={
                prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="mt-6 inline-flex min-h-16 items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              اِبْدَأِ الْمُغَامَرَةَ 🚀
            </motion.button>
          </motion.section>
        )}

        {phase.kind === "zone" && currentZone && (
          <motion.div
            key={`zone-${phase.index}`}
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, x: 40, scale: 0.97 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            <ZoneNavigator
              zone={currentZone}
              colors={content.colors}
              digits={content.digits}
              letters={content.letters}
              onComplete={(r) => completeZone(phase.index, r)}
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
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-pink-400 text-7xl shadow-2xl ring-4 ring-white"
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
            <p className="mt-2 text-base font-medium text-gray-600">
              You finished{" "}
              <span className="font-black text-gray-900" lang="ar" dir="rtl">
                {lessonTitle}
              </span>
              .
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
              <Link
                href={`/dashboard/courses/${encodeURIComponent(theme.name)}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                <span aria-hidden>←</span> Back to {theme.title}
              </Link>
              {nextLesson && (
                <Link
                  href={`/dashboard/courses/${encodeURIComponent(theme.name)}/${encodeURIComponent(nextLesson.slug)}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                >
                  Next: {nextLesson.title} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </LessonShell>
  );
}
