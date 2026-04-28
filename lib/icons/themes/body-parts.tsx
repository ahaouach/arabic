/**
 * Body parts theme — icon registry.
 *
 * 12 entries: 5 library icons (Phosphor Smiley/Eye/Ear/Hand/Footprints)
 * and 7 custom SVGs (Nose, Mouth, Arm, Leg, Finger, Hair, Tooth).
 *
 * Drawing notes for the customs:
 *   - Nose / mouth / arm / leg / finger / hair are anatomical line
 *     glyphs at 32×32, single-stroke.
 *   - Tooth is a friendly rounded molar — deliberately rounder than
 *     Phosphor's anatomical Tooth so it reads "kid friendly".
 */

import type { ReactElement } from "react";
import {
  Smiley as PhosphorSmiley,
  Eye as PhosphorEye,
  Ear as PhosphorEar,
  Hand as PhosphorHand,
  Footprints as PhosphorFootprints,
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

/* -------------------------------------------------------------------------- */
/*  Custom SVG glyphs                                                         */
/* -------------------------------------------------------------------------- */

const Nose = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Bridge */}
    <path d="M16 6 C 14 12 13 18 13 22 Q 13 25 16 25 Q 19 25 19 22 C 19 18 18 12 16 6 Z" />
    {/* Nostrils */}
    <path d="M14 23 Q 14 24 15 24" />
    <path d="M18 23 Q 18 24 17 24" />
  </svg>
);

const Mouth = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Upper lip */}
    <path d="M6 17 Q 10 12 13 14 Q 16 16 19 14 Q 22 12 26 17 Q 22 16 16 16 Q 10 16 6 17 Z" />
    {/* Lower lip */}
    <path d="M6 17 Q 10 24 16 24 Q 22 24 26 17" />
    {/* Centre line */}
    <path d="M6 17 L 26 17" strokeOpacity={0.4} />
  </svg>
);

const Arm = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Shoulder */}
    <circle cx="9" cy="9" r="3" />
    {/* Upper arm + bicep curve */}
    <path d="M11 11 Q 18 12 22 18" />
    <path d="M11 11 Q 16 16 22 18" />
    {/* Forearm */}
    <path d="M22 18 Q 21 24 20 28" />
    <path d="M22 18 Q 24 23 23 27" />
    {/* Hand suggestion */}
    <path d="M19 27 Q 21 29 24 27" />
  </svg>
);

const Leg = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Hip */}
    <path d="M14 4 L 18 4" />
    {/* Thigh */}
    <path d="M14 4 Q 13 12 16 18" />
    <path d="M18 4 Q 19 12 16 18" />
    {/* Knee */}
    <circle cx="16" cy="18" r="1.5" />
    {/* Shin */}
    <path d="M16 18 L 14 28" />
    <path d="M16 18 L 18 28" />
    {/* Foot */}
    <path d="M13 28 Q 18 30 19 28" />
  </svg>
);

const Finger = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Index finger pointing up */}
    <path d="M14 4 Q 14 2 16 2 Q 18 2 18 4 L 18 18 L 22 18 Q 24 18 24 21 L 24 26 Q 24 29 21 29 L 12 29 Q 10 29 10 26 L 10 20 Q 10 17 14 17 Z" />
    {/* Knuckle line */}
    <path d="M14 9 L 18 9" strokeOpacity={0.45} />
  </svg>
);

const Hair = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Forehead arc (head outline) */}
    <path d="M7 22 Q 7 14 16 12 Q 25 14 25 22" />
    {/* Wavy hair strands on top */}
    <path d="M8 14 Q 9 8 12 9 Q 13 5 16 7 Q 19 5 20 9 Q 23 8 24 14" />
    {/* Side strand */}
    <path d="M9 18 Q 6 22 8 26" />
    <path d="M23 18 Q 26 22 24 26" />
  </svg>
);

const Tooth = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Friendly rounded molar */}
    <path d="M9 7 Q 7 7 7 12 L 7 22 Q 7 26 10 28 Q 13 28 13 22 Q 13 19 16 19 Q 19 19 19 22 Q 19 28 22 28 Q 25 26 25 22 L 25 12 Q 25 7 23 7 Q 16 6 9 7 Z" />
    {/* Sparkle highlight */}
    <path d="M11 12 Q 12 14 12 16" strokeOpacity={0.45} />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const BODY_PARTS_ICONS: ThemeIconRegistry = {
  Head: phosphor(PhosphorSmiley, "#FECDD3", "رَأْسٌ"),
  Eye: phosphor(PhosphorEye, "#BAE6FD", "عَيْنٌ"),
  Ear: phosphor(PhosphorEar, "#FBCFE8", "أُذُنٌ"),
  Hand: phosphor(PhosphorHand, "#BFDBFE", "يَدٌ"),
  Foot: phosphor(PhosphorFootprints, "#A7F3D0", "قَدَمٌ"),
  Nose: { renderGlyph: Nose, bgColor: "#FED7AA", sizeRatio: 0.65, defaultLabel: "أَنْفٌ" },
  Mouth: { renderGlyph: Mouth, bgColor: "#FCA5A5", sizeRatio: 0.65, defaultLabel: "فَمٌ" },
  Arm: { renderGlyph: Arm, bgColor: "#DDD6FE", sizeRatio: 0.65, defaultLabel: "ذِرَاعٌ" },
  Leg: { renderGlyph: Leg, bgColor: "#C7D2FE", sizeRatio: 0.65, defaultLabel: "رِجْلٌ" },
  Finger: { renderGlyph: Finger, bgColor: "#FDE68A", sizeRatio: 0.65, defaultLabel: "إِصْبَعٌ" },
  Hair: { renderGlyph: Hair, bgColor: "#FED7AA", sizeRatio: 0.7, defaultLabel: "شَعْرٌ" },
  Tooth: { renderGlyph: Tooth, bgColor: "#F5F5F4", sizeRatio: 0.65, defaultLabel: "سِنٌّ" },
};
