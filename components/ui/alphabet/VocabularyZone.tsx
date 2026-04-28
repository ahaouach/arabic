"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import VocabularyCard from "./VocabularyCard";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, pickRandom, randomInt } from "@/lib/utils/random";
import type {
  ArabicLetter,
  VocabularyWord,
  VocabularyZone as VocabularyZoneType,
} from "@/lib/types/alphabetLesson.types";

export interface VocabularyZoneProps {
  letter: ArabicLetter;
  /** Full vocab pool — we filter to `letterKey === letter.key` inside. */
  vocabulary: VocabularyWord[];
  zone: VocabularyZoneType;
  onComplete?: () => void;
  onAdvance?: () => void;
}

export default function VocabularyZone({
  letter,
  vocabulary,
  zone,
  onComplete,
  onAdvance,
}: VocabularyZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const pool = useMemo(
    () => vocabulary.filter((w) => w.letterKey === letter.key),
    [vocabulary, letter.key],
  );

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const words = useMemo<VocabularyWord[]>(() => {
    if (seed === null) return [];
    if (pool.length === 0) return [];
    const max = Math.min(zone.maxWords, pool.length);
    const min = Math.min(zone.minWords, max);
    const n = randomInt(min, max, seed);
    return pickRandom(pool, n, seed + 1);
  }, [pool, zone.minWords, zone.maxWords, seed]);

  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [announced, setAnnounced] = useState(false);
  const total = words.length;
  const allSeen = visited.size === total && total > 0;

  useEffect(() => {
    if (allSeen && !announced) {
      setAnnounced(true);
      onComplete?.();
    }
  }, [allSeen, announced, onComplete]);

  const onTap = (w: VocabularyWord) => {
    // Reinforces the letter first, then the word.
    playAudio(undefined, `${letter.nameAr} ... ${w.audioText}`);
    setVisited((prev) => {
      if (prev.has(w.key)) return prev;
      const next = new Set(prev);
      next.add(w.key);
      return next;
    });
  };
  const onHover = (w: VocabularyWord) => {
    playAudio(w.audioUrl, w.audioText);
  };

  const replay = () => {
    setSeed(generateRoundSeed());
    setVisited(new Set());
    setAnnounced(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="alphabet-vocab-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="alphabet-vocab-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "مُفْرَدَاتٌ تَحْتَوِي عَلَى الْحَرْفِ"}
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
        <div
          aria-live="polite"
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          <span aria-hidden>⭐</span>
          <span className="tabular-nums">
            {visited.size} / {total}
          </span>
        </div>
      </div>

      {pool.length === 0 ? (
        <div
          className="rounded-3xl bg-white p-6 text-center text-sm text-gray-600 shadow-inner ring-1 ring-black/5"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          لَا تُوجَدُ مُفْرَدَاتٌ لِهَذَا الْحَرْفِ بَعْدُ.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {words.map((w, i) => (
            <VocabularyCard
              key={w.key}
              word={w}
              index={i}
              onHover={() => onHover(w)}
              onClick={() => onTap(w)}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ReplayButton onClick={replay} label="كَلِمَاتٌ أُخْرَى" size="sm" />
        {onAdvance && (
          <motion.button
            type="button"
            onClick={onAdvance}
            whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
          >
            {allSeen
              ? "الْمِنْطَقَةُ التَّالِيَةُ →"
              : "تَخَطَّ إِلَى التَّالِيَةِ →"}
          </motion.button>
        )}
      </div>
    </section>
  );
}
