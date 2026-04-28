/**
 * Vocabulary pool for letter ل (lām).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const LAAM_VOCAB: VocabularyWord[] = [
  {
    key: "laam_night",
    letterKey: "laam",
    word: "لَيْلٌ",
    translit: "layl",
    emoji: "🌙",
    audioText: "لَيْلٌ",
    letters: [
      { base: "ل", harakat: "َ", display: "لَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: true },
    ],
  },
  {
    key: "laam_yogurt",
    letterKey: "laam",
    word: "لَبَنٌ",
    translit: "laban",
    emoji: "🥛",
    audioText: "لَبَنٌ",
    letters: [
      { base: "ل", harakat: "َ", display: "لَ", isTarget: true },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "laam_meat",
    letterKey: "laam",
    word: "لَحْمٌ",
    translit: "laḥm",
    emoji: "🥩",
    audioText: "لَحْمٌ",
    letters: [
      { base: "ل", harakat: "َ", display: "لَ", isTarget: true },
      { base: "ح", harakat: "ْ", display: "حْ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "laam_tongue",
    letterKey: "laam",
    word: "لِسَانٌ",
    translit: "lisān",
    emoji: "👅",
    audioText: "لِسَانٌ",
    letters: [
      { base: "ل", harakat: "ِ", display: "لِ", isTarget: true },
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "laam_almonds",
    letterKey: "laam",
    word: "لَوْزٌ",
    translit: "lawz",
    emoji: "🌰",
    audioText: "لَوْزٌ",
    letters: [
      { base: "ل", harakat: "َ", display: "لَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: false },
    ],
  },
  {
    key: "laam_camel",
    letterKey: "laam",
    word: "جَمَلٌ",
    translit: "jamal",
    emoji: "🐫",
    audioText: "جَمَلٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: true },
    ],
  },
  {
    key: "laam_honey",
    letterKey: "laam",
    word: "عَسَلٌ",
    translit: "ʿasal",
    emoji: "🍯",
    audioText: "عَسَلٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", isTarget: false },
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: true },
    ],
  },
  {
    key: "laam_elephant",
    letterKey: "laam",
    word: "فِيلٌ",
    translit: "fīl",
    emoji: "🐘",
    audioText: "فِيلٌ",
    letters: [
      { base: "ف", harakat: "ِ", display: "فِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: true },
    ],
  },
];
