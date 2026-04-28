/**
 * Vegetables theme — icon registry.
 *
 * 12 entries: 1 library icon (`Phosphor.Carrot`) and 11 custom SVGs.
 * Vegetables is the icon-library blind spot — Phosphor and Lucide both
 * carry a generic `Carrot` and not much else for produce, so the bulk
 * of this file is hand-rolled vector glyphs.
 *
 * All customs follow the same minimalist single-stroke aesthetic so
 * they read as one visual family alongside the Phosphor `Carrot`.
 */

import type { ReactElement } from "react";
import { Carrot as PhosphorCarrot, type Icon as PhosphorIconComponent } from "@phosphor-icons/react";
import type { ThemeIconRegistry, VocabularyIconConfig } from "./types";

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Custom SVG glyphs                                                         */
/* -------------------------------------------------------------------------- */

const Potato = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Lumpy potato body */}
    <path d="M9 18 C 7 14 11 8 16 8 C 22 8 26 12 26 18 C 26 24 22 26 16 25 C 12 24 11 22 9 18 Z" />
    {/* Eyes (3 dots) */}
    <circle cx="13" cy="15" r="0.8" fill={color} />
    <circle cx="20" cy="13" r="0.8" fill={color} />
    <circle cx="22" cy="20" r="0.8" fill={color} />
  </svg>
);

const Onion = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Stem (sprouting top) */}
    <path d="M14 5 L 16 9 L 18 5" />
    {/* Bulb */}
    <path d="M16 9 C 9 10 7 17 9 23 C 11 27 14 28 16 28 C 18 28 21 27 23 23 C 25 17 23 10 16 9 Z" />
    {/* Concentric layer arcs */}
    <path d="M11 19 C 13 22 19 22 21 19" strokeOpacity={0.4} />
    <path d="M13 14 Q 16 13 19 14" strokeOpacity={0.4} />
  </svg>
);

const Lettuce = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Outer leafy bunch */}
    <path d="M5 18 Q 8 8 16 8 Q 24 8 27 18" />
    {/* Layered leaves */}
    <path d="M7 18 Q 12 10 16 12 Q 20 10 25 18" />
    <path d="M10 19 Q 13 14 16 16 Q 19 14 22 19" />
    {/* Base */}
    <path d="M8 18 L 24 18 L 22 24 Q 16 27 10 24 Z" />
  </svg>
);

const Garlic = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Stem tuft */}
    <path d="M14 4 L 16 8 L 18 4" />
    {/* Bulb */}
    <path d="M16 8 C 10 9 8 16 10 23 C 12 27 14 28 16 28 C 18 28 20 27 22 23 C 24 16 22 9 16 8 Z" />
    {/* Clove division */}
    <path d="M16 8 L 16 28" strokeOpacity={0.5} />
    <path d="M11 14 Q 16 17 21 14" strokeOpacity={0.4} />
  </svg>
);

const Broccoli = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Florets — three bumpy clouds */}
    <path d="M8 12 A 4 4 0 0 1 13 8 A 4 4 0 0 1 18 8 A 4 4 0 0 1 23 8 A 4 4 0 0 1 25 14 L 8 14 Z" />
    {/* Stalk */}
    <path d="M12 14 L 12 26" />
    <path d="M16 14 L 16 26" />
    <path d="M20 14 L 20 26" />
    {/* Floret bumps */}
    <circle cx="13" cy="11" r="1" fill={color} />
    <circle cx="18" cy="10" r="1" fill={color} />
    <circle cx="22" cy="11" r="1" fill={color} />
  </svg>
);

const Tomato = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Round body */}
    <circle cx="16" cy="19" r="10" />
    {/* Star-shape green cap */}
    <path d="M16 9 L 13 6 M16 9 L 19 6 M16 9 L 11 8 M16 9 L 21 8" />
    <path d="M11 9 Q 13 11 16 11 Q 19 11 21 9 Q 19 13 16 13 Q 13 13 11 9 Z" />
  </svg>
);

const Cucumber = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Long oval cucumber, slight tilt */}
    <path d="M6 22 C 4 18 10 6 18 6 C 24 6 28 10 26 16 C 24 22 14 28 8 26 C 6 25 6 23 6 22 Z" />
    {/* Surface ridges */}
    <path d="M11 12 L 9 14" strokeOpacity={0.5} />
    <path d="M16 11 L 14 13" strokeOpacity={0.5} />
    <path d="M21 12 L 19 14" strokeOpacity={0.5} />
    <path d="M14 19 L 12 21" strokeOpacity={0.5} />
    <path d="M19 18 L 17 20" strokeOpacity={0.5} />
  </svg>
);

