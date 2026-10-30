"use client";

import { useEffect, useState } from "react";
import type { AudioStep } from "@/lib/lessons-schema";
import AudioPlayer from "./AudioPlayer";

interface AudioExerciseProps {
  step: AudioStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: string) => void;
}

/**
 * Audio listening exercise. The play button delegates to `AudioPlayer`,
 * which uses the stored MP3 when available and falls back to the
 * browser's Web Speech API otherwise — so learners always hear
 * *something*, even with zero audio files on disk.
 */
export default function AudioExercise({
  step,
  feedback,
  onAnswer,
}: AudioExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [step.id]);

  const locked = feedback !== null;

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <AudioPlayer
          src={step.audioUrl ?? ""}
          text={step.correctAnswer}
          lang="ar-SA"
          label="Play audio clue"
          size="lg"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
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
                "flex h-24 items-center justify-center rounded-2xl border-2 text-4xl font-bold transition-all",
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
