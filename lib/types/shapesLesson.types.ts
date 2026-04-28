/**
 * Public types for the `shapes_lesson` section.
 *
 * Re-exported from the Zod schema so runtime validation and static types
 * stay in lock-step. Prefer importing from here in components; only
 * import the *Schema values from `@/lib/schemas/shapesLesson.schema`
 * when you actually need to run validation.
 *
 * `ArabicColor` is re-exported from the colors schema to avoid a circular
 * re-definition — the two lessons share the palette shape.
 */

export type {
  ArabicShape,
  LetterGlyph,
  ShapeWord,
  ShapesLessonSection,
  ShapesLessonZone,
  ShapesDiscoveryZone,
  ShapesListenPickZone,
  CountShapesZone,
  ColorShapeZone,
  ColorLettersWordZone,
  DrawShapeZone,
} from "@/lib/schemas/shapesLesson.schema";

export type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";