const Eggplant = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Stem cap leaves */}
    <path d="M13 5 L 15 9 M19 5 L 17 9 M16 4 L 16 9" />
    <path d="M12 8 Q 16 11 20 8" />
    {/* Teardrop body */}
    <path d="M16 9 C 11 10 7 16 9 22 C 11 27 16 29 20 27 C 25 24 25 16 22 11 C 20 9 18 9 16 9 Z" />
  </svg>
);

const Pepper = ({ color, size }: GlyphArgs): ReactElement => (
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
    <path d="M16 4 L 16 8" />
    {/* Calyx (leaves at top) */}
    <path d="M11 9 Q 16 11 21 9 Q 19 11 16 11 Q 13 11 11 9 Z" />
    {/* Bell pepper body — three lobes */}
    <path d="M9 11 C 8 16 8 22 11 26 C 14 28 18 28 21 26 C 24 22 24 16 23 11" />
    {/* Lobe lines */}
    <path d="M13 12 L 13 26" strokeOpacity={0.4} />
    <path d="M19 12 L 19 26" strokeOpacity={0.4} />
  </svg>
);

const Pumpkin = ({ color, size }: GlyphArgs): ReactElement => (
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
    <path d="M16 5 L 16 9" />
    {/* Curly vine */}
    <path d="M16 7 Q 18 5 20 6 Q 21 7 20 8" />
    {/* Pumpkin body — wide rounded with ridges */}
    <ellipse cx="16" cy="19" rx="11" ry="9" />
    {/* Ridge lines */}
    <path d="M10 11 Q 9 19 11 27" strokeOpacity={0.5} />
    <path d="M16 9 L 16 28" strokeOpacity={0.5} />
    <path d="M22 11 Q 23 19 21 27" strokeOpacity={0.5} />
  </svg>
);

const Corn = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Husk leaves on either side */}
    <path d="M9 9 Q 11 11 13 13 L 13 22 Q 11 22 9 20 Z" />
    <path d="M23 9 Q 21 11 19 13 L 19 22 Q 21 22 23 20 Z" />
    {/* Cob */}
    <path d="M13 8 C 13 7 19 7 19 8 L 19 26 C 19 27 13 27 13 26 Z" />
    {/* Kernels (cross-hatch) */}
    <path d="M13 12 L 19 12 M13 16 L 19 16 M13 20 L 19 20 M13 24 L 19 24" strokeOpacity={0.5} />
    <path d="M16 8 L 16 26" strokeOpacity={0.4} />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const VEGETABLES_ICONS: ThemeIconRegistry = {
  Carrot: phosphor(PhosphorCarrot, "#FB923C", "جَزَرٌ"),
  Potato: { renderGlyph: Potato, bgColor: "#FDE68A", sizeRatio: 0.65, defaultLabel: "بَطَاطَا" },
  Onion: { renderGlyph: Onion, bgColor: "#FECACA", sizeRatio: 0.65, defaultLabel: "بَصَلٌ" },
  Lettuce: { renderGlyph: Lettuce, bgColor: "#86EFAC", sizeRatio: 0.65, defaultLabel: "خَسٌّ" },
  Garlic: { renderGlyph: Garlic, bgColor: "#F5F5F4", sizeRatio: 0.65, defaultLabel: "ثَوْمٌ" },
  Broccoli: { renderGlyph: Broccoli, bgColor: "#6EE7B7", sizeRatio: 0.65, defaultLabel: "بُرُوكُلِي" },
  Tomato: { renderGlyph: Tomato, bgColor: "#F87171", sizeRatio: 0.65, defaultLabel: "طَمَاطِمُ" },
  Cucumber: { renderGlyph: Cucumber, bgColor: "#BBF7D0", sizeRatio: 0.65, defaultLabel: "خِيَارٌ" },
  Eggplant: { renderGlyph: Eggplant, bgColor: "#C4B5FD", sizeRatio: 0.65, defaultLabel: "بَاذِنْجَانٌ" },
  Pepper: { renderGlyph: Pepper, bgColor: "#DC2626", sizeRatio: 0.65, defaultLabel: "فِلْفِلٌ" },
  Pumpkin: { renderGlyph: Pumpkin, bgColor: "#FB923C", sizeRatio: 0.65, defaultLabel: "قَرْعٌ" },
  Corn: { renderGlyph: Corn, bgColor: "#FCD34D", sizeRatio: 0.65, defaultLabel: "ذُرَةٌ" },
};
