/**
 * Vocabulary pool for letter غ (ghayn).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const GHAYN_VOCAB: VocabularyWord[] = [
  {
    key: "ghayn_deer",
    letterKey: "ghayn",
    word: "غَزَالٌ",
    translit: "ghazāl",
    emoji: "🦌",
    audioText: "غَزَالٌ",
    letters: [
      { base: "غ", harakat: "َ", display: "غَ", isTarget: true },
      { base: "ز", harakat: "َ", display: "زَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_cloud",
    letterKey: "ghayn",
    word: "غَيْمٌ",
    translit: "ghaym",
    emoji: "☁️",
    audioText: "غَيْمٌ",
    letters: [
      { base: "غ", harakat: "َ", display: "غَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_room",
    letterKey: "ghayn",
    word: "غُرْفَةٌ",
    translit: "ghurfa",
    emoji: "🚪",
    audioText: "غُرْفَةٌ",
    letters: [
      { base: "غ", harakat: "ُ", display: "غُ", isTarget: true },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_lunch",
    letterKey: "ghayn",
    word: "غَدَاءٌ",
    translit: "ghadāʾ",
    emoji: "🍽️",
    audioText: "غَدَاءٌ",
    letters: [
      { base: "غ", harakat: "َ", display: "غَ", isTarget: true },
      { base: "د", harakat: "َ", display: "دَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_forest",
    letterKey: "ghayn",
    word: "غَابَةٌ",
    translit: "ghāba",
    emoji: "🌲",
    audioText: "غَابَةٌ",
    letters: [
      { base: "غ", harakat: "َ", display: "غَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_crow",
    letterKey: "ghayn",
    word: "غُرَابٌ",
    translit: "ghurāb",
    emoji: "🐦‍⬛",
    audioText: "غُرَابٌ",
    letters: [
      { base: "غ", harakat: "ُ", display: "غُ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_language",
    letterKey: "ghayn",
    word: "لُغَةٌ",
    translit: "lugha",
    emoji: "🗣️",
    audioText: "لُغَةٌ",
    letters: [
      { base: "ل", harakat: "ُ", display: "لُ", isTarget: false },
      { base: "غ", harakat: "َ", display: "غَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "ghayn_gum",
    letterKey: "ghayn",
    word: "صَمْغٌ",
    translit: "ṣamgh",
    emoji: "🍬",
    audioText: "صَمْغٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: false },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "غ", harakat: "ٌ", display: "غٌ", isTarget: true },
    ],
  },
];
