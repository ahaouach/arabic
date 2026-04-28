/**
 * Public types for the colors_lesson section.
 *
 * Re-exported from the Zod schema so runtime validation and static types
 * stay in lock-step. Prefer importing from here in components; only
 * import the *Schema values from `@/lib/schemas/colorsLesson.schema`
 * when you actually need to run validation.
 */

export type {
  ArabicColor,
  ArabicLetter,
  ColorsLessonSection,
  ColorsLessonZone,
  ColorsDiscoveryZone,
  ColorsListenPickZone,
  ColorDigitsZone,
  ColorLettersZone,
  PickObjectsZone,
  MemoryGameZone,
  ShapeKind,
  MemoryDifficulty,
} from "@/lib/schemas/colorsLesson.schema";
