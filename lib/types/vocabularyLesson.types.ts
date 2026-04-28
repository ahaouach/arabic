/**
 * Public types for the `vocabulary_lesson` section.
 *
 * Re-exported from the Zod schema so runtime validation and static
 * types stay in lock-step. Prefer importing from here in components;
 * import the *Schema values from `@/lib/schemas/vocabularyLesson.schema`
 * only when running validation.
 */

export type {
  IdleAnimationKind,
  VocabularyItem,
  VocabularyWord,
  WordLetter,
  VocabDiscoveryZone,
  VocabListenPickZone,
  VocabCountZone,
  VocabColorItemZone,
  VocabColorLettersZone,
  VocabularyLessonZone,
  VocabularyLessonSection,
} from "@/lib/schemas/vocabularyLesson.schema";
