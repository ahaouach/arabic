/**
 * Vocabulary pool for letter خ (khāʾ).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const KHAA_VOCAB: VocabularyWord[] = [
  {
    key: "khaa_bread",
    letterKey: "khaa",
    word: "خُبْزٌ",
    translit: "khubz",
    emoji: "🍞",
    audioText: "خُبْزٌ",
    letters: [
      { base: "خ", harakat: "ُ", display: "خُ", isTarget: true },
      { base: "ب", harakat: "ْ", display: "بْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_sheep",
    letterKey: "khaa",
    word: "خَرُوفٌ",
    translit: "kharūf",
    emoji: "🐑",
    audioText: "خَرُوفٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", isTarget: true },
      { base: "ر", harakat: "ُ", display: "رُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_tent",
    letterKey: "khaa",
    word: "خَيْمَةٌ",
    translit: "khayma",
    emoji: "⛺",
    audioText: "خَيْمَةٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_cucumber",
    letterKey: "khaa",
    word: "خِيَارٌ",
    translit: "khiyār",
    emoji: "🥒",
    audioText: "خِيَارٌ",
    letters: [
      { base: "خ", harakat: "ِ", display: "خِ", isTarget: true },
      { base: "ي", harakat: "َ", display: "يَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_ring",
    letterKey: "khaa",
    word: "خَاتَمٌ",
    translit: "khātam",
    emoji: "💍",
    audioText: "خَاتَمٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_bat",
    letterKey: "khaa",
    word: "خُفَّاشٌ",
    translit: "khuffāsh",
    emoji: "🦇",
    audioText: "خُفَّاشٌ",
    letters: [
      { base: "خ", harakat: "ُ", display: "خُ", isTarget: true },
      { base: "ف", harakat: "َّ", display: "فَّ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ش", harakat: "ٌ", display: "شٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_sister",
    letterKey: "khaa",
    word: "أُخْتٌ",
    translit: "ukht",
    emoji: "👧",
    audioText: "أُخْتٌ",
    letters: [
      { base: "أ", harakat: "ُ", display: "أُ", isTarget: false },
      { base: "خ", harakat: "ْ", display: "خْ", isTarget: true },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "khaa_watermelon",
    letterKey: "khaa",
    word: "بِطِّيخٌ",
    translit: "biṭṭīkh",
    emoji: "🍉",
    audioText: "بِطِّيخٌ",
    letters: [
      { base: "ب", harakat: "ِ", display: "بِ", isTarget: false },
      { base: "ط", harakat: "ِّ", display: "طِّ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "خ", harakat: "ٌ", display: "خٌ", isTarget: true },
    ],
  },
];
