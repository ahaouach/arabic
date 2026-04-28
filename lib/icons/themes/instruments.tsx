/**
 * Instruments theme — icon registry.
 *
 * 10 entries: 4 library icons (Phosphor.Guitar/Bell, Lucide.Drum/Piano)
 * and 6 custom SVGs (Oud, Violin, Flute, Trumpet, Tambourine,
 * Xylophone). The Arabic oud (`عُودٌ`) is the cultural anchor of the
 * theme — its glyph is purpose-drawn (pear body + neck + frets + sound
 * rosette).
 */

import type { ReactElement } from "react";
import { Guitar as PhosphorGuitar, Bell as PhosphorBell, type Icon as PhosphorIconComponent } from "@phosphor-icons/react";
import { Drum as LucideDrum, Piano as LucidePiano, type LucideIcon } from "lucide-react";
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

const Oud = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Tuning pegs (head bent back) */}
    <path d="M8 4 L 6 8" />
    <path d="M9 4 L 7 8" strokeOpacity={0.5} />
    <path d="M10 4 L 8 8" strokeOpacity={0.5} />
    {/* Neck */}
    <path d="M7 8 L 13 18" />
    <path d="M9 7 L 15 17" strokeOpacity={0.5} />
    {/* Pear-shaped body */}
    <path d="M13 18 C 8 19 6 25 11 28 C 16 30 22 28 24 23 C 26 18 21 15 17 16 C 15 16 13 17 13 18 Z" />
    {/* Sound rosette */}
    <circle cx="17" cy="22" r="2" />
    <path d="M15.5 22 L 18.5 22" strokeOpacity={0.5} />
    <path d="M17 20.5 L 17 23.5" strokeOpacity={0.5} />
    {/* Bridge */}
    <path d="M21 25 L 25 25" />
  </svg>
);

const Violin = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Scroll head */}
    <path d="M9 5 Q 7 6 7 8 Q 7 10 9 9" />
    {/* Neck */}
    <path d="M9 5 L 13 14" />
    <path d="M11 5 L 15 14" strokeOpacity={0.5} />
    {/* Figure-8 body — upper bout */}
    <path d="M13 14 Q 10 14 9 17 Q 9 19 11 20 Q 13 19 14 17" />
    {/* Waist */}
    <path d="M14 17 Q 12 17 12 19 Q 12 21 14 21" strokeOpacity={0.7} />
    {/* Lower bout */}
    <path d="M14 21 Q 11 22 11 25 Q 13 28 16 28 Q 19 28 21 25 Q 22 22 19 21" />
    {/* Mirror upper bout */}
    <path d="M19 21 Q 21 21 21 19 Q 21 17 19 17" strokeOpacity={0.7} />
    <path d="M19 17 Q 18 14 16 14" strokeOpacity={0.5} />
    {/* F-hole */}
    <path d="M17 23 L 17 26" strokeOpacity={0.6} />
    {/* Bow */}
    <path d="M22 7 L 28 13" />
    <path d="M22 8 L 27 13" strokeOpacity={0.5} />
  </svg>
);

const Flute = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Pipe (long horizontal cylinder, slight tilt) */}
    <path d="M5 22 L 27 12" />
    <path d="M6 24 L 28 14" />
    <path d="M5 22 L 6 24" />
    <path d="M27 12 L 28 14" />
    {/* Mouthpiece end cap */}
    <path d="M4 21 L 5 23" strokeOpacity={0.6} />
    {/* Finger holes */}
    <circle cx="10" cy="20" r="0.8" fill={color} />
    <circle cx="14" cy="18" r="0.8" fill={color} />
    <circle cx="18" cy="16" r="0.8" fill={color} />
    <circle cx="22" cy="14" r="0.8" fill={color} />
    {/* Embouchure hole */}
    <circle cx="7" cy="22" r="1.2" fill={color} />
  </svg>
);

