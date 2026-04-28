/**
 * Jobs theme — icon registry.
 *
 * 10 entries: 7 library icons (Lucide.Stethoscope/Cog,
 * Phosphor.GraduationCap/ChefHat/Tractor/Bread/Palette) and 3 custom
 * SVGs (Firefighter person, Police person, Driver wheel).
 *
 * Each profession is represented by a tool / glyph rather than a
 * generic "person" — except for firefighter and police, where the
 * Phase 2 lock-in chose to author dedicated person figures (with a
 * helmet and a peaked cap respectively) so the cards visibly read
 * "this person is doing this job", not "this is a vehicle".
 */

import type { ReactElement } from "react";
import { Stethoscope as LucideStethoscope, Cog as LucideCog, type LucideIcon } from "lucide-react";
import {
  GraduationCap as PhosphorGraduationCap,
  ChefHat as PhosphorChefHat,
  Tractor as PhosphorTractor,
  Bread as PhosphorBread,
  Palette as PhosphorPalette,
  type Icon as PhosphorIconComponent,
} from "@phosphor-icons/react";
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
/*  Custom SVG glyphs                                                         */
/* -------------------------------------------------------------------------- */

const Firefighter = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Helmet — wide brim with crest */}
    <path d="M7 13 Q 7 5 16 5 Q 25 5 25 13" />
    <path d="M5 13 L 27 13" />
    <path d="M14 5 L 14 9 L 18 9 L 18 5" />
    {/* Face */}
    <circle cx="16" cy="17" r="3.5" />
    {/* Body */}
    <path d="M9 28 L 9 22 Q 9 19 12 19 L 20 19 Q 23 19 23 22 L 23 28" />
    {/* Belt with hose buckle */}
    <path d="M9 24 L 23 24" strokeOpacity={0.45} />
    <circle cx="16" cy="24" r="1" fill={color} />
  </svg>
);

const Police = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Peaked cap */}
    <path d="M9 11 L 9 8 Q 9 5 16 5 Q 23 5 23 8 L 23 11" />
    <path d="M7 12 L 25 12" />
    {/* Cap badge */}
    <circle cx="16" cy="9" r="1" fill={color} />
    {/* Face */}
    <circle cx="16" cy="17" r="3.5" />
    {/* Body */}
    <path d="M9 28 L 9 22 Q 9 19 12 19 L 20 19 Q 23 19 23 22 L 23 28" />
    {/* Star badge on chest */}
    <path d="M14 23 L 16 22 L 18 23 L 18 25 L 16 26 L 14 25 Z" />
  </svg>
);

const Driver = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Outer wheel */}
    <circle cx="16" cy="16" r="11" />
    {/* Inner hub */}
    <circle cx="16" cy="16" r="2.5" />
    {/* Spokes (horizontal + 2 angled) */}
    <path d="M5 16 L 27 16" />
    <path d="M16 18.5 L 9 25" />
    <path d="M16 18.5 L 23 25" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const JOBS_ICONS: ThemeIconRegistry = {
  Doctor: lucide(LucideStethoscope, "#BAE6FD", "طَبِيبٌ"),
  Teacher: phosphor(PhosphorGraduationCap, "#DDD6FE", "مُعَلِّمٌ"),
  Firefighter: { renderGlyph: Firefighter, bgColor: "#FCA5A5", sizeRatio: 0.7, defaultLabel: "إِطْفَائِيٌّ" },
  Police: { renderGlyph: Police, bgColor: "#BFDBFE", sizeRatio: 0.7, defaultLabel: "شُرْطِيٌّ" },
  Chef: phosphor(PhosphorChefHat, "#F5F5F4", "طَبَّاخٌ"),
  Baker: phosphor(PhosphorBread, "#FED7AA", "خَبَّازٌ"),
  Artist: phosphor(PhosphorPalette, "#F0ABFC", "رَسَّامٌ"),
  Farmer: phosphor(PhosphorTractor, "#A7F3D0", "فَلَّاحٌ"),
  Engineer: lucide(LucideCog, "#C7D2FE", "مُهَنْدِسٌ"),
  Driver: { renderGlyph: Driver, bgColor: "#FDE68A", sizeRatio: 0.7, defaultLabel: "سَائِقٌ" },
};
