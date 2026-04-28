/**
 * Zod schema for the `family_lesson` section.
 *
 * A single-section lesson whose `content` JSON drives a 6-zone course
 * teaching Arabic family vocabulary. Everything is DB-driven — the
 * orchestrator + zones contain no hardcoded Arabic text or member data.
 *
 * Shape:
 *   content = { title?, members[], words[], colors[], zones[] }
 *
 * Why a single section (not six): the six zones share a common pool of
 * members / words / colors. Splitting them into six `LessonSection`
 * rows would force every orchestrator to fan out the same data with
 * fragile keys, and would defeat the "one source of truth" invariant
 * the other full-course lessons (alphabet, colors, shapes, numbers)
 * already enforce.
 */

import { z } from "zod";
import { ArabicColorSchema } from "@/lib/schemas/colorsLesson.schema";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

const InternalPathSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^\/[A-Za-z0-9._\-/]+$/, "audioUrl must be a relative path");

const KeySchema = z
  .string()
  .trim()
  .min(1)
  .max(48)
  .regex(/^[a-z0-9_-]+$/, "key must be lowercase alphanumeric");

/**
 * `svgComponent` is a whitelisted React component name resolved against
 * `lib/svg/family/index.ts` at render time. A regex-only guard here
 * keeps the schema dumb; the security check is "does this string match
 * a key in the whitelist" and lives in the renderer.
 */
const SvgComponentKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(48)
  .regex(/^[A-Z][A-Za-z0-9]+Svg$/, "svgComponent must be PascalCase ending in 'Svg'");

/* -------------------------------------------------------------------------- */
/*  Family member                                                             */
/*                                                                            */
/*  `category` groups members for the "prefer same-category distractors"      */
/*  option in Zone 2 — makes the listen-pick rounds meaningfully harder       */
/*  by pairing mother with grandmother/aunt instead of baby/grandfather.      */
/* -------------------------------------------------------------------------- */

export const FAMILY_CATEGORIES = [
  "parent",
  "sibling",
  "grandparent",
  "uncle_aunt",
  "child",
] as const;
export type FamilyCategory = (typeof FAMILY_CATEGORIES)[number];

export const FamilyMemberSchema = z.object({
  key: KeySchema,
  nameAr: z.string().trim().min(1).max(100),
  transliteration: z.string().trim().min(1).max(100),
  svgComponent: SvgComponentKeySchema,
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
  category: z.enum(FAMILY_CATEGORIES).optional(),
});
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

/* -------------------------------------------------------------------------- */
/*  Pre-split family word                                                     */
/*                                                                            */
/*  Arabic harakat are combining marks; splitting at runtime with             */
/*  `.split("")` breaks them. The seed authors each letter with its base +    */
/*  harakat + a pre-combined `display` string so the tappable letter cells    */
/*  in Zone 6 can render exactly what was authored without reassembling.      */
/*                                                                            */
/*  `isTarget` in the *schema* is left free — the runtime chooser (Zone 6)   */
/*  picks which letter(s) to color on each round. The seed always writes     */
/*  `false`; the flag exists so the same structure can be reused if we ever  */
/*  want an authored-per-round variant.                                      */
/* -------------------------------------------------------------------------- */

export const WordLetterSchema = z.object({
  base: z.string().trim().min(1).max(4),
  harakat: z.string().max(6), // may be empty; combining marks only
  display: z.string().trim().min(1).max(10),
  /** Name of the base letter in Arabic, for audio playback on correct tap. */
  name: z.string().trim().min(1).max(100),
  isTarget: z.boolean(),
});
export type WordLetter = z.infer<typeof WordLetterSchema>;

export const FamilyWordSchema = z.object({
  memberKey: KeySchema,
  word: z.string().trim().min(1).max(100),
  letters: z.array(WordLetterSchema).min(1).max(15),
});
export type FamilyWord = z.infer<typeof FamilyWordSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone configs — one per zone kind                                          */
/* -------------------------------------------------------------------------- */

const TitleFields = {
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
};

/** Zone 1 — Discovery: all members rendered as SVG cards with audio. */
export const FamilyDiscoveryZoneSchema = z.object({
  kind: z.literal("family_discovery"),
  ...TitleFields,
});
export type FamilyDiscoveryZone = z.infer<typeof FamilyDiscoveryZoneSchema>;

