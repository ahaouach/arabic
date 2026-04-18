"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Confetti from "./Confetti";
import { useAudio } from "@/lib/useAudio";
import type { LetterColoringSection } from "@/lib/lessonSections";

export default function LetterColoring({ section }: { section: LetterColoringSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [selected, setSelected] = useState<LetterColoringSection["colors"][number] | null>(
    null,
  );
  const [fill, setFill] = useState<string>("#f3f4f6");
  const [confettiKey, setConfettiKey] = useState(0);

  const pickColor = (c: LetterColoringSection["colors"][number]) => {
    setSelected(c);
    playAudio(undefined, c.audioText ?? c.name);
  };

  const paintLetter = () => {
    if (!selected) {
      playAudio(undefined, "اِخْتَرْ لَوْنًا أَوَّلًا");
      return;
    }
    setFill(selected.hex);
    setConfettiKey((k) => k + 1);
    playAudio(undefined, "أَحْسَنْتَ");
  };

  const reset = () => {
    setFill("#f3f4f6");
    setSelected(null);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <Confetti trigger={confettiKey} />

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Palette */}
      <div
        role="radiogroup"
        aria-label="Color palette"
        className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white/80 p-3 shadow-inner ring-1 ring-black/5"
      >
        {section.colors.map((c) => {
          const active = selected?.name === c.name;
          return (
            <motion.button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={c.name}
              onClick={() => pickColor(c)}
              onMouseEnter={() => playAudio(undefined, c.audioText ?? c.name)}
              whileHover={{ y: -4, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                aria-hidden
                className={`h-12 w-12 rounded-full ring-4 transition-all ${
                  active ? "ring-gray-900 scale-110" : "ring-white"
                }`}
                style={{ backgroundColor: c.hex }}
              />
              <span
                className="text-xs font-black text-gray-700"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {c.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Big letter canvas — SVG <text> so the shape is actually filled */}
      <motion.button
        type="button"
        onClick={paintLetter}
        whileTap={{ scale: 0.97 }}
        className="relative mx-auto mt-6 flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-[40px] bg-white shadow-inner ring-1 ring-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
        aria-label={`Paint the letter ${section.letter}`}
      >
        <motion.svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <text
            x="100"
            y="108"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={190}
            fontWeight={900}
            fontFamily='"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif'
            fill={fill}
            stroke="#111827"
            strokeWidth={6}
            paintOrder="stroke"
            direction="rtl"
          >
            {section.letter}
          </text>
        </motion.svg>
      </motion.button>
    </div>
  );
}
