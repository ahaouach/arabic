"use client";

import { useEffect, useState } from "react";
import type { WritingStep } from "@/lib/lessons-schema";

interface WritingExerciseProps {
  step: WritingStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: string) => void;
}

/**
 * SECURITY: The input value is sent as a plain string to `/api/progress`,
 * where the server re-grades against the canonical `expected` value. The
 * input is bounded to 64 chars on the server (Zod schema), and rendered
 * here as a JSX text child only — never injected as HTML.
 */
export default function WritingExercise({
  step,
  feedback,
  onAnswer,
}: WritingExerciseProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setValue("");
    setSubmitted(false);
  }, [step.id]);

  const locked = feedback !== null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked || !value.trim()) return;
    setSubmitted(true);
    onAnswer(value.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto max-w-md">
        <input
          type="text"
          inputMode="text"
          dir="auto"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={64}
          disabled={locked}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={step.placeholder || "Type here…"}
          className={[
            "w-full rounded-2xl border-2 px-5 py-4 text-center text-3xl font-bold shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            locked && feedback === "correct"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : locked && feedback === "incorrect"
                ? "border-rose-500 bg-rose-50 text-rose-700"
                : "border-gray-200 bg-white",
          ].join(" ")}
          aria-label="Your answer"
        />
        {!submitted && !locked && (
          <button
            type="submit"
            disabled={!value.trim()}
            className="mt-4 w-full rounded-xl bg-primary-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check answer
          </button>
        )}
      </div>
    </form>
  );
}
