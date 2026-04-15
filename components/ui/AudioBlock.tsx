"use client";

import { useEffect } from "react";
import type { AudioSection } from "@/lib/lessonSections";
import { useAudio } from "@/lib/useAudio";

export default function AudioBlock({ section }: { section: AudioSection }) {
  const { playAudio, stop, isPlaying, isLoading, isMuted, toggleMute } = useAudio();

  // Auto-play on mount when requested. The browser may block this if the
  // user hasn't interacted yet — that's expected; they can press Play.
  useEffect(() => {
    if (section.autoPlay) {
      playAudio(section.audioUrl, section.title ?? section.caption ?? "");
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-6">
      {section.title && (
        <h3 className="mb-3 text-lg font-black text-gray-900" dir="auto">
          {section.title}
        </h3>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            playAudio(section.audioUrl, section.title ?? section.caption ?? "")
          }
          aria-label="Play audio"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-2xl text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          {isLoading ? "⏳" : isPlaying ? "⏸" : "▶"}
        </button>
        <div className="flex-1 text-sm text-gray-600" dir="auto">
          {section.caption ?? "Tap the button to listen."}
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
    </div>
  );
}
