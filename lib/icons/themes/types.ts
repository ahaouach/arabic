/**
 * Shape of a single entry in a per-theme icon registry.
 *
 * `renderGlyph` is a pure function that emits the glyph React element
 * sized to `size` and stroked / coloured with `color`. The wrapper
 * ( `VocabularyIcon` ) provides the circular pastel background, sizing,
 * and ARIA — the registry only owns "which icon, which colours, which
 * relative size".
 *
 * Why a function instead of `Icon: ComponentType` (like family does)?
 * Because Phosphor and Lucide have different prop interfaces and we
 * want themes to mix freely. A pure render function decouples the
 * runtime from the icon library.
 */

import type { ReactElement } from "react";

export interface VocabularyIconConfig {
  /** Pure renderer: produce the glyph React element at the given color/size. */
  renderGlyph: (props: { color: string; size: number }) => ReactElement;
  /** Pastel HEX painted as the circular card background in default state. */
  bgColor: string;
  /** 0..1 — glyph size as a fraction of the outer card. ~0.55 reads well. */
  sizeRatio: number;
  /** Default Arabic ARIA label when the caller doesn't pass one. */
  defaultLabel: string;
}

/** Per-theme registry: iconKey → config. */
export type ThemeIconRegistry = Record<string, VocabularyIconConfig>;
