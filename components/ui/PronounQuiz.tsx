"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Confetti from "./Confetti";
import { useAudio } from "@/lib/useAudio";
import type { PronounQuizSection } from "@/lib/lessonSections";

/**
 * Render a prompt where "____" (4+ underscores) is replaced by a visual blank.
 */
function PromptWithBlank({ prompt }: { prompt: string }) {
  const parts = prompt.split(/_{3,}/);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="mx-1 inline-block min-w-[3.5rem] border-b-4 border-dashed border-gray-400 align-middle" />
          )}
        </span>
      ))}
    </>
  );
}

export default function PronounQuiz({ section }: { section: PronounQuizSection }) {
  const { playAudio } = useAudio();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);

  const total = section.questions.length;
  const q = section.questions[step];
  const finished = step >= total;

  const check = () => {
    if (!selected || !q) return;
    setRevealed(true);
    if (selected === q.answer) {
      setScore((s) => s + 1);
      setConfettiKey((k) => k + 1);
      playAudio(undefined, "أَحْسَنْتَ");
    } else {
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
    }
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <Confetti trigger={confettiKey} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {section.title && (
            <h3
              className="text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.title}
            </h3>
          )}
          {section.instructions && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.instructions}
            </p>
          )}
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-800 shadow ring-1 ring-black/5">
          {finished ? `${score} / ${total}` : `${step + 1} / ${total}`}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished && q ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mt-2 rounded-3xl bg-white p-6 text-center shadow-inner ring-1 ring-black/5">
              <div
                className="text-2xl font-black text-gray-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                <PromptWithBlank prompt={q.prompt} />
              </div>
              {q.translation && (
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                  {q.translation}
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {q.options.map((opt) => {
                const isSelected = opt === selected;
                const isAnswer = opt === q.answer;
                let ring = "ring-1 ring-black/5 bg-white";
                if (revealed && isAnswer) {
                  ring = "bg-emerald-500 text-white ring-4 ring-emerald-300";
                } else if (revealed && isSelected && !isAnswer) {
                  ring = "bg-rose-500 text-white ring-4 ring-rose-300";
                } else if (!revealed && isSelected) {
                  ring = "bg-gray-900 text-white ring-4 ring-gray-400";
                }

                return (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => !revealed && setSelected(opt)}
                    disabled={revealed}
                    whileHover={!revealed ? { y: -3, scale: 1.03 } : undefined}
                    whileTap={!revealed ? { scale: 0.97 } : undefined}
                    className={`rounded-2xl px-5 py-4 text-2xl font-black shadow-md transition ${ring}`}
                    lang="ar"
                    dir="rtl"
                    style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              {!revealed ? (
                <button
                  type="button"
                  disabled={!selected}
                  onClick={check}
                  className="rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-2.5 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
                >
                  Check answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-black text-white shadow-lg"
                >
                  {step + 1 === total ? "See score →" : "Next →"}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <div className="text-6xl" aria-hidden>
              {score === total ? "🏆" : score > 0 ? "🌟" : "💪"}
            </div>
            <p className="mt-2 text-2xl font-black text-gray-900">
              {score} / {total}
            </p>
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
            >
              {score === total ? "أَحْسَنْتَ!" : "حَاوِلْ مَرَّةً أُخْرَى"}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-2 text-sm font-black text-white shadow-lg"
            >
              Play again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
