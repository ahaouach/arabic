/**
 * Seasons theme — icon registry.
 *
 * 4 entries: 3 library icons (Phosphor.FlowerTulip / Sun / Snowflake)
 * and 1 custom SVG (Autumn — multi-tone falling leaf with stem and
 * vein detail; the generic Phosphor `Leaf` reads as evergreen, missing
 * autumn's signature shape and falling motion cue).
 */

import type { ReactElement } from "react";
import {
  FlowerTulip as PhosphorFlowerTulip,
  Sun as PhosphorSun,
  Snowflake as PhosphorSnowflake,
  type Icon as PhosphorIconComponent,
} from "@phosphor-icons/react";
import type { ThemeIconRegistry, VocabularyIconConfig } from "./types";

function phosphor(
  Icon: PhosphorIconComponent,
  bgColor: string,
  defaultLabel: string,
  sizeRatio = 0.55,
): VocabularyIconConfig {
  return {
    renderGlyph: ({ color, size }) => (
      <Icon color={color} size={size} weight="regular" />
    ),
    bgColor,
    sizeRatio,
    defaultLabel,
  };
}

interface GlyphArgs {
  color: string;
  size: number;
}

const Autumn = ({ color, size }: GlyphArgs): ReactElement => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke={color}
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {/* Stem */}
    <path d="M16 28 L 16 14" />
    {/* Maple-style leaf with five lobes */}
    <path d="M16 14 L 8 12 L 6 8 L 12 9 L 10 4 L 16 8 L 22 4 L 20 9 L 26 8 L 24 12 L 16 14 Z" />
    {/* Vein structure */}
    <path d="M16 13 L 12 9" strokeOpacity={0.5} />
    <path d="M16 13 L 20 9" strokeOpacity={0.5} />
    <path d="M16 13 L 9 11" strokeOpacity={0.45} />
    <path d="M16 13 L 23 11" strokeOpacity={0.45} />
  </svg>
);

export const SEASONS_ICONS: ThemeIconRegistry = {
  Spring: phosphor(PhosphorFlowerTulip, "#FBCFE8", "الرَّبِيعُ"),
  Summer: phosphor(PhosphorSun, "#FCD34D", "الصَّيْفُ"),
  Autumn: { renderGlyph: Autumn, bgColor: "#FB923C", sizeRatio: 0.7, defaultLabel: "الْخَرِيفُ" },
  Winter: phosphor(PhosphorSnowflake, "#BAE6FD", "الشِّتَاءُ"),
};
