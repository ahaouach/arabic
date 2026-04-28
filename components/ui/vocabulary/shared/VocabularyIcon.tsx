"use client";

/**
 * Pure circular-card icon renderer.
 *
 * Given a `VocabularyIconConfig`, paints a circular pastel background
 * + glyph at the configured ratio. State machine matches the family
 * lesson:
 *
 *   - default        → pastel BG + dark-slate stroke
 *   - `outlined`     → neutral grey BG + grey stroke (Zone 4 hides the
 *                      character's identity colour before tap)
 *   - `fillColor` set → pastel BG + fillColor stroke (after tap)
 *
 * Smooth 280 ms colour transition between states.
 */

import type { VocabularyIconConfig } from "@/lib/icons/themes";

const OUTLINED_BG = "#F3F4F6";
const OUTLINED_STROKE = "#9CA3AF";
const DEFAULT_STROKE = "#1F2937";

export interface VocabularyIconProps {
  config: VocabularyIconConfig;
  /** Recolouring stroke. Drives Zone 4. */
  fillColor?: string;
  /** Square render size in px. Defaults to 120. */
  size?: number;
  /** Strokes only, neutral grey BG. */
  outlined?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function VocabularyIcon({
  config,
  fillColor,
  size = 120,
  outlined = false,
  className,
  "aria-label": ariaLabel,
}: VocabularyIconProps) {
  const { renderGlyph, bgColor, sizeRatio, defaultLabel } = config;
  const label = ariaLabel ?? defaultLabel;

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
      {renderGlyph({ color: strokeColor, size: iconSize })}
    </div>
  );
}
