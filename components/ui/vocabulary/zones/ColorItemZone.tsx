"use client";

/**
 * Zone 4 — Color the requested item.
 *
 * Row of N grey-outlined item cards. Instruction banner says e.g.
 * "Color the apple in red" + a colour chip. Tapping the correct card
 * fills its glyph with the instruction colour (via `fillColor`, which
 * the `VocabularyIcon` propagates to the icon stroke). Wrong tap →
 * shake; round stays open until the correct card is tapped.
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
import { generateRoundSeed, mulberry32, pickRandom, randomInt, shuffle } from "@/lib/utils/random";
import type {
  VocabColorItemZone,
  VocabularyItem,
} from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface ColorItemZoneProps {
  zone: VocabColorItemZone;
  theme: string;
  items: VocabularyItem[];
  colors: ArabicColor[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

interface Instruction {
  item: VocabularyItem;
  color: ArabicColor;
}

function generateInstructions(
  zone: VocabColorItemZone,
  items: VocabularyItem[],
  colors: ArabicColor[],
  seed: number,
): Instruction[] {
  const n = Math.min(
    randomInt(zone.minInstructions, zone.maxInstructions, seed),
    items.length,
    colors.length,
  );
  const rand = mulberry32(seed);
  const itemSeed = Math.floor(rand() * 0xffffffff);
  const colorSeed = Math.floor(rand() * 0xffffffff);
  const pickedItems = pickRandom(items, n, itemSeed);
  const pickedColors = pickRandom(colors, n, colorSeed);
  return pickedItems.map((item, i) => ({ item, color: pickedColors[i] }));
}

export default function ColorItemZone({
  zone,
  theme,
  items,
  colors,
  onComplete,
  onAdvance,
}: ColorItemZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const instructions = useMemo<Instruction[]>(
    () => (seed === null ? [] : generateInstructions(zone, items, colors, seed)),
    [zone, items, colors, seed],
  );

  // Display order shuffled vs. instruction order.
  const displayOrder = useMemo<VocabularyItem[]>(
    () => (seed === null ? [] : shuffle(instructions.map((i) => i.item), seed + 1)),
    [instructions, seed],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filledMap, setFilledMap] = useState<Record<string, string>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [finished, setFinished] = useState(false);

  const currentInstruction = instructions[currentIndex];

  const announceFinished = useCallback(() => {
    if (finished) return;
    setFinished(true);
    onComplete?.({ correct: instructions.length, total: instructions.length });
  }, [finished, onComplete, instructions.length]);

  const lastSpokenIndex = useRef<number | null>(null);
  useEffect(() => {
    if (!currentInstruction) return;
    if (lastSpokenIndex.current === currentIndex) return;
    lastSpokenIndex.current = currentIndex;
    const t = window.setTimeout(() => {
      playAudio(undefined, `${currentInstruction.item.audioText}، ${currentInstruction.color.audioText}`);
    }, 250);
    return () => window.clearTimeout(t);
  }, [currentInstruction, currentIndex, playAudio]);

  const replay = () => {
    if (!currentInstruction) return;
    playAudio(undefined, `${currentInstruction.item.audioText}، ${currentInstruction.color.audioText}`);
  };

  const handleTap = (it: VocabularyItem) => {
    if (!currentInstruction || finished) return;
    if (filledMap[it.key]) return;

    if (it.key === currentInstruction.item.key) {
      setFilledMap((prev) => ({ ...prev, [it.key]: currentInstruction.color.hex }));
      playAudio(it.audioUrl, it.audioText);
      setFeedback("correct");
      window.setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= instructions.length) {
          announceFinished();
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 900);
    } else {
      setWrongKey(it.key);
      setFeedback("wrong");
      window.setTimeout(() => {
        setWrongKey(null);
        setFeedback(null);
      }, 600);
    }
  };

  const statusFor = (it: VocabularyItem): VocabularyCardStatus => {
    if (filledMap[it.key]) return "correct";
    if (wrongKey === it.key) return "wrong";
    return "idle";
  };

  const title = zone.title ?? "لَوِّنِ الْكَلِمَةَ الْمَطْلُوبَةَ";
  const instructionTextAr = currentInstruction
    ? `لَوِّنْ ${currentInstruction.item.nameAr} بِاللَّوْنِ ${currentInstruction.color.nameAr}`
    : title;

  return (
    <motion.section
      aria-labelledby="vocab-color-item-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:py-10"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <header className="mb-4 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="vocab-color-item-title"
          className="text-3xl sm:text-4xl font-black text-gray-900"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {title}
        </h2>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ScoreTracker
          completed={Object.keys(filledMap).length}
          total={instructions.length}
          accent="emerald"
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
          subTextAr={`${currentIndex + 1} / ${instructions.length}`}
          colorChipHex={currentInstruction?.color.hex}
          onReplayAudio={replay}
          changeKey={currentIndex}
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
            <span>الْمِنْطَقَةُ التَّالِيَةُ</span>
          </motion.button>
        </div>
      ) : (
        <div
          className="grid gap-4 sm:gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(displayOrder.length, 5)}, minmax(0, 1fr))`,
          }}
        >
          {displayOrder.map((it, i) => (
            <VocabularyCard
              key={it.key}
              item={it}
              theme={theme}
              onClick={() => handleTap(it)}
              index={i}
              outlined={!filledMap[it.key]}
              fillColor={filledMap[it.key]}
              status={statusFor(it)}
              captionOverride={null}
              compact
              disableIdle
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