const Trumpet = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Mouthpiece */}
    <path d="M3 16 L 6 14 L 6 18 Z" />
    {/* Lead pipe */}
    <path d="M6 16 L 14 16" />
    {/* Curve back */}
    <path d="M14 14 L 18 14 Q 20 14 20 16 Q 20 18 18 18 L 14 18" />
    {/* Forward pipe to bell */}
    <path d="M18 16 L 24 16" />
    {/* Bell flare */}
    <path d="M24 12 L 24 20 L 29 22 L 29 10 Z" />
    {/* Three valve buttons on top */}
    <path d="M16 14 L 16 11" />
    <path d="M19 14 L 19 11" />
    <path d="M22 14 L 22 11" />
    <circle cx="16" cy="11" r="0.8" fill={color} />
    <circle cx="19" cy="11" r="0.8" fill={color} />
    <circle cx="22" cy="11" r="0.8" fill={color} />
  </svg>
);

const Tambourine = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Outer ring (frame) */}
    <circle cx="16" cy="16" r="9" />
    {/* Inner skin */}
    <circle cx="16" cy="16" r="6.5" strokeOpacity={0.55} />
    {/* Jingles around the frame */}
    <ellipse cx="7" cy="16" rx="1.5" ry="2" />
    <ellipse cx="25" cy="16" rx="1.5" ry="2" />
    <ellipse cx="16" cy="7" rx="2" ry="1.5" />
    <ellipse cx="16" cy="25" rx="2" ry="1.5" />
    <ellipse cx="9" cy="9" rx="1.5" ry="1.5" />
    <ellipse cx="23" cy="9" rx="1.5" ry="1.5" />
    <ellipse cx="9" cy="23" rx="1.5" ry="1.5" />
    <ellipse cx="23" cy="23" rx="1.5" ry="1.5" />
  </svg>
);

const Xylophone = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Frame rails */}
    <path d="M3 12 L 27 8" />
    <path d="M3 26 L 27 22" />
    {/* Bars (graduated, longest left → shortest right) */}
    <path d="M5 13 L 5 25" />
    <path d="M9 12 L 9 24" />
    <path d="M13 11 L 13 23" />
    <path d="M17 11 L 17 22" />
    <path d="M21 10 L 21 21" />
    <path d="M25 9 L 25 20" />
    {/* Bars cross-bars (top and bottom of each bar) */}
    <path d="M5 13 L 25 9" strokeOpacity={0.5} />
    <path d="M5 25 L 25 20" strokeOpacity={0.5} />
    {/* Mallet */}
    <path d="M27 4 L 22 14" />
    <circle cx="22" cy="15" r="1.5" fill={color} />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const INSTRUMENTS_ICONS: ThemeIconRegistry = {
  Drum: lucide(LucideDrum, "#C4B5FD", "طَبْلَةٌ"),
  Oud: { renderGlyph: Oud, bgColor: "#FB923C", sizeRatio: 0.7, defaultLabel: "عُودٌ" },
  Guitar: phosphor(PhosphorGuitar, "#FED7AA", "جِيتَارٌ"),
  Flute: { renderGlyph: Flute, bgColor: "#BAE6FD", sizeRatio: 0.7, defaultLabel: "نَايٌ" },
  Piano: lucide(LucidePiano, "#F3F4F6", "بِيَانُو"),
  Trumpet: { renderGlyph: Trumpet, bgColor: "#FCD34D", sizeRatio: 0.7, defaultLabel: "بُوقٌ" },
  Violin: { renderGlyph: Violin, bgColor: "#FBCFE8", sizeRatio: 0.7, defaultLabel: "كَمَانٌ" },
  Tambourine: { renderGlyph: Tambourine, bgColor: "#FCD34D", sizeRatio: 0.7, defaultLabel: "دُفٌّ" },
  Bell: phosphor(PhosphorBell, "#FDE68A", "جَرَسٌ"),
  Xylophone: { renderGlyph: Xylophone, bgColor: "#A7F3D0", sizeRatio: 0.7, defaultLabel: "إِكْسِيلُوفُونٌ" },
};
