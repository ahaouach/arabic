"use client";

import { useMemo } from "react";
import ColorGlyphsZone, { type GlyphItem } from "./ColorGlyphsZone";
import type {
  ArabicColor,
  ArabicLetter,
  ColorLettersZone as ColorLettersZoneData,
} from "@/lib/types/colorsLesson.types";

export interface ColorLettersZoneProps {
  colors: ArabicColor[];
  letters: ArabicLetter[];
  zone: ColorLettersZoneData;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

export default function ColorLettersZone({
  colors,
  letters,
  zone,
  onComplete,
  onAdvance,
}: ColorLettersZoneProps) {
  const pool = useMemo<GlyphItem[]>(
    () =>
      letters.map((l) => ({
        key: l.char,
        glyph: l.char,
        arabicLabel: l.nameAr,
        audioText: l.audioText,
        audioUrl: l.audioUrl,
      })),
    [letters],
  );

  return (
    <ColorGlyphsZone
      pool={pool}
      colors={colors}
      min={zone.minLetters}
      max={zone.maxLetters}
      variant="letter"
      title={zone.title ?? "لَوِّنِ الْحُرُوفَ"}
      description={zone.description}
      instructionPrefix="لَوِّنْ حَرْفَ"
      wrongAudio="لَيْسَ هَذَا الْحَرْفَ"
      glyphAriaLabel={(item) => `حَرْفُ ${item.arabicLabel}`}
      onComplete={onComplete}
      onAdvance={onAdvance}
    />
  );
}
