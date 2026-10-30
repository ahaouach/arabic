"use client";

/**
 * Client-side state for an interactive lesson attempt.
 *
 * This hook iterates through a lesson's `steps[]` array, records
 * answers, gives instant local feedback, and POSTs the final attempt
 * to `/api/progress`. The server is the single source of truth for
 * the persisted score.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import {
  isExerciseStep,
  type AnswerValue,
  type ExerciseStep,
  type LessonStep,
} from "./lessons-schema";
import { playSuccess, playError } from "./feedback-sounds";

export interface ProgressResult {
  score: number;
  maxScore: number;
  completed: boolean;
  attempts: number;
  correctThisAttempt: number;
  totalExercises: number;
}

interface UseLessonProgressArgs {
  lessonId: string;
  steps: LessonStep[];
}

export function useLessonProgress({ lessonId, steps }: UseLessonProgressArgs) {
  const totalSteps = steps.length;

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [localScore, setLocalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ProgressResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Hard guard against re-entry: once we've attempted a submit for
   * this lesson mount we don't retry. Ref (not state) so flipping it
   * never triggers a re-render — the `submit`-driving effect in
   * LessonPlayer was looping because `submitting` state changes
   * re-ran the effect after each failure.
   */
  const hasAttemptedRef = useRef(false);

  const totalPoints = useMemo(
    () =>
      steps.reduce((sum, s) => (isExerciseStep(s) ? sum + s.points : sum), 0),
    [steps]
  );

  const currentStep: LessonStep | null = steps[stepIndex] ?? null;
  const isLast = stepIndex >= totalSteps - 1;

  /**
   * Record an answer for the current exercise step and give instant
   * local feedback. The score from local grading is a UX hint only —
   * the server re-grades on submit.
   */
  const answerCurrent = useCallback(
    (value: AnswerValue) => {
      if (!currentStep || !isExerciseStep(currentStep)) return;

      const correct = localGrade(currentStep, value);
      setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) {
        setLocalScore((s) => s + currentStep.points);
        playSuccess();
      } else {
        playError();
      }
    },
    [currentStep]
  );

  const next = useCallback(() => {
    setFeedback(null);
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setFeedback(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  /**
   * POST the attempt. The server re-grades and returns the
   * authoritative score, which we cache in `result`.
   */
  const submit = useCallback(async (): Promise<ProgressResult | null> => {
    if (hasAttemptedRef.current) return result;
    hasAttemptedRef.current = true;
    setSubmitting(true);
    setError(null);

    const payload = {
      lessonId,
      answers: Object.entries(answers).map(([exerciseId, value]) => ({
        exerciseId,
        value,
      })),
    };

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Failed to save progress");
        return null;
      }

      const data = (await res.json()) as ProgressResult;
      setResult(data);
      setSubmitted(true);
      return data;
    } catch {
      setError("Network error");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [answers, lessonId, result]);

  const restart = useCallback(() => {
    hasAttemptedRef.current = false;
    setStepIndex(0);
    setAnswers({});
    setFeedback(null);
    setLocalScore(0);
    setResult(null);
    setSubmitted(false);
    setError(null);
  }, []);

  return {
    stepIndex,
    totalSteps,
    currentStep,
    isLast,
    feedback,
    localScore,
    totalPoints,
    answerCurrent,
    next,
    prev,
    submit,
    submitting,
    submitted,
    result,
    error,
    restart,
  };
}

/** Client-side hint grader. Mirrors `gradeExerciseStep` in the schema. */
function localGrade(step: ExerciseStep, value: AnswerValue): boolean {
  switch (step.exerciseType) {
    case "multiple_choice":
    case "reading":
    case "audio":
      return typeof value === "string" && value === step.correctAnswer;
    case "writing":
      return typeof value === "string" && value.trim() === step.expected.trim();
    case "match":
      if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
      return step.pairs.every((p) => value[p.letter] === p.word);
    case "drag_drop":
      if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
      return step.pairs.every((p) => value[p.item] === p.target);
    case "drawing":
      return value === "completed";
    case "multi_select": {
      if (!Array.isArray(value)) return false;
      const selected = new Set(value);
      const targets = step.options.filter((o) => o.isTarget).map((o) => o.id);
      if (selected.size !== targets.length) return false;
      for (const t of targets) if (!selected.has(t)) return false;
      return true;
    }
    case "colorize": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
      }
      for (const shape of step.shapes) {
        const fill = value[shape.id];
        if (shape.isTarget) {
          if (fill !== step.targetColor) return false;
        } else {
          if (fill === step.targetColor) return false;
        }
      }
      return true;
    }
  }
}
