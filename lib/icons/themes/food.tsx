/**
 * Food theme — icon registry.
 *
 * 12 entries: 7 library icons (Phosphor.Bread/Pizza/Cheese/Cake/Cookie,
 * Lucide.Soup/GlassWater) and 5 custom SVGs (Rice, Pasta, Milk, Juice,
 * Honey). The customs cover items the libraries don't render — a bowl
 * of rice, a spaghetti curl, a milk bottle, a juice glass, and a honey
 * jar with a dipper.
 */

import type { ReactElement } from "react";
import {
  Bread as PhosphorBread,
  Pizza as PhosphorPizza,
  Cheese as PhosphorCheese,
  Cake as PhosphorCake,
  Cookie as PhosphorCookie,
  type Icon as PhosphorIconComponent,
} from "@phosphor-icons/react";
import { Soup as LucideSoup, GlassWater as LucideGlassWater, type LucideIcon } from "lucide-react";
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

const Rice = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Bowl */}
    <path d="M5 16 L 27 16 Q 26 26 16 26 Q 6 26 5 16 Z" />
    <path d="M3 16 L 29 16" />
    {/* Rice grains piled inside */}
    <ellipse cx="11" cy="14" rx="1.2" ry="0.6" fill={color} />
    <ellipse cx="14" cy="13" rx="1.2" ry="0.6" fill={color} />
    <ellipse cx="17" cy="12.5" rx="1.2" ry="0.6" fill={color} />
    <ellipse cx="20" cy="13.5" rx="1.2" ry="0.6" fill={color} />
    <ellipse cx="13" cy="11" rx="1.2" ry="0.6" fill={color} />
    <ellipse cx="18" cy="10" rx="1.2" ry="0.6" fill={color} />
    {/* Steam */}
    <path d="M10 9 Q 10 5 12 7" strokeOpacity={0.5} />
    <path d="M16 7 Q 16 3 18 5" strokeOpacity={0.5} />
    <path d="M21 9 Q 21 5 23 7" strokeOpacity={0.5} />
  </svg>
);

const Pasta = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Plate */}
    <ellipse cx="16" cy="22" rx="11" ry="3.5" />
    <path d="M5 22 Q 5 26 16 26 Q 27 26 27 22" />
    {/* Spaghetti curls */}
    <path d="M9 19 Q 12 15 14 18 Q 16 22 18 17 Q 20 13 22 18" />
    <path d="M8 21 Q 12 17 15 20 Q 18 23 21 19 Q 24 16 25 21" strokeOpacity={0.7} />
    <path d="M10 17 Q 14 13 17 16 Q 20 19 23 16" strokeOpacity={0.5} />
    {/* Fork over the side */}
    <path d="M22 13 L 24 8" />
    <path d="M22 13 L 23 12 M22 13 L 24 12 M22 13 L 25 13" strokeOpacity={0.6} />
  </svg>
);

const Milk = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Bottle neck */}
    <path d="M13 4 L 19 4 L 19 7 L 13 7 Z" />
    {/* Bottle shoulder */}
    <path d="M13 7 L 11 11 L 11 26 Q 11 28 13 28 L 19 28 Q 21 28 21 26 L 21 11 L 19 7" />
    {/* Label band */}
    <path d="M11 16 L 21 16" strokeOpacity={0.5} />
    <path d="M11 21 L 21 21" strokeOpacity={0.5} />
    {/* Drop on label */}
    <path d="M14 18 Q 14 20 16 20 Q 18 20 18 18 Q 18 17 16 17 Q 14 17 14 18 Z" strokeOpacity={0.6} />
  </svg>
);

const Juice = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Glass — tapered tumbler */}
    <path d="M9 7 L 23 7 L 21 27 Q 21 28 19 28 L 13 28 Q 11 28 11 27 Z" />
    {/* Liquid level line */}
    <path d="M10 12 Q 16 13 22 12" strokeOpacity={0.5} />
    {/* Straw poking out */}
    <path d="M18 4 L 18 18" />
    <path d="M18 4 L 21 4" />
    {/* Lemon slice on rim */}
    <path d="M9 7 Q 7 5 9 4 Q 11 4 11 6" />
    <path d="M9 5 L 10 6" strokeOpacity={0.5} />
  </svg>
);

const Honey = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Lid */}
    <path d="M9 9 L 23 9 L 23 12 L 9 12 Z" />
    {/* Jar body */}
    <path d="M10 12 L 22 12 L 23 27 Q 23 28 21 28 L 11 28 Q 9 28 9 27 Z" />
    {/* Honey "B" label */}
    <path d="M14 17 Q 14 16 15 16 Q 16 16 16 17 Q 16 18 15 18 Q 14 18 14 17 Z" strokeOpacity={0.6} />
    <path d="M14 19 Q 14 18 15 18 Q 17 18 17 20 Q 17 22 15 22 Q 14 22 14 21" strokeOpacity={0.6} />
    {/* Dipper sticking out of top */}
    <path d="M16 9 L 16 4" />
    <ellipse cx="16" cy="3" rx="1.5" ry="1.2" fill={color} />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const FOOD_ICONS: ThemeIconRegistry = {
  Bread: phosphor(PhosphorBread, "#FED7AA", "خُبْزٌ"),
  Rice: { renderGlyph: Rice, bgColor: "#F5F5F4", sizeRatio: 0.7, defaultLabel: "أَرُزٌّ" },
  Pasta: { renderGlyph: Pasta, bgColor: "#FCD34D", sizeRatio: 0.7, defaultLabel: "مَعْكَرُونَةٌ" },
  Soup: lucide(LucideSoup, "#FB923C", "حَسَاءٌ"),
  Pizza: phosphor(PhosphorPizza, "#FECACA", "بِيتْزَا"),
  Cheese: phosphor(PhosphorCheese, "#FEF08A", "جُبْنٌ"),
  Milk: { renderGlyph: Milk, bgColor: "#F3F4F6", sizeRatio: 0.7, defaultLabel: "حَلِيبٌ" },
  Water: lucide(LucideGlassWater, "#BAE6FD", "مَاءٌ"),
  Juice: { renderGlyph: Juice, bgColor: "#FB923C", sizeRatio: 0.7, defaultLabel: "عَصِيرٌ" },
  Cake: phosphor(PhosphorCake, "#FBCFE8", "كَعْكَةٌ"),
  Cookie: phosphor(PhosphorCookie, "#FED7AA", "بِسْكُوِيتٌ"),
  Honey: { renderGlyph: Honey, bgColor: "#FCD34D", sizeRatio: 0.7, defaultLabel: "عَسَلٌ" },
};
