"use client";

import ColorLetterInWordZone from "./ColorLetterInWordZone";
import ColorLetterZone from "./ColorLetterZone";
import FindWordsZone from "./FindWordsZone";
import LetterTashkeelZone from "./LetterTashkeelZone";
import VocabularyZone from "./VocabularyZone";
import type {
  AlphabetLessonZone,
  ArabicLetter,
  VocabularyWord,
} from "@/lib/types/alphabetLesson.types";

export interface ZoneResult {
  correct: number;
  total: number;
}

export interface ZoneNavigatorProps {
  zone: AlphabetLessonZone;
  letter: ArabicLetter;
  allLetters: ArabicLetter[];
  vocabulary: VocabularyWord[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

/**
 * Dispatcher — picks the right alphabet-zone component from `zone.kind`.
 * Kept stateless so the parent `LetterJourney` owns all progress state.
 */
export default function ZoneNavigator({
  zone,
  letter,
  allLetters,
  vocabulary,
  onComplete,
  onAdvance,
}: ZoneNavigatorProps) {
  switch (zone.kind) {
    case "letter_tashkeel":
      return (
        <LetterTashkeelZone
          letter={letter}
          zone={zone}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "vocabulary":
      return (
        <VocabularyZone
          letter={letter}
          vocabulary={vocabulary}
          zone={zone}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "color_letter":
      return (
        <ColorLetterZone
          letter={letter}
          allLetters={allLetters}
          zone={zone}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "color_letter_in_word":
      return (
        <ColorLetterInWordZone
          letter={letter}
          vocabulary={vocabulary}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "find_words":
      return (
        <FindWordsZone
          letter={letter}
          vocabulary={vocabulary}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    default: {
      const _exhaustive: never = zone;
      return null;
    }
  }
}
