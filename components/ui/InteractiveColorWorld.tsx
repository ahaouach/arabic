"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ColorCard from "./ColorCard";
import Confetti from "./Confetti";
import { useColorAudio } from "@/lib/useColorAudio";
import type { InteractiveColorWorldSection } from "@/lib/lessonSections";

type ColorItem = InteractiveColorWorldSection["colors"][number];

export default function InteractiveColorWorld({
  section,
}: {
  section: InteractiveColorWorldSection;
}) {
  const { playColor, isMuted, toggleMute } = useColorAudio();

  const [selected, setSelected] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [confettiKey, setConfettiKey] = useState(0);

  const total = section.colors.length;
  const allVisited = visited.size === total && total > 0;

  // Celebrate once when the last color is explored.
  useEffect(() => {
    if (allVisited) {
      setConfettiKey((k) => k + 1);
    }
  }, [allVisited]);

  const onHover = (color: ColorItem) => {
    playColor(color);
  };

  const onSelect = (color: ColorItem) => {
    setSelected(color.name);
    setVisited((prev) => {
      if (prev.has(color.name)) return prev;
      const next = new Set(prev);
      next.add(color.name);
      return next;
    });
    playColor(color);
  };

  const progress = useMemo(() => Math.round((visited.size / Math.max(total, 1)) * 100), [
    visited.size,
    total,
  ]);

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <Confetti trigger={confettiKey} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
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
          <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-black text-amber-600 shadow ring-1 ring-black/5">
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.2, 1], rotate: [0, -6, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ⭐
            </motion.span>
            {visited.size} / {total}
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
      </div>

      {/* Progress ribbon */}
      <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-white/80 shadow-inner ring-1 ring-black/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-500 to-amber-400"
        />
      </div>

      {/* Floating color cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.colors.map((c, i) => (
          <ColorCard
            key={c.name}
            color={c}
            selected={selected === c.name}
            visited={visited.has(c.name)}
            onHover={() => onHover(c)}
            onSelect={() => onSelect(c)}
            index={i}
          />
        ))}
      </div>

      {/* Completion banner */}
      <AnimatePresence>
        {allVisited && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 to-pink-400 p-5 text-center text-white shadow-xl"
          >
            <motion.div
              aria-hidden
              animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl"
            >
              🎉
            </motion.div>
            <p
              className="mt-2 text-xl font-black"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ! لَقَدْ تَعَلَّمْتَ كُلَّ الأَلْوَانِ!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
