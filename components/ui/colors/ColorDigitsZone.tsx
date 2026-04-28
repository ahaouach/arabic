"use client";

import { useMemo } from "react";
import ColorGlyphsZone, { type GlyphItem } from "./ColorGlyphsZone";
import type {
  ArabicColor,
  ColorDigitsZone as ColorDigitsZoneData,
} from "@/lib/types/colorsLesson.types";

export interface ColorDigitsZoneProps {
  colors: ArabicColor[];
  digits: number[];
  zone: ColorDigitsZoneData;
  onComplete?: (result: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}

// Western digits spoken in fully-vowelized Arabic — kept tiny and local
// (the numbers lesson already seeds these separately). Any digit missing
// here falls back to the glyph itself (safe, non-blocking).
const DIGIT_NAMES_AR: Record<string, string> = {
  "0": "صِفْرٌ",
  "1": "وَاحِدٌ",
  "2": "اِثْنَانِ",
  "3": "ثَلَاثَةٌ",
  "4": "أَرْبَعَةٌ",
  "5": "خَمْسَةٌ",
  "6": "سِتَّةٌ",
  "7": "سَبْعَةٌ",
  "8": "ثَمَانِيَةٌ",
  "9": "تِسْعَةٌ",
};

export default function ColorDigitsZone({
  colors,
  digits,
  zone,
  onComplete,
  onAdvance,
}: ColorDigitsZoneProps) {
  const pool = useMemo<GlyphItem[]>(
    () =>
      digits.map((d) => {
        const glyph = String(d);
        const arabicLabel = DIGIT_NAMES_AR[glyph] ?? glyph;
        return {
          key: glyph,
          glyph,
          arabicLabel,
          audioText: arabicLabel,
        };
      }),
    [digits],
  );

  return (
    <ColorGlyphsZone
      pool={pool}
      colors={colors}
      min={zone.minDigits}
      max={zone.maxDigits}
      variant="digit"
      title={zone.title ?? "لَوِّنِ الْأَرْقَامَ"}
      description={zone.description}
      instructionPrefix="لَوِّنِ الرَّقْمَ"
      wrongAudio="لَيْسَ هَذَا الرَّقْمَ"
      glyphAriaLabel={(item) => `الرَّقْمُ ${item.arabicLabel}`}
      onComplete={onComplete}
      onAdvance={onAdvance}
    />
  );
}
