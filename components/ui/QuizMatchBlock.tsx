"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { QuizMatchSection } from "@/lib/lessonSections";
import { ARABIC_NUMBER_WORDS } from "@/lib/speak";
import { useAudio } from "@/lib/useAudio";

export default function QuizMatchBlock({ section }: { section: QuizMatchSection }) {
  const { playAudio } = useAudio();
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  // Deterministic order on first render (matches SSR output) …
  const orderedChoices = useMemo(
    () => Array.from(new Set(section.pairs.map((p) => p.answer))),
    [section.pairs],
  );
  // … then shuffle after mount so hydration matches.
  const [choices, setChoices] = useState<string[]>(orderedChoices);
  useEffect(() => {
    setChoices([...orderedChoices].sort(() => Math.random() - 0.5));
  }, [orderedChoices]);

  const play = (audioUrl: string, answer: string) => {
    playAudio(audioUrl, ARABIC_NUMBER_WORDS[answer] ?? answer);
  };

  const pick = (idx: number, choice: string) => {
    setAnswers((a) => ({ ...a, [idx]: choice }));
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-600">
        <span aria-hidden>🎧</span>
        Listen & match
      </div>
      <p className="mt-3 text-xl font-black text-gray-900" dir="auto">
        {section.question}
      </p>

      <div className="mt-5 space-y-4">
        {section.pairs.map((pair, idx) => {
          const picked = answers[idx] ?? null;
          const checked = picked !== null;
          const correct = checked && picked === pair.answer;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-gradient-to-br from-sky-50 to-fuchsia-50 p-4 ring-1 ring-black/5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => play(pair.audio, pair.answer)}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-black text-white shadow-md"
                  aria-label={`Play sound ${idx + 1}`}
                >
                  ▶ Play
                </motion.button>

                <div className="flex flex-wrap gap-2">
                  {choices.map((c) => {
                    const isPicked = picked === c;
                    let style = "bg-white text-gray-800 ring-1 ring-black/5 hover:bg-yellow-50";
                    if (checked && c === pair.answer) {
                      style = "bg-emerald-500 text-white ring-2 ring-emerald-300";
                    } else if (checked && isPicked && c !== pair.answer) {
                      style = "bg-rose-500 text-white ring-2 ring-rose-300";
                    } else if (isPicked) {
                      style = "bg-gray-900 text-white";
                    }
                    return (
                      <button
                        key={c}
                        type="button"
                        disabled={checked}
                        onClick={() => pick(idx, c)}
                        className={`min-w-[3rem] rounded-xl px-4 py-2 text-base font-black shadow-sm transition ${style}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>

                {checked && (
                  <span
                    className={`text-sm font-black ${
                      correct ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {correct ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
