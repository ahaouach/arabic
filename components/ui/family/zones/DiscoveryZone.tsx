"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import FamilyMemberCard from "../shared/FamilyMemberCard";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, shuffle } from "@/lib/utils/random";
import type {
  FamilyDiscoveryZone as FamilyDiscoveryZoneType,
  FamilyMember,
} from "@/lib/types/familyLesson.types";

export interface DiscoveryZoneProps {
  zone: FamilyDiscoveryZoneType;
  members: FamilyMember[];
  onComplete?: () => void;
  onAdvance?: () => void;
}

/**
 * Zone 1 — Discovery.
 *
 * All members laid out as large cards, tap-to-play. Order is shuffled
 * on mount and re-shuffles on the "Shuffle again" button. Mark-complete
 * fires once the child has interacted with at least one card OR taps
 * the Continue CTA (whichever comes first), so the orchestrator can
 * award the zone star without forcing kids to visit every card.
 */
export default function DiscoveryZone({
  zone,
  members,
  onComplete,
  onAdvance,
}: DiscoveryZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const ordered = useMemo<FamilyMember[]>(() => {
    if (seed === null) return members;
    return shuffle(members, seed);
  }, [members, seed]);

  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [announced, setAnnounced] = useState(false);

  const announceComplete = () => {
    if (announced) return;
    setAnnounced(true);
    onComplete?.();
  };

  useEffect(() => {
    if (!announced && visited.size > 0) {
      announceComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited, announced]);

  const playMember = (m: FamilyMember) => {
    playAudio(m.audioUrl, m.audioText);
    setVisited((prev) => {
      if (prev.has(m.key)) return prev;
      const next = new Set(prev);
      next.add(m.key);
      return next;
    });
  };

  const shuffleAgain = () => setSeed(generateRoundSeed());

  const handleContinue = () => {
    announceComplete();
    onAdvance?.();
  };

  return (
    <motion.section
      aria-labelledby="family-discovery-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:py-10"
    >
      <header className="mb-6 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="family-discovery-title"
          className="text-3xl sm:text-4xl font-black text-gray-900"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {zone.title ?? "أَفْرَادُ الْعَائِلَةِ"}
        </h2>
        {zone.description && (
          <p
            className="text-lg text-gray-600"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.description}
          </p>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={shuffleAgain}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-base font-bold text-white shadow-lg ring-2 ring-violet-200 transition hover:bg-violet-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70"
        >
          <span aria-hidden>🔀</span>
          <span>شَخْبَطْ</span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? "تَشْغِيلُ الصَّوْتِ" : "إِيقَافُ الصَّوْتِ"}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-md ring-2 ring-gray-200 transition hover:ring-violet-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70"
        >
          <span aria-hidden>{isMuted ? "🔇" : "🔊"}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {ordered.map((m, i) => (
          <FamilyMemberCard
            key={m.key}
            member={m}
            onClick={() => playMember(m)}
            index={i}
            status={visited.has(m.key) ? "correct" : "idle"}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <motion.button
          type="button"
          onClick={handleContinue}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-black text-white shadow-xl ring-2 ring-emerald-200 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
          dir="rtl"
          lang="ar"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          <span aria-hidden>→</span>
          <span>الْمِنْطَقَةُ التَّالِيَةُ</span>
        </motion.button>
      </div>
    </motion.section>
  );
}
