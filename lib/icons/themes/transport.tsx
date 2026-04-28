/**
 * Transport theme — icon registry.
 *
 * 10 entries: 9 library icons (Phosphor.Car/Bus/Train/Bicycle/
 * Motorcycle/Truck/AirplaneTilt/Sailboat, Lucide.Helicopter) and 1
 * custom SVG (Ship — friendly steamship). Sailboat covers "boat",
 * the custom Ship covers the larger seafaring vessel.
 */

import type { ReactElement } from "react";
import { Helicopter as LucideHelicopter, type LucideIcon } from "lucide-react";
import {
  Car as PhosphorCar,
  Bus as PhosphorBus,
  Train as PhosphorTrain,
  Bicycle as PhosphorBicycle,
  Motorcycle as PhosphorMotorcycle,
  Truck as PhosphorTruck,
  AirplaneTilt as PhosphorAirplaneTilt,
  Sailboat as PhosphorSailboat,
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
/*  Custom SVG: Ship                                                          */
/* -------------------------------------------------------------------------- */

const Ship = ({ color, size }: GlyphArgs): ReactElement => (
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
    {/* Hull (rounded trapezoid) */}
    <path d="M3 22 L 29 22 L 26 28 L 6 28 Z" />
    {/* Deck */}
    <path d="M5 22 L 5 18 L 27 18 L 27 22" />
    {/* Cabin / superstructure */}
    <path d="M9 18 L 9 13 L 21 13 L 21 18" />
    {/* Smokestack */}
    <path d="M16 13 L 16 7 L 20 7 L 20 13" />
    {/* Smoke puff */}
    <path d="M22 7 Q 24 5 25 7 Q 26 4 24 4" />
    {/* Cabin windows */}
    <circle cx="12" cy="16" r="0.8" fill={color} />
    <circle cx="15" cy="16" r="0.8" fill={color} />
    <circle cx="18" cy="16" r="0.8" fill={color} />
    {/* Waterline ripples */}
    <path d="M3 28 Q 5 27 7 28 Q 9 27 11 28" strokeOpacity={0.5} />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

export const TRANSPORT_ICONS: ThemeIconRegistry = {
  Car: phosphor(PhosphorCar, "#BFDBFE", "سَيَّارَةٌ"),
  Bus: phosphor(PhosphorBus, "#FCD34D", "حَافِلَةٌ"),
  Train: phosphor(PhosphorTrain, "#C7D2FE", "قِطَارٌ"),
  Bike: phosphor(PhosphorBicycle, "#A7F3D0", "دَرَّاجَةٌ"),
  Motorcycle: phosphor(PhosphorMotorcycle, "#FB923C", "دَرَّاجَةٌ نَارِيَّةٌ"),
  Truck: phosphor(PhosphorTruck, "#FED7AA", "شَاحِنَةٌ"),
  Plane: phosphor(PhosphorAirplaneTilt, "#BAE6FD", "طَائِرَةٌ"),
  Helicopter: lucide(LucideHelicopter, "#DDD6FE", "مِرْوَحِيَّةٌ"),
  Boat: phosphor(PhosphorSailboat, "#67E8F9", "قَارِبٌ"),
  Ship: { renderGlyph: Ship, bgColor: "#BFDBFE", sizeRatio: 0.7, defaultLabel: "سَفِينَةٌ" },
};
