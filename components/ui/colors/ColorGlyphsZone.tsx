"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import ColorableGlyph from "./ColorableGlyph";
import InstructionBanner from "./InstructionBanner";
import ReplayButton from "./ReplayButton";
import FeedbackOverlay from "@/components/ui/numbers/FeedbackOverlay";
import { useAudio } from "@/lib/useAudio";
import {
  generateRoundSeed,
  pickRandom,
  randomInt,
  shuffle,
} from "@/lib/utils/random";
import type { ArabicColor } from "@/lib/types/colorsLesson.types";

/**
 * Shared orchestrator for "colour the digits" and "colour the letters".
 *
 * Both zones follow the same loop:
 *   1. Pick `N` random items from the pool (N ∈ [min, max]).
 *   2. Pick `N` random colours from the palette.
 *   3. Pair them → an ordered list of instructions.
 *   4. Display the items on screen (positions shuffled independently).
 *   5. Child taps the item matching the active instruction → fill + next.
 *   6. All done → completion screen with replay / advance.
 */

export interface GlyphItem {
  /** Unique identifier used for lookup, e.g. `"3"` or `"س"`. */
  key: string;
  /** Displayed glyph. Same as `key` for digits; same as `key` for letters. */
  glyph: string;
  /** Fully-vowelized Arabic label read aloud (e.g. `"ثَلَاثَةٌ"`). */
  arabicLabel: string;
  /** Audio text for the glyph itself (e.g. `"ثَلَاثَةٌ"` or `"سِينٌ"`). */
  audioText: string;
  /** Optional internal MP3 path. */
  audioUrl?: string;
}

