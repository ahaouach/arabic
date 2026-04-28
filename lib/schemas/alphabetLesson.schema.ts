import { z } from "zod";

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

/* -------------------------------------------------------------------------- */
/*  Letter                                                                    */
/* -------------------------------------------------------------------------- */

export const LetterFormSchema = z.object({
  isolated: z.string().trim().min(1).max(6),
  initial: z.string().trim().min(1).max(8),
  medial: z.string().trim().min(1).max(8),
  final: z.string().trim().min(1).max(8),
});
export type LetterForm = z.infer<typeof LetterFormSchema>;

export const ArabicLetterSchema = z.object({
  key: KeySchema,
  char: z.string().trim().min(1).max(4),
  nameAr: z.string().trim().min(1).max(100),
  transliteration: z.string().trim().min(1).max(100),
  orderIndex: z.number().int().min(1).max(99),
  forms: LetterFormSchema,
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
});
export type ArabicLetter = z.infer<typeof ArabicLetterSchema>;

/* -------------------------------------------------------------------------- */
/*  Vocabulary word — pre-split letters with `isTarget` flag                  */
/*                                                                            */
/*  Why pre-split in the seed: Arabic harakat are combining marks, which      */
/*  makes runtime splitting brittle. Pre-authoring the split also lets us     */
/*  flag the exact occurrence(s) of the target letter that Zone 2 / Zone 4   */
/*  need to highlight or accept as correct.                                   */
/* -------------------------------------------------------------------------- */

export const VocabularyLetterSchema = z.object({
  base: z.string().trim().min(1).max(4),
  harakat: z.string().max(6), // may be empty; combining marks
  display: z.string().trim().min(1).max(10),
  isTarget: z.boolean(),
});
export type VocabularyLetter = z.infer<typeof VocabularyLetterSchema>;

export const VocabularyWordSchema = z.object({
  key: KeySchema,
  letterKey: KeySchema,
  word: z.string().trim().min(1).max(100),
  translit: z.string().trim().min(1).max(100),
  emoji: z.string().trim().min(1).max(8),
  imageUrl: InternalPathSchema.optional(),
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
  letters: z.array(VocabularyLetterSchema).min(1).max(15),
});
export type VocabularyWord = z.infer<typeof VocabularyWordSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone configs                                                              */
/* -------------------------------------------------------------------------- */

const TitleFields = {
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
};

export const TASHKEEL_STATES = [
  "fatha",
  "kasra",
  "damma",
  "sukun",
  "fathatan",
  "kasratan",
  "dammatan",
] as const;
export type TashkeelState = (typeof TASHKEEL_STATES)[number];

/** Zone 1 — the letter with each short-vowel / tanwin state. */
export const LetterTashkeelZoneSchema = z.object({
  kind: z.literal("letter_tashkeel"),
  ...TitleFields,
  states: z.array(z.enum(TASHKEEL_STATES)).min(1).max(7),
});
export type LetterTashkeelZone = z.infer<typeof LetterTashkeelZoneSchema>;

/** Zone 2 — vocabulary words with the target letter highlighted. */
export const VocabularyZoneSchema = z.object({
  kind: z.literal("vocabulary"),
  ...TitleFields,
  minWords: z.number().int().min(2).max(20),
  maxWords: z.number().int().min(2).max(20),
});
export type VocabularyZone = z.infer<typeof VocabularyZoneSchema>;

/** Zone 3 — colour every occurrence of the letter in a mixed grid. */
export const ColorLetterZoneSchema = z.object({
  kind: z.literal("color_letter"),
  ...TitleFields,
  gridCols: z.number().int().min(3).max(8),
  gridRows: z.number().int().min(3).max(8),
  targetCountMin: z.number().int().min(1).max(20),
  targetCountMax: z.number().int().min(1).max(20),
  /** When true, target letter appears in mixed connected forms (isolated / initial / medial / final). */
  mixForms: z.boolean(),
  /**
   * `"random"` picks a different colour each replay. Any other value is
   * treated as a named colour key ("red", "blue"...) that the renderer
   * resolves to a hex. Unknown values fall back to red.
   */
  targetColor: z.string().trim().min(1).max(32),
});
export type ColorLetterZone = z.infer<typeof ColorLetterZoneSchema>;

