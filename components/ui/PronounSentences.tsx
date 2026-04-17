"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/lib/useAudio";
import type { PronounSentencesSection } from "@/lib/lessonSections";

/**
 * Render a sentence with the target pronoun highlighted. Uses split()
 * on the exact pronoun substring — React-escaped, no HTML injection.
 */
function HighlightedSentence({
  sentence,
  pronoun,
}: {
  sentence: string;
  pronoun: string;
}) {
  if (!pronoun || !sentence.includes(pronoun)) {
    return <span>{sentence}</span>;
  }
  const parts = sentence.split(pronoun);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="rounded-md bg-amber-200 px-1 text-amber-900">
              {pronoun}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export default function PronounSentences({
  section,
}: {
  section: PronounSentencesSection;
}) {
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

      <div className="grid gap-4 sm:grid-cols-2">
        {section.sentences.map((s, i) => {
          const play = () => playAudio(undefined, s.audioText ?? s.sentence);
          return (
            <motion.button
              key={`${s.sentence}-${i}`}
              type="button"
              onClick={play}
              onMouseEnter={play}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              aria-label={`Play sentence ${s.sentence}`}
              className="flex items-center gap-4 rounded-3xl bg-white p-5 text-right shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-pink-100 text-3xl shadow-inner">
                <span aria-hidden>{s.emoji ?? "💬"}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="text-2xl font-black text-gray-900"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  <HighlightedSentence sentence={s.sentence} pronoun={s.pronoun} />
                </div>
                {s.translation && (
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    {s.translation}
                  </div>
                )}
              </div>
              <span
                aria-hidden
                className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white"
              >
                🔊
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
