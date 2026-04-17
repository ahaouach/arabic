"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NumberCard from "./NumberCard";
import { useAudio } from "@/lib/useAudio";
import type {
  DiscoveryZone as DiscoveryZoneData,
  NumberItem,
} from "@/lib/types/numbersLesson.types";

export interface DiscoveryZoneProps {
  /** All numbers to display (typically 1..10). */
  numbers: NumberItem[];
  /** Zone config (title, instructions). */
  zone: DiscoveryZoneData;
  /** Called once the child has tapped (or hovered) every number. */
  onComplete?: () => void;
  /** Called when the child presses "Next zone". */
  onAdvance?: () => void;
}

export default function DiscoveryZone({
  numbers,
  zone,
  onComplete,
  onAdvance,
}: DiscoveryZoneProps) {
  const { playAudio } = useAudio();
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [announced, setAnnounced] = useState(false);

  const total = numbers.length;
  const allSeen = visited.size === total && total > 0;

  // Fire the completion callback exactly once per session.
  useEffect(() => {
    if (allSeen && !announced) {
      setAnnounced(true);
      onComplete?.();
    }
  }, [allSeen, announced, onComplete]);

  const play = (n: NumberItem) => {
    playAudio(n.audioUrl, n.audioText ?? n.nameAr);
    setVisited((prev) => {
      if (prev.has(n.value)) return prev;
      const next = new Set(prev);
      next.add(n.value);
      return next;
    });
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="discovery-zone-title"
    >
      {/* Header */}
      <div className="mb-5">
        <h3
          id="discovery-zone-title"
          className="text-2xl font-black text-gray-900"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {zone.title ?? "تَعَرَّفْ عَلَى الْأَرْقَامِ"}
        </h3>
        {zone.instructions && (
          <p
            className="mt-1 text-sm font-medium text-gray-600"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.instructions}
          </p>
        )}
      </div>

      {/* Cards grid */}
      <div
        className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        role="list"
      >
        {numbers.map((n, i) => (
          <div key={n.value} role="listitem">
            <NumberCard
              number={n}
              size="md"
              index={i}
              onClick={() => play(n)}
              onHover={() => play(n)}
              showArabicName
              showTransliteration
              showEasternDigit={false}
              selected={visited.has(n.value)}
            />
          </div>
        ))}
      </div>

      {/* Footer — progression + manual advance */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          aria-live="polite"
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          <span aria-hidden>⭐</span>
          <span className="tabular-nums">
            {visited.size} / {total}
          </span>
        </div>

        {onAdvance && (
          <motion.button
            type="button"
            onClick={onAdvance}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-3 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
            aria-label="Go to the next zone"
          >
            {allSeen ? "Next zone →" : "Skip to next zone →"}
          </motion.button>
        )}
      </div>
    </section>
  );
}
