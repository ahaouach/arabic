"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { CompletionStep } from "@/lib/lessons-schema";
import type { ProgressResult } from "@/lib/useLessonProgress";
import Confetti from "./Confetti";
import { playCelebration } from "@/lib/feedback-sounds";

interface CompletionScreenProps {
  step: CompletionStep | null;
  result: ProgressResult | null;
  localScore: number;
  totalPoints: number;
  backHref: string;
  onRestart: () => void;
}

export default function CompletionScreen({
  step,
  result,
  localScore,
  totalPoints,
  backHref,
  onRestart,
}: CompletionScreenProps) {
  const score = result?.score ?? localScore;
  const maxScore = result?.maxScore ?? totalPoints;
  const completed = result?.completed ?? false;
  const pct = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;

  // Fire confetti + celebration sound exactly once when the lesson
  // is officially completed (server-confirmed).
  useEffect(() => {
    if (completed) playCelebration();
  }, [completed]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-primary-50 via-white to-emerald-50 p-8 text-center shadow-lg">
      <Confetti active={completed} />
      <div className="mb-4 text-6xl animate-bounce" aria-hidden="true">
        {completed ? "🎉" : "💪"}
      </div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900">
        {completed ? "Lesson complete!" : "Great effort!"}
      </h2>
      <p className="mb-6 text-gray-600">
        {step?.message ??
          (completed
            ? "Amazing work! You answered everything correctly."
            : "Keep practicing — you're getting better every time.")}
      </p>

      <div
        className="mb-6 flex items-center justify-center gap-2 text-5xl"
        aria-label={`${stars} stars out of 3`}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < stars ? "text-amber-400" : "text-gray-200"}>
            ★
          </span>
        ))}
      </div>

      <div className="mb-8 inline-flex flex-col items-center rounded-2xl bg-white px-8 py-4 shadow-sm">
        <span className="text-xs uppercase tracking-wide text-gray-400">Score</span>
        <span className="text-3xl font-bold text-gray-900">
          {score}
          <span className="text-lg font-medium text-gray-400"> / {maxScore}</span>
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Try again
        </button>
        <Link
          href={backHref}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          Back to lessons
        </Link>
      </div>
    </div>
  );
}
