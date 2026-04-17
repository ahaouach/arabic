"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/lib/useAudio";
import type { PronounObjectSection } from "@/lib/lessonSections";

export default function PronounObject({ section }: { section: PronounObjectSection }) {
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
        {section.pairs.map((p, i) => (
          <motion.div
            key={`${p.subject}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5"
          >
            {/* Subject form */}
            <button
              type="button"
              onClick={() => playAudio(undefined, p.subjectAudio ?? p.subject)}
              onMouseEnter={() => playAudio(undefined, p.subjectAudio ?? p.subject)}
              aria-label={`Play ${p.subject}`}
              className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-sky-50 p-4 transition-colors hover:bg-sky-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
            >
              <span
                className="text-2xl font-black text-sky-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {p.subject}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">
                Subject
              </span>
            </button>

            {/* Arrow */}
            <motion.div
              aria-hidden
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl text-gray-400"
            >
              ←
            </motion.div>

            {/* Object form */}
            <button
              type="button"
              onClick={() => playAudio(undefined, p.objectAudio ?? p.object)}
              onMouseEnter={() => playAudio(undefined, p.objectAudio ?? p.object)}
              aria-label={`Play ${p.object}`}
              className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-fuchsia-50 p-4 transition-colors hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300/70"
            >
              <span
                className="text-2xl font-black text-fuchsia-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {p.object}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
                Object
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
