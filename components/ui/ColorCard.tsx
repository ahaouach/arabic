"use client";

import { motion } from "framer-motion";
import type { InteractiveColorWorldSection } from "@/lib/lessonSections";

type ColorItem = InteractiveColorWorldSection["colors"][number];

interface ColorCardProps {
  color: ColorItem;
  selected: boolean;
  visited: boolean;
  onHover: () => void;
  onSelect: () => void;
  index?: number;
}

export default function ColorCard({
  color,
  selected,
  visited,
  onHover,
  onSelect,
  index = 0,
}: ColorCardProps) {
  const ring = selected
    ? "ring-4 ring-gray-900 shadow-2xl"
    : visited
      ? "ring-4 ring-emerald-400"
      : "ring-1 ring-black/5";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      onFocus={onHover}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 180,
        damping: 18,
      }}
      whileHover={{ y: -6, scale: 1.04, rotate: -0.5 }}
      whileTap={{ scale: 0.96 }}
      aria-pressed={selected}
      aria-label={`Play pronunciation for ${color.name}`}
      className={`group relative flex flex-col items-center gap-3 rounded-[32px] bg-white p-5 transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${ring}`}
    >
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-[40px] opacity-0 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ backgroundColor: color.hex }}
      />

      {/* Big color block with optional example emoji */}
      <div
        className="relative flex h-32 w-32 items-center justify-center rounded-[28px] text-5xl shadow-inner ring-4 ring-white/80"
        style={{ backgroundColor: color.hex }}
        aria-hidden
      >
        {color.example ? (
          <motion.span
            animate={{ y: [0, -4, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="drop-shadow-sm"
          >
            {color.example}
          </motion.span>
        ) : null}
      </div>

      {/* Arabic name — fully vowelized */}
      <div className="relative text-center">
        <div
          lang="ar"
          dir="rtl"
          className="text-2xl font-black leading-loose text-gray-900"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif' }}
        >
          {color.name}
        </div>
        {color.transliteration && (
          <div className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-400">
            {color.transliteration}
          </div>
        )}
      </div>

      {/* Play chip */}
      <span
        aria-hidden
        className={`relative rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow ${
          selected ? "bg-gradient-to-br from-sky-500 to-fuchsia-500" : "bg-gray-900"
        }`}
      >
        🔊 Play
      </span>

      {/* Visited checkmark */}
      {visited && (
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-base text-white shadow-lg">
          ✓
        </span>
      )}
    </motion.button>
  );
}
