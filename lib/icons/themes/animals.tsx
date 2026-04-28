/**
 * Animals theme — icon registry.
 *
 * 12 entries: 7 library icons (Phosphor.Cat/Dog/Rabbit/Cow/Horse/Fish/
 * Bird) and 5 custom SVGs (Sheep, Lion, Elephant, Monkey, Snake).
 * Phosphor doesn't ship glyphs for the wild-animal set, so the customs
 * cover lion/elephant/monkey/snake plus sheep (which falls between
 * Phosphor's Cow and the absence of a sheep-specific glyph).
 *
 * The new course lives at slug `animals` — leaves the existing
 * `animals-world` course (different pedagogy) untouched.
 */

import type { ReactElement } from "react";
import {
  Cat as PhosphorCat,
  Dog as PhosphorDog,
  Rabbit as PhosphorRabbit,
  Cow as PhosphorCow,
  Horse as PhosphorHorse,
  Fish as PhosphorFish,
  Bird as PhosphorBird,
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

const Sheep = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Fluffy wool — bumpy oval body */}
    <path d="M9 18 Q 7 14 9 12 Q 11 9 14 11 Q 16 9 19 11 Q 22 9 23 12 Q 26 13 25 17 Q 27 19 25 22 Q 26 25 22 25 L 11 25 Q 7 25 8 22 Q 6 19 9 18 Z" />
    {/* Face — small darker oval at front */}
    <ellipse cx="11" cy="16" rx="2.5" ry="2" />
    {/* Eye + nostril */}
    <circle cx="9.5" cy="15" r="0.5" fill={color} />
    <path d="M9 17 Q 10 17 10 17.5" strokeOpacity={0.55} />
    {/* Ears */}
    <path d="M11 14 Q 9 12 8 14" strokeOpacity={0.7} />
    {/* Legs */}
    <path d="M13 25 L 13 28" />
    <path d="M16 25 L 16 28" />
    <path d="M20 25 L 20 28" />
  </svg>
);

const Lion = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Mane — bumpy circle around the face */}
    <path d="M16 5 Q 10 5 8 8 Q 4 10 5 14 Q 4 17 6 19 Q 5 22 8 23 Q 11 26 16 26 Q 21 26 24 23 Q 27 22 26 19 Q 28 17 27 14 Q 28 10 24 8 Q 22 5 16 5 Z" />
    {/* Face */}
    <circle cx="16" cy="16" r="6" />
    {/* Eyes */}
    <circle cx="13.5" cy="14.5" r="0.7" fill={color} />
    <circle cx="18.5" cy="14.5" r="0.7" fill={color} />
    {/* Nose — small triangle */}
    <path d="M15 18 L 17 18 L 16 19 Z" fill={color} />
    {/* Mouth */}
    <path d="M16 19 L 16 20" />
    <path d="M14 21 Q 16 22 18 21" />
    {/* Whiskers */}
    <path d="M11 18 L 13 19" strokeOpacity={0.5} />
    <path d="M11 20 L 13 20" strokeOpacity={0.5} />
    <path d="M21 18 L 19 19" strokeOpacity={0.5} />
    <path d="M21 20 L 19 20" strokeOpacity={0.5} />
  </svg>
);

const Elephant = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Body — rounded blob */}
    <path d="M9 22 C 6 18 7 13 12 11 C 14 10 16 10 18 11 C 23 12 25 16 24 21 Q 24 25 21 25 L 11 25 Q 9 25 9 22 Z" />
    {/* Big floppy ear */}
    <path d="M11 12 Q 7 11 7 16 Q 7 19 10 20" />
    {/* Trunk — curving down then forward */}
    <path d="M22 18 Q 24 22 22 26 Q 21 28 23 28 Q 25 28 25 26" />
    {/* Eye */}
    <circle cx="14" cy="15" r="0.7" fill={color} />
    {/* Tail */}
    <path d="M9 22 Q 6 23 7 26" strokeOpacity={0.6} />
    {/* Legs */}
    <path d="M12 25 L 12 28" />
    <path d="M16 25 L 16 28" />
    <path d="M19 25 L 19 28" />
  </svg>
);

const Monkey = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Head */}
    <circle cx="16" cy="11" r="6" />
    {/* Face inner */}
    <path d="M11 12 Q 16 16 21 12" strokeOpacity={0.6} />
    {/* Ears */}
    <circle cx="9" cy="9" r="2" />
    <circle cx="23" cy="9" r="2" />
    {/* Eyes */}
    <circle cx="14" cy="10" r="0.7" fill={color} />
    <circle cx="18" cy="10" r="0.7" fill={color} />
    {/* Mouth — curve */}
    <path d="M14 13 Q 16 14 18 13" />
    {/* Body */}
    <path d="M11 17 L 13 22 L 19 22 L 21 17" />
    {/* Curled tail */}
    <path d="M21 22 Q 26 22 26 26 Q 26 29 23 29" />
    {/* Arms hanging */}
    <path d="M11 18 L 9 23" />
    <path d="M21 18 L 23 21" />
  </svg>
);

const Snake = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* S-curve body — outer line */}
    <path d="M5 25 Q 10 25 10 20 Q 10 14 16 14 Q 22 14 22 8 Q 22 4 27 4" />
    {/* S-curve body — inner line (parallel) */}
    <path d="M5 27 Q 12 27 12 20 Q 12 16 16 16 Q 20 16 20 8 Q 20 6 27 6" />
    {/* Head — slightly elongated */}
    <ellipse cx="27" cy="5" rx="2.5" ry="1.5" />
    {/* Eye */}
    <circle cx="28" cy="5" r="0.5" fill={color} />
    {/* Forked tongue */}
    <path d="M30 5 L 32 4 M30 5 L 32 6" strokeOpacity={0.7} />
    {/* Tail tip */}
    <path d="M5 25 L 3 26" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const ANIMALS_ICONS: ThemeIconRegistry = {
  Cat: phosphor(PhosphorCat, "#FED7AA", "قِطٌّ"),
  Dog: phosphor(PhosphorDog, "#FCD34D", "كَلْبٌ"),
  Rabbit: phosphor(PhosphorRabbit, "#FBCFE8", "أَرْنَبٌ"),
  Cow: phosphor(PhosphorCow, "#F5F5F4", "بَقَرَةٌ"),
  Horse: phosphor(PhosphorHorse, "#FED7AA", "حِصَانٌ"),
  Sheep: { renderGlyph: Sheep, bgColor: "#F3F4F6", sizeRatio: 0.7, defaultLabel: "خَرُوفٌ" },
  Lion: { renderGlyph: Lion, bgColor: "#FCD34D", sizeRatio: 0.7, defaultLabel: "أَسَدٌ" },
  Elephant: { renderGlyph: Elephant, bgColor: "#BFDBFE", sizeRatio: 0.7, defaultLabel: "فِيلٌ" },
  Monkey: { renderGlyph: Monkey, bgColor: "#FB923C", sizeRatio: 0.7, defaultLabel: "قِرْدٌ" },
  Snake: { renderGlyph: Snake, bgColor: "#A7F3D0", sizeRatio: 0.7, defaultLabel: "ثُعْبَانٌ" },
  Fish: phosphor(PhosphorFish, "#BAE6FD", "سَمَكَةٌ"),
  Bird: phosphor(PhosphorBird, "#C4B5FD", "عُصْفُورٌ"),
};
