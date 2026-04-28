import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Palette item                                                              */
/* -------------------------------------------------------------------------- */

const HexColorSchema = z
  .string()
  .trim()
  .regex(
    /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/,
    "hex must be #RGB / #RRGGBB / #RRGGBBAA",
  );

const InternalPathSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^\/[A-Za-z0-9._\-/]+$/, "audioUrl must be a relative path");

export const ArabicColorSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[a-z0-9_-]+$/, "key must be lowercase alphanumeric"),
  nameAr: z.string().trim().min(1).max(100),
  transliteration: z.string().trim().min(1).max(100),
  hex: HexColorSchema,
  emoji: z.string().trim().min(1).max(8),
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
});
export type ArabicColor = z.infer<typeof ArabicColorSchema>;

/* -------------------------------------------------------------------------- */
/*  Letter item                                                               */
/* -------------------------------------------------------------------------- */

export const ArabicLetterSchema = z.object({
  char: z.string().trim().min(1).max(4),
  nameAr: z.string().trim().min(1).max(100),
  transliteration: z.string().trim().min(1).max(100),
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
});
export type ArabicLetter = z.infer<typeof ArabicLetterSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone configs                                                              */
/* -------------------------------------------------------------------------- */

const TitleFields = {
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
};

/** Zone 1 — Discovery: display every colour, hover/click to hear. */
export const ColorsDiscoveryZoneSchema = z.object({
  kind: z.literal("discovery"),
  ...TitleFields,
});
export type ColorsDiscoveryZone = z.infer<typeof ColorsDiscoveryZoneSchema>;

