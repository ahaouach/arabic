"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Confetti from "./Confetti";
import { useAudio } from "@/lib/useAudio";
import type { FamilyMatchSection } from "@/lib/lessonSections";

export default function FamilyMatchGame({ section }: { section: FamilyMatchSection }) {
  const { playAudio } = useAudio();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);

  const total = section.rounds.length;
  const round = section.rounds[step];
  const finished = step >= total;

  const playPrompt = () => {
    if (!round) return;
    playAudio(undefined, round.audioText ?? round.prompt);
  };

  const check = () => {
    if (!selected || !round) return;
    setRevealed(true);
    if (selected === round.answer) {
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

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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
        {!finished && round ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Prompt button */}
            <div className="flex items-center justify-center">
              <motion.button
                type="button"
                onClick={playPrompt}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-base font-black text-white shadow-lg"
                aria-label="Play the sound"
              >
                ▶ Play sound
              </motion.button>
            </div>

            {/* Options */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {round.options.map((opt) => {
                const isSelected = opt.name === selected;
                const isAnswer = opt.name === round.answer;
                let ring = "ring-1 ring-black/5";
                if (revealed && isAnswer) ring = "ring-4 ring-emerald-400";
                else if (revealed && isSelected && !isAnswer)
                  ring = "ring-4 ring-rose-400";
                else if (!revealed && isSelected) ring = "ring-4 ring-gray-900";

                return (
                  <motion.button
                    key={opt.name}
                    type="button"
                    onClick={() => !revealed && setSelected(opt.name)}
                    disabled={revealed}
                    whileHover={!revealed ? { y: -4, scale: 1.03 } : undefined}
                    whileTap={!revealed ? { scale: 0.97 } : undefined}
                    className={`flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-lg transition ${ring}`}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-pink-100 text-5xl shadow-inner">
                      <span aria-hidden>{opt.emoji}</span>
                    </div>
                    <div
                      className="text-lg font-black text-gray-900"
                      lang="ar"
                      dir="rtl"
                      style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                    >
                      {opt.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
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
