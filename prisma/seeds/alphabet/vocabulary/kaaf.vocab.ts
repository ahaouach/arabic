/**
 * Vocabulary pool for letter ك (kāf).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const KAAF_VOCAB: VocabularyWord[] = [
  {
    key: "kaaf_ball",
    letterKey: "kaaf",
    word: "كُرَةٌ",
    translit: "kura",
    emoji: "⚽",
    audioText: "كُرَةٌ",
    letters: [
      { base: "ك", harakat: "ُ", display: "كُ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "kaaf_cake",
    letterKey: "kaaf",
    word: "كَعْكٌ",
    translit: "kaʿk",
    emoji: "🎂",
    audioText: "كَعْكٌ",
    letters: [
      { base: "ك", harakat: "َ", display: "كَ", isTarget: true },
      { base: "ع", harakat: "ْ", display: "عْ", isTarget: false },
      { base: "ك", harakat: "ٌ", display: "كٌ", isTarget: true },
    ],
  },
  {
    key: "kaaf_book",
    letterKey: "kaaf",
    word: "كِتَابٌ",
    translit: "kitāb",
    emoji: "📖",
    audioText: "كِتَابٌ",
    letters: [
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: true },
      { base: "ت", harakat: "َ", display: "تَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "kaaf_dog",
    letterKey: "kaaf",
    word: "كَلْبٌ",
    translit: "kalb",
    emoji: "🐕",
    audioText: "كَلْبٌ",
    letters: [
      { base: "ك", harakat: "َ", display: "كَ", isTarget: true },
      { base: "ل", harakat: "ْ", display: "لْ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "kaaf_chair",
    letterKey: "kaaf",
    word: "كُرْسِيٌّ",
    translit: "kursiyy",
    emoji: "🪑",
    audioText: "كُرْسِيٌّ",
    letters: [
      { base: "ك", harakat: "ُ", display: "كُ", isTarget: true },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "س", harakat: "ِ", display: "سِ", isTarget: false },
      { base: "ي", harakat: "ٌّ", display: "يٌّ", isTarget: false },
    ],
  },
  {
    key: "kaaf_fish",
    letterKey: "kaaf",
    word: "سَمَكَةٌ",
    translit: "samaka",
    emoji: "🐟",
    audioText: "سَمَكَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ك", harakat: "َ", display: "كَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "kaaf_sugar",
    letterKey: "kaaf",
    word: "سُكَّرٌ",
    translit: "sukkar",
    emoji: "🍬",
    audioText: "سُكَّرٌ",
    letters: [
      { base: "س", harakat: "ُ", display: "سُ", isTarget: false },
      { base: "ك", harakat: "َّ", display: "كَّ", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "kaaf_rooster",
    letterKey: "kaaf",
    word: "دِيكٌ",
    translit: "dīk",
    emoji: "🐓",
    audioText: "دِيكٌ",
    letters: [
      { base: "د", harakat: "ِ", display: "دِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ك", harakat: "ٌ", display: "كٌ", isTarget: true },
    ],
  },
];
