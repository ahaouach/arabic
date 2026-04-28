"use client";

/**
 * Zone 5 — Color letters of the word.
 *
 * Reuses the alphabet's `LetterGlyph` and the seed's pre-split letters
 * so no runtime Unicode splitting happens. Each round picks 1-2 target
 * bases from the word's distinct base letters; the child colours every
 * occurrence of base 1, then base 2, then the round completes with a
 * full-word pronunciation.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LetterGlyph from "@/components/ui/alphabet/LetterGlyph";
import FeedbackOverlay, { type FeedbackKind } from "../shared/FeedbackOverlay";
import InstructionBanner from "../shared/InstructionBanner";
import ScoreTracker from "../shared/ScoreTracker";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, mulberry32, pickRandom, randomInt } from "@/lib/utils/random";
import type {
  VocabColorLettersZone,
  VocabularyWord,
  WordLetter,
} from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface ColorLettersZoneProps {
  zone: VocabColorLettersZone;
  words: VocabularyWord[];
  colors: ArabicColor[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

interface Target {
  base: string;
  name: string;
  color: ArabicColor;
}

interface Round {
  word: VocabularyWord;
  targets: Target[];
}

const AUTO_NEXT_ROUND_MS = 1000;

function distinctBases(letters: WordLetter[]): Array<{ base: string; name: string }> {
  const seen = new Set<string>();
  const out: Array<{ base: string; name: string }> = [];
  for (const l of letters) {
    if (seen.has(l.base)) continue;
    seen.add(l.base);
    out.push({ base: l.base, name: l.name });
  }
  return out;
}

function generateRounds(
  zone: VocabColorLettersZone,
  words: VocabularyWord[],
  colors: ArabicColor[],
  seed: number,
): Round[] {
  const rand = mulberry32(seed);
  const wordsByRound = pickRandom(words, zone.rounds, seed);
  while (wordsByRound.length < zone.rounds) {
    const more = pickRandom(
      words,
      Math.min(zone.rounds - wordsByRound.length, words.length),
      Math.floor(rand() * 0xffffffff),
    );
    wordsByRound.push(...more);
  }

  return wordsByRound.map((word, i) => {
    const bases = distinctBases(word.letters);
    const wantedTargets = randomInt(zone.minLettersToColor, zone.maxLettersToColor, seed + i);
    const n = Math.min(wantedTargets, bases.length, colors.length);
    const pickedBases = pickRandom(bases, n, seed + i * 31);
    const pickedColors = pickRandom(colors, n, seed + i * 31 + 11);
    return {
      word,
      targets: pickedBases.map((b, j) => ({
        base: b.base,
        name: b.name,
        color: pickedColors[j],
      })),
    };
  });
}

export default function ColorLettersZone({
  zone,
  words,
  colors,
  onComplete,
  onAdvance,
}: ColorLettersZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(
    () => (seed === null ? [] : generateRounds(zone, words, colors, seed)),
    [zone, words, colors, seed],
  );

  const [roundIndex, setRoundIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [filledIndices, setFilledIndices] = useState<Record<number, string>>({});
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [finished, setFinished] = useState(false);

  const round = rounds[roundIndex];
  const currentTarget = round?.targets[targetIndex] ?? null;

  const resetRoundLocalState = useCallback(() => {
    setTargetIndex(0);
    setFilledIndices({});
    setWrongIndex(null);
    setFeedback(null);
  }, []);

  const announceFinished = useCallback(() => {
    if (finished) return;
    setFinished(true);
    onComplete?.({ correct: rounds.length, total: rounds.length });
  }, [finished, onComplete, rounds.length]);

  const lastSpokenKey = useRef<string | null>(null);
  useEffect(() => {
    if (!currentTarget) return;
    const key = `${roundIndex}:${targetIndex}`;
    if (lastSpokenKey.current === key) return;
    lastSpokenKey.current = key;
    const t = window.setTimeout(() => {
      playAudio(undefined, `${currentTarget.name}، ${currentTarget.color.audioText}`);
    }, 250);
    return () => window.clearTimeout(t);
  }, [currentTarget, roundIndex, targetIndex, playAudio]);

  const replay = () => {
    if (!currentTarget) return;
    playAudio(undefined, `${currentTarget.name}، ${currentTarget.color.audioText}`);
  };

  const handleLetterTap = (letter: WordLetter, index: number) => {
    if (!round || !currentTarget || finished) return;
    if (filledIndices[index]) return;

    if (letter.base === currentTarget.base) {
      const nextFilled = { ...filledIndices, [index]: currentTarget.color.hex };
      setFilledIndices(nextFilled);
      playAudio(undefined, currentTarget.name);

      const remainingForTarget = round.word.letters.some(
        (l, i) => l.base === currentTarget.base && !nextFilled[i],
      );
      if (remainingForTarget) return;

      if (targetIndex + 1 < round.targets.length) {
        setTargetIndex((i) => i + 1);
        return;
      }

      setFeedback("correct");
      playAudio(undefined, round.word.word);
      window.setTimeout(() => {
        setFeedback(null);
        if (roundIndex + 1 >= rounds.length) {
          announceFinished();
        } else {
          setRoundIndex((i) => i + 1);
          resetRoundLocalState();
        }
      }, AUTO_NEXT_ROUND_MS);
    } else {
      setWrongIndex(index);
      setFeedback("wrong");
      window.setTimeout(() => {
        setWrongIndex(null);
        setFeedback(null);
      }, 600);
    }
  };

  const title = zone.title ?? "لَوِّنْ حُرُوفَ الْكَلِمَةِ";
  const instructionTextAr = currentTarget
    ? `لَوِّنْ حَرْفَ ${currentTarget.base} بِاللَّوْنِ ${currentTarget.color.nameAr}`
    : title;

  return (
    <motion.section
      aria-labelledby="vocab-color-letters-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-4xl px-4 py-6 sm:py-10"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <header className="mb-4 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="vocab-color-letters-title"
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
          textAr={instructionTextAr}
          subTextAr={round ? round.word.word : undefined}
          colorChipHex={currentTarget?.color.hex}
          onReplayAudio={replay}
          changeKey={`${roundIndex}:${targetIndex}`}
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
            <span>إِنْهَاءُ الدَّرْسِ</span>
          </motion.button>
        </div>
      ) : (
        round && (
          <div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            dir="rtl"
            lang="ar"
          >
            {round.word.letters.map((l, i) => (
              <LetterGlyph
                key={`${roundIndex}-${i}`}
                glyph={l.display}
                fill={filledIndices[i] ?? null}
                status={wrongIndex === i ? "wrong" : filledIndices[i] ? "correct" : "idle"}
                ariaLabel={l.name}
                onClick={() => handleLetterTap(l, i)}
                disabled={!!filledIndices[i]}
                index={i}
                size="lg"
              />
            ))}
          </div>
        )
      )}
    </motion.section>
  );
}
