"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArabicColor } from "@/lib/types/shapesLesson.types";

export interface DrawingToolbarProps {
  colors: ArabicColor[];
  /** Currently-selected brush colour (hex). */
  color: string;
  onSelectColor: (hex: string) => void;
  /** Available brush sizes in px. */
  brushSizes: number[];
  brushSize: number;
  onSelectBrush: (px: number) => void;
  /** Show the dashed reference guide behind the strokes? */
  showGuide: boolean;
  onToggleGuide: () => void;
  canUndo: boolean;
  onUndo: () => void;
  onRequestClear: () => void;
  onDone: () => void;
}

/**
 * Drawing toolbar: colour swatches, brush sizes, undo, guide toggle,
 * clear (the parent owns the confirm flow), and done. Every button is
 * keyboard accessible; tap targets ≥72×72 per spec (using min-h-16).
 */
export default function DrawingToolbar({
  colors,
  color,
  onSelectColor,
  brushSizes,
  brushSize,
  onSelectBrush,
  showGuide,
  onToggleGuide,
  canUndo,
  onUndo,
  onRequestClear,
  onDone,
}: DrawingToolbarProps) {
  const prefersReducedMotion = useReducedMotion();
  const tap = prefersReducedMotion ? undefined : { scale: 0.94 };
  const hover = prefersReducedMotion ? undefined : { y: -2, scale: 1.04 };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-white p-3 shadow-lg ring-1 ring-black/5 sm:gap-4 sm:p-4">
      {/* Colour swatches */}
      <div
        className="flex flex-wrap items-center gap-1.5"
        role="radiogroup"
        aria-label="Choose a colour"
      >
        {colors.map((c) => {
          const selected = color.toLowerCase() === c.hex.toLowerCase();
          return (
            <motion.button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${c.nameAr} — ${c.transliteration}`}
              onClick={() => onSelectColor(c.hex)}
              whileHover={hover}
              whileTap={tap}
              className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-transform ring-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
                selected ? "ring-gray-900 scale-110" : "ring-white"
              }`}
              style={{ backgroundColor: c.hex }}
            >
              <span className="sr-only">{c.nameAr}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Brush sizes */}
      <div
        className="flex items-center gap-1.5"
        role="radiogroup"
        aria-label="Brush size"
      >
        {brushSizes.map((px) => {
          const selected = px === brushSize;
          return (
            <motion.button
              key={px}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Brush size ${px}px`}
              onClick={() => onSelectBrush(px)}
              whileHover={hover}
              whileTap={tap}
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 shadow-md transition-colors ring-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
                selected ? "ring-gray-900 bg-gray-200" : "ring-white"
              }`}
            >
              <span
                aria-hidden
                className="rounded-full bg-gray-900"
                style={{ width: `${Math.min(px, 20)}px`, height: `${Math.min(px, 20)}px` }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Guide toggle */}
      <motion.button
        type="button"
        onClick={onToggleGuide}
        whileHover={hover}
        whileTap={tap}
        aria-pressed={showGuide}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black shadow-md ring-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
          showGuide ? "bg-gray-900 text-white ring-gray-900" : "bg-white text-gray-800 ring-black/10"
        }`}
        lang="ar"
        dir="rtl"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
      >
        {showGuide ? "أَخْفِ الدَّلِيلَ" : "أَظْهِرِ الدَّلِيلَ"}
      </motion.button>

      {/* Undo */}
      <motion.button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        whileHover={canUndo ? hover : undefined}
        whileTap={canUndo ? tap : undefined}
        aria-label="Undo the last stroke"
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-gray-100 text-xl font-black text-gray-700 shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ↶
      </motion.button>

      {/* Clear (parent confirms) */}
      <motion.button
        type="button"
        onClick={onRequestClear}
        whileHover={hover}
        whileTap={tap}
        aria-label="Clear the canvas"
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-rose-100 text-xl font-black text-rose-700 shadow-md ring-1 ring-rose-200 transition-colors hover:bg-rose-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/70"
      >
        🗑️
      </motion.button>

      {/* Done */}
      <motion.button
        type="button"
        onClick={onDone}
        whileHover={hover}
        whileTap={tap}
        className="ms-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-5 py-2 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
        lang="ar"
        dir="rtl"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
      >
        اِنْتَهَيْتُ ✓
      </motion.button>
    </div>
  );
}
