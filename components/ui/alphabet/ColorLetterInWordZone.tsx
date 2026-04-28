"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import LetterGlyph from "./LetterGlyph";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, shuffle } from "@/lib/utils/random";
import type {
  ArabicLetter,
  ColorLetterInWordZone as ColorLetterInWordZoneType,
  VocabularyWord,
} from "@/lib/types/alphabetLesson.types";

export interface ColorLetterInWordZoneProps {
  letter: ArabicLetter;
  vocabulary: VocabularyWord[];
  zone: ColorLetterInWordZoneType;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

const TARGET_FILL = "#2563EB"; // cheerful blue

function pickWords(
  pool: VocabularyWord[],
  rounds: number,
  seed: number,
): VocabularyWord[] {
  if (pool.length === 0) return [];
  const out: VocabularyWord[] = [];
  let remaining = shuffle(pool, seed);
  while (out.length < rounds) {
    if (remaining.length === 0) remaining = shuffle(pool, seed + out.length);
    const next = remaining.pop();
    if (next) out.push(next);
  }
  return out;
}

export default function ColorLetterInWordZone({
  letter,
  vocabulary,
  zone,
  onComplete,
  onAdvance,
}: ColorLetterInWordZoneProps) {
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

  const rounds = useMemo<VocabularyWord[]>(() => {
    if (seed === null || pool.length === 0) return [];
    return pickWords(pool, zone.rounds, seed);
  }, [pool, zone.rounds, seed]);

  const [step, setStep] = useState(0);
  const [donePositions, setDonePositions] = useState<Set<number>>(new Set());
  const [wrongPosition, setWrongPosition] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [notified, setNotified] = useState(false);

  const word = rounds[step];
  const total = rounds.length;
  const finished = total > 0 && step >= total;

  const targetPositions = useMemo(
    () =>
      word
        ? new Set(
            word.letters
              .map((ll, i) => (ll.isTarget ? i : -1))
              .filter((i) => i >= 0),
          )
        : new Set<number>(),
    [word],
  );

  const allDoneInRound =
    word && donePositions.size >= targetPositions.size && targetPositions.size > 0;

  useEffect(() => {
    if (!word || !allDoneInRound) return;
    setScore((s) => s + 1);
    playAudio(word.audioUrl, word.audioText);
    const id = window.setTimeout(() => {
      setDonePositions(new Set());
      setWrongPosition(null);
      setStep((s) => s + 1);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [word, allDoneInRound, playAudio]);

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  }, [finished, notified, onComplete, score, total]);

  const onTap = useCallback(
    (position: number) => {
      if (!word) return;
      if (donePositions.has(position)) return;
      const ll = word.letters[position];
      if (ll.isTarget) {
        setDonePositions((prev) => {
          const next = new Set(prev);
          next.add(position);
          return next;
        });
        setFeedback("correct");
        playAudio(undefined, letter.nameAr);
      } else {
        setWrongPosition(position);
        setFeedback("wrong");
        playAudio(undefined, "لَيْسَ هَذَا الْحَرْفَ");
        window.setTimeout(() => setWrongPosition(null), 600);
      }
    },
    [word, donePositions, letter.nameAr, playAudio],
  );

  const replay = () => {
    setSeed(generateRoundSeed());
    setStep(0);
    setDonePositions(new Set());
    setWrongPosition(null);
    setFeedback(null);
    setScore(0);
    setNotified(false);
  };

  if (pool.length === 0) {
    return (
      <section
        className="rounded-[32px] bg-white p-8 text-center shadow-lg ring-1 ring-black/5"
        lang="ar"
        dir="rtl"
      >
        <p
          className="text-base text-gray-600"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          لَا تُوجَدُ مُفْرَدَاتٌ لِهَذَا الْحَرْفِ بَعْدُ.
        </p>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="alphabet-color-in-word-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="alphabet-color-in-word-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "لَوِّنِ الْحَرْفَ فِي الْكَلِمَةِ"}
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
          {finished ? (
            <>
              <span aria-hidden>⭐</span>
              <span className="tabular-nums">
                {score} / {total}
              </span>
            </>
          ) : (
            <span className="tabular-nums">
              {step + 1} / {total || zone.rounds}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!finished && word ? (
          <motion.div
            key={step}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <span className="text-6xl" aria-hidden>
                {word.emoji}
              </span>
              <p
                lang="ar"
                dir="rtl"
                className="text-lg font-black text-gray-900 sm:text-xl"
                style={{
                  fontFamily:
                    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                }}
              >
                لَوِّنْ حَرْفَ{" "}
                <span className="text-amber-600">{letter.char}</span> فِي كَلِمَةِ{" "}
                <span>{word.word}</span>
              </p>
              <motion.button
                type="button"
                onClick={() => playAudio(word.audioUrl, word.audioText)}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                aria-label="Play the word"
                className="ms-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                🔊
              </motion.button>
            </div>

            <div
              className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white p-6 shadow-inner ring-1 ring-black/5"
              dir="rtl"
              lang="ar"
              role="group"
              aria-label={`Letters of ${word.word}`}
            >
              {word.letters.map((ll, position) => {
                const isDone = donePositions.has(position);
                const isWrong = wrongPosition === position;
                const status: "idle" | "correct" | "wrong" = isWrong
                  ? "wrong"
                  : isDone
                    ? "correct"
                    : "idle";
                return (
                  <LetterGlyph
                    key={position}
                    glyph={ll.display}
                    fill={isDone ? TARGET_FILL : null}
                    status={status}
                    disabled={isDone}
                    ariaLabel={`حَرْفٌ ${ll.base}`}
                    onClick={() => onTap(position)}
                    index={position}
                    size="lg"
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
              {score === total ? "🏆" : score > 0 ? "🌟" : "💪"}
            </div>
            <p className="mt-3 text-2xl font-black text-gray-900 tabular-nums">
              {score} / {total}
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
                  الْمِنْطَقَةُ التَّالِيَةُ →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
