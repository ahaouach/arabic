/**
 * Emotions theme — icon registry.
 *
 * 8 entries: 4 library icons (Phosphor.Smiley/SmileySad, Lucide.Angry/
 * Laugh) and 4 custom face SVGs (Calm, Scared, Tired, Surprised). The
 * customs each follow the same template — round face outline + eyes +
 * mouth — so they read as one visual family alongside the Phosphor /
 * Lucide smileys.
 */

import type { ReactElement } from "react";
import { Smiley as PhosphorSmiley, SmileySad as PhosphorSmileySad, type Icon as PhosphorIconComponent } from "@phosphor-icons/react";
import { Angry as LucideAngry, Laugh as LucideLaugh, type LucideIcon } from "lucide-react";
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
/*  Custom face glyphs                                                        */
/*                                                                            */
/*  All four share the same circular face outline so they read as one         */
/*  family. Eyes / brows / mouth are what tell them apart.                    */
/* -------------------------------------------------------------------------- */

const Calm = ({ color, size }: GlyphArgs): ReactElement => (
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
    <circle cx="16" cy="16" r="11" />
    {/* Eyes — closed (gentle arcs) */}
    <path d="M10 14 Q 12 13 14 14" />
    <path d="M18 14 Q 20 13 22 14" />
    {/* Soft smile */}
    <path d="M11 21 Q 16 23 21 21" />
  </svg>
);

const Scared = ({ color, size }: GlyphArgs): ReactElement => (
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
    <circle cx="16" cy="16" r="11" />
    {/* Wide round eyes */}
    <circle cx="12" cy="14" r="1.6" />
    <circle cx="20" cy="14" r="1.6" />
    {/* Worried small mouth */}
    <path d="M13 22 Q 16 20 19 22" />
    {/* Sweat-drop hint at temple */}
    <path d="M24 13 Q 25 15 24 17 Q 23 15 24 13 Z" />
  </svg>
);

const Tired = ({ color, size }: GlyphArgs): ReactElement => (
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
    <circle cx="16" cy="16" r="11" />
    {/* Drooping eyelids */}
    <path d="M9 14 Q 12 16 14 14" />
    <path d="M18 14 Q 20 16 23 14" />
    {/* Small frown */}
    <path d="M12 22 Q 16 20 20 22" />
    {/* Sleep-z above head */}
    <path d="M22 7 L 25 7 L 22 10 L 25 10" strokeOpacity={0.6} />
  </svg>
);

const Surprised = ({ color, size }: GlyphArgs): ReactElement => (
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
    <circle cx="16" cy="16" r="11" />
    {/* Raised eyebrows */}
    <path d="M9 11 Q 11 9 14 10" />
    <path d="M18 10 Q 21 9 23 11" />
    {/* Round eyes */}
    <circle cx="12" cy="14" r="1.4" />
    <circle cx="20" cy="14" r="1.4" />
    {/* O-mouth */}
    <ellipse cx="16" cy="22" rx="2" ry="2.5" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const EMOTIONS_ICONS: ThemeIconRegistry = {
  Happy: phosphor(PhosphorSmiley, "#FCD34D", "سَعِيدٌ"),
  Excited: lucide(LucideLaugh, "#FB923C", "مُتَحَمِّسٌ"),
  Calm: { renderGlyph: Calm, bgColor: "#A7F3D0", sizeRatio: 0.7, defaultLabel: "هَادِئٌ" },
  Sad: phosphor(PhosphorSmileySad, "#BFDBFE", "حَزِينٌ"),
  Angry: lucide(LucideAngry, "#FCA5A5", "غَاضِبٌ"),
  Scared: { renderGlyph: Scared, bgColor: "#C4B5FD", sizeRatio: 0.7, defaultLabel: "خَائِفٌ" },
  Tired: { renderGlyph: Tired, bgColor: "#E5E7EB", sizeRatio: 0.7, defaultLabel: "مُتْعَبٌ" },
  Surprised: { renderGlyph: Surprised, bgColor: "#FDE68A", sizeRatio: 0.7, defaultLabel: "مُتَفَاجِئٌ" },
};
