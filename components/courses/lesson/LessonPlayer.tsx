"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { LessonViewModel } from "@/lib/lessons-db";
import { useLessonProgress } from "@/lib/useLessonProgress";
import ProgressBar from "./ProgressBar";
import ScoreDisplay from "./ScoreDisplay";
import StepRenderer from "./StepRenderer";
import CompletionScreen from "./CompletionScreen";

interface LessonPlayerProps {
  lesson: LessonViewModel;
  backHref: string;
}

/**
 * Iterates the lesson's `steps[]` array via `StepRenderer`.
 *
 * Flow:
 *   intro → visual(s) → exercise(s) → completion
 *
 * SECURITY:
 *  - The server passes a validated `LessonViewModel` (Zod-parsed).
 *    No raw user-supplied HTML is ever rendered — every field is a
 *    text child of a JSX element (React auto-escapes).
 *  - Local grading is a UX hint only; the authoritative score is
 *    computed server-side in `/api/progress`.
 */
export default function LessonPlayer({ lesson, backHref }: LessonPlayerProps) {
  const {
    stepIndex,
    totalSteps,
    currentStep,
    isLast,
    feedback,
    localScore,
    totalPoints,
    answerCurrent,
    next,
    submit,
    submitting,
    submitted,
    result,
    error,
    restart,
  } = useLessonProgress({
    lessonId: lesson.id,
    steps: lesson.steps,
  });

  // When the user lands on the completion step, fire-and-forget the
  // server-side submission so the score is persisted. Re-entry is
  // guarded inside `submit()` itself via a ref, so we don't list
  // `submitting` here — if we did, the effect would re-fire on every
  // flip of that flag and loop on failure.
  useEffect(() => {
    if (currentStep?.type === "completion") {
      submit();
    }
  }, [currentStep, submit]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Keyframes for the shake animation — no framer-motion dependency. */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>

      <div className="mb-6 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <ScoreDisplay score={localScore} total={totalPoints} />
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Page {lesson.orderIndex} • Step {stepIndex + 1} of {totalSteps}
        </p>
        <div className="mt-3">
          <ProgressBar value={stepIndex + 1} max={totalSteps} />
        </div>
      </header>

      {currentStep && (
        <StepRenderer
          step={currentStep}
          feedback={feedback}
          onAnswer={answerCurrent}
          onNext={next}
          isLast={isLast}
          renderCompletion={(completionStep) => (
            <>
              {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {submitting && (
                <div className="mb-4 text-center text-sm text-gray-500">Saving your progress…</div>
              )}
              <CompletionScreen
                step={completionStep}
                result={result}
                localScore={localScore}
                totalPoints={totalPoints}
                backHref={backHref}
                onRestart={restart}
              />
            </>
          )}
        />
      )}
    </div>
  );
}
