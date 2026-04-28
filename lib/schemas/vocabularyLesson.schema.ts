/**
 * Zod schema for the generic `vocabulary_lesson` section.
 *
 * One section type, 13 themed courses (fruits, vegetables, body-parts,
 * clothes, jobs, transport, days, seasons, weather, emotions, food,
 * instruments, animals). Every course shares the same 5-zone runtime —
 * Discovery → Listen-Pick → Count → Color-Item → Color-Letters — and
 * differs only by content data:
 *
 *   - `theme`: a slug used to look up the per-theme icon registry
 *     (`lib/icons/themes/<theme>.ts`) so the renderer can resolve
 *     `item.iconKey` to a Phosphor / Lucide glyph.
 *   - `items`: the vocabulary set (≥ 4, e.g. 7 days, 4 seasons, 12 fruits).
 *   - `words`: pre-split harakat-bearing words for the letter-coloring
 *     zone. Authoring rule: every Arabic letter appears with its base +
 *     harakat + a pre-combined `display` string so we never split
 *     combining marks at runtime.
 *   - `colors`: shared palette reused across themes (vetted in
 *     `colorsLesson.schema`).
 *   - `zones`: array of zone configs, one per zone the orchestrator
 *     should run. Order matters; `useLessonProgress` walks them in array
 *     order.
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

const ThemeSchema = z
  .string()
  .trim()
  .min(1)
  .max(48)
  .regex(/^[a-z][a-z0-9-]*$/, "theme must be a lowercase slug");

/**
 * `iconKey` resolves against the per-theme registry at render time. The
 * regex is just a syntax guard; the security check is "does this string
 * exist in `THEME_REGISTRIES[theme]`" and lives in the renderer.
 */
const IconKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(48)
  .regex(/^[A-Z][A-Za-z0-9]+$/, "iconKey must be PascalCase");

/* -------------------------------------------------------------------------- */
/*  Idle animations                                                           */
/*                                                                            */
/*  Six personalities applied to the icon glyph while a card sits idle.       */
/*  `useReducedMotion` disables all of them at the component level.           */
/* -------------------------------------------------------------------------- */

export const IDLE_ANIMATIONS = [
  "bounce",
  "wiggle",
  "bob",
  "sway",
  "hop",
  "breathe",
] as const;
export type IdleAnimationKind = (typeof IDLE_ANIMATIONS)[number];

/* -------------------------------------------------------------------------- */
/*  Vocabulary item                                                           */
/*                                                                            */
/*  `category` groups items for the "prefer same-category distractors"        */
/*  option in Listen-Pick — pairing apple with banana/pear is harder than     */
/*  apple with carrot.                                                        */
/* -------------------------------------------------------------------------- */

export const VocabularyItemSchema = z.object({
  key: KeySchema,
  nameAr: z.string().trim().min(1).max(100),
  transliteration: z.string().trim().min(1).max(100),
  iconKey: IconKeySchema,
  category: KeySchema.optional(),
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
  idleAnimation: z.enum(IDLE_ANIMATIONS).optional(),
});
export type VocabularyItem = z.infer<typeof VocabularyItemSchema>;

/* -------------------------------------------------------------------------- */
/*  Pre-split word                                                            */
/*                                                                            */
/*  Same shape as `WordLetter` in familyLesson — single source of truth here  */
/*  for the vocabulary runtime. `isTarget` is always `false` in the seed; it  */
/*  exists for symmetry with the alphabet runtime and for future authored-    */
/*  per-round variants. The runtime chooser in ColorLettersZone picks the    */
/*  letter to color per round.                                                */
/* -------------------------------------------------------------------------- */

export const WordLetterSchema = z.object({
  base: z.string().trim().min(1).max(4),
  harakat: z.string().max(6),
  display: z.string().trim().min(1).max(10),
  /** Letter's Arabic name — used for audio playback on correct tap. */
  name: z.string().trim().min(1).max(100),
  isTarget: z.boolean(),
});
export type WordLetter = z.infer<typeof WordLetterSchema>;

export const VocabularyWordSchema = z.object({
  itemKey: KeySchema,
  word: z.string().trim().min(1).max(100),
  letters: z.array(WordLetterSchema).min(1).max(15),
});
export type VocabularyWord = z.infer<typeof VocabularyWordSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone configs                                                              */
/* -------------------------------------------------------------------------- */

const TitleFields = {
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
};

/** Zone 1 — Discovery: every item as a tap-to-play card. */
export const VocabDiscoveryZoneSchema = z.object({
  kind: z.literal("vocab_discovery"),
  ...TitleFields,
});
export type VocabDiscoveryZone = z.infer<typeof VocabDiscoveryZoneSchema>;

