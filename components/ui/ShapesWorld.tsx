"use client";

import ShapeCard from "./ShapeCard";
import { useAudio } from "@/lib/useAudio";
import type { InteractiveShapesWorldSection } from "@/lib/lessonSections";

export default function ShapesWorld({
  section,
}: {
  section: InteractiveShapesWorldSection;
}) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const playShape = (shape: InteractiveShapesWorldSection["shapes"][number]) => {
    // No per-shape MP3 for now — pass undefined and let the TTS fallback
    // handle pronunciation with the fully-vowelized name.
    playAudio(undefined, shape.audioText ?? shape.name);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {section.title && (
            <h3
              className="text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.title}
            </h3>
          )}
          {section.instructions && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.instructions}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {section.shapes.map((s) => (
          <ShapeCard key={s.name} shape={s} onPlay={() => playShape(s)} />
        ))}
      </div>
    </div>
  );
}