/** Zone 2 — Listen & pick: hear a name, tap the matching member. */
export const FamilyListenPickZoneSchema = z.object({
  kind: z.literal("family_listen_pick"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(20),
  optionsPerRound: z.number().int().min(2).max(6),
  preferSameCategoryDistractors: z.boolean(),
});
export type FamilyListenPickZone = z.infer<typeof FamilyListenPickZoneSchema>;

/** Zone 3 — Matching: word ↔ illustration pairs. */
export const FamilyMatchingZoneSchema = z.object({
  kind: z.literal("family_matching"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  pairsPerRound: z.number().int().min(2).max(8),
  /** When true, desktop users can drag words onto illustrations. Tap-to-pair always works. */
  allowDragAndDrop: z.boolean(),
});
export type FamilyMatchingZone = z.infer<typeof FamilyMatchingZoneSchema>;

/** Zone 4 — Count family members: scattered scene, count of a target type. */
export const FamilyCountZoneSchema = z.object({
  kind: z.literal("family_count"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  minTotalCharacters: z.number().int().min(4).max(20),
  maxTotalCharacters: z.number().int().min(4).max(20),
  minTargetCount: z.number().int().min(1).max(10),
  maxTargetCount: z.number().int().min(1).max(10),
});
export type FamilyCountZone = z.infer<typeof FamilyCountZoneSchema>;

/** Zone 5 — Color the family member: grey outlines + voice instructions. */
export const FamilyColorMemberZoneSchema = z.object({
  kind: z.literal("family_color_member"),
  ...TitleFields,
  minInstructions: z.number().int().min(1).max(10),
  maxInstructions: z.number().int().min(1).max(10),
});
export type FamilyColorMemberZone = z.infer<typeof FamilyColorMemberZoneSchema>;

/** Zone 6 — Color letters of the word: per-letter glyphs tappable. */
export const FamilyColorLettersZoneSchema = z.object({
  kind: z.literal("family_color_letters"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  minLettersToColor: z.number().int().min(1).max(4),
  maxLettersToColor: z.number().int().min(1).max(4),
});
export type FamilyColorLettersZone = z.infer<typeof FamilyColorLettersZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone union                                                                */
/* -------------------------------------------------------------------------- */

export const FamilyLessonZoneSchema = z.discriminatedUnion("kind", [
  FamilyDiscoveryZoneSchema,
  FamilyListenPickZoneSchema,
  FamilyMatchingZoneSchema,
  FamilyCountZoneSchema,
  FamilyColorMemberZoneSchema,
  FamilyColorLettersZoneSchema,
]);
export type FamilyLessonZone = z.infer<typeof FamilyLessonZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const FamilyLessonSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    members: z.array(FamilyMemberSchema).min(1).max(30),
    words: z.array(FamilyWordSchema).min(1).max(30),
    colors: z.array(ArabicColorSchema).min(2).max(20),
    zones: z.array(FamilyLessonZoneSchema).min(1).max(10),
  })
  .refine(
    (v) => {
      // Unique member keys.
      const memberKeys = new Set<string>();
      for (const m of v.members) {
        if (memberKeys.has(m.key)) return false;
        memberKeys.add(m.key);
      }

      // Unique word per memberKey, and every word must reference an existing member.
      const wordMemberKeys = new Set<string>();
      for (const w of v.words) {
        if (!memberKeys.has(w.memberKey)) return false;
        if (wordMemberKeys.has(w.memberKey)) return false;
        wordMemberKeys.add(w.memberKey);
      }

      // Unique color keys.
      const colorKeys = new Set<string>();
      for (const c of v.colors) {
        if (colorKeys.has(c.key)) return false;
        colorKeys.add(c.key);
      }

      // Zone invariants.
      for (const z of v.zones) {
        if (z.kind === "family_count") {
          if (z.minTotalCharacters > z.maxTotalCharacters) return false;
          if (z.minTargetCount > z.maxTargetCount) return false;
          // The target must fit inside the scene with room for ≥ 1 distractor.
          if (z.maxTargetCount >= z.maxTotalCharacters) return false;
        } else if (z.kind === "family_color_member") {
          if (z.minInstructions > z.maxInstructions) return false;
          // Need enough members / colors to fill one instruction set.
          if (z.maxInstructions > v.members.length) return false;
          if (z.maxInstructions > v.colors.length) return false;
        } else if (z.kind === "family_color_letters") {
          if (z.minLettersToColor > z.maxLettersToColor) return false;
        } else if (z.kind === "family_listen_pick") {
          if (z.optionsPerRound > v.members.length) return false;
        } else if (z.kind === "family_matching") {
          if (z.pairsPerRound > v.members.length) return false;
        }
      }

      return true;
    },
    {
      message:
        "Unique member/color keys required; every word.memberKey must exist; zone configs must fit the available pools.",
    },
  );

export type FamilyLessonSection = z.infer<typeof FamilyLessonSectionSchema>;
