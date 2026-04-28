/**
 * Vocabulary pool for letter ف (fāʾ).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const FAA_VOCAB: VocabularyWord[] = [
  {
    key: "faa_horse",
    letterKey: "faa",
    word: "فَرَسٌ",
    translit: "faras",
    emoji: "🐎",
    audioText: "فَرَسٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: false },
    ],
  },
  {
    key: "faa_elephant",
    letterKey: "faa",
    word: "فِيلٌ",
    translit: "fīl",
    emoji: "🐘",
    audioText: "فِيلٌ",
    letters: [
      { base: "ف", harakat: "ِ", display: "فِ", isTarget: true },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "faa_mouse",
    letterKey: "faa",
    word: "فَأْرٌ",
    translit: "faʾr",
    emoji: "🐭",
    audioText: "فَأْرٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: true },
      { base: "أ", harakat: "ْ", display: "أْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "faa_butterfly",
    letterKey: "faa",
    word: "فَرَاشَةٌ",
    translit: "farāsha",
    emoji: "🦋",
    audioText: "فَرَاشَةٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ش", harakat: "َ", display: "شَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "faa_fava",
    letterKey: "faa",
    word: "فُولٌ",
    translit: "fūl",
    emoji: "🫘",
    audioText: "فُولٌ",
    letters: [
      { base: "ف", harakat: "ُ", display: "فُ", isTarget: true },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "faa_mouth",
    letterKey: "faa",
    word: "فَمٌ",
    translit: "fam",
    emoji: "👄",
    audioText: "فَمٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: true },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "faa_fruit",
    letterKey: "faa",
    word: "فَاكِهَةٌ",
    translit: "fākiha",
    emoji: "🍎",
    audioText: "فَاكِهَةٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: false },
      { base: "ه", harakat: "َ", display: "هَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "faa_sheep",
    letterKey: "faa",
    word: "خَرُوفٌ",
    translit: "kharūf",
    emoji: "🐑",
    audioText: "خَرُوفٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", isTarget: false },
      { base: "ر", harakat: "ُ", display: "رُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", isTarget: true },
    ],
  },
];
