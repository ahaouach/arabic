"use client";

/**
 * Central dispatcher: `(theme, iconKey)` → glyph element.
 *
 * Resolves the registry; on hit renders `VocabularyIcon` with the
 * theme's config; on miss (unknown theme or unknown iconKey) renders a
 * soft placeholder so a not-yet-authored theme doesn't crash. This is
 * the security boundary for DB-driven content — the registry is a
 * whitelist, not a freeform import.
 */

import { resolveVocabularyIcon } from "@/lib/icons/themes";
import { VocabularyIcon } from "./VocabularyIcon";

export interface VocabularyRendererProps {
  /** Theme slug (e.g. "fruits"). */
  theme: string;
  /** Registry key (PascalCase, must match `VocabularyItem.iconKey`). */
  iconKey: string;
  /** Recolouring stroke (Zone 4). */
  fillColor?: string;
  size?: number;
  outlined?: boolean;
  className?: string;
  "aria-label"?: string;
}

export default function VocabularyRenderer({
  theme,
  iconKey,
  size = 120,
  outlined = false,
  fillColor,
  className,
  "aria-label": ariaLabel,
}: VocabularyRendererProps) {
  const config = resolveVocabularyIcon(theme, iconKey);

  if (!config) {
    // Soft placeholder — a dashed circle with a neutral glyph shape.
    return (
      <div
        role="img"
        aria-label={ariaLabel ?? iconKey}
        className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className ?? ""}`}
        style={{
          width: size,
          height: size,
          backgroundColor: outlined ? "transparent" : "#F3F4F6",
          border: "2px dashed #9CA3AF",
        }}
      >
        <svg
          width={Math.round(size * 0.45)}
          height={Math.round(size * 0.45)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r="0.5" />
        </svg>
      </div>
    );
  }

  return (
    <VocabularyIcon
      config={config}
      fillColor={fillColor}
      size={size}
      outlined={outlined}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
