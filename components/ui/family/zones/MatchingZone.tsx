"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import FamilyMemberRenderer from "../shared/FamilyMemberRenderer";
import FeedbackOverlay, { type FeedbackKind } from "../shared/FeedbackOverlay";
import ScoreTracker from "../shared/ScoreTracker";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, mulberry32, pickRandom, shuffle } from "@/lib/utils/random";
import type {
  FamilyMatchingZone as FamilyMatchingZoneType,
  FamilyMember,
} from "@/lib/types/familyLesson.types";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface MatchingZoneProps {
  zone: FamilyMatchingZoneType;
  members: FamilyMember[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

/**
 * Zone 3 — Matching.
 *
 * Tap-to-pair: tap a word, then tap an illustration (or vice-versa).
 * If the pair matches, both cells lock in with a green ring + audio
 * replay. Wrong pair → shake, clear selection, no score penalty.
 *
 * Drag-and-drop (mission's nice-to-have desktop mode) is intentionally
 * deferred — tap-to-pair works uniformly on touch + keyboard + mouse
 * and doesn't need a DnD library dependency. If we want to add it
 * later, wrap the same tap handlers with `@dnd-kit`.
 */

interface Round {
  /** Members (right column words + left column illustrations). */
  pool: FamilyMember[];
  /** Display order for the word column. */
  wordOrder: string[];
  /** Display order for the illustration column. */
  cardOrder: string[];
}

type PairState = "pending" | "matched";

function generateRounds(
  zone: FamilyMatchingZoneType,
  members: FamilyMember[],
  seed: number,
): Round[] {
  const rounds: Round[] = [];
  const rand = mulberry32(seed);
  const roundCount = Math.max(1, zone.rounds);
  const pairsPerRound = Math.min(zone.pairsPerRound, members.length);

  for (let i = 0; i < roundCount; i++) {
    const roundSeed = Math.floor(rand() * 0xffffffff);
    const pool = pickRandom(members, pairsPerRound, roundSeed);
    const wordOrder = shuffle(pool, roundSeed + 1).map((m) => m.key);
    const cardOrder = shuffle(pool, roundSeed + 2).map((m) => m.key);
    rounds.push({ pool, wordOrder, cardOrder });
  }
  return rounds;
}

export default function MatchingZone({
  zone,
  members,
  onComplete,
  onAdvance,
}: MatchingZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(
    () => (seed === null ? [] : generateRounds(zone, members, seed)),
    [zone, members, seed],
  );

  const [roundIndex, setRoundIndex] = useState(0);
  const [pairStates, setPairStates] = useState<Record<string, PairState>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<{ word: string; card: string } | null>(null);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [totalMatched, setTotalMatched] = useState(0);
  const [finished, setFinished] = useState(false);

  const round = rounds[roundIndex];

  const resetSelections = useCallback(() => {
    setSelectedWord(null);
    setSelectedCard(null);
  }, []);

  const handleRoundCleared = useCallback(() => {
    setFeedback("correct");
    window.setTimeout(() => {
      setFeedback(null);
      if (roundIndex + 1 >= rounds.length) {
        setFinished(true);
        onComplete?.({ correct: totalMatched + round.pool.length, total: rounds.length * round.pool.length });
      } else {
        setRoundIndex((i) => i + 1);
        setPairStates({});
        resetSelections();
      }
    }, 900);
  }, [roundIndex, rounds.length, totalMatched, round, onComplete, resetSelections]);

  const validatePair = useCallback(
    (wordKey: string, cardKey: string) => {
      if (wordKey === cardKey) {
        setPairStates((prev) => ({ ...prev, [wordKey]: "matched" }));
        setTotalMatched((t) => t + 1);
        const member = round.pool.find((m) => m.key === wordKey);
        if (member) playAudio(member.audioUrl, member.audioText);
        resetSelections();

        // Check if this was the last pair in the round.
        const matchedCount = Object.values({ ...pairStates, [wordKey]: "matched" }).filter(
          (s) => s === "matched",
        ).length;
        if (matchedCount >= round.pool.length) {
          handleRoundCleared();
        }
      } else {
        setWrongFlash({ word: wordKey, card: cardKey });
        window.setTimeout(() => {
          setWrongFlash(null);
          resetSelections();
        }, 600);
      }
    },
    [round, pairStates, playAudio, resetSelections, handleRoundCleared],
  );

  const onWordTap = (wordKey: string) => {
    if (pairStates[wordKey] === "matched") return;
    setSelectedWord(wordKey);
    if (selectedCard) {
      validatePair(wordKey, selectedCard);
    }
  };

  const onCardTap = (cardKey: string) => {
    if (pairStates[cardKey] === "matched") return;
    setSelectedCard(cardKey);
    const member = round?.pool.find((m) => m.key === cardKey);
    if (member) playAudio(member.audioUrl, member.audioText);
    if (selectedWord) {
      validatePair(selectedWord, cardKey);
    }
  };

  const pairStatus = (key: string): "idle" | "selected" | "matched" | "wrong" => {
    if (pairStates[key] === "matched") return "matched";
    if (wrongFlash && (wrongFlash.word === key || wrongFlash.card === key)) return "wrong";
    if (selectedWord === key || selectedCard === key) return "selected";
    return "idle";
  };

  const title = zone.title ?? "طَابِقِ الْكَلِمَةَ بِالصُّورَةِ";

  return (
    <motion.section
      aria-labelledby="family-matching-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-4xl px-4 py-6 sm:py-10"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <header className="mb-4 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="family-matching-title"
          className="text-3xl sm:text-4xl font-black text-gray-900"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {title}
        </h2>
        {zone.description && (
          <p
            className="text-base text-gray-600"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.description}
          </p>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <ScoreTracker
          completed={roundIndex + (finished ? 1 : 0)}
          total={rounds.length}
          labelAr="الجَوْلَةُ"
        />
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

      {finished ? (
        <div className="flex flex-col items-center gap-4">
          <p
            className="text-2xl font-black text-emerald-600"
            dir="rtl"
            lang="ar"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            أَحْسَنْتَ!
          </p>
          <motion.button
            type="button"
            onClick={onAdvance}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-black text-white shadow-xl ring-2 ring-emerald-200 transition hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
            dir="rtl"
            lang="ar"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            <span aria-hidden>→</span>
            <span>الْمِنْطَقَةُ التَّالِيَةُ</span>
          </motion.button>
        </div>
      ) : (
        round && (
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {/* Word column (RTL) */}
            <div className="flex flex-col gap-3" dir="rtl" lang="ar">
              {round.wordOrder.map((key) => {
                const member = round.pool.find((m) => m.key === key);
                if (!member) return null;
                const status = pairStatus(key);
                return (
                  <WordChip
                    key={key}
                    member={member}
                    status={status}
                    onClick={() => onWordTap(key)}
                  />
                );
              })}
            </div>

            {/* Illustration column */}
            <div className="flex flex-col gap-3">
              {round.cardOrder.map((key) => {
                const member = round.pool.find((m) => m.key === key);
                if (!member) return null;
                const status = pairStatus(key);
                return (
                  <IllustrationChip
                    key={key}
                    member={member}
                    status={status}
                    onClick={() => onCardTap(key)}
                  />
                );
              })}
            </div>
          </div>
        )
      )}
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Local chips                                                               */
/* -------------------------------------------------------------------------- */

type ChipStatus = "idle" | "selected" | "matched" | "wrong";

const STATUS_RING: Record<ChipStatus, string> = {
  idle: "ring-2 ring-gray-200 hover:ring-violet-300",
  selected: "ring-4 ring-violet-500",
  matched: "ring-4 ring-emerald-500",
  wrong: "ring-4 ring-rose-500",
};

function WordChip({
  member,
  status,
  onClick,
}: {
  member: FamilyMember;
  status: ChipStatus;
  onClick: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const locked = status === "matched";
  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;

  return (
    <motion.button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      aria-label={member.nameAr}
      aria-pressed={status === "selected" || status === "matched"}
      animate={shake}
      whileHover={locked || prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={locked || prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.45, ease: "easeInOut" as const }}
      className={`flex min-h-20 items-center justify-center rounded-3xl bg-white px-4 py-3 text-4xl font-black text-gray-900 shadow-md transition-shadow ${
        locked ? "opacity-85 cursor-default" : "hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70 cursor-pointer"
      } ${STATUS_RING[status]}`}
      style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
      dir="rtl"
      lang="ar"
    >
      {member.nameAr}
    </motion.button>
  );
}

function IllustrationChip({
  member,
  status,
  onClick,
}: {
  member: FamilyMember;
  status: ChipStatus;
  onClick: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const locked = status === "matched";
  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;

  return (
    <motion.button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      aria-label={member.nameAr}
      aria-pressed={status === "selected" || status === "matched"}
      animate={shake}
      whileHover={locked || prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={locked || prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.45, ease: "easeInOut" as const }}
      className={`flex min-h-20 items-center justify-center rounded-3xl bg-white p-2 shadow-md transition-shadow ${
        locked ? "opacity-85 cursor-default" : "hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70 cursor-pointer"
      } ${STATUS_RING[status]}`}
    >
      <FamilyMemberRenderer svgKey={member.svgComponent} size={80} aria-label={member.nameAr} />
    </motion.button>
  );
}