export interface ColorGlyphsZoneProps {
  /** Pool of items to pick from. */
  pool: GlyphItem[];
  /** Palette available for colouring. */
  colors: ArabicColor[];
  /** Items pick count — between min and max, both inclusive. */
  min: number;
  max: number;
  /** LTR + Nunito for digits, RTL + Amiri for letters. */
  variant: "digit" | "letter";
  /** Zone title (vowelized). */
  title: string;
  /** Optional vowelized description. */
  description?: string;
  /** Prefix for the instruction — e.g. `"لَوِّنِ الرَّقْمَ"` or `"لَوِّنْ حَرْفَ"`. */
  instructionPrefix: string;
  /** Wrong-tap audio fallback — e.g. `"لَيْسَ هَذَا الرَّقْمَ"`. */
  wrongAudio: string;
  /** ARIA label formatter for a pool item, e.g. `(it) => "الرَّقْمُ 3"`. */
  glyphAriaLabel: (item: GlyphItem) => string;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

interface Instruction {
  item: GlyphItem;
  color: ArabicColor;
}

interface Round {
  instructions: Instruction[];
  /** The items in screen order (different from instruction order). */
  layout: GlyphItem[];
}

function buildRound(
  pool: GlyphItem[],
  colors: ArabicColor[],
  min: number,
  max: number,
  seed: number,
): Round {
  const n = Math.min(
    randomInt(min, max, seed),
    pool.length,
    colors.length,
  );
  const items = pickRandom(pool, n, seed + 1);
  const chosenColors = pickRandom(colors, n, seed + 2);
  const instructions: Instruction[] = items.map((item, i) => ({
    item,
    color: chosenColors[i],
  }));
  const layout = shuffle(items, seed + 3);
  return { instructions, layout };
}

export default function ColorGlyphsZone({
  pool,
  colors,
  min,
  max,
  variant,
  title,
  description,
  instructionPrefix,
  wrongAudio,
  glyphAriaLabel,
  onComplete,
  onAdvance,
}: ColorGlyphsZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const round = useMemo<Round | null>(
    () => (seed === null ? null : buildRound(pool, colors, min, max, seed)),
    [pool, colors, min, max, seed],
  );

  const [doneKeys, setDoneKeys] = useState<Set<string>>(new Set());
  const [fillByKey, setFillByKey] = useState<Record<string, string>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [notified, setNotified] = useState(false);

  // Active instruction = first unfinished in order.
  const activeIndex = useMemo(() => {
    if (!round) return -1;
    return round.instructions.findIndex((inst) => !doneKeys.has(inst.item.key));
  }, [round, doneKeys]);

  const total = round?.instructions.length ?? 0;
  const allDone = total > 0 && doneKeys.size === total;

  useEffect(() => {
    if (allDone && !notified) {
      setNotified(true);
      onComplete?.({ correct: total, total });
    }
  }, [allDone, notified, onComplete, total]);

  const onTapGlyph = useCallback(
    (key: string) => {
      if (!round || allDone) return;
      if (doneKeys.has(key)) return;
      const active = round.instructions[activeIndex];
      if (!active) return;

      if (active.item.key === key) {
        setFillByKey((prev) => ({ ...prev, [key]: active.color.hex }));
        setDoneKeys((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
        setFeedback("correct");
        // Reinforce with the glyph's own Arabic name (tilde-ideal for learning).
        playAudio(active.item.audioUrl, active.item.audioText);
      } else {
        setWrongKey(key);
        setFeedback("wrong");
        playAudio(undefined, wrongAudio);
        window.setTimeout(() => setWrongKey(null), 600);
      }
    },
    [round, allDone, activeIndex, doneKeys, playAudio, wrongAudio],
  );

  const playInstruction = useCallback(
    (idx: number) => {
      if (!round) return;
      const inst = round.instructions[idx];
      if (!inst) return;
      playAudio(inst.color.audioUrl, inst.color.audioText);
    },
    [round, playAudio],
  );

  const replay = () => {
    setSeed(generateRoundSeed());
    setDoneKeys(new Set());
    setFillByKey({});
    setWrongKey(null);
    setFeedback(null);
    setNotified(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="colors-glyphs-title"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="colors-glyphs-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {description}
            </p>
          )}
        </div>
        <div
          aria-live="polite"
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          <span aria-hidden>⭐</span>
          <span className="tabular-nums">
            {doneKeys.size} / {total || 0}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {round && !allDone ? (
          <motion.div
            key={seed ?? "round"}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid gap-6 lg:grid-cols-[1fr_22rem]"
          >
            {/* Glyph canvas */}
            <div
              className="flex min-h-64 flex-wrap items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-inner ring-1 ring-black/5"
              dir={variant === "letter" ? "rtl" : "ltr"}
            >
              {round.layout.map((item, i) => {
                const isDone = doneKeys.has(item.key);
                const isWrong = wrongKey === item.key;
                const activeItem =
                  activeIndex >= 0 ? round.instructions[activeIndex]?.item : null;
                const isActive = activeItem?.key === item.key;

                return (
                  <ColorableGlyph
                    key={item.key}
                    glyph={item.glyph}
                    variant={variant}
                    fill={fillByKey[item.key] ?? null}
                    status={isWrong ? "wrong" : isDone ? "correct" : "idle"}
                    disabled={isDone}
                    index={i}
                    ariaLabel={
                      isActive
                        ? `${glyphAriaLabel(item)} — tap me`
                        : glyphAriaLabel(item)
                    }
                    onClick={() => onTapGlyph(item.key)}
                  />
                );
              })}
            </div>

            {/* Instructions rail */}
            <div className="flex flex-col gap-3">
              {round.instructions.map((inst, i) => (
                <InstructionBanner
                  key={`${inst.item.key}-${i}`}
                  color={inst.color}
                  prefixAr={instructionPrefix}
                  targetArabicLabel={inst.item.arabicLabel}
                  targetDisplay={inst.item.glyph}
                  active={i === activeIndex}
                  done={doneKeys.has(inst.item.key)}
                  onPlay={i === activeIndex ? () => playInstruction(i) : undefined}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <motion.div
              aria-hidden
              animate={prefersReducedMotion ? undefined : { rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              🏆
            </motion.div>
            <p
              className="mt-3 text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ! لَقَدْ لَوَّنْتَ كُلَّ شَيْءٍ!
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

      {/* Persistent replay under the round (before completion) */}
      {round && !allDone && (
        <div className="mt-6 flex items-center justify-center">
          <ReplayButton onClick={replay} size="sm" label="أَعِدْ مَرَّةً أُخْرَى" />
        </div>
      )}
    </section>
  );
}
