/**
 * Vocabulary pool for letter ر (rāʾ). Very common letter — plenty of
 * child-friendly nouns to pick from.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const RAA_VOCAB: VocabularyWord[] = [
  {
    key: "raa_man",
    letterKey: "raa",
    word: "رَجُلٌ",
    translit: "rajul",
    emoji: "👨",
    audioText: "رَجُلٌ",
    letters: [
      { base: "ر", harakat: "َ", display: "رَ", isTarget: true },
      { base: "ج", harakat: "ُ", display: "جُ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "raa_pomegranate",
    letterKey: "raa",
    word: "رُمَّانٌ",
    translit: "rummān",
    emoji: "🍎",
    audioText: "رُمَّانٌ",
    letters: [
      { base: "ر", harakat: "ُ", display: "رُ", isTarget: true },
      { base: "م", harakat: "َّ", display: "مَّ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "raa_sand",
    letterKey: "raa",
    word: "رَمْلٌ",
    translit: "raml",
    emoji: "🏜️",
    audioText: "رَمْلٌ",
    letters: [
      { base: "ر", harakat: "َ", display: "رَ", isTarget: true },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "raa_moon",
    letterKey: "raa",
    word: "قَمَرٌ",
    translit: "qamar",
    emoji: "🌙",
    audioText: "قَمَرٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: true },
    ],
  },
  {
    key: "raa_sugar",
    letterKey: "raa",
    word: "سُكَّرٌ",
    translit: "sukkar",
    emoji: "🍬",
    audioText: "سُكَّرٌ",
    letters: [
      { base: "س", harakat: "ُ", display: "سُ", isTarget: false },
      { base: "ك", harakat: "َّ", display: "كَّ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: true },
    ],
  },
  {
    key: "raa_cow",
    letterKey: "raa",
    word: "بَقَرَةٌ",
    translit: "baqara",
    emoji: "🐄",
    audioText: "بَقَرَةٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ق", harakat: "َ", display: "قَ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "raa_giraffe",
    letterKey: "raa",
    word: "زَرَافَةٌ",
    translit: "zarāfa",
    emoji: "🦒",
    audioText: "زَرَافَةٌ",
    letters: [
      { base: "ز", harakat: "َ", display: "زَ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "raa_tiger",
    letterKey: "raa",
    word: "نَمِرٌ",
    translit: "namir",
    emoji: "🐅",
    audioText: "نَمِرٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: false },
      { base: "م", harakat: "ِ", display: "مِ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: true },
    ],
  },
];
