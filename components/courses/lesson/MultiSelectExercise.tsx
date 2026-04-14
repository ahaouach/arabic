"use client";

import { useEffect, useState } from "react";
import type { MultiSelectStep } from "@/lib/lessons-schema";

interface MultiSelectExerciseProps {
  step: MultiSelectStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: string[]) => void;
}

/**
 * "Pick every item matching the rule" exercise. The learner toggles
 * options on/off and taps "Done" to submit.
 *
 * SECURITY: Selected IDs are validated on the server against the
 * canonical `options` list; a submission that names an unknown id is
 * simply ignored. The client cannot forge a score.
 */
export default function MultiSelectExercise({
  step,
  feedback,
  onAnswer,
}: MultiSelectExerciseProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected(new Set());
    setSubmitted(false);
  }, [step.id]);

  const locked = feedback !== null;

  function toggle(id: string) {
    if (locked || submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    if (locked || submitted || selected.size === 0) return;
    setSubmitted(true);
    onAnswer(Array.from(selected));
  }

  const targetCount = step.options.filter((o) => o.isTarget).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-end">
        <span className="text-sm font-medium text-gray-500">
          {selected.size} / {targetCount} sélectionnés
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {step.options.map((opt) => {
          const isSelected = selected.has(opt.id);
          const isCorrect = locked && opt.isTarget;
          const isWrongSelection = locked && isSelected && !opt.isTarget;
          const missed = locked && opt.isTarget && !isSelected;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={locked}
              onClick={() => toggle(opt.id)}
              aria-pressed={isSelected}
              className={[
                "flex h-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                locked
                  ? isCorrect && isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : isWrongSelection
                      ? "border-rose-500 bg-rose-50"
                      : missed
                        ? "border-amber-400 bg-amber-50"
                        : "border-gray-100 bg-gray-50"
                  : isSelected
                    ? "border-primary-500 bg-primary-50 scale-[1.02]"
                    : "border-gray-100 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md",
              ].join(" ")}
            >
              {opt.emoji && (
                <span className="text-4xl leading-none" aria-hidden="true">
                  {opt.emoji}
                </span>
              )}
              {opt.label && (
                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {!submitted && !locked && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={submit}
            disabled={selected.size === 0}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Valider ma sélection
          </button>
        </div>
      )}
    </div>
  );
}
