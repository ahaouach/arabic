"use client";

import type {
  LessonStep,
  IntroStep,
  VisualStep,
  CompletionStep,
  AnswerValue,
} from "@/lib/lessons-schema";
import { isExerciseStep } from "@/lib/lessons-schema";
import ExerciseRenderer from "./ExerciseRenderer";
import AudioPlayer from "./AudioPlayer";
import VocabStepCard from "./VocabStepCard";
import InstructionBanner, { parseBilingual } from "./InstructionBanner";

interface StepRendererProps {
  step: LessonStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: AnswerValue) => void;
  onNext: () => void;
  isLast: boolean;
  /** Render a custom UI for the completion step (score / stars). */
  renderCompletion?: (step: CompletionStep) => React.ReactNode;
}

/**
 * Dispatches a single lesson step to the right sub-renderer.
 *
 * Step types: intro | visual | exercise (multiple_choice | match | reading) | completion
 */
export default function StepRenderer({
  step,
  feedback,
  onAnswer,
  onNext,
  isLast,
  renderCompletion,
}: StepRendererProps) {
  if (isExerciseStep(step)) {
    return (
      <ExerciseRenderer
        step={step}
        feedback={feedback}
        onAnswer={onAnswer}
        onNext={onNext}
        isLast={isLast}
      />
    );
  }

  switch (step.type) {
    case "intro":
      return <IntroStepCard step={step} onNext={onNext} />;
    case "visual":
      return <VisualStepCard step={step} onNext={onNext} />;
    case "vocab":
      return <VocabStepCard step={step} onNext={onNext} />;
    case "completion":
      return <>{renderCompletion?.(step)}</>;
  }
}

// ---- Intro ----------------------------------------------------------------

function IntroStepCard({ step, onNext }: { step: IntroStep; onNext: () => void }) {
  const { fr, ar } = parseBilingual(step.text);
  return (
    <div>
      <InstructionBanner fr={fr} ar={ar} audioUrlAr={step.audioUrl} />
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl" aria-hidden="true">👋</div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">{step.title}</h2>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          C'est parti →
        </button>
      </div>
    </div>
  );
}

// ---- Visual ---------------------------------------------------------------

function VisualStepCard({ step, onNext }: { step: VisualStep; onNext: () => void }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-6 inline-flex flex-col items-center rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 px-12 py-8">
        <div className="text-9xl font-bold text-emerald-900 leading-none">{step.letter}</div>
      </div>
      <p className="mb-1 text-xl font-semibold text-gray-900">{step.example}</p>
      <p className="mb-6 text-base text-gray-500">({step.translation})</p>
      <div className="mb-6 flex justify-center">
        <AudioPlayer
          src={step.audioUrl ?? ""}
          text={step.example}
          lang="ar-SA"
          label={`Pronounce ${step.letter}`}
          size="md"
        />
      </div>
      <button
        type="button"
        onClick={onNext}
        className="rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        I'm ready →
      </button>
    </div>
  );
}
