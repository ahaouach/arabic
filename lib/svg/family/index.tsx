/**
 * Whitelist registry for family-member icon components.
 *
 * The `svgComponent` string lives in the database and drives which
 * wrapper renders. Unknown keys fall through to `resolveFamilySvg` →
 * `null`, so the renderer shows its placeholder instead of crashing
 * or (worse) running arbitrary code.
 *
 * The public API (`resolveFamilySvg`, `FamilyMemberSvgProps`,
 * `FamilySvgComponent`, `FAMILY_SVG_REGISTRY`) is kept intact so
 * callers (`FamilyMemberRenderer`, every zone) don't need to change.
 * Internally the registry now resolves to 11 `FamilyIcon`-based
 * wrappers instead of the previous hand-drawn SVGs.
 */

import { Baby, UserRound, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { FamilyIcon, type FamilyIconConfig } from "./FamilyIcon";

export interface FamilyMemberSvgProps {
  /** Fill for recolourable regions (clothes/body). Zone 5 drives this. */
  fillColor?: string;
  /** Optional skin-tone override; defaults are neutral. */
  skinTone?: string;
  /** Square render size in px. Defaults to 120. */
  size?: number;
  className?: string;
  /** When true: strokes only, no fills. "Grey outline" state used by Zone 5. */
  outlined?: boolean;
  "aria-label"?: string;
}

export type FamilySvgComponent = ComponentType<FamilyMemberSvgProps>;

/* -------------------------------------------------------------------------- */
/*  Per-character configs                                                     */
/*                                                                            */
/*  Differentiation strategy (since Lucide only exposes ~2 useful glyphs):    */
/*    - Unique pastel BG per character = primary identity cue.                */
/*    - Size ratio telegraphs age (adults 0.65, teens 0.55, baby 0.50).       */
/*    - Palette groups:                                                       */
/*        immediate family  → varied (sky, rose, emerald, pink, yellow)       */
/*        elders            → violet / lavender                               */
/*        paternal side     → warm (orange, amber)                            */
/*        maternal side     → cool (teal, cyan)                               */
/* -------------------------------------------------------------------------- */

type MemberKey =
  | "FatherSvg"
  | "MotherSvg"
  | "BrotherSvg"
  | "SisterSvg"
  | "BabySvg"
  | "GrandfatherSvg"
  | "GrandmotherSvg"
  | "UnclePaternalSvg"
  | "AuntPaternalSvg"
  | "UncleMaternalSvg"
  | "AuntMaternalSvg";

const MEMBER_CONFIGS: Record<MemberKey, FamilyIconConfig> = {
  FatherSvg: { Icon: UserRound, bgColor: "#BAE6FD", sizeRatio: 0.65, defaultLabel: "أَبٌ" },
  MotherSvg: { Icon: UserRound, bgColor: "#FECDD3", sizeRatio: 0.65, defaultLabel: "أُمٌّ" },
  BrotherSvg: { Icon: UserRound, bgColor: "#A7F3D0", sizeRatio: 0.55, defaultLabel: "أَخٌ" },
  SisterSvg: { Icon: UserRound, bgColor: "#FBCFE8", sizeRatio: 0.55, defaultLabel: "أُخْتٌ" },
  BabySvg: { Icon: Baby, bgColor: "#FEF08A", sizeRatio: 0.5, defaultLabel: "طِفْلٌ" },
  GrandfatherSvg: { Icon: UserRound, bgColor: "#DDD6FE", sizeRatio: 0.65, defaultLabel: "جَدٌّ" },
  GrandmotherSvg: { Icon: UserRound, bgColor: "#E9D5FF", sizeRatio: 0.65, defaultLabel: "جَدَّةٌ" },
  UnclePaternalSvg: { Icon: UserRound, bgColor: "#FED7AA", sizeRatio: 0.65, defaultLabel: "عَمٌّ" },
  AuntPaternalSvg: { Icon: UserRound, bgColor: "#FDE68A", sizeRatio: 0.65, defaultLabel: "عَمَّةٌ" },
  UncleMaternalSvg: { Icon: UserRound, bgColor: "#99F6E4", sizeRatio: 0.65, defaultLabel: "خَالٌ" },
  AuntMaternalSvg: { Icon: UserRound, bgColor: "#A5F3FC", sizeRatio: 0.65, defaultLabel: "خَالَةٌ" },
};

/**
 * Bind a config to the shared `FamilyIcon` wrapper, producing a
 * per-character component that takes the same `FamilyMemberSvgProps`
 * the old hand-drawn SVGs did.
 */
function makeMemberIcon(key: MemberKey, config: FamilyIconConfig): FamilySvgComponent {
  const Bound: FamilySvgComponent = (props) => <FamilyIcon config={config} {...props} />;
  Bound.displayName = `FamilyIcon(${key})`;
  return Bound;
}

// Build registry lazily from the config map so the key list stays
// single-sourced and additions only require editing MEMBER_CONFIGS.
export const FAMILY_SVG_REGISTRY: Record<string, FamilySvgComponent> = Object.fromEntries(
  (Object.entries(MEMBER_CONFIGS) as Array<[MemberKey, FamilyIconConfig]>).map(([k, v]) => [
    k,
    makeMemberIcon(k, v),
  ]),
);

/** Safely resolve a registry key — unknown keys return `null`. */
export function resolveFamilySvg(key: string | undefined): FamilySvgComponent | null {
  if (!key) return null;
  return FAMILY_SVG_REGISTRY[key] ?? null;
}

// Keep `LucideIcon` re-exported so the FamilyIcon file can type its
// config prop without reaching back into lucide-react directly.
export type { LucideIcon };
