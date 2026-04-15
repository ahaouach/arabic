"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { GameNumbersSection } from "@/lib/lessonSections";
import { ARABIC_NUMBER_WORDS } from "@/lib/speak";
import { useAudio } from "@/lib/useAudio";

export default function GameNumbersBlock({ section }: { section: GameNumbersSection }) {
  const { playAudio } = useAudio();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const total = section.questions.length;
  const question = section.questions[step];
  const finished = step >= total;

  const play = (audioUrl: string, answer: string) => {
    playAudio(audioUrl, ARABIC_NUMBER_WORDS[answer] ?? answer);
  };

  const check = () => {
    if (!selected || !question) return;
    setRevealed(true);
    if (selected === question.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setRevealed(false);
    setSelected(null);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-pink-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">
          <span aria-hidden>🎮</span>
          Game time
        </div>
        <div className="rounded-full bg-gray-900 px-3 py-1 text-xs font-black text-white">
          {finished ? `${score} / ${total}` : `Question ${step + 1} / ${total}`}
        </div>
      </div>

      <p className="mt-3 text-xl font-black text-gray-900" dir="auto">
        {section.instructions}
      </p>

      <AnimatePresence mode="wait">
        {!finished && question ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => play(question.audio, question.answer)}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-base font-black text-white shadow-lg"
              aria-label="Play sound"
            >
              ▶ Play sound
            </motion.button>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {question.options.map((opt) => {
                const isSelected = opt === selected;
                const isAnswer = opt === question.answer;
                let style = "bg-white text-gray-800 ring-1 ring-black/5 hover:bg-yellow-50";
                if (revealed && isAnswer) {
                  style = "bg-emerald-500 text-white ring-2 ring-emerald-300";
                } else if (revealed && isSelected && !isAnswer) {
                  style = "bg-rose-500 text-white ring-2 ring-rose-300";
                } else if (!revealed && isSelected) {
                  style = "bg-gray-900 text-white";
                }
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    whileHover={!revealed ? { scale: 1.03 } : undefined}
                    whileTap={!revealed ? { scale: 0.97 } : undefined}
                    onClick={() => {
                      if (!revealed) setSelected(opt);
                    }}
                    disabled={revealed}
                    className={`rounded-2xl px-5 py-4 text-2xl font-black shadow-md transition ${style}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
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
            className="mt-6 rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <div className="text-6xl" aria-hidden>
              {score === total ? "🏆" : score > 0 ? "🌟" : "💪"}
            </div>
            <p className="mt-3 text-2xl font-black text-gray-900">
              You scored {score} / {total}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {score === total ? "Perfect game!" : "Try again to improve your score."}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-5 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-2.5 text-sm font-black text-white shadow-lg"
            >
              Play again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
