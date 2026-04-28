/**
 * Fruits theme — icon registry.
 *
 * 12 entries: 7 library icons (Lucide.Apple/Banana/Cherry/Grape/Citrus,
 * Phosphor.Orange/Cherries) and 5 custom SVGs (Watermelon, Pear, Peach,
 * Pineapple, Mango). Each entry honours the contract in
 * `lib/icons/themes/types.ts` — `renderGlyph(color, size)` returns a
 * react element sized to fit inside `VocabularyIcon`'s pastel circle.
 *
 * The custom SVGs are intentionally minimalist (single-stroke, no fill)
 * so they sit cleanly alongside the Phosphor / Lucide line glyphs.
 * Stroke width 1.75 matches the family pattern.
 */

import type { ReactElement } from "react";
import {
  Apple as LucideApple,
  Banana as LucideBanana,
  Cherry as LucideCherry,
  Citrus as LucideCitrus,
  Grape as LucideGrape,
  type LucideIcon,
} from "lucide-react";
import { Orange as PhosphorOrange, Cherries as PhosphorCherries, type Icon as PhosphorIconComponent } from "@phosphor-icons/react";
import type { ThemeIconRegistry, VocabularyIconConfig } from "./types";

/* -------------------------------------------------------------------------- */
/*  Helper factories                                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Custom SVG glyphs                                                         */
/*                                                                            */
/*  All drawn inside a 32×32 viewBox with stroke-only paths so the same       */
/*  `color` prop drives both library and custom rendering uniformly.          */
/* -------------------------------------------------------------------------- */

interface GlyphArgs {
  color: string;
  size: number;
}

const Watermelon = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Half-slice silhouette */}
    <path d="M4 22 A 12 10 0 0 1 28 22 Z" />
    {/* Inner flesh boundary */}
    <path d="M5.5 22 A 10 8 0 0 1 26.5 22" />
    {/* Seeds */}
    <circle cx="11" cy="18.5" r="0.7" fill={color} />
    <circle cx="15" cy="16" r="0.7" fill={color} />
    <circle cx="19" cy="16" r="0.7" fill={color} />
    <circle cx="23" cy="18.5" r="0.7" fill={color} />
  </svg>
);

const Pear = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Leaf */}
    <path d="M16 7 Q 19 5 21 7 Q 18 8 16 8" />
    {/* Pear teardrop body */}
    <path d="M16 9 C 12 10 10 14 10 19 C 10 24 13 28 16 28 C 19 28 22 24 22 19 C 22 14 20 10 16 9 Z" />
  </svg>
);

const Peach = ({ color, size }: GlyphArgs): ReactElement => (
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
    <path d="M16 5 L 16 8" />
    {/* Leaf */}
    <path d="M16 6 Q 20 5 22 8 Q 19 9 16 8" />
    {/* Round body with central cleft */}
    <circle cx="16" cy="19" r="9" />
    <path d="M16 10 C 14 14 14 24 16 28" strokeOpacity={0.45} />
  </svg>
);

const Pineapple = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Crown leaves (3 fronds) */}
    <path d="M13 9 L 11 3" />
    <path d="M16 9 L 16 2" />
    <path d="M19 9 L 21 3" />
    {/* Body — oval */}
    <ellipse cx="16" cy="19" rx="7" ry="10" />
    {/* Diamond cross-hatch */}
    <path d="M11 14 L 16 18 L 21 14" strokeOpacity={0.5} />
    <path d="M11 19 L 16 23 L 21 19" strokeOpacity={0.5} />
    <path d="M11 24 L 16 27 L 21 24" strokeOpacity={0.5} />
  </svg>
);

const Mango = ({ color, size }: GlyphArgs): ReactElement => (
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
    <path d="M22 7 L 23 4" />
    {/* Mango asymmetric oval body */}
    <path d="M22 8 C 27 11 28 19 24 25 C 19 30 11 28 8 22 C 5 16 9 9 16 7 C 19 7 21 7 22 8 Z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const FRUITS_ICONS: ThemeIconRegistry = {
  Apple: lucide(LucideApple, "#FCA5A5", "تُفَّاحٌ"),
  Banana: lucide(LucideBanana, "#FEF08A", "مَوْزٌ"),
  Orange: phosphor(PhosphorOrange, "#FED7AA", "بُرْتُقَالٌ"),
  Strawberry: lucide(LucideCherry, "#FDA4AF", "فَرَاوِلَةٌ"),
  Grape: lucide(LucideGrape, "#DDD6FE", "عِنَبٌ"),
  Lemon: lucide(LucideCitrus, "#FEF3C7", "لَيْمُونٌ"),
  Fig: phosphor(PhosphorCherries, "#C4B5FD", "تِينٌ"),
  Watermelon: {
    renderGlyph: Watermelon,
    bgColor: "#BBF7D0",
    sizeRatio: 0.65,
    defaultLabel: "بِطِّيخٌ",
  },
  Pear: {
    renderGlyph: Pear,
    bgColor: "#D9F99D",
    sizeRatio: 0.65,
    defaultLabel: "كُمَّثْرَى",
  },
  Peach: {
    renderGlyph: Peach,
    bgColor: "#FECDD3",
    sizeRatio: 0.65,
    defaultLabel: "خَوْخٌ",
  },
  Pineapple: {
    renderGlyph: Pineapple,
    bgColor: "#FDE68A",
    sizeRatio: 0.65,
    defaultLabel: "أَنَانَاسٌ",
  },
  Mango: {
    renderGlyph: Mango,
    bgColor: "#FB923C",
    sizeRatio: 0.65,
    defaultLabel: "مَانْجُو",
  },
};
