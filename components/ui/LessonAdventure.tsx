"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Confetti from "./Confetti";
import FloatingBackground from "./FloatingBackground";
import GameProgressBar from "./GameProgressBar";
import LevelBadge from "./LevelBadge";
import Mascot, { type MascotMood } from "./Mascot";
import SectionRenderer from "./SectionRenderer";
import { useAudio } from "@/lib/useAudio";
import type { LessonLevel } from "@/lib/lessonLevel";
import type { Section } from "@/lib/lessonSections";

export interface LessonAdventureProps {
  title: string;
  description: string | null;
  icon: string | null;
  level: LessonLevel;
  sections: Section[];
  theme: { name: string; title: string };
  nextLesson: { slug: string; title: string } | null;
}

type Phase =
  | { kind: "intro" }
  | { kind: "zone"; index: number }
  | { kind: "complete" };

const ZONE_LABELS: Record<Section["type"], { label: string; icon: string }> = {
  text: { label: "Story Zone", icon: "📖" },
  image: { label: "Discovery Zone", icon: "🎨" },
  audio: { label: "Listening Zone", icon: "🎧" },
  quiz: { label: "Quiz Battle", icon: "⚔️" },
  numbers: { label: "Number World", icon: "🔢" },
  quiz_match: { label: "Match Challenge", icon: "🧠" },
  game_numbers: { label: "Mini Game", icon: "🎮" },
  paint_game: { label: "Paint Studio", icon: "🎨" },
  interactive_color_world: { label: "Color World", icon: "🌈" },
  interactive_shapes_world: { label: "Shape World", icon: "🔷" },
  draw_shapes: { label: "Draw Shapes", icon: "✏️" },
  color_shapes: { label: "Color Shapes", icon: "🎨" },
  family_intro: { label: "Meet the Family", icon: "👨‍👩‍👧‍👦" },
  family_tree: { label: "Family Tree", icon: "🌳" },
  family_match: { label: "Match Game", icon: "🎮" },
  body_map: { label: "Body Explorer", icon: "👤" },
  pronoun_cards: { label: "Meet the Pronouns", icon: "🗣️" },
  pronoun_object: { label: "Object Forms", icon: "🔄" },
  pronoun_sentences: { label: "Sentences", icon: "🧠" },
  pronoun_quiz: { label: "Pronoun Quiz", icon: "🎮" },
  animal_world: { label: "Animal World", icon: "🐾" },
  animal_world_quiz: { label: "Animal Quiz", icon: "🎮" },
  // `numbers_lesson` renders via its own full-page orchestrator
  // (NumbersLessonPage) — if we ever get here through LessonAdventure it
  // means a mixed-section lesson added one by mistake; show a neutral
  // fallback label rather than crash exhaustiveness.
  numbers_lesson: { label: "Number World", icon: "🔢" },
  // `colors_lesson` renders via its own full-page orchestrator
  // (ColorsLessonPage) and normally never routes through LessonAdventure,
  // but a fallback label keeps the exhaustive check happy.
  colors_lesson: { label: "Colors World", icon: "🌈" },
  // Same story for `shapes_lesson` — routed via ShapesLessonPage in the
  // dynamic route. Fallback label present only to satisfy exhaustiveness.
  shapes_lesson: { label: "Shapes World", icon: "🔷" },
  // And again for `alphabet_lesson` — rendered by AlphabetLessonPage.
  alphabet_lesson: { label: "Alphabet Journey", icon: "🔤" },
};

