"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAudio } from "@/lib/useAudio";
import type { FamilyIntroSection } from "@/lib/lessonSections";

export default function FamilyIntro({ section }: { section: FamilyIntroSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();
  const [selected, setSelected] = useState<string | null>(null);

  const play = (m: FamilyIntroSection["members"][number]) => {
    setSelected(m.name);
    playAudio(undefined, m.audioText ?? m.name);
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.members.map((m) => {
          const active = selected === m.name;
          return (
            <motion.button
              key={m.name}
              type="button"
              onClick={() => play(m)}
              onMouseEnter={() => play(m)}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label={`Play pronunciation for ${m.name}`}
              aria-pressed={active}
              className={`flex flex-col items-center gap-3 rounded-[32px] bg-white p-5 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
                active ? "ring-4 ring-gray-900" : "ring-1 ring-black/5"
              }`}
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-100 to-pink-100 text-7xl shadow-inner"
              >
                <span aria-hidden>{m.emoji}</span>
              </motion.div>
              <div
                className="text-2xl font-black text-gray-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {m.name}
              </div>
              {m.meaning && (
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {m.meaning}
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
