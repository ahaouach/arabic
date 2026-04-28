/**
 * Whitelist registries of icon glyphs, grouped by theme.
 *
 * Each per-theme module (`./fruits`, `./vegetables`, …) exports a
 * `<Theme>_ICONS: ThemeIconRegistry` and is registered in
 * `THEME_REGISTRIES` below. Items in the DB use `iconKey` strings that
 * resolve against the matching theme's registry via
 * `resolveVocabularyIcon(theme, iconKey)`.
 *
 * Unknown (theme, iconKey) pairs return `null`; the renderer
 * (`VocabularyRenderer`) shows a soft grey placeholder instead of
 * crashing. This is the security boundary for the JSON-driven content
 * model — the registry is a whitelist, not a freeform import.
 */

import type { ThemeIconRegistry, VocabularyIconConfig } from "./types";
import { FRUITS_ICONS } from "./fruits";
import { VEGETABLES_ICONS } from "./vegetables";
import { BODY_PARTS_ICONS } from "./body-parts";
import { CLOTHES_ICONS } from "./clothes";
import { JOBS_ICONS } from "./jobs";
import { TRANSPORT_ICONS } from "./transport";
import { DAYS_ICONS } from "./days";
import { SEASONS_ICONS } from "./seasons";
import { WEATHER_ICONS } from "./weather";
import { EMOTIONS_ICONS } from "./emotions";
import { FOOD_ICONS } from "./food";
import { INSTRUMENTS_ICONS } from "./instruments";
import { ANIMALS_ICONS } from "./animals";

export const THEME_REGISTRIES: Record<string, ThemeIconRegistry> = {
  fruits: FRUITS_ICONS,
  vegetables: VEGETABLES_ICONS,
  "body-parts": BODY_PARTS_ICONS,
  clothes: CLOTHES_ICONS,
  jobs: JOBS_ICONS,
  transport: TRANSPORT_ICONS,
  days: DAYS_ICONS,
  seasons: SEASONS_ICONS,
  weather: WEATHER_ICONS,
  emotions: EMOTIONS_ICONS,
  food: FOOD_ICONS,
  instruments: INSTRUMENTS_ICONS,
  animals: ANIMALS_ICONS,
};

/** Safely resolve `(theme, iconKey)` to a config. Unknown → `null`. */
export function resolveVocabularyIcon(
  theme: string | undefined,
  iconKey: string | undefined,
): VocabularyIconConfig | null {
  if (!theme || !iconKey) return null;
  const registry = THEME_REGISTRIES[theme];
  return registry?.[iconKey] ?? null;
}

export type { ThemeIconRegistry, VocabularyIconConfig };
