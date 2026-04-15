"use client";

import { motion } from "framer-motion";
import type { InteractiveShapesWorldSection } from "@/lib/lessonSections";

type ShapeItem = InteractiveShapesWorldSection["shapes"][number];

interface ShapeCardProps {
  shape: ShapeItem;
  onPlay: () => void;
}

export default function ShapeCard({ shape, onPlay }: ShapeCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onPlay}
      onMouseEnter={onPlay}
      onFocus={onPlay}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Play pronunciation for ${shape.name}`}
      className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
    >
      {/* Shape visual */}
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-fuchsia-100 text-6xl shadow-inner">
        <span aria-hidden>{shape.emoji}</span>
      </div>

      {/* Arabic name — fully vowelized */}
      <div
        lang="ar"
        dir="rtl"
        className="text-2xl font-black leading-loose text-gray-900"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif' }}
      >
        {shape.name}
      </div>

      {shape.transliteration && (
        <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {shape.transliteration}
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
}
