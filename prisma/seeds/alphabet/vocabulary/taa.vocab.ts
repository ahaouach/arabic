/**
 * Vocabulary pool for letter ت (tāʾ). `ة` (teh marbuta) is a distinct
 * codepoint and NOT flagged as target here — the pedagogical target is
 * the plain tāʾ only. `ت` is flagged wherever it appears.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const TAA_VOCAB: VocabularyWord[] = [
  {
    key: "taa_apple",
    letterKey: "taa",
    word: "تُفَّاحٌ",
    translit: "tuffāḥ",
    emoji: "🍎",
    audioText: "تُفَّاحٌ",
    letters: [
      { base: "ت", harakat: "ُ", display: "تُ", isTarget: true },
      { base: "ف", harakat: "َّ", display: "فَّ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ح", harakat: "ٌ", display: "حٌ", isTarget: false },
    ],
  },
  {
    key: "taa_fig",
    letterKey: "taa",
    word: "تِينٌ",
    translit: "tīn",
    emoji: "🍈",
    audioText: "تِينٌ",
    letters: [
      { base: "ت", harakat: "ِ", display: "تِ", isTarget: true },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "taa_dates",
    letterKey: "taa",
    word: "تَمْرٌ",
    translit: "tamr",
    emoji: "🌴",
    audioText: "تَمْرٌ",
    letters: [
      { base: "ت", harakat: "َ", display: "تَ", isTarget: true },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "taa_girl",
    letterKey: "taa",
    word: "بِنْتٌ",
    translit: "bint",
    emoji: "👧",
    audioText: "بِنْتٌ",
    letters: [
      { base: "ب", harakat: "ِ", display: "بِ", isTarget: false },
      { base: "ن", harakat: "ْ", display: "نْ", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: true },
    ],
  },
  {
    key: "taa_house",
    letterKey: "taa",
    word: "بَيْتٌ",
    translit: "bayt",
    emoji: "🏠",
    audioText: "بَيْتٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: true },
    ],
  },
  {
    key: "taa_book",
    letterKey: "taa",
    word: "كِتَابٌ",
    translit: "kitāb",
    emoji: "📖",
    audioText: "كِتَابٌ",
    letters: [
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "taa_crown",
    letterKey: "taa",
    word: "تَاجٌ",
    translit: "tāj",
    emoji: "👑",
    audioText: "تَاجٌ",
    letters: [
      { base: "ت", harakat: "َ", display: "تَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ج", harakat: "ٌ", display: "جٌ", isTarget: false },
    ],
  },
  {
    key: "taa_berries",
    letterKey: "taa",
    word: "تُوتٌ",
    translit: "tūt",
    emoji: "🫐",
    audioText: "تُوتٌ",
    letters: [
      { base: "ت", harakat: "ُ", display: "تُ", isTarget: true },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: true },
    ],
  },
];