export default function LessonAdventure({
  title,
  description,
  icon,
  level,
  sections,
  theme,
  nextLesson,
}: LessonAdventureProps) {
  const { playAudio } = useAudio();

  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [stars, setStars] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);

  const total = sections.length;
  const currentIndex = phase.kind === "zone" ? phase.index : phase.kind === "intro" ? 0 : total;

  const currentSection = phase.kind === "zone" ? sections[phase.index] : null;
  const zoneLabel = currentSection ? ZONE_LABELS[currentSection.type] : null;

  /* ---- Mascot messages ---- */
  const mascotState = useMemo<{ message: string; mood: MascotMood }>(() => {
    if (phase.kind === "intro") {
      return {
        message: description || "مَرْحَبًا! Let's start a new adventure together!",
        mood: "happy",
      };
    }
    if (phase.kind === "complete") {
      return { message: "🎉 Amazing work! You finished the whole adventure!", mood: "cheer" };
    }
    const i = phase.index + 1;
    if (i === total) return { message: "Last zone — you got this!", mood: "cheer" };
    if (i === 1) return { message: "Tap and listen to explore!", mood: "happy" };
    return { message: `Zone ${i} of ${total} — keep going!`, mood: "think" };
  }, [phase, total, description]);

  /* ---- Actions ---- */
  const start = () => {
    playAudio(undefined, description || "هَيَّا بِنَا نَتَعَلَّمُ");
    if (total > 0) setPhase({ kind: "zone", index: 0 });
    else setPhase({ kind: "complete" });
  };

  const goNext = () => {
    if (phase.kind !== "zone") return;
    setStars((s) => s + 1);
    setConfettiKey((k) => k + 1);
    const next = phase.index + 1;
    if (next >= total) {
      setPhase({ kind: "complete" });
      setTimeout(() => setConfettiKey((k) => k + 1), 600);
    } else {
      setPhase({ kind: "zone", index: next });
    }
  };

  const goPrev = () => {
    if (phase.kind !== "zone" || phase.index === 0) return;
    setPhase({ kind: "zone", index: phase.index - 1 });
  };

  /* ---- Keyboard nav ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase.kind !== "zone") return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <FloatingBackground />
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
          <li aria-current="page" className="font-semibold text-gray-800" dir="auto">
            {title}
          </li>
        </ol>
      </nav>

      {/* Hero header */}
      <header className="mx-auto mt-4 max-w-5xl px-6 sm:px-10">
        <motion.div
          layout
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-sky-400 via-fuchsia-500 to-amber-400 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/40 sm:p-8"
        >
          <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/30 blur-2xl" />
          <div className="relative flex items-center gap-4">
            {icon && (
              <motion.div
                aria-hidden
                animate={{ y: [0, -8, 0], rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/90 text-5xl shadow-inner"
              >
                {icon}
              </motion.div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black uppercase tracking-widest text-white/90">
                  {theme.title}
                </p>
                <LevelBadge level={level} size="sm" animated={false} />
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 truncate text-3xl font-black text-white drop-shadow sm:text-4xl"
                dir="auto"
              >
                {title}
              </motion.h1>
            </div>
          </div>

          <div className="relative mt-5">
            <GameProgressBar current={currentIndex} total={total} stars={stars} level={1} />
          </div>
        </motion.div>
      </header>

      {/* Main stage */}
      <main className="mx-auto mt-6 max-w-5xl px-6 pb-24 sm:px-10">
        <AnimatePresence mode="wait">
          {phase.kind === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              className="relative overflow-hidden rounded-[36px] bg-white p-8 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
            >
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 text-6xl shadow-xl ring-4 ring-white">
                {icon ?? "🌟"}
              </div>
              <h2 className="mt-5 text-2xl font-black text-gray-900 sm:text-3xl" dir="auto">
                {title}
              </h2>
              {description && (
                <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600 sm:text-base" dir="auto">
                  {description}
                </p>
              )}
              <p className="mx-auto mt-6 max-w-md text-sm font-medium text-gray-500">
                Ready for today&apos;s adventure? Press the button and let&apos;s go!
              </p>
              <motion.button
                type="button"
                onClick={start}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl"
              >
                Start Adventure 🚀
              </motion.button>
            </motion.section>
          )}

          {phase.kind === "zone" && currentSection && zoneLabel && (
            <motion.section
              key={`zone-${phase.index}`}
              initial={{ opacity: 0, x: 60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="relative"
            >
              {/* Zone header */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-md ring-1 ring-black/5"
                >
                  {zoneLabel.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                    Zone {phase.index + 1} / {total}
                  </p>
                  <h3 className="text-lg font-black text-gray-900">{zoneLabel.label}</h3>
                </div>
              </div>

              {/* Zone content */}
              <div className="relative">
                <SectionRenderer section={currentSection} />
              </div>

              {/* Zone navigation */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={phase.index === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-yellow-50"
                >
                  <span aria-hidden>←</span> Previous
                </button>

                <motion.button
                  type="button"
                  onClick={goNext}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-8 py-3 text-base font-black text-white shadow-xl"
                >
                  {phase.index + 1 === total ? "Finish Lesson 🏁" : "Next Level"}
                  <span aria-hidden>→</span>
                </motion.button>
              </div>
            </motion.section>
          )}

          {phase.kind === "complete" && (
            <motion.section
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              className="relative overflow-hidden rounded-[36px] bg-white p-10 text-center shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-16"
            >
              <motion.div
                aria-hidden
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-pink-400 text-7xl shadow-2xl ring-4 ring-white"
              >
                🏆
              </motion.div>
              <h2 className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl">
                Adventure complete!
              </h2>
              <p className="mt-2 text-base font-medium text-gray-600">
                You finished <span className="font-black text-gray-900">{title}</span>.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 px-6 py-3 shadow-inner">
                <span className="text-3xl" aria-hidden>
                  ⭐
                </span>
                <span className="text-2xl font-black text-amber-700">
                  {stars} / {total} stars
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/dashboard/courses/${encodeURIComponent(theme.name)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
                >
                  <span aria-hidden>←</span> Back to {theme.title}
                </Link>
                {nextLesson && (
                  <Link
                    href={`/dashboard/courses/${encodeURIComponent(theme.name)}/${encodeURIComponent(nextLesson.slug)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-xl"
                  >
                    Next: {nextLesson.title} <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Mascot — hidden on very small screens to avoid overlap */}
      <div className="hidden sm:block">
        <Mascot message={mascotState.message} mood={mascotState.mood} position="bottom-left" />
      </div>
    </div>
  );
}
