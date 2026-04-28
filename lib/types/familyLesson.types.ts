/**
 * Public types for the `family_lesson` section.
 *
 * Re-exported from the Zod schema so runtime validation and static
 * types stay in lock-step. Prefer importing from here in components;
 * only import the *Schema values from `@/lib/schemas/familyLesson.schema`
 * when you actually need to run validation.
 */

export type {
  FamilyCategory,
  FamilyColorLettersZone,
  FamilyColorMemberZone,
  FamilyCountZone,
  FamilyDiscoveryZone,
  FamilyLessonSection,
  FamilyLessonZone,
  FamilyListenPickZone,
  FamilyMatchingZone,
  FamilyMember,
  FamilyWord,
  WordLetter,
} from "@/lib/schemas/familyLesson.schema";
