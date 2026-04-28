import { z } from "zod";
import { ArabicColorSchema } from "@/lib/schemas/colorsLesson.schema";

/* -------------------------------------------------------------------------- */
/*  Shape item (DB-driven; SVG path rendered via React's <path d=...> —       */
/*  never via dangerouslySetInnerHTML, so no XSS surface even from a          */
/*  malformed path string).                                                   */
/* -------------------------------------------------------------------------- */

const InternalPathSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^\/[A-Za-z0-9._\-/]+$/, "audioUrl must be a relative path");

// Restricts an SVG path `d` attribute to the subset of characters used by
// valid path commands. Whitelisting cuts attack surface without preventing
// legitimate curves.
const SvgPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .regex(
    /^[MmLlHhVvCcSsQqTtAaZz0-9eE,.\s+\-]+$/,
    "svgPath must contain only valid SVG path characters",
  );

const ViewBoxSchema = z
  .string()
  .trim()
  .regex(
    /^-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?$/,
    "viewBox must be four numbers separated by spaces",
  );

export const ArabicShapeSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[a-z0-9_-]+$/, "key must be lowercase alphanumeric"),
  nameAr: z.string().trim().min(1).max(100),
  transliteration: z.string().trim().min(1).max(100),
  svgPath: SvgPathSchema,
  viewBox: ViewBoxSchema,
  emoji: z.string().trim().min(1).max(8),
  audioText: z.string().trim().min(1).max(200),
  audioUrl: InternalPathSchema.optional(),
});
export type ArabicShape = z.infer<typeof ArabicShapeSchema>;

/* -------------------------------------------------------------------------- */
/*  Letter glyph — pre-split in the seed so we never have to split a          */
/*  vowelized Arabic word at runtime (harakat are combining marks, which      */
/*  makes runtime splitting brittle).                                         */
/* -------------------------------------------------------------------------- */

export const LetterGlyphSchema = z.object({
  base: z.string().trim().min(1).max(4),
  harakat: z.string().max(6), // may be empty; harakat are combining marks
  display: z.string().trim().min(1).max(10),
  name: z.string().trim().min(1).max(100),
});
export type LetterGlyph = z.infer<typeof LetterGlyphSchema>;

export const ShapeWordSchema = z.object({
  shapeKey: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[a-z0-9_-]+$/, "shapeKey must be lowercase alphanumeric"),
  word: z.string().trim().min(1).max(100),
  letters: z.array(LetterGlyphSchema).min(1).max(12),
});
export type ShapeWord = z.infer<typeof ShapeWordSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone configs                                                              */
/*  Per-zone refinements wrap a schema in ZodEffects, which breaks            */
/*  discriminatedUnion. We therefore keep the per-zone schemas as plain       */
/*  ZodObjects and enforce cross-field invariants at the top level.           */
/* -------------------------------------------------------------------------- */

const TitleFields = {
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
};

/** Zone 1 — Discovery: every shape, hover/click to hear. */
export const ShapesDiscoveryZoneSchema = z.object({
  kind: z.literal("discovery"),
  ...TitleFields,
});
export type ShapesDiscoveryZone = z.infer<typeof ShapesDiscoveryZoneSchema>;

