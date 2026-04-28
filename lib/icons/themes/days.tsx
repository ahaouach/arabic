/**
 * Days theme — icon registry.
 *
 * 7 entries, all composed glyphs: `Phosphor.CalendarBlank` rendered
 * full-size with the day's ordinal digit (1-7) overlaid in the
 * centre. Sunday = 1, Monday = 2, …, Saturday = 7 — the digit
 * matches the position-in-week, not the etymology of the day name
 * (Friday/Saturday don't actually mean "sixth"/"seventh" — see seed
 * data for the etymology notes).
 *
 * The composition uses an absolutely-positioned <span> on top of the
 * calendar SVG. The same `color` prop drives both — so when Zone 4
 * sets `outlined=true` and the wrapper paints both the calendar and
 * the digit grey, the recolour is uniform.
 */

import type { ReactElement } from "react";
import { CalendarBlank as PhosphorCalendarBlank } from "@phosphor-icons/react";
import type { ThemeIconRegistry, VocabularyIconConfig } from "./types";

interface GlyphArgs {
  color: string;
  size: number;
}

/** Render the calendar with a centred ordinal digit. */
function makeDayGlyph(digit: string) {
  return ({ color, size }: GlyphArgs): ReactElement => (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <PhosphorCalendarBlank color={color} size={size} weight="regular" />
      <span
        style={{
          position: "absolute",
          color,
          fontSize: Math.round(size * 0.42),
          fontWeight: 800,
          fontFamily: '"Nunito", system-ui, sans-serif',
          // Calendar pad's body is offset slightly below the header strip,
          // so nudge the digit down for visual centring inside the pad.
          marginTop: Math.round(size * 0.08),
          lineHeight: 1,
          letterSpacing: 0,
          userSelect: "none",
        }}
      >
        {digit}
      </span>
    </div>
  );
}

function dayConfig(digit: string, bgColor: string, defaultLabel: string): VocabularyIconConfig {
  return {
    renderGlyph: makeDayGlyph(digit),
    bgColor,
    sizeRatio: 0.7,
    defaultLabel,
  };
}

export const DAYS_ICONS: ThemeIconRegistry = {
  Day1: dayConfig("1", "#FEF08A", "الْأَحَدُ"),
  Day2: dayConfig("2", "#BFDBFE", "الِاثْنَيْنِ"),
  Day3: dayConfig("3", "#A7F3D0", "الثُّلَاثَاءُ"),
  Day4: dayConfig("4", "#FED7AA", "الْأَرْبِعَاءُ"),
  Day5: dayConfig("5", "#DDD6FE", "الْخَمِيسُ"),
  Day6: dayConfig("6", "#FBCFE8", "الْجُمُعَةُ"),
  Day7: dayConfig("7", "#FDE68A", "السَّبْتُ"),
};
