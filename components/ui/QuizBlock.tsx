"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { QuizSection } from "@/lib/lessonSections";

export default function QuizBlock({ section }: { section: QuizSection }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = revealed && selected === section.answer;

  const reset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-600">
        <span aria-hidden>🧠</span>
        Quiz time
      </div>
      <p className="mt-3 text-xl font-black text-gray-900" dir="auto">
        {section.question}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.options.map((opt) => {
          const isSelected = opt === selected;
          const isAnswer = opt === section.answer;

          let style =
            "bg-white text-gray-800 hover:bg-yellow-50 ring-1 ring-black/5";
          if (revealed && isAnswer) {
            style = "bg-emerald-500 text-white ring-2 ring-emerald-300";
          } else if (revealed && isSelected && !isAnswer) {
            style = "bg-rose-500 text-white ring-2 ring-rose-300";
          } else if (!revealed && isSelected) {
            style = "bg-gray-900 text-white ring-2 ring-gray-400";
          }

          return (
            <motion.button
              key={opt}
              type="button"
              whileHover={!revealed ? { scale: 1.02 } : undefined}
              whileTap={!revealed ? { scale: 0.98 } : undefined}
              onClick={() => {
                if (!revealed) setSelected(opt);
              }}
              disabled={revealed}
              dir="auto"
              className={`rounded-2xl px-5 py-4 text-lg font-bold shadow-md transition ${style}`}
              aria-pressed={isSelected}
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
            onClick={() => setRevealed(true)}
            className="rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-2.5 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          >
            Try again
          </button>
        )}

        <AnimatePresence mode="wait">
          {revealed && (
            <motion.span
              key={correct ? "ok" : "ko"}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`rounded-full px-4 py-2 text-sm font-black shadow-md ${
                correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {correct ? "✅ Great job!" : "❌ Not quite — try again!"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
