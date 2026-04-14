"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  ExerciseStep,
  MultipleChoiceStep,
  MatchStep,
  ReadingStep,
  AnswerValue,
} from "@/lib/lessons-schema";
import DragDropExercise from "./DragDropExercise";
import WritingExercise from "./WritingExercise";
import AudioExercise from "./AudioExercise";
import DrawingExercise from "./DrawingExercise";
import MultiSelectExercise from "./MultiSelectExercise";
import ColorizeExercise from "./ColorizeExercise";
import InstructionBanner, { parseBilingual } from "./InstructionBanner";

interface ExerciseRendererProps {
  step: ExerciseStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: AnswerValue) => void;
  onNext: () => void;
  isLast: boolean;
}

/**
 * SECURITY: Every text field is rendered as a JSX child so React's
 * auto-escaping handles XSS. Never introduce `dangerouslySetInnerHTML`.
 */
export default function ExerciseRenderer({
  step,
  feedback,
  onAnswer,
  onNext,
  isLast,
}: ExerciseRendererProps) {
  const shakeClass =
    feedback === "incorrect" ? "animate-[shake_0.4s_ease-in-out]" : "";

  // Every exercise carries either a `question` or an `instruction` —
  // extract the bilingual parts so we can autoplay the French version.
  const rawInstruction =
    "question" in step ? step.question : step.instruction;
  const { fr, ar } = parseBilingual(rawInstruction);

  return (
    <div>
      <InstructionBanner fr={fr} ar={ar} />
      <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${shakeClass}`}>
      {step.exerciseType === "multiple_choice" && (
        <MultipleChoice step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "reading" && (
        <Reading step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "match" && (
        <Match step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "drag_drop" && (
        <DragDropExercise step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "writing" && (
        <WritingExercise step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "audio" && (
        <AudioExercise step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "drawing" && (
        <DrawingExercise step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "multi_select" && (
        <MultiSelectExercise step={step} feedback={feedback} onAnswer={onAnswer} />
      )}
      {step.exerciseType === "colorize" && (
        <ColorizeExercise step={step} feedback={feedback} onAnswer={onAnswer} />
      )}

      {feedback && (
        <div className="mt-6 flex items-center justify-between">
          <span
            className={
              feedback === "correct"
                ? "inline-flex items-center gap-2 text-sm font-semibold text-emerald-600"
                : "inline-flex items-center gap-2 text-sm font-semibold text-rose-600"
            }
          >
            <span aria-hidden="true">{feedback === "correct" ? "✅" : "❌"}</span>
            {feedback === "correct" ? "Great job!" : "Not quite — keep going!"}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {isLast ? "Finish" : "Next →"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

// ---- Multiple choice ------------------------------------------------------

function MultipleChoice({
  step,
  feedback,
  onAnswer,
}: {
  step: MultipleChoiceStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [step.id]);

  const locked = feedback !== null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {step.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = locked && opt === step.correctAnswer;
          const isWrongChoice = locked && isSelected && opt !== step.correctAnswer;
          return (
            <button
              key={opt}
              type="button"
              disabled={locked}
              onClick={() => {
                if (locked) return;
                setSelected(opt);
                onAnswer(opt);
              }}
              className={[
                "flex h-28 items-center justify-center rounded-2xl border-2 text-5xl font-bold transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                locked
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : isWrongChoice
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-gray-100 bg-gray-50 text-gray-400"
                  : isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-100 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Reading --------------------------------------------------------------

function Reading({
  step,
  feedback,
  onAnswer,
}: {
  step: ReadingStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [step.id]);

  const locked = feedback !== null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 py-8 text-6xl font-bold text-emerald-900">
        {step.word}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {step.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = locked && opt === step.correctAnswer;
          const isWrongChoice = locked && isSelected && opt !== step.correctAnswer;
          return (
            <button
              key={opt}
              type="button"
              disabled={locked}
              onClick={() => {
                if (locked) return;
                setSelected(opt);
                onAnswer(opt);
              }}
              className={[
                "rounded-xl border-2 px-4 py-3 text-lg font-semibold transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                locked
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : isWrongChoice
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-gray-100 bg-gray-50 text-gray-400"
                  : isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-100 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Match ----------------------------------------------------------------

function Match({
  step,
  feedback,
  onAnswer,
}: {
  step: MatchStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: Record<string, string>) => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedLeft(null);
    setPairs({});
  }, [step.id]);

  const locked = feedback !== null;
  const lefts = step.pairs.map((p) => p.letter);
  // Stable shuffle of the right column so SSR/CSR match.
  const rights = useMemo(
    () => shuffleStable(step.pairs.map((p) => p.word), step.id),
    [step.id, step.pairs]
  );

  function pickLeft(left: string) {
    if (locked) return;
    setSelectedLeft(left);
  }

  function pickRight(right: string) {
    if (locked || !selectedLeft) return;
    const next = { ...pairs, [selectedLeft]: right };
    setPairs(next);
    setSelectedLeft(null);
    if (Object.keys(next).length === lefts.length) {
      onAnswer(next);
    }
  }

  function matchedLeftFor(right: string): string | undefined {
    return Object.entries(pairs).find(([, r]) => r === right)?.[0];
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {lefts.map((left) => {
            const isMatched = pairs[left] != null;
            const isSelected = selectedLeft === left;
            const correctMatch = step.pairs.find((p) => p.letter === left)?.word;
            const isCorrectFinal = locked && pairs[left] === correctMatch;
            const isWrongFinal = locked && isMatched && pairs[left] !== correctMatch;
            return (
              <button
                key={left}
                type="button"
                disabled={locked || isMatched}
                onClick={() => pickLeft(left)}
                className={[
                  "w-full rounded-xl border-2 px-4 py-3 text-2xl font-bold transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500",
                  locked
                    ? isCorrectFinal
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : isWrongFinal
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-gray-100 bg-gray-50 text-gray-400"
                    : isMatched
                      ? "border-primary-300 bg-primary-50 text-primary-700"
                      : isSelected
                        ? "border-primary-500 bg-primary-100"
                        : "border-gray-100 bg-white hover:border-primary-300",
                ].join(" ")}
              >
                {left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((right) => {
            const matchedLeft = matchedLeftFor(right);
            const isMatched = matchedLeft != null;
            return (
              <button
                key={right}
                type="button"
                disabled={locked || isMatched}
                onClick={() => pickRight(right)}
                className={[
                  "w-full rounded-xl border-2 px-4 py-3 text-base font-medium transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500",
                  isMatched
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-gray-100 bg-white hover:border-primary-300",
                ].join(" ")}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- utils ----------------------------------------------------------------

/**
 * Deterministic shuffle so SSR and CSR produce the same order on
 * first render (avoids hydration mismatch). Seeded from the exercise id.
 */
function shuffleStable<T>(arr: T[], seed: string): T[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
