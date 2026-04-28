"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import LetterGlyph from "./LetterGlyph";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, shuffle } from "@/lib/utils/random";
import type {
  ArabicLetter,
  LetterTashkeelZone as LetterTashkeelZoneType,
  TashkeelState,
} from "@/lib/types/alphabetLesson.types";

export interface LetterTashkeelZoneProps {
  letter: ArabicLetter;
  zone: LetterTashkeelZoneType;
  onComplete?: () => void;
  onAdvance?: () => void;
}

/**
 * Static mapping from each vowelization state to its combining mark + the
 * Arabic name of the mark. Combining marks join the base letter at render
 * time — no string concatenation of Unicode codepoints needed beyond
 * `base + mark`, which browsers handle correctly.
 */
const TASHKEEL_INFO: Record<
  TashkeelState,
  { mark: string; name: string; transliteration: string }
> = {
  fatha: { mark: "\u064E", name: "فَتْحَةٌ", transliteration: "fatḥa" },
  kasra: { mark: "\u0650", name: "كَسْرَةٌ", transliteration: "kasra" },
  damma: { mark: "\u064F", name: "ضَمَّةٌ", transliteration: "ḍamma" },
  sukun: { mark: "\u0652", name: "سُكُونٌ", transliteration: "sukūn" },
  fathatan: { mark: "\u064B", name: "تَنْوِينُ فَتْحٍ", transliteration: "fatḥatān" },
  kasratan: { mark: "\u064D", name: "تَنْوِينُ كَسْرٍ", transliteration: "kasratān" },
  dammatan: { mark: "\u064C", name: "تَنْوِينُ ضَمٍّ", transliteration: "ḍammatān" },
};

export default function LetterTashkeelZone({
  letter,
  zone,
  onComplete,
  onAdvance,
}: LetterTashkeelZoneProps) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const ordered = useMemo<TashkeelState[]>(() => {
    if (seed === null) return zone.states;
    return shuffle(zone.states, seed);
  }, [zone.states, seed]);

  const [visited, setVisited] = useState<Set<TashkeelState>>(new Set());
  const [announced, setAnnounced] = useState(false);
  const total = zone.states.length;
  const allSeen = visited.size === total && total > 0;

  useEffect(() => {
    if (allSeen && !announced) {
      setAnnounced(true);
      onComplete?.();
    }
  }, [allSeen, announced, onComplete]);

  const play = (state: TashkeelState) => {
    const info = TASHKEEL_INFO[state];
    const combined = letter.char + info.mark;
    playAudio(undefined, combined);
    setVisited((prev) => {
      if (prev.has(state)) return prev;
      const next = new Set(prev);
      next.add(state);
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
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="alphabet-tashkeel-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="alphabet-tashkeel-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "الْحَرْفُ مَعَ الْحَرَكَاتِ"}
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

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ordered.map((state, i) => {
          const info = TASHKEEL_INFO[state];
          const glyph = letter.char + info.mark;
          const seen = visited.has(state);
          return (
            <div key={state} className="flex flex-col items-center gap-2">
              <LetterGlyph
                glyph={glyph}
                fill={seen ? "#1f2937" : null}
                status={seen ? "selected" : "idle"}
                ariaLabel={`${letter.nameAr} مَعَ ${info.name}`}
                onClick={() => play(state)}
                index={i}
                size="lg"
              />
              <span
                lang="ar"
                dir="rtl"
                className="text-xl font-black text-gray-900"
                style={{
                  fontFamily:
                    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                }}
              >
                {info.name}
              </span>
              <span className="text-[0.7rem] font-medium uppercase tracking-widest text-gray-500">
                {info.transliteration}
              </span>
            </div>
          );
        })}
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
          >
            {allSeen ? "الْمِنْطَقَةُ التَّالِيَةُ →" : "تَخَطَّ إِلَى التَّالِيَةِ →"}
          </motion.button>
        )}
      </div>
    </section>
  );
}
