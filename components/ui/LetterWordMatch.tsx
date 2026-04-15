"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/lib/useAudio";
import type { LetterWordMatchSection } from "@/lib/lessonSections";

/**
 * Split the word into characters and highlight every character that matches
 * `letter`. Harakat combining marks stay attached to the previous character
 * so the highlight stays visually correct. `Array.from` iterates by Unicode
 * code points (emoji-safe).
 */
function renderHighlighted(word: string, letter: string) {
  const chars = Array.from(word);
  const target = letter.charAt(0);
  return chars.map((ch, i) => {
    const base = Array.from(ch)[0] ?? ch;
    const isMatch = base === target;
    return (
      <span
        key={i}
        className={isMatch ? "text-rose-500" : "text-gray-900"}
      >
        {ch}
      </span>
    );
  });
}

export default function LetterWordMatch({ section }: { section: LetterWordMatchSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();

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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.words.map((w) => {
          const play = () => playAudio(undefined, w.audioText ?? w.word);
          return (
            <motion.button
              key={w.word}
              type="button"
              onClick={play}
              onMouseEnter={play}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Play ${w.word}`}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-pink-100 text-6xl shadow-inner">
                <span aria-hidden>{w.emoji ?? "🔤"}</span>
              </div>

              <div
                className="text-3xl font-black leading-loose"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {renderHighlighted(w.word, w.letter)}
              </div>

              {w.meaning && (
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {w.meaning}
                </div>
              )}

              <span
                aria-hidden
                className="rounded-full bg-gray-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white"
              >
                🔊 Play
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
