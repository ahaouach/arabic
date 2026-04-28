"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ShapeCard from "./ShapeCard";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, shuffle } from "@/lib/utils/random";
import type {
  ArabicShape,
  ShapesDiscoveryZone,
} from "@/lib/types/shapesLesson.types";

export interface DiscoveryZoneProps {
  shapes: ArabicShape[];
  zone: ShapesDiscoveryZone;
  onComplete?: () => void;
  onAdvance?: () => void;
}

/**
 * Palette of playful pastel fills applied deterministically per-shape so
 * each shape always wears the same colour within a discovery grid. The
 * fill is cosmetic only — the DB `svgPath` stays the source of truth.
 */
const DISCOVERY_FILLS = [
  "#FCA5A5", // rose-300
  "#93C5FD", // blue-300
  "#6EE7B7", // emerald-300
  "#FDE68A", // amber-200
  "#FDBA74", // orange-300
  "#C4B5FD", // violet-300
];

function fillFor(key: string): string {
  // Tiny deterministic string hash → stable pastel per shape key.
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  return DISCOVERY_FILLS[Math.abs(h) % DISCOVERY_FILLS.length];
}

export default function DiscoveryZone({
  shapes,
  zone,
  onComplete,
  onAdvance,
}: DiscoveryZoneProps) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  // Initial render is deterministic (SSR-safe); shuffle runs post-hydration.
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const ordered = useMemo(
    () => (seed === null ? shapes : shuffle(shapes, seed)),
    [shapes, seed],
  );

  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [announced, setAnnounced] = useState(false);
  const total = shapes.length;
  const allSeen = visited.size === total && total > 0;

  useEffect(() => {
    if (allSeen && !announced) {
      setAnnounced(true);
      onComplete?.();
    }
  }, [allSeen, announced, onComplete]);

  const play = (s: ArabicShape) => {
    playAudio(s.audioUrl, s.audioText);
    setVisited((prev) => {
      if (prev.has(s.key)) return prev;
      const next = new Set(prev);
      next.add(s.key);
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
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-amber-50 via-white to-sky-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="shapes-discovery-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="shapes-discovery-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "عَالَمُ الْأَشْكَالِ"}
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
        {ordered.map((s, i) => (
          <ShapeCard
            key={s.key}
            shape={s}
            size="md"
            index={i}
            onClick={() => play(s)}
            onHover={() => play(s)}
            fill={fillFor(s.key)}
            selected={visited.has(s.key)}
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
            {allSeen
              ? "الْمِنْطَقَةُ التَّالِيَةُ →"
              : "تَخَطَّ إِلَى الْمِنْطَقَةِ التَّالِيَةِ →"}
          </motion.button>
        )}
      </div>
    </section>
  );
}
