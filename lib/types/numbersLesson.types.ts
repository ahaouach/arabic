/**
 * Public types for the numbers_lesson section.
 *
 * Re-exported from the Zod schema so runtime validation and static types
 * stay in lock-step. Prefer importing from here in components; only import
 * the *Schema values from `@/lib/schemas/numbersLesson.schema` when you
 * actually need to run validation.
 */

export type {
  NumberItem,
  NumbersLessonSection,
  NumbersLessonZone,
  DiscoveryZone,
  ListenPickZone,
  CountColorZone,
  MatchingZone,
  WriteNumberZone,
  ColorTargetDigitZone,
} from "@/lib/schemas/numbersLesson.schema";
