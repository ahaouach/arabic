"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAudio } from "@/lib/useAudio";
import type { AnimalWorld, AnimalWorldSection } from "@/lib/lessonSections";

const WORLD_THEME: Record<
  AnimalWorld,
  { gradient: string; chip: string; ambientEmojis: string[] }
> = {
  farm: {
    gradient: "from-lime-100 via-yellow-100 to-emerald-100",
    chip: "bg-lime-600",
    ambientEmojis: ["🌾", "🌻", "🚜", "🌿"],
  },
  jungle: {
    gradient: "from-emerald-200 via-green-100 to-teal-100",
    chip: "bg-emerald-700",
    ambientEmojis: ["🌴", "🍃", "🌳", "🌿"],
  },
  sky: {
    gradient: "from-sky-100 via-blue-50 to-indigo-100",
    chip: "bg-sky-600",
    ambientEmojis: ["☁️", "☀️", "🌤️", "✨"],
  },
  ocean: {
    gradient: "from-cyan-100 via-sky-100 to-blue-200",
    chip: "bg-blue-600",
    ambientEmojis: ["🌊", "🫧", "🐚", "⛵"],
  },
};

export default function AnimalWorldSectionView({
  section,
}: {
  section: AnimalWorldSection;
}) {
  const { playAudio, isMuted, toggleMute } = useAudio();
  const [selected, setSelected] = useState<string | null>(null);

  const theme = WORLD_THEME[section.world];

  const play = (a: AnimalWorldSection["animals"][number]) => {
    setSelected(a.name);
    playAudio(undefined, a.audioText ?? a.name);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-6 shadow-lg ring-1 ring-black/5 sm:p-8`}
    >
      {/* Ambient floating emojis */}
      {theme.ambientEmojis.map((e, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute select-none text-4xl opacity-30"
          style={{
            top: `${10 + i * 18}%`,
            left: i % 2 === 0 ? `${4 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 3}%` : undefined,
          }}
          animate={{ y: [0, -10, 0], rotate: [0, 6, -6, 0] }}
          transition={{
            duration: 5 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {e}
        </motion.span>
      ))}

      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
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
              className="mt-1 text-sm font-medium text-gray-700"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.instructions}
            </p>
          )}
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow ${theme.chip}`}
          >
            {section.world}
          </span>
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

      <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.animals.map((a) => {
          const active = selected === a.name;
          return (
            <motion.button
              key={a.name}
              type="button"
              onClick={() => play(a)}
              onMouseEnter={() => play(a)}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={active ? { rotate: [0, -4, 4, 0], scale: [1, 1.08, 1] } : undefined}
              transition={{ duration: 0.5 }}
              aria-pressed={active}
              aria-label={`Play pronunciation for ${a.name}`}
              className={`flex flex-col items-center gap-3 rounded-[32px] bg-white p-5 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
                active ? "ring-4 ring-gray-900" : "ring-1 ring-black/5"
              }`}
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-100 to-pink-100 text-6xl shadow-inner"
              >
                <span aria-hidden>{a.emoji}</span>
              </motion.div>
              <div
                className="text-2xl font-black text-gray-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {a.name}
              </div>
              {a.meaning && (
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {a.meaning}
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
