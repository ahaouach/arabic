/**
 * Vocabulary pool for letter ب (bāʾ). Every occurrence of ب in each
 * word is flagged with `isTarget: true`, including repeated occurrences.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const BAA_VOCAB: VocabularyWord[] = [
  {
    key: "baa_door",
    letterKey: "baa",
    word: "بَابٌ",
    translit: "bāb",
    emoji: "🚪",
    audioText: "بَابٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: true },
    ],
  },
  {
    key: "baa_duck",
    letterKey: "baa",
    word: "بَطَّةٌ",
    translit: "baṭṭa",
    emoji: "🦆",
    audioText: "بَطَّةٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: true },
      { base: "ط", harakat: "َّ", display: "طَّ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "baa_sea",
    letterKey: "baa",
    word: "بَحْرٌ",
    translit: "baḥr",
    emoji: "🌊",
    audioText: "بَحْرٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: true },
      { base: "ح", harakat: "ْ", display: "حْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "baa_house",
    letterKey: "baa",
    word: "بَيْتٌ",
    translit: "bayt",
    emoji: "🏠",
    audioText: "بَيْتٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "baa_owl",
    letterKey: "baa",
    word: "بُومَةٌ",
    translit: "būma",
    emoji: "🦉",
    audioText: "بُومَةٌ",
    letters: [
      { base: "ب", harakat: "ُ", display: "بُ", isTarget: true },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "baa_milk",
    letterKey: "baa",
    word: "حَلِيبٌ",
    translit: "ḥalīb",
    emoji: "🥛",
    audioText: "حَلِيبٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", isTarget: false },
      { base: "ل", harakat: "ِ", display: "لِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: true },
    ],
  },
  {
    key: "baa_book",
    letterKey: "baa",
    word: "كِتَابٌ",
    translit: "kitāb",
    emoji: "📖",
    audioText: "كِتَابٌ",
    letters: [
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: true },
    ],
  },
  {
    key: "baa_heart",
    letterKey: "baa",
    word: "قَلْبٌ",
    translit: "qalb",
    emoji: "💗",
    audioText: "قَلْبٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: true },
    ],
  },
];
