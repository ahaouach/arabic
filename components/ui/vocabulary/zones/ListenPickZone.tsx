"use client";

/**
 * Zone 2 — Listen & Pick.
 *
 * Hear an item's name → tap the matching card from N options. Same-
 * category distractors preferred when the config opts in (apple paired
 * with banana/pear is a stricter test than apple paired with carrot).
 *
 * Wrong tap → shake + replay target audio; round stays open.
 * Correct tap → green ring + correct feedback + auto-advance after 1.2s.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VocabularyCard, {
  type VocabularyCardStatus,
} from "../shared/VocabularyCard";
import FeedbackOverlay, { type FeedbackKind } from "../shared/FeedbackOverlay";
import InstructionBanner from "../shared/InstructionBanner";
import ScoreTracker from "../shared/ScoreTracker";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, mulberry32, pickRandom, shuffle } from "@/lib/utils/random";
import type {
  VocabListenPickZone,
  VocabularyItem,
} from "@/lib/types/vocabularyLesson.types";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface ListenPickZoneProps {
  zone: VocabListenPickZone;
  theme: string;
  items: VocabularyItem[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

interface Round {
  target: VocabularyItem;
  options: VocabularyItem[];
}

const AUTO_ADVANCE_MS = 1200;

function pickDistractors(
  target: VocabularyItem,
  pool: VocabularyItem[],
  n: number,
  preferSameCategory: boolean,
  seed: number,
): VocabularyItem[] {
  const others = pool.filter((m) => m.key !== target.key);
  if (preferSameCategory && target.category) {
    const sameCat = others.filter((m) => m.category === target.category);
    if (sameCat.length >= n) {
      return pickRandom(sameCat, n, seed);
    }
    const rest = others.filter((m) => m.category !== target.category);
    const need = n - sameCat.length;
    return [...sameCat, ...pickRandom(rest, need, seed + 1)];
  }
  return pickRandom(others, n, seed);
}

function generateRounds(
  zone: VocabListenPickZone,
  items: VocabularyItem[],
  seed: number,
): Round[] {
  const roundCount = Math.max(1, zone.rounds);
  const rand = mulberry32(seed);
  const targets: VocabularyItem[] = [];
  let pool: VocabularyItem[] = [];
  // Targets without replacement; cycle the pool when we run out.
  for (let i = 0; i < roundCount; i++) {
    if (pool.length === 0) {
      pool = shuffle(items, Math.floor(rand() * 0xffffffff));
    }
    targets.push(pool.shift() as VocabularyItem);
  }

  return targets.map((target, i) => {
    const distractorSeed = seed + i * 31 + 7;
    const distractors = pickDistractors(
      target,
      items,
      Math.max(1, zone.optionsPerRound - 1),
      zone.preferSameCategoryDistractors,
      distractorSeed,
    );
    const options = shuffle([target, ...distractors], distractorSeed + 1);
    return { target, options };
  });
}

export default function ListenPickZone({
  zone,
  theme,
  items,
  onComplete,
  onAdvance,
}: ListenPickZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(
    () => (seed === null ? [] : generateRounds(zone, items, seed)),
    [zone, items, seed],
  );

  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [finished, setFinished] = useState(false);

  const round = rounds[roundIndex];

  const lastAutoPlayIndex = useRef<number | null>(null);
  useEffect(() => {
    if (!round) return;
    if (lastAutoPlayIndex.current === roundIndex) return;
    lastAutoPlayIndex.current = roundIndex;
    const t = window.setTimeout(() => {
      playAudio(round.target.audioUrl, round.target.audioText);
    }, 250);
    return () => window.clearTimeout(t);
  }, [round, roundIndex, playAudio]);

  const announceFinished = useCallback(
    (correct: number) => {
      if (finished) return;
      setFinished(true);
      onComplete?.({ correct, total: rounds.length });
    },
    [finished, onComplete, rounds.length],
  );

  const replayTarget = useCallback(() => {
    if (!round) return;
    playAudio(round.target.audioUrl, round.target.audioText);
  }, [round, playAudio]);

  const handlePick = useCallback(
    (m: VocabularyItem) => {
      if (!round || locked) return;
      setSelectedKey(m.key);

      if (m.key === round.target.key) {
        setLocked(true);
        setCorrectCount((c) => c + 1);
        setFeedback("correct");
        window.setTimeout(() => {
          setFeedback(null);
          setSelectedKey(null);
          setLocked(false);
          if (roundIndex + 1 >= rounds.length) {
            announceFinished(correctCount + 1);
          } else {
            setRoundIndex((i) => i + 1);
          }
        }, AUTO_ADVANCE_MS);
      } else {
        setFeedback("wrong");
        window.setTimeout(() => {
          setFeedback(null);
          setSelectedKey(null);
          replayTarget();
        }, 700);
      }
    },
    [round, locked, roundIndex, rounds.length, correctCount, announceFinished, replayTarget],
  );

  const statusFor = (m: VocabularyItem): VocabularyCardStatus => {
    if (!selectedKey) return "idle";
    if (m.key === selectedKey) {
      if (feedback === "correct") return "correct";
      if (feedback === "wrong") return "wrong";
      return "selected";
    }
    return "idle";
  };

  const title = zone.title ?? "اِسْتَمِعْ وَاخْتَرْ";
  const instruction = "اِضْغَطْ عَلَى الصُّورَةِ الصَّحِيحَةِ";

  return (
    <motion.section
      aria-labelledby="vocab-listen-pick-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:py-10"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <header className="mb-4 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="vocab-listen-pick-title"
          className="text-3xl sm:text-4xl font-black text-gray-900"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {title}
        </h2>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ScoreTracker completed={correctCount} total={rounds.length} />
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

      <InstructionBanner
        textAr={instruction}
        subTextAr={round ? `الجَوْلَةُ ${roundIndex + 1} مِنْ ${rounds.length}` : undefined}
        onReplayAudio={replayTarget}
        changeKey={roundIndex}
        className="mb-6"
      />

      {finished ? (
        <div className="mt-8 flex flex-col items-center gap-4">
          <p
            className="text-2xl font-black text-emerald-600"
            dir="rtl"
            lang="ar"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            أَحْسَنْتَ! {correctCount} / {rounds.length}
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
          <div
            className="grid gap-4 sm:gap-6"
            style={{
              gridTemplateColumns: `repeat(${Math.min(round.options.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {round.options.map((m, i) => (
              <VocabularyCard
                key={`${roundIndex}-${m.key}`}
                item={m}
                theme={theme}
                onClick={() => handlePick(m)}
                status={statusFor(m)}
                index={i}
                disabled={locked && m.key !== selectedKey}
                disableIdle
              />
            ))}
          </div>
        )
      )}
    </motion.section>
  );
}
