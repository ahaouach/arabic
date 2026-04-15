"use client";

import { motion } from "framer-motion";
import type { PaintGameSection } from "@/lib/lessonSections";

type PaletteColor = PaintGameSection["colors"][number];

interface ColorPaletteProps {
  colors: PaletteColor[];
  selected: string | null;
  onSelect: (color: PaletteColor) => void;
  onHover: (color: PaletteColor) => void;
}

export default function ColorPalette({ colors, selected, onSelect, onHover }: ColorPaletteProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Color palette"
      className="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/80 p-4 shadow-inner ring-1 ring-black/5 backdrop-blur"
    >
      {colors.map((c) => {
        const isSelected = selected === c.name;
        return (
          <motion.button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={c.name}
            onClick={() => onSelect(c)}
            onMouseEnter={() => onHover(c)}
            onFocus={() => onHover(c)}
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`group flex flex-col items-center gap-2 rounded-2xl p-2 transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
              isSelected ? "shadow-2xl" : "shadow"
            }`}
          >
            <div
              aria-hidden
              className={`h-14 w-14 rounded-full ring-4 transition-all ${
                isSelected ? "ring-gray-900 scale-110" : "ring-white"
              }`}
              style={{ backgroundColor: c.hex }}
            />
            <span
              className="text-sm font-black text-gray-800"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif' }}
            >
              {c.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
