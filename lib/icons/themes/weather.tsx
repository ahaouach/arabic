/**
 * Weather theme — icon registry.
 *
 * 8 entries, all Lucide icons. Zero custom SVGs — Lucide ships a
 * complete meteorological set (`Sun`, `CloudRain`, `Cloud`,
 * `CloudSnow`, `Wind`, `CloudLightning`, `Rainbow`, `CloudFog`).
 */

import {
  Sun as LucideSun,
  CloudRain as LucideCloudRain,
  Cloud as LucideCloud,
  CloudSnow as LucideCloudSnow,
  Wind as LucideWind,
  CloudLightning as LucideCloudLightning,
  Rainbow as LucideRainbow,
  CloudFog as LucideCloudFog,
  type LucideIcon,
} from "lucide-react";
import type { ThemeIconRegistry, VocabularyIconConfig } from "./types";

function lucide(
  Icon: LucideIcon,
  bgColor: string,
  defaultLabel: string,
  sizeRatio = 0.55,
): VocabularyIconConfig {
  return {
    renderGlyph: ({ color, size }) => (
      <Icon color={color} size={size} strokeWidth={1.75} />
    ),
    bgColor,
    sizeRatio,
    defaultLabel,
  };
}

export const WEATHER_ICONS: ThemeIconRegistry = {
  Sun: lucide(LucideSun, "#FCD34D", "شَمْسٌ"),
  Rain: lucide(LucideCloudRain, "#BFDBFE", "مَطَرٌ"),
  Cloud: lucide(LucideCloud, "#F3F4F6", "غَيْمَةٌ"),
  Snow: lucide(LucideCloudSnow, "#BAE6FD", "ثَلْجٌ"),
  Wind: lucide(LucideWind, "#A7F3D0", "رِيحٌ"),
  Storm: lucide(LucideCloudLightning, "#C4B5FD", "عَاصِفَةٌ"),
  Rainbow: lucide(LucideRainbow, "#FBCFE8", "قَوْسُ قُزَحٍ"),
  Fog: lucide(LucideCloudFog, "#E5E7EB", "ضَبَابٌ"),
};