/** Zone 2 — Listen & Pick: hear a colour, pick from N options. */
export const ColorsListenPickZoneSchema = z.object({
  kind: z.literal("listen_pick"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(20),
  optionsPerRound: z.number().int().min(2).max(6),
});
export type ColorsListenPickZone = z.infer<typeof ColorsListenPickZoneSchema>;

/** Zone 3 — Colour the digits: apply each requested colour to a digit. */
export const ColorDigitsZoneSchema = z.object({
  kind: z.literal("color_digits"),
  ...TitleFields,
  minDigits: z.number().int().min(1).max(10),
  maxDigits: z.number().int().min(1).max(10),
}).refine((v) => v.minDigits <= v.maxDigits, {
  message: "minDigits must be ≤ maxDigits",
});
export type ColorDigitsZone = z.infer<typeof ColorDigitsZoneSchema>;

/** Zone 4 — Colour the letters: apply each requested colour to a letter. */
export const ColorLettersZoneSchema = z.object({
  kind: z.literal("color_letters"),
  ...TitleFields,
  minLetters: z.number().int().min(1).max(10),
  maxLetters: z.number().int().min(1).max(10),
}).refine((v) => v.minLetters <= v.maxLetters, {
  message: "minLetters must be ≤ maxLetters",
});
export type ColorLettersZone = z.infer<typeof ColorLettersZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone 5 — Pick objects by colour.                                          */
/*  Zone 6 — Memory card game.                                                */
/*                                                                            */
/*  Per-zone refinements would wrap the schema in ZodEffects which breaks     */
/*  discriminatedUnion; we therefore check the invariants at the top-level    */
/*  refinement in `ColorsLessonSectionSchema` below.                          */
/* -------------------------------------------------------------------------- */

export const SHAPE_KINDS = [
  "circle",
  "square",
  "triangle",
  "heart",
  "star",
  "flower",
  "apple",
  "balloon",
  "car",
  "ball",
] as const;
export type ShapeKind = (typeof SHAPE_KINDS)[number];

export const PickObjectsZoneSchema = z.object({
  kind: z.literal("pick_objects"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(20),
  gridCols: z.number().int().min(3).max(6),
  gridRows: z.number().int().min(3).max(6),
  targetCountMin: z.number().int().min(1).max(20),
  targetCountMax: z.number().int().min(1).max(20),
  shapePool: z.array(z.enum(SHAPE_KINDS)).min(1).max(20),
});
export type PickObjectsZone = z.infer<typeof PickObjectsZoneSchema>;

export const MEMORY_DIFFICULTY = ["easy", "medium", "hard"] as const;
export type MemoryDifficulty = (typeof MEMORY_DIFFICULTY)[number];

export const MemoryGameZoneSchema = z.object({
  kind: z.literal("memory_game"),
  ...TitleFields,
  difficulty: z.enum(MEMORY_DIFFICULTY),
  gridCols: z.number().int().min(2).max(6),
  gridRows: z.number().int().min(2).max(6),
  pairsCount: z.number().int().min(2).max(18),
  flipCheckDelayMs: z.number().int().min(300).max(5000),
});
export type MemoryGameZone = z.infer<typeof MemoryGameZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone union (raw — discriminatedUnion requires ZodObjects, not effects).  */
/*  Per-zone refinements above need the ZodObject, so we pick .refine() only */
/*  where the refinement is scoped to a single zone. The cross-field         */
/*  invariants (e.g. digits[].length ≥ maxDigits) live in the top-level      */
/*  schema below.                                                             */
/* -------------------------------------------------------------------------- */

export const ColorsLessonZoneSchema = z.discriminatedUnion("kind", [
  ColorsDiscoveryZoneSchema,
  ColorsListenPickZoneSchema,
  // These two have .refine() applied. That wraps them in ZodEffects which
  // breaks discriminatedUnion. We keep them raw in the union and duplicate
  // the check in the top-level refinement.
  z.object({
    kind: z.literal("color_digits"),
    ...TitleFields,
    minDigits: z.number().int().min(1).max(10),
    maxDigits: z.number().int().min(1).max(10),
  }),
  z.object({
    kind: z.literal("color_letters"),
    ...TitleFields,
    minLetters: z.number().int().min(1).max(10),
    maxLetters: z.number().int().min(1).max(10),
  }),
  PickObjectsZoneSchema,
  MemoryGameZoneSchema,
]);
export type ColorsLessonZone = z.infer<typeof ColorsLessonZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const ColorsLessonSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    colors: z.array(ArabicColorSchema).min(2).max(32),
    digits: z
      .array(z.number().int().min(0).max(9))
      .min(1)
      .max(10),
    letters: z.array(ArabicLetterSchema).min(1).max(32),
    zones: z.array(ColorsLessonZoneSchema).min(1).max(10),
  })
  .refine(
    (v) => {
      // Unique colour keys / letter chars — zone logic relies on lookup.
      const colorKeys = new Set<string>();
      for (const c of v.colors) {
        if (colorKeys.has(c.key)) return false;
        colorKeys.add(c.key);
      }
      const letterChars = new Set<string>();
      for (const l of v.letters) {
        if (letterChars.has(l.char)) return false;
        letterChars.add(l.char);
      }
      // Every zone's requested pool fits inside the available one.
      for (const z of v.zones) {
        if (z.kind === "listen_pick") {
          if (z.optionsPerRound > v.colors.length) return false;
        } else if (z.kind === "color_digits") {
          if (z.minDigits > z.maxDigits) return false;
          if (z.maxDigits > v.digits.length) return false;
          if (z.maxDigits > v.colors.length) return false;
        } else if (z.kind === "color_letters") {
          if (z.minLetters > z.maxLetters) return false;
          if (z.maxLetters > v.letters.length) return false;
          if (z.maxLetters > v.colors.length) return false;
        } else if (z.kind === "pick_objects") {
          if (z.targetCountMin > z.targetCountMax) return false;
          if (z.targetCountMax > z.gridCols * z.gridRows) return false;
          if (z.targetCountMax > v.colors.length) return false;
        } else if (z.kind === "memory_game") {
          // Cards on screen = gridCols × gridRows = pairsCount × 2.
          if (z.pairsCount * 2 !== z.gridCols * z.gridRows) return false;
          if (z.pairsCount > v.colors.length) return false;
        }
      }
      return true;
    },
    {
      message:
        "colors[].key and letters[].char must be unique; zone pools must fit the available catalogues",
    },
  );

export type ColorsLessonSection = z.infer<typeof ColorsLessonSectionSchema>;
