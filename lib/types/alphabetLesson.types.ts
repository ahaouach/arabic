/**
 * Public types for the `alphabet_lesson` section.
 *
 * Re-exported from the Zod schema so runtime validation and static types
 * stay in lock-step. Prefer importing from here in components; only
 * import the *Schema values from `@/lib/schemas/alphabetLesson.schema`
 * when you actually need to run validation.
 */

export type {
  AlphabetLessonSection,
  AlphabetLessonZone,
  ArabicLetter,
  ColorLetterInWordZone,
  ColorLetterZone,
  FindWordsZone,
  LetterForm,
  LetterTashkeelZone,
  TashkeelState,
  VocabularyLetter,
  VocabularyWord,
  VocabularyZone,
} from "@/lib/schemas/alphabetLesson.schema";
