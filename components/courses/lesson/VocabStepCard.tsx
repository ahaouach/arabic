"use client";

import type { VocabStep } from "@/lib/lessons-schema";
import AudioPlayer from "./AudioPlayer";
import InstructionBanner from "./InstructionBanner";

interface VocabStepCardProps {
  step: VocabStep;
  onNext: () => void;
}

/**
 * Renders a page of vocabulary items (emoji + Arabic + label) as a
 * responsive grid. Each card has its own audio button so the learner
 * can tap to hear that specific word.
 *
 * SECURITY: Every field comes from a Zod-validated `VocabStep`; all
 * values render as JSX text children (auto-escaped by React). The
 * `audioUrl` on each item is bounded to 300 chars and only ever feeds
 * a controlled `<audio>` element inside `AudioPlayer`.
 */
export default function VocabStepCard({ step, onNext }: VocabStepCardProps) {
  return (
    <div>
      <InstructionBanner
        fr={step.consigneFr || "Écoute et répète"}
        ar={step.consigneAr}
        audioUrlAr={step.audioUrl}
      />
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      {/* Grid of items */}
      <ul className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {step.items.map((item, idx) => (
          <li
            key={`${item.ar}-${idx}`}
            className="group relative flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {item.emoji && (
              <div className="text-5xl leading-none" aria-hidden="true">
                {item.emoji}
              </div>
            )}
            <div
              className="text-3xl font-bold text-emerald-900"
              dir="rtl"
              lang="ar"
            >
              {item.ar}
            </div>
            {item.label && (
              <div className="text-lg font-semibold text-gray-700">{item.label}</div>
            )}
            {item.fr && (
              <div className="text-sm text-gray-500">{item.fr}</div>
            )}
            <div className="mt-1">
              <AudioPlayer
                src={item.audioUrl ?? ""}
                text={item.ar}
                lang="ar-SA"
                label={`Pronounce ${item.ar}`}
                size="sm"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Continuer →
        </button>
      </div>
      </div>
    </div>
  );
}
