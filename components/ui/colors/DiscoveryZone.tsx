"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ColorCard from "./ColorCard";
import ReplayButton from "./ReplayButton";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, shuffle } from "@/lib/utils/random";
import type {
  ArabicColor,
  ColorsDiscoveryZone,
} from "@/lib/types/colorsLesson.types";

export interface DiscoveryZoneProps {
  colors: ArabicColor[];
  zone: ColorsDiscoveryZone;
  onComplete?: () => void;
  onAdvance?: () => void;
}

export default function DiscoveryZone({
  colors,
  zone,
  onComplete,
  onAdvance,
}: DiscoveryZoneProps) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  // Initial render is deterministic (SSR-safe); the shuffle runs client-side
  // post-hydration. See Phase 2 standard: "Randomisation happens
  // client-side after hydration to avoid SSR mismatch".
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const ordered = useMemo(
    () => (seed === null ? colors : shuffle(colors, seed)),
    [colors, seed],
  );

  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [announced, setAnnounced] = useState(false);
  const total = colors.length;
  const allSeen = visited.size === total && total > 0;

  useEffect(() => {
    if (allSeen && !announced) {
      setAnnounced(true);
      onComplete?.();
    }
  }, [allSeen, announced, onComplete]);

  const play = (c: ArabicColor) => {
    playAudio(c.audioUrl, c.audioText);
    setVisited((prev) => {
      if (prev.has(c.key)) return prev;
      const next = new Set(prev);
      next.add(c.key);
      return next;
    });
  };

  const reshuffle = () => {
    setSeed(generateRoundSeed());
    setVisited(new Set());
    setAnnounced(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="colors-discovery-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="colors-discovery-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "عَالَمُ الْأَلْوَانِ"}
          </h3>
          {zone.description && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {zone.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            aria-live="polite"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
          >
            <span aria-hidden>⭐</span>
            <span className="tabular-nums">
              {visited.size} / {total}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-white px-3 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ordered.map((c, i) => (
          <ColorCard
            key={c.key}
            color={c}
            size="md"
            index={i}
            onClick={() => play(c)}
            onHover={() => play(c)}
            selected={visited.has(c.key)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ReplayButton onClick={reshuffle} label="أَعِدِ الْخَلْطَ" size="sm" />

        {onAdvance && (
          <motion.button
            type="button"
            onClick={onAdvance}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
            aria-label="Go to the next zone"
          >
            {allSeen ? "الْمِنْطَقَةُ التَّالِيَةُ →" : "تَخَطَّ إِلَى الْمِنْطَقَةِ التَّالِيَةِ →"}
          </motion.button>
        )}
      </div>
    </section>
  );
}
