/**
 * Clothes theme — icon registry.
 *
 * 10 entries: 6 library icons (Phosphor TShirt/Pants/Sneaker/Dress/
 * Sock/Eyeglasses) and 4 custom SVGs (Hat, Jacket, Scarf, Gloves).
 *
 * Per the Phase 2 lock-in, Hat is a custom round cap (instead of
 * Phosphor's `Beanie` which biases toward winter wear) so the glyph
 * reads as a generic `قُبَّعَةٌ` regardless of season.
 */

import type { ReactElement } from "react";
import {
  TShirt as PhosphorTShirt,
  Pants as PhosphorPants,
  Sneaker as PhosphorSneaker,
  Dress as PhosphorDress,
  Sock as PhosphorSock,
  Eyeglasses as PhosphorEyeglasses,
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

const Hat = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Crown — rounded dome */}
    <path d="M8 18 Q 8 8 16 8 Q 24 8 24 18 Z" />
    {/* Brim */}
    <path d="M5 18 L 27 18" />
    <path d="M5 18 Q 5 21 16 21 Q 27 21 27 18" />
    {/* Band */}
    <path d="M9 17 L 23 17" strokeOpacity={0.45} />
  </svg>
);

const Jacket = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Collar V-neck */}
    <path d="M11 6 L 16 11 L 21 6" />
    {/* Body — boxy with sleeves */}
    <path d="M11 6 L 6 9 L 6 16 L 9 17 L 9 27 L 23 27 L 23 17 L 26 16 L 26 9 L 21 6" />
    {/* Zip line down centre */}
    <path d="M16 11 L 16 27" strokeOpacity={0.5} />
    {/* Pocket lines */}
    <path d="M11 22 L 14 22" strokeOpacity={0.4} />
    <path d="M18 22 L 21 22" strokeOpacity={0.4} />
  </svg>
);

const Scarf = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Top loop around neck */}
    <path d="M9 8 Q 16 4 23 8" />
    {/* Left tail descending */}
    <path d="M9 8 Q 8 14 11 18 Q 9 22 12 27" />
    <path d="M14 8 Q 14 14 14 27" strokeOpacity={0.45} />
    {/* Right tail descending */}
    <path d="M23 8 Q 24 14 21 18 Q 23 22 20 27" />
    {/* Fringe */}
    <path d="M11 27 L 11 29 M13 27 L 13 29 M15 27 L 15 29" />
    <path d="M18 27 L 18 29 M20 27 L 20 29" />
  </svg>
);

const Gloves = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Mitten body */}
    <path d="M9 11 Q 9 7 14 7 L 22 7 Q 25 7 25 11 L 25 22 Q 25 26 21 26 L 14 26 Q 9 26 9 22 Z" />
    {/* Thumb */}
    <path d="M9 12 Q 5 13 5 17 Q 5 20 9 20" />
    {/* Cuff */}
    <path d="M9 22 L 25 22" strokeOpacity={0.5} />
    {/* Stitch line */}
    <path d="M16 8 L 16 21" strokeOpacity={0.35} />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const CLOTHES_ICONS: ThemeIconRegistry = {
  Shirt: phosphor(PhosphorTShirt, "#BFDBFE", "قَمِيصٌ"),
  Pants: phosphor(PhosphorPants, "#C7D2FE", "بَنْطَلُونٌ"),
  Shoes: phosphor(PhosphorSneaker, "#FED7AA", "حِذَاءٌ"),
  Dress: phosphor(PhosphorDress, "#FBCFE8", "فُسْتَانٌ"),
  Socks: phosphor(PhosphorSock, "#A7F3D0", "جَوْرَبٌ"),
  Glasses: phosphor(PhosphorEyeglasses, "#BAE6FD", "نَظَّارَةٌ"),
  Hat: { renderGlyph: Hat, bgColor: "#FECACA", sizeRatio: 0.65, defaultLabel: "قُبَّعَةٌ" },
  Jacket: { renderGlyph: Jacket, bgColor: "#DDD6FE", sizeRatio: 0.65, defaultLabel: "مِعْطَفٌ" },
  Scarf: { renderGlyph: Scarf, bgColor: "#FDA4AF", sizeRatio: 0.65, defaultLabel: "وِشَاحٌ" },
  Gloves: { renderGlyph: Gloves, bgColor: "#FEF08A", sizeRatio: 0.65, defaultLabel: "قُفَّازٌ" },
};