/** Zone 2 — Listen & Pick: hear a shape, pick from N options. */
export const ShapesListenPickZoneSchema = z.object({
  kind: z.literal("listen_pick"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(20),
  optionsPerRound: z.number().int().min(2).max(6),
});
export type ShapesListenPickZone = z.infer<typeof ShapesListenPickZoneSchema>;

/** Zone 3 — Count the shapes in a scene. */
export const CountShapesZoneSchema = z.object({
  kind: z.literal("count_shapes"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(20),
  minShapes: z.number().int().min(3).max(30),
  maxShapes: z.number().int().min(3).max(30),
  minTargetCount: z.number().int().min(1).max(20),
  maxTargetCount: z.number().int().min(1).max(20),
});
export type CountShapesZone = z.infer<typeof CountShapesZoneSchema>;

/** Zone 4 — Color a specific shape by name. */
export const ColorShapeZoneSchema = z.object({
  kind: z.literal("color_shape"),
  ...TitleFields,
  minInstructions: z.number().int().min(1).max(10),
  maxInstructions: z.number().int().min(1).max(10),
});
export type ColorShapeZone = z.infer<typeof ColorShapeZoneSchema>;

/** Zone 5 — Color letters of the shape's word. */
export const ColorLettersWordZoneSchema = z.object({
  kind: z.literal("color_letters_word"),
  ...TitleFields,
  rounds: z.number().int().min(1).max(10),
  minLettersToColor: z.number().int().min(1).max(6),
  maxLettersToColor: z.number().int().min(1).max(6),
});
export type ColorLettersWordZone = z.infer<typeof ColorLettersWordZoneSchema>;

/** Zone 6 — Free-hand canvas drawing. */
export const DrawShapeZoneSchema = z.object({
  kind: z.literal("draw_shape"),
  ...TitleFields,
  showGuideByDefault: z.boolean(),
  brushSizes: z.array(z.number().int().min(1).max(40)).min(1).max(6),
  maxUndoStack: z.number().int().min(1).max(200),
});
export type DrawShapeZone = z.infer<typeof DrawShapeZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone union                                                                */
/* -------------------------------------------------------------------------- */

export const ShapesLessonZoneSchema = z.discriminatedUnion("kind", [
  ShapesDiscoveryZoneSchema,
  ShapesListenPickZoneSchema,
  CountShapesZoneSchema,
  ColorShapeZoneSchema,
  ColorLettersWordZoneSchema,
  DrawShapeZoneSchema,
]);
export type ShapesLessonZone = z.infer<typeof ShapesLessonZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const ShapesLessonSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    shapes: z.array(ArabicShapeSchema).min(2).max(20),
    shapeWords: z.array(ShapeWordSchema).min(1).max(20),
    colors: z.array(ArabicColorSchema).min(2).max(32),
    zones: z.array(ShapesLessonZoneSchema).min(1).max(10),
  })
  .refine(
    (v) => {
      const shapeKeys = new Set<string>();
      for (const s of v.shapes) {
        if (shapeKeys.has(s.key)) return false;
        shapeKeys.add(s.key);
      }
      const colorKeys = new Set<string>();
      for (const c of v.colors) {
        if (colorKeys.has(c.key)) return false;
        colorKeys.add(c.key);
      }

      // Every shapeWord must reference an existing shape.
      for (const w of v.shapeWords) {
        if (!shapeKeys.has(w.shapeKey)) return false;
      }

      for (const z of v.zones) {
        if (z.kind === "listen_pick") {
          if (z.optionsPerRound > v.shapes.length) return false;
        } else if (z.kind === "count_shapes") {
          if (z.minShapes > z.maxShapes) return false;
          if (z.minTargetCount > z.maxTargetCount) return false;
          if (z.maxTargetCount > z.maxShapes) return false;
        } else if (z.kind === "color_shape") {
          if (z.minInstructions > z.maxInstructions) return false;
          if (z.maxInstructions > v.shapes.length) return false;
          if (z.maxInstructions > v.colors.length) return false;
        } else if (z.kind === "color_letters_word") {
          if (z.minLettersToColor > z.maxLettersToColor) return false;
          // The maximum letters to color in any round can't exceed the
          // colors palette (we pick distinct colors per round).
          if (z.maxLettersToColor > v.colors.length) return false;
          // At least one word in the catalogue must be long enough.
          const longest = v.shapeWords.reduce(
            (m, w) => Math.max(m, w.letters.length),
            0,
          );
          if (z.maxLettersToColor > longest) return false;
        }
      }
      return true;
    },
    {
      message:
        "shapes[].key and colors[].key must be unique; every shapeWord.shapeKey must reference a shape; zone pools must fit the catalogues",
    },
  );

export type ShapesLessonSection = z.infer<typeof ShapesLessonSectionSchema>;
