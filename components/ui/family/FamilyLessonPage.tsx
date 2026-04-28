"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FamilyBackground from "./FamilyBackground";
import ZoneNavigator from "./ZoneNavigator";
import Confetti from "@/components/ui/Confetti";
import LessonShell from "@/lib/components/arabic/LessonShell";
import { useLessonProgress, type ZoneResult } from "@/lib/hooks/useLessonProgress";
import type { FamilyLessonSection } from "@/lib/types/familyLesson.types";

export interface FamilyLessonPageProps {
  content: FamilyLessonSection;
  theme: { name: string; title: string };
  lessonTitle: string;
  nextLesson: { slug: string; title: string } | null;
}

/**
 * Orchestrator for the 6-zone family lesson.
 *
 * Phases: intro → zone[0..N-1] → complete.
 * Star count + confetti driven by `useLessonProgress`. Zone-local
 * randomisation (order of cards, round composition, scene layout) is
 * owned by each zone; this orchestrator only drives the outer phase
 * machine and passes data through.
 */
export default function FamilyLessonPage({
  content,
  theme,
  lessonTitle,
  nextLesson,
}: FamilyLessonPageProps) {
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
    reset,
  } = useLessonProgress(totalZones);

  const currentZone = phase.kind === "zone" ? content.zones[phase.index] : null;

  const handleComplete = (zoneIndex: number, result?: ZoneResult) => {
    completeZone(zoneIndex, result);
  };

  return (
    <LessonShell theme={theme} lessonTitle={lessonTitle} background={<FamilyBackground />}>
      <Confetti trigger={confettiKey} />

      {/* Sticky progress header while inside a zone. */}
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
            key="family-intro"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="relative mx-auto mt-4 max-w-3xl overflow-hidden rounded-[36px] bg-white p-8 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 via-violet-400 to-sky-500 text-6xl shadow-xl ring-4 ring-white">
              👨‍👩‍👧‍👦
            </div>
            <h1
              className="mt-6 text-3xl sm:text-4xl font-black text-gray-900"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {content.title ?? "الْعَائِلَةُ"}
            </h1>
            <p
              className="mx-auto mt-4 max-w-md text-base font-medium text-gray-600"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              سِتُّ مَنَاطِقَ مَمْتِعَةٌ لِنَتَعَلَّمَ أَفْرَادَ الْعَائِلَةِ مَعًا
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
            key={`family-zone-${phase.index}`}
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            <ZoneNavigator
              zone={currentZone}
              members={content.members}
              words={content.words}
              colors={content.colors}
              onComplete={(r) => handleComplete(phase.index, r)}
              onAdvance={() => advanceZone(phase.index)}
            />
          </motion.div>
        )}

        {phase.kind === "complete" && (
          <motion.section
            key="family-complete"
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
              أَكْمَلْتَ دَرْسَ الْعَائِلَةِ
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
