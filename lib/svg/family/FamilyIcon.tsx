/**
 * Unified family-member card renderer.
 *
 * Replaces the 11 per-member hand-drawn SVGs. Each character is now a
 * composition of:
 *   - a Lucide icon (`UserRound` for adults, `Baby` for the baby),
 *   - a circular pastel background (unique per character — the
 *     primary identity cue),
 *   - a size ratio (smaller for children so the silhouette reads
 *     as "younger"),
 *   - a palette-group hint for paternal / maternal / elder roles.
 *
 * The component exposes the same `FamilyMemberSvgProps` contract the
 * old SVGs did, so every caller (`FamilyMemberRenderer`, every zone)
 * keeps working without any changes.
 *
 * Zone 5's "grey outline → fill with colour" mechanic:
 *   - `outlined=true`  → icon stroke `#9CA3AF`, BG neutral grey, so
 *                        the character's identity pastel doesn't give
 *                        away the answer before the child taps.
 *   - `fillColor` set  → icon stroke switches to `fillColor`, BG
 *                        returns to the character's pastel.
 */

import type { LucideIcon } from "lucide-react";
import type { FamilyMemberSvgProps } from "./index";

export interface FamilyIconConfig {
  /** Lucide icon component to render inside the card. */
  Icon: LucideIcon;
  /** Pastel HEX that paints the circular background in default state. */
  bgColor: string;
  /** 0..1 — icon glyph size as a fraction of the outer card. 0.65 works for adults, smaller for kids. */
  sizeRatio: number;
  /** Default Arabic aria-label when the caller doesn't pass one. */
  defaultLabel: string;
}

export interface FamilyIconProps extends FamilyMemberSvgProps {
  config: FamilyIconConfig;
}

const OUTLINED_BG = "#F3F4F6"; // neutral grey — hides identity in Zone 5
const OUTLINED_STROKE = "#9CA3AF"; // medium-grey stroke
const DEFAULT_STROKE = "#1F2937"; // dark-slate stroke when no fillColor

export function FamilyIcon({
  config,
  fillColor,
  size = 120,
  outlined = false,
  className,
  "aria-label": ariaLabel,
}: FamilyIconProps) {
  const { Icon, bgColor, sizeRatio, defaultLabel } = config;
  const label = ariaLabel ?? defaultLabel;

  // Outlined Zone-5 state hides the identity colour; otherwise use the
  // character's pastel + either the coloured fill or dark-slate default.
  const background = outlined ? OUTLINED_BG : bgColor;
  const strokeColor = outlined
    ? OUTLINED_STROKE
    : (fillColor ?? DEFAULT_STROKE);

  const iconSize = Math.round(size * sizeRatio);

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        backgroundColor: background,
        boxShadow: "inset 0 0 0 2px rgba(31, 41, 55, 0.08)",
        transition: "background-color 280ms ease, color 280ms ease",
      }}
    >
      <Icon
        size={iconSize}
        color={strokeColor}
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden
      />
    </div>
  );
}