/** Zone 4 — colour the target letter inside one vocabulary word. */
export const ColorLetterInWordZoneSchema = z.object({
  kind: z.literal("color_letter_in_word"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
});
export type ColorLetterInWordZone = z.infer<typeof ColorLetterInWordZoneSchema>;

/** Zone 5 — pick every word that contains the target letter. */
export const FindWordsZoneSchema = z.object({
  kind: z.literal("find_words"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  totalCards: z.number().int().min(4).max(12),
  minValid: z.number().int().min(1).max(10),
  maxValid: z.number().int().min(1).max(10),
});
export type FindWordsZone = z.infer<typeof FindWordsZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone union                                                                */
/* -------------------------------------------------------------------------- */

export const AlphabetLessonZoneSchema = z.discriminatedUnion("kind", [
  LetterTashkeelZoneSchema,
  VocabularyZoneSchema,
  ColorLetterZoneSchema,
  ColorLetterInWordZoneSchema,
  FindWordsZoneSchema,
]);
export type AlphabetLessonZone = z.infer<typeof AlphabetLessonZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const AlphabetLessonSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    letters: z.array(ArabicLetterSchema).min(1).max(40),
    vocabulary: z.array(VocabularyWordSchema).min(1).max(600),
    zones: z.array(AlphabetLessonZoneSchema).min(1).max(10),
    /**
     * Optional extra distractor-letter pool for Zone 3 when the 27
     * non-target letters aren't enough (rare; here for future-proofing).
     */
    distractorLettersFallback: z.array(z.string().min(1).max(4)).max(40).optional(),
  })
  .refine(
    (v) => {
      // Unique letter keys.
      const letterKeys = new Set<string>();
      for (const l of v.letters) {
        if (letterKeys.has(l.key)) return false;
        letterKeys.add(l.key);
      }
      // Letter `char` must be unique too — it's the primary visual match key.
      const letterChars = new Set<string>();
      for (const l of v.letters) {
        if (letterChars.has(l.char)) return false;
        letterChars.add(l.char);
      }
      // Unique vocab word keys across all letters.
      const vocabKeys = new Set<string>();
      for (const w of v.vocabulary) {
        if (vocabKeys.has(w.key)) return false;
        vocabKeys.add(w.key);
      }

      const letterByKey = new Map(v.letters.map((l) => [l.key, l]));
      for (const w of v.vocabulary) {
        // Every vocab word must reference an existing letter.
        const parent = letterByKey.get(w.letterKey);
        if (!parent) return false;
        // At least one letter flagged as target...
        const targets = w.letters.filter((ll) => ll.isTarget);
        if (targets.length === 0) return false;
        // ...and every flagged letter's `base` must match the parent letter.
        for (const t of targets) {
          if (t.base !== parent.char) return false;
        }
      }

      // Zone invariants.
      for (const z of v.zones) {
        if (z.kind === "vocabulary") {
          if (z.minWords > z.maxWords) return false;
        } else if (z.kind === "color_letter") {
          if (z.targetCountMin > z.targetCountMax) return false;
          const cells = z.gridCols * z.gridRows;
          // Need at least 1 distractor cell alongside the target max.
          if (z.targetCountMax >= cells) return false;
        } else if (z.kind === "find_words") {
          if (z.minValid > z.maxValid) return false;
          if (z.maxValid >= z.totalCards) return false;
        }
      }
      return true;
    },
    {
      message:
        "Unique letter keys/chars and vocab keys required; every vocab.letterKey must exist and flag its target letter occurrences; zone pools must fit.",
    },
  );

export type AlphabetLessonSection = z.infer<typeof AlphabetLessonSectionSchema>;