/** Zone 2 — Listen & Pick. */
export const VocabListenPickZoneSchema = z.object({
  kind: z.literal("vocab_listen_pick"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(20),
  optionsPerRound: z.number().int().min(2).max(6),
  preferSameCategoryDistractors: z.boolean(),
});
export type VocabListenPickZone = z.infer<typeof VocabListenPickZoneSchema>;

/** Zone 3 — Count: scattered scene, target count of one item type. */
export const VocabCountZoneSchema = z.object({
  kind: z.literal("vocab_count"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  minTotalCharacters: z.number().int().min(4).max(20),
  maxTotalCharacters: z.number().int().min(4).max(20),
  minTargetCount: z.number().int().min(1).max(10),
  maxTargetCount: z.number().int().min(1).max(10),
});
export type VocabCountZone = z.infer<typeof VocabCountZoneSchema>;

/** Zone 4 — Color the requested item among grey-outlined cards. */
export const VocabColorItemZoneSchema = z.object({
  kind: z.literal("vocab_color_item"),
  ...TitleFields,
  minInstructions: z.number().int().min(1).max(10),
  maxInstructions: z.number().int().min(1).max(10),
});
export type VocabColorItemZone = z.infer<typeof VocabColorItemZoneSchema>;

/** Zone 5 — Color the letters of the item's word. */
export const VocabColorLettersZoneSchema = z.object({
  kind: z.literal("vocab_color_letters"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  minLettersToColor: z.number().int().min(1).max(4),
  maxLettersToColor: z.number().int().min(1).max(4),
});
export type VocabColorLettersZone = z.infer<typeof VocabColorLettersZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone union                                                                */
/* -------------------------------------------------------------------------- */

export const VocabularyLessonZoneSchema = z.discriminatedUnion("kind", [
  VocabDiscoveryZoneSchema,
  VocabListenPickZoneSchema,
  VocabCountZoneSchema,
  VocabColorItemZoneSchema,
  VocabColorLettersZoneSchema,
]);
export type VocabularyLessonZone = z.infer<typeof VocabularyLessonZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const VocabularyLessonSectionSchema = z
  .object({
    /** Optional override for the on-screen title; defaults are baked per-theme. */
    title: z.string().trim().min(1).max(200).optional(),
    /** Theme slug; drives icon-registry resolution + background styling. */
    theme: ThemeSchema,
    items: z.array(VocabularyItemSchema).min(4).max(30),
    words: z.array(VocabularyWordSchema).min(1).max(30),
    colors: z.array(ArabicColorSchema).min(2).max(20),
    zones: z.array(VocabularyLessonZoneSchema).min(1).max(8),
  })
  .refine(
    (v) => {
      // Unique item keys.
      const itemKeys = new Set<string>();
      for (const it of v.items) {
        if (itemKeys.has(it.key)) return false;
        itemKeys.add(it.key);
      }

      // Each item references a unique iconKey (no two items share the same icon).
      const iconKeys = new Set<string>();
      for (const it of v.items) {
        if (iconKeys.has(it.iconKey)) return false;
        iconKeys.add(it.iconKey);
      }

      // Words: every word.itemKey must exist + unique per item.
      const wordItemKeys = new Set<string>();
      for (const w of v.words) {
        if (!itemKeys.has(w.itemKey)) return false;
        if (wordItemKeys.has(w.itemKey)) return false;
        wordItemKeys.add(w.itemKey);
      }

      // Colour keys unique.
      const colorKeys = new Set<string>();
      for (const c of v.colors) {
        if (colorKeys.has(c.key)) return false;
        colorKeys.add(c.key);
      }

      // Zone invariants.
      for (const z of v.zones) {
        if (z.kind === "vocab_count") {
          if (z.minTotalCharacters > z.maxTotalCharacters) return false;
          if (z.minTargetCount > z.maxTargetCount) return false;
          // Need at least one distractor in the scene.
          if (z.maxTargetCount >= z.maxTotalCharacters) return false;
        } else if (z.kind === "vocab_color_item") {
          if (z.minInstructions > z.maxInstructions) return false;
          if (z.maxInstructions > v.items.length) return false;
          if (z.maxInstructions > v.colors.length) return false;
        } else if (z.kind === "vocab_color_letters") {
          if (z.minLettersToColor > z.maxLettersToColor) return false;
          if (v.words.length === 0) return false;
        } else if (z.kind === "vocab_listen_pick") {
          if (z.optionsPerRound > v.items.length) return false;
        }
      }

      return true;
    },
    {
      message:
        "Unique item/icon/color keys required; every word.itemKey must reference an existing item; zone configs must fit the available pools.",
    },
  );

export type VocabularyLessonSection = z.infer<typeof VocabularyLessonSectionSchema>;
