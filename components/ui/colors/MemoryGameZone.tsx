"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MemoryCard from "./MemoryCard";
import ReplayButton from "./ReplayButton";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, pickRandom, shuffle } from "@/lib/utils/random";
import type {
  ArabicColor,
  MemoryGameZone as MemoryGameZoneType,
} from "@/lib/types/colorsLesson.types";

export interface MemoryGameZoneProps {
  colors: ArabicColor[];
  zone: MemoryGameZoneType;
  onComplete?: (result: { moves: number; pairs: number; stars: 1 | 2 | 3 }) => void;
  onAdvance?: () => void;
}

interface Card {
  id: number;
  color: ArabicColor;
}

/**
 * Pick `pairsCount` distinct colours, duplicate each, shuffle the deck.
 * Each card gets a stable `id` so React keys survive the shuffle.
 */
function buildDeck(
  colors: ArabicColor[],
  pairsCount: number,
  seed: number,
): Card[] {
  const chosen = pickRandom(colors, pairsCount, seed);
  const duplicated: Card[] = chosen.flatMap((c, i) => [
    { id: i * 2, color: c },
    { id: i * 2 + 1, color: c },
  ]);
  return shuffle(duplicated, seed + 13);
}

function computeStars(moves: number, pairs: number): 1 | 2 | 3 {
  if (moves <= Math.ceil(pairs * 1.5)) return 3;
  if (moves <= pairs * 2) return 2;
  return 1;
}

export default function MemoryGameZone({
  colors,
  zone,
  onComplete,
  onAdvance,
}: MemoryGameZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const deck = useMemo<Card[]>(() => {
    if (seed === null) return [];
    return buildDeck(colors, zone.pairsCount, seed);
  }, [colors, zone.pairsCount, seed]);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [notified, setNotified] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const totalPairs = zone.pairsCount;
  const matchedPairs = matched.size;
  const finished = deck.length > 0 && matchedPairs >= totalPairs;

  const flipCard = useCallback(
    (idx: number) => {
      if (locked) return;
      const card = deck[idx];
      if (!card) return;
      if (matched.has(card.color.key)) return;
      if (flipped.includes(idx)) return;
      if (flipped.length >= 2) return;

      const nextFlipped = [...flipped, idx];
      setFlipped(nextFlipped);
      playAudio(card.color.audioUrl, card.color.audioText);

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = nextFlipped;
        const cardA = deck[a];
        const cardB = deck[b];
        if (cardA.color.key === cardB.color.key) {
          // Match — reveal permanently after a beat.
          setLocked(true);
          timerRef.current = window.setTimeout(() => {
            setMatched((prev) => {
              const next = new Set(prev);
              next.add(cardA.color.key);
              return next;
            });
            setFlipped([]);
            setLocked(false);
            playAudio(undefined, "أَحْسَنْتَ");
          }, 600);
        } else {
          // Mismatch — flip back after the configured delay.
          setLocked(true);
          timerRef.current = window.setTimeout(() => {
            setFlipped([]);
            setLocked(false);
          }, zone.flipCheckDelayMs);
        }
      }
    },
    [deck, flipped, locked, matched, playAudio, zone.flipCheckDelayMs],
  );

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      const stars = computeStars(moves, totalPairs);
      onComplete?.({ moves, pairs: totalPairs, stars });
    }
  }, [finished, notified, moves, totalPairs, onComplete]);

  const replay = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setSeed(generateRoundSeed());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setNotified(false);
  };

  const stars = finished ? computeStars(moves, totalPairs) : 0;

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="colors-memory-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="colors-memory-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "لُعْبَةُ الذَّاكِرَةِ"}
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
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          <span className="tabular-nums">
            {matchedPairs} / {totalPairs}
          </span>
          <span aria-hidden>•</span>
          <span className="tabular-nums" aria-label="Moves">
            {moves} حَرَكَة
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="grid"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div
              role="grid"
              aria-label="Memory cards"
              className="mx-auto grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${zone.gridCols}, minmax(0, 1fr))`,
                maxWidth: `${zone.gridCols * 120}px`,
              }}
            >
              {deck.map((card, i) => {
                const isMatched = matched.has(card.color.key);
                const isFlipped = flipped.includes(i);
                const ariaLabel = isFlipped || isMatched
                  ? `${card.color.nameAr} — ${card.color.transliteration}`
                  : "بِطَاقَةٌ مَقْلُوبَةٌ";
                return (
                  <MemoryCard
                    key={card.id}
                    color={card.color}
                    flipped={isFlipped}
                    matched={isMatched}
                    disabled={locked || isFlipped || isMatched}
                    index={i}
                    ariaLabel={ariaLabel}
                    onClick={() => flipCard(i)}
                  />
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <div className="text-6xl" aria-hidden>
              {stars === 3 ? "🏆" : stars === 2 ? "🌟" : "💪"}
            </div>
            <div
              className="mt-3 flex items-center justify-center gap-1 text-4xl"
              aria-label={`${stars} stars`}
            >
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  aria-hidden
                  className={s <= stars ? "text-amber-400" : "text-gray-200"}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 tabular-nums">
              {moves} moves · {totalPairs} pairs
            </p>
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {stars === 3 ? "رَائِعٌ!" : stars === 2 ? "جَيِّدٌ جِدًّا!" : "جَيِّدٌ!"}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <ReplayButton onClick={replay} size="sm" />
              {onAdvance && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="min-h-12 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  إِنْهَاءُ الدَّرْسِ →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
