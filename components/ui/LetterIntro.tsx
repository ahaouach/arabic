"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/lib/useAudio";
import type { LetterIntroSection } from "@/lib/lessonSections";

export default function LetterIntro({ section }: { section: LetterIntroSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const play = () => playAudio(undefined, section.audioText ?? section.name);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-8 shadow-lg ring-1 ring-black/5 sm:p-12">
      <div className="flex items-center justify-end">
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

      <motion.button
        type="button"
        onClick={play}
        onMouseEnter={play}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.97 }}
        aria-label={`Play ${section.name}`}
        className="relative mx-auto mt-2 flex flex-col items-center gap-5 rounded-[40px] bg-white p-10 shadow-xl ring-1 ring-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 sm:p-14"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10rem] font-black text-gray-900 drop-shadow sm:text-[12rem]"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif', lineHeight: 1 }}
        >
          {section.letter}
        </motion.div>

        <div
          className="text-4xl font-black text-sky-700"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {section.name}
        </div>

        {section.transliteration && (
          <div className="text-sm font-medium uppercase tracking-wider text-gray-400">
            {section.transliteration}
          </div>
        )}

        <span
          aria-hidden
          className="rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-5 py-2 text-sm font-black text-white shadow-lg"
        >
          🔊 Play
        </span>
      </motion.button>
    </div>
  );
}
