"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import Confetti from "@/components/ui/Confetti";
import NumbersBackground from "./NumbersBackground";
import ScoreTracker from "./ScoreTracker";
import ZoneNavigator, { type ZoneResult } from "./ZoneNavigator";
import type { NumbersLessonSection } from "@/lib/types/numbersLesson.types";

export interface NumbersLessonPageProps {
  /** Zod-validated content of the single `numbers_lesson` LessonSection. */
  content: NumbersLessonSection;
  /** Theme context for breadcrumbs. */
  theme: { name: string; title: string };
  /** Lesson-level title (usually the Arabic lesson title). */
  lessonTitle: string;
  /** Optional "next lesson" CTA shown on the completion screen. */
  nextLesson: { slug: string; title: string } | null;
}

type Phase =
  | { kind: "intro" }
  | { kind: "zone"; index: number }
  | { kind: "complete" };

/**
 * Self-contained orchestrator for a `numbers_lesson` section.
 *
 * Renders breadcrumbs → hero intro → one of 5 interactive zones at a time
 * → completion screen with total score. Each zone fires `onComplete` once
 * it detects success, at which point we award a star and trigger confetti.
 *
 * The outer `LessonAdventure` is bypassed for this lesson (see page.tsx)
 * to avoid double-chrome — this page is the whole experience.
 */
export default function NumbersLessonPage({
  content,
  theme,
  lessonTitle,
  nextLesson,
}: NumbersLessonPageProps) {
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [stars, setStars] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [zoneResults, setZoneResults] = useState<
    Record<number, ZoneResult | null>
  >({});

  const totalZones = content.zones.length;

  const currentZone =
    phase.kind === "zone" ? content.zones[phase.index] : null;

  const totals = useMemo(() => {
    let correct = 0;
    let total = 0;
    for (const r of Object.values(zoneResults)) {
      if (!r) continue;
      correct += r.correct;
      total += r.total;
    }
    return { correct, total };
  }, [zoneResults]);

  const start = () => {
    if (totalZones > 0) setPhase({ kind: "zone", index: 0 });
    else setPhase({ kind: "complete" });
  };

  const onZoneComplete = (index: number) => (result?: ZoneResult) => {
    setZoneResults((prev) => {
      if (prev[index] !== undefined) return prev;
      return { ...prev, [index]: result ?? null };
    });
    setStars((s) => s + 1);
    setConfettiKey((k) => k + 1);
  };

  const onZoneAdvance = (index: number) => () => {
    const nextIdx = index + 1;
    if (nextIdx >= totalZones) {
      setPhase({ kind: "complete" });
      setTimeout(() => setConfettiKey((k) => k + 1), 400);
    } else {
      setPhase({ kind: "zone", index: nextIdx });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <NumbersBackground />
      <Confetti trigger={confettiKey} />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-5xl px-6 pt-6 text-sm text-gray-500 sm:px-10"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard/courses" className="hover:text-gray-800">
              Courses
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/dashboard/courses/${encodeURIComponent(theme.name)}`}
              className="hover:text-gray-800"
            >
              {theme.title}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li
            aria-current="page"
            className="truncate font-semibold text-gray-800"
            lang="ar"
            dir="auto"
          >
            {lessonTitle}
          </li>
        </ol>
      </nav>

      <main className="mx-auto mt-4 max-w-5xl px-6 pb-24 sm:px-10">
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
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 text-6xl shadow-xl ring-4 ring-white">
                🔢
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
                هَيَّا بِنَا نَتَعَلَّمُ الْأَرْقَامَ!
              </p>
              <motion.button
                type="button"
                onClick={start}
                whileHover={
                  prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className="mt-6 inline-flex min-h-16 items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                اِبْدَأِ الْمُغَامَرَةَ 🚀
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
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              <ScoreTracker
                zoneIndex={phase.index}
                totalZones={totalZones}
                zoneTitle={currentZone.title}
                stars={stars}
              />

              <div className="mt-5">
                <ZoneNavigator
                  zone={currentZone}
                  numbers={content.numbers}
                  onComplete={onZoneComplete(phase.index)}
                  onAdvance={onZoneAdvance(phase.index)}
                />
              </div>
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
      </main>
    </div>
  );
}
