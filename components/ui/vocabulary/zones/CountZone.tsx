"use client";

/**
 * Zone 3 — Count items in a scattered scene.
 *
 * Each round picks a target item + a count, fills the rest of the scene
 * with random distractors (sampled with replacement so the same scene
 * can have multiple of the same distractor — better discrimination).
 * A rejection-sampler scatters them so silhouettes never overlap.
 *
 * Two attempts; after two wrong answers the targets pulse briefly as a
 * hint and the round auto-advances without crediting — kids never get
 * stuck.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VocabularyRenderer from "../shared/VocabularyRenderer";
import FeedbackOverlay, { type FeedbackKind } from "../shared/FeedbackOverlay";
import InstructionBanner from "../shared/InstructionBanner";
import ScoreTracker from "../shared/ScoreTracker";
import NumberPad from "../shared/NumberPad";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, mulberry32, pickOne, randomInt } from "@/lib/utils/random";
import type {
  VocabCountZone,
  VocabularyItem,
} from "@/lib/types/vocabularyLesson.types";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface CountZoneProps {
  zone: VocabCountZone;
  theme: string;
  items: VocabularyItem[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

const SCENE_WIDTH = 640;
const SCENE_HEIGHT = 360;
const CHAR_SIZE = 80;
const MIN_SPACING = 70;

interface Placement {
  item: VocabularyItem;
  cx: number;
  cy: number;
}

interface Round {
  target: VocabularyItem;
  targetCount: number;
  placements: Placement[];
}

function layoutScene(sequence: VocabularyItem[], seed: number): Placement[] {
  const rand = mulberry32(seed);
  const placements: Placement[] = [];
  const minX = CHAR_SIZE / 2 + 12;
  const maxX = SCENE_WIDTH - CHAR_SIZE / 2 - 12;
  const minY = CHAR_SIZE / 2 + 12;
  const maxY = SCENE_HEIGHT - CHAR_SIZE / 2 - 12;
  const maxAttempts = sequence.length * 80;
  let attempts = 0;

  while (placements.length < sequence.length && attempts < maxAttempts) {
    const cx = minX + rand() * (maxX - minX);
    const cy = minY + rand() * (maxY - minY);
    const clash = placements.some((p) => {
      const dx = p.cx - cx;
      const dy = p.cy - cy;
      return dx * dx + dy * dy < MIN_SPACING * MIN_SPACING;
    });
    if (!clash) {
      placements.push({ item: sequence[placements.length], cx, cy });
    }
    attempts++;
  }
  return placements;
}

function generateRound(
  zone: VocabCountZone,
  items: VocabularyItem[],
  seed: number,
): Round {
  const target = pickOne(items, seed);
  const targetCount = randomInt(zone.minTargetCount, zone.maxTargetCount, seed + 1);
  const totalCharacters = randomInt(
    Math.max(zone.minTotalCharacters, targetCount + 2),
    zone.maxTotalCharacters,
    seed + 2,
  );
  const distractorsNeeded = Math.max(0, totalCharacters - targetCount);
  const distractorPool = items.filter((it) => it.key !== target.key);

  const rand = mulberry32(seed + 3);
  const sequence: VocabularyItem[] = [];
  for (let i = 0; i < targetCount; i++) sequence.push(target);
  for (let i = 0; i < distractorsNeeded; i++) {
    const idx = Math.floor(rand() * distractorPool.length);
    sequence.push(distractorPool[idx] ?? target);
  }
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }

  return {
    target,
    targetCount,
    placements: layoutScene(sequence, seed + 4),
  };
}

export default function CountZone({
  zone,
  theme,
  items,
  onComplete,
  onAdvance,
}: CountZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(() => {
    if (seed === null) return [];
    const rand = mulberry32(seed);
    return Array.from({ length: zone.rounds }, (_, i) =>
      generateRound(zone, items, Math.floor(rand() * 0xffffffff) + i),
    );
  }, [zone, items, seed]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [hintPulse, setHintPulse] = useState(false);
  const [finished, setFinished] = useState(false);

  const round = rounds[roundIndex];
  const questionAr = round ? `كَمْ ${round.target.nameAr} تَرَى؟` : "";

  const lastSpokenIndex = useRef<number | null>(null);
  useEffect(() => {
    if (!round) return;
    if (lastSpokenIndex.current === roundIndex) return;
    lastSpokenIndex.current = roundIndex;
    const t = window.setTimeout(() => playAudio(undefined, questionAr), 250);
    return () => window.clearTimeout(t);
  }, [round, roundIndex, questionAr, playAudio]);

  const replay = () => playAudio(undefined, questionAr);

  const announceFinished = useCallback(
    (finalCorrect: number) => {
      if (finished) return;
      setFinished(true);
      onComplete?.({ correct: finalCorrect, total: rounds.length });
    },
    [finished, onComplete, rounds.length],
  );

  const nextRound = useCallback(
    (final: number) => {
      if (roundIndex + 1 >= rounds.length) {
        announceFinished(final);
      } else {
        setRoundIndex((i) => i + 1);
        setAnswer("");
        setAttempts(0);
        setHintPulse(false);
      }
    },
    [roundIndex, rounds.length, announceFinished],
  );

  const handleSubmit = () => {
    if (!round || finished || !answer) return;
    const n = parseInt(answer, 10);
    if (Number.isNaN(n)) return;

    if (n === round.targetCount) {
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setFeedback("correct");
      playAudio(undefined, `أَحْسَنْتَ! ${n}`);
      window.setTimeout(() => {
        setFeedback(null);
        nextRound(nextCorrect);
      }, 1200);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback("wrong");
    window.setTimeout(() => setFeedback(null), 700);

    if (nextAttempts >= 2) {
      setHintPulse(true);
      window.setTimeout(() => {
        setHintPulse(false);
        setFeedback("hint");
        window.setTimeout(() => {
          setFeedback(null);
          nextRound(correctCount);
        }, 900);
      }, 1400);
    } else {
      setAnswer("");
    }
  };

  const pushDigit = (d: string) => {
    if (answer.length >= 2) return;
    setAnswer((a) => a + d);
  };
  const backspace = () => setAnswer((a) => a.slice(0, -1));
  const clear = () => setAnswer("");

  const title = zone.title ?? "عُدَّ الْأَشْيَاءَ";

  return (
    <motion.section
      aria-labelledby="vocab-count-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:py-10"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <header className="mb-4 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="vocab-count-title"
          className="text-3xl sm:text-4xl font-black text-gray-900"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {title}
        </h2>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ScoreTracker
          completed={roundIndex + (finished ? 1 : 0)}
          total={rounds.length}
          labelAr="الجَوْلَةُ"
          accent="sky"
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

      {!finished && (
        <InstructionBanner
          textAr={questionAr}
          subTextAr={attempts > 0 ? "حَاوِلْ مَرَّةً أُخْرَى" : undefined}
          onReplayAudio={replay}
          changeKey={roundIndex}
          className="mb-6"
        />
      )}

      {finished ? (
        <div className="flex flex-col items-center gap-4">
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
          <div className="flex flex-col items-center gap-6">
            <Scene
              theme={theme}
              round={round}
              hintPulse={hintPulse}
              prefersReducedMotion={!!prefersReducedMotion}
            />
            <NumberPad
              value={answer}
              onDigit={pushDigit}
              onBackspace={backspace}
              onClear={clear}
              onSubmit={handleSubmit}
            />
          </div>
        )
      )}
    </motion.section>
  );
}

function Scene({
  theme,
  round,
  hintPulse,
  prefersReducedMotion,
}: {
  theme: string;
  round: Round;
  hintPulse: boolean;
  prefersReducedMotion: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-sky-50 to-emerald-50 shadow-inner ring-1 ring-sky-100"
      style={{
        width: "100%",
        maxWidth: SCENE_WIDTH,
        aspectRatio: `${SCENE_WIDTH} / ${SCENE_HEIGHT}`,
      }}
      role="img"
      aria-label={`مَشْهَدٌ يَحْتَوِي عَلَى ${round.placements.length} عَنَاصِرَ`}
    >
      {round.placements.map((p, i) => {
        const isTarget = p.item.key === round.target.key;
        return (
          <motion.div
            key={`${i}-${p.item.key}`}
            className="absolute"
            style={{
              left: `${(p.cx / SCENE_WIDTH) * 100}%`,
              top: `${(p.cy / SCENE_HEIGHT) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={
              hintPulse && isTarget && !prefersReducedMotion
                ? {
                    scale: [1, 1.15, 1],
                    filter: [
                      "drop-shadow(0 0 0 rgba(0,0,0,0))",
                      "drop-shadow(0 0 14px #fbbf24)",
                      "drop-shadow(0 0 0 rgba(0,0,0,0))",
                    ],
                  }
                : undefined
            }
            transition={{ duration: 1.2, repeat: hintPulse && isTarget ? 1 : 0 }}
          >
            <VocabularyRenderer
              theme={theme}
              iconKey={p.item.iconKey}
              size={CHAR_SIZE}
              aria-label={p.item.nameAr}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
