"use client";

import { motion } from "framer-motion";
import type { NumbersSection } from "@/lib/lessonSections";
import { useAudio } from "@/lib/useAudio";

export default function NumbersBlock({ section }: { section: NumbersSection }) {
  const { playAudio, isMuted, toggleMute, isLoading, isPlaying } = useAudio();

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
          🔊 Hover or tap to listen
        </p>
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
        >
          {isMuted ? "🔇 Muted" : "🔊 Sound on"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {section.numbers.map((n, i) => {
          const key = `${n.latin}-${i}`;
          // Always speak the fully-vowelled word so TTS gets the right
          // case endings (tanween). `audioText` wins if explicitly set.
          const spoken = n.audioText ?? n.arabic_full;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => playAudio(n.audio, spoken)}
              onMouseEnter={() => playAudio(n.audio, spoken)}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Play ${n.arabic_full}`}
              className="group relative flex flex-col items-center overflow-hidden rounded-3xl bg-white p-5 text-center shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200 to-pink-200 opacity-40 blur-2xl transition-opacity group-hover:opacity-80" />

              {/* Numeral glyph (١, ٢, …) */}
              <div
                className="relative text-6xl font-black text-gray-900 drop-shadow-sm"
                dir="auto"
              >
                {n.arabic_simple}
              </div>
              <div className="relative mt-1 text-lg font-black text-sky-600">
                {n.latin}
              </div>

              {/* Fully-vowelled word — Arabic diacritics rendered clearly.
                  `leading-loose` gives harakat marks room to breathe. */}
              <div
                lang="ar"
                dir="rtl"
                className="relative mt-3 text-2xl font-black leading-loose text-gray-900"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif' }}
              >
                {n.arabic_full}
              </div>
              <div className="relative mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                {n.transliteration}
              </div>

              <span
                aria-hidden
                className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white"
              >
                🔊 Play
              </span>
            </motion.button>
          );
        })}
      </div>

      {(isLoading || isPlaying) && !isMuted && (
        <p className="mt-4 text-center text-xs font-medium text-gray-500" aria-live="polite">
          {isLoading ? "Loading sound…" : "Playing…"}
        </p>
      )}
    </div>
  );
}
