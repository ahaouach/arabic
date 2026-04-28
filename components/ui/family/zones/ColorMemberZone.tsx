"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FamilyMemberCard, { type FamilyMemberCardStatus } from "../shared/FamilyMemberCard";
import FeedbackOverlay, { type FeedbackKind } from "../shared/FeedbackOverlay";
import InstructionBanner from "../shared/InstructionBanner";
import ScoreTracker from "../shared/ScoreTracker";
import { useAudio } from "@/lib/useAudio";
import { generateRoundSeed, mulberry32, pickRandom, randomInt, shuffle } from "@/lib/utils/random";
import type {
  FamilyColorMemberZone as FamilyColorMemberZoneType,
  FamilyMember,
} from "@/lib/types/familyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface ColorMemberZoneProps {
  zone: FamilyColorMemberZoneType;
  members: FamilyMember[];
  colors: ArabicColor[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

interface Instruction {
  member: FamilyMember;
  color: ArabicColor;
}

/**
 * Zone 5 — Color the family member.
 *
 * A row of N grey-outlined SVGs. An instruction banner says e.g.
 * "Color mom in red" + the colour chip. Tapping the correct character
 * fills its body/clothes region with the instruction colour (via the
 * `fillColor` prop that every family SVG honours). Wrong tap → shake +
 * "لَيْسَ هَذَا الْفَرْدَ".
 *
 * Rounds here = one instruction set (N pairs). Mission spec only
 * defines `min/maxInstructions` — we draw a single fresh set per
 * replay. If the author wants a multi-round session they can bump
 * `maxInstructions` (capped by the available member/colour count in
 * the schema's refinement).
 */
function generateInstructions(
  zone: FamilyColorMemberZoneType,
  members: FamilyMember[],
  colors: ArabicColor[],
  seed: number,
): Instruction[] {
  const n = Math.min(
    randomInt(zone.minInstructions, zone.maxInstructions, seed),
    members.length,
    colors.length,
  );
  const rand = mulberry32(seed);
  const memberSeed = Math.floor(rand() * 0xffffffff);
  const colorSeed = Math.floor(rand() * 0xffffffff);
  const pickedMembers = pickRandom(members, n, memberSeed);
  const pickedColors = pickRandom(colors, n, colorSeed);
  return pickedMembers.map((member, i) => ({ member, color: pickedColors[i] }));
}

export default function ColorMemberZone({
  zone,
  members,
  colors,
  onComplete,
  onAdvance,
}: ColorMemberZoneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  const instructions = useMemo<Instruction[]>(
    () => (seed === null ? [] : generateInstructions(zone, members, colors, seed)),
    [zone, members, colors, seed],
  );

  // Display order is shuffled vs. instruction order so kids have to pick
  // by appearance, not by position.
  const displayOrder = useMemo<FamilyMember[]>(
    () => (seed === null ? [] : shuffle(instructions.map((i) => i.member), seed + 1)),
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

  // Auto-play instruction audio on entry.
  const lastSpokenIndex = useRef<number | null>(null);
  useEffect(() => {
    if (!currentInstruction) return;
    if (lastSpokenIndex.current === currentIndex) return;
    lastSpokenIndex.current = currentIndex;
    const t = window.setTimeout(() => {
      // Voice the member + colour together. TTS handles the combined
      // Arabic cleanly (e.g. "أُمٌّ، أَحْمَرُ").
      playAudio(undefined, `${currentInstruction.member.audioText}، ${currentInstruction.color.audioText}`);
    }, 250);
    return () => window.clearTimeout(t);
  }, [currentInstruction, currentIndex, playAudio]);

  const replay = () => {
    if (!currentInstruction) return;
    playAudio(undefined, `${currentInstruction.member.audioText}، ${currentInstruction.color.audioText}`);
  };

  const handleTap = (m: FamilyMember) => {
    if (!currentInstruction || finished) return;
    if (filledMap[m.key]) return; // already coloured, ignore

    if (m.key === currentInstruction.member.key) {
      setFilledMap((prev) => ({ ...prev, [m.key]: currentInstruction.color.hex }));
      playAudio(m.audioUrl, m.audioText);
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
      setWrongKey(m.key);
      setFeedback("wrong");
      window.setTimeout(() => {
        setWrongKey(null);
        setFeedback(null);
      }, 600);
    }
  };

  const statusFor = (m: FamilyMember): FamilyMemberCardStatus => {
    if (filledMap[m.key]) return "correct";
    if (wrongKey === m.key) return "wrong";
    return "idle";
  };

  const title = zone.title ?? "لَوِّنِ الْفَرْدَ الْمَطْلُوبَ";
  const instructionTextAr = currentInstruction
    ? `لَوِّنْ ${currentInstruction.member.nameAr} بِاللَّوْنِ ${currentInstruction.color.nameAr}`
    : title;

  return (
    <motion.section
      aria-labelledby="family-color-member-title"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:py-10"
    >
      <FeedbackOverlay kind={feedback} onDismiss={() => setFeedback(null)} />

      <header className="mb-4 flex flex-col items-center gap-2 text-center" dir="rtl" lang="ar">
        <h2
          id="family-color-member-title"
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
          {displayOrder.map((m, i) => (
            <FamilyMemberCard
              key={m.key}
              member={m}
              onClick={() => handleTap(m)}
              index={i}
              outlined={!filledMap[m.key]}
              fillColor={filledMap[m.key]}
              status={statusFor(m)}
              captionOverride={null}
              compact
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
