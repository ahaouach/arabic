"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import WordSelectionCard from "./WordSelectionCard";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import {
  generateRoundSeed,
  pickRandom,
  randomInt,
  shuffle,
} from "@/lib/utils/random";
import type {
  ArabicLetter,
  FindWordsZone as FindWordsZoneType,
  VocabularyWord,
} from "@/lib/types/alphabetLesson.types";

export interface FindWordsZoneProps {
  letter: ArabicLetter;
  /** Full vocab pool across all letters. */
  vocabulary: VocabularyWord[];
  zone: FindWordsZoneType;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Round {
  validKeys: Set<string>;
  cards: VocabularyWord[];
}

/** A word "contains the target letter" iff any of its `letters[].base` matches. */
function wordContainsLetter(w: VocabularyWord, letterChar: string): boolean {
  return w.letters.some((ll) => ll.base === letterChar);
}

function buildRound(
  letter: ArabicLetter,
  vocabulary: VocabularyWord[],
  zone: FindWordsZoneType,
  seed: number,
): Round | null {
  const valids = vocabulary.filter((w) => w.letterKey === letter.key);
  // Distractors: words belonging to OTHER letters that also don't contain the
  // target letter (defensive — some words may contain multiple target chars).
  const distractors = vocabulary.filter(
    (w) => w.letterKey !== letter.key && !wordContainsLetter(w, letter.char),
  );

  const maxValid = Math.min(zone.maxValid, valids.length, zone.totalCards - 1);
  const minValid = Math.min(zone.minValid, maxValid);
  if (maxValid < 1) return null;

  const validCount = randomInt(minValid, maxValid, seed);
  const distractorCount = Math.min(
    zone.totalCards - validCount,
    distractors.length,
  );
  if (distractorCount < 1) return null;

  const chosenValid = pickRandom(valids, validCount, seed + 1);
  const chosenDistractors = pickRandom(distractors, distractorCount, seed + 2);
  const cards = shuffle([...chosenValid, ...chosenDistractors], seed + 3);
  return { validKeys: new Set(chosenValid.map((w) => w.key)), cards };
}

export default function FindWordsZone({
  letter,
  vocabulary,
  zone,
  onComplete,
  onAdvance,
}: FindWordsZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const rounds = useMemo<Round[]>(() => {
    if (seed === null) return [];
    const out: Round[] = [];
    for (let i = 0; i < zone.rounds; i++) {
      const r = buildRound(letter, vocabulary, zone, seed + i * 1013);
      if (r) out.push(r);
    }
    return out;
  }, [letter, vocabulary, zone, seed]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [notified, setNotified] = useState(false);

  const total = rounds.length;
  const round = rounds[step];
  const finished = total > 0 && step >= total;

  const toggle = (k: string) => {
    if (revealed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const check = useCallback(() => {
    if (!round) return;
    const wrong = Array.from(selected).filter((k) => !round.validKeys.has(k));
    const missed = Array.from(round.validKeys).filter((k) => !selected.has(k));
    const perfect = wrong.length === 0 && missed.length === 0;
    setRevealed(true);
    if (perfect) {
      setScore((s) => s + 1);
      setFeedback("correct");
      playAudio(undefined, "أَحْسَنْتَ");
      window.setTimeout(() => {
        setSelected(new Set());
        setRevealed(false);
        setFeedback(null);
        setStep((s) => s + 1);
      }, 1300);
    } else {
      setFeedback("wrong");
      const msg =
        wrong.length > 0
          ? "بَعْضُ الِاخْتِيَارَاتِ غَيْرُ صَحِيحَةٍ"
          : "هُنَاكَ كَلِمَاتٌ لَمْ تَخْتَرْهَا";
      playAudio(undefined, msg);
    }
  }, [round, selected, playAudio]);

  const nextRound = () => {
    setSelected(new Set());
    setRevealed(false);
    setFeedback(null);
    setStep((s) => s + 1);
  };

  useEffect(() => {
    if (finished && !notified) {
      setNotified(true);
      onComplete?.({ correct: score, total });
    }
  }, [finished, notified, onComplete, score, total]);

  const replay = () => {
    setSeed(generateRoundSeed());
    setStep(0);
    setSelected(new Set());
    setRevealed(false);
    setFeedback(null);
    setScore(0);
    setNotified(false);
  };

  const cardStatus = (
    w: VocabularyWord,
  ): "idle" | "correct" | "wrong" | "missed" => {
    if (!round || !revealed) return "idle";
    const isValid = round.validKeys.has(w.key);
    const isPicked = selected.has(w.key);
    if (isValid && isPicked) return "correct";
    if (!isValid && isPicked) return "wrong";
    if (isValid && !isPicked) return "missed";
    return "idle";
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-fuchsia-50 via-white to-amber-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="alphabet-find-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="alphabet-find-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "اِبْحَثْ عَنْ كَلِمَاتٍ"}
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
        {!finished && round ? (
          <motion.div
            key={step}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            {/* Instruction */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <p
                lang="ar"
                dir="rtl"
                className="text-lg font-black text-gray-900 sm:text-xl"
                style={{
                  fontFamily:
                    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                }}
              >
                اِخْتَرْ كُلَّ الْكَلِمَاتِ الَّتِي تَحْتَوِي عَلَى حَرْفِ{" "}
                <span className="text-amber-600">{letter.char}</span>
              </p>
              <motion.button
                type="button"
                onClick={() => playAudio(undefined, letter.nameAr)}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                aria-label="Play the target letter"
                className="ms-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                🔊
              </motion.button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {round.cards.map((w, i) => (
                <WordSelectionCard
                  key={w.key}
                  word={w}
                  selected={selected.has(w.key)}
                  status={cardStatus(w)}
                  disabled={revealed}
                  onClick={() => toggle(w.key)}
                  index={i}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {!revealed ? (
                <button
                  type="button"
                  onClick={check}
                  disabled={selected.size === 0}
                  className="min-h-16 rounded-full bg-gradient-to-br from-fuchsia-400 to-rose-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  تَحَقَّقْ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextRound}
                  className="min-h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  تَابِعْ →
                </button>
              )}
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
                  إِنْهَاءُ الْحَرْفِ →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
