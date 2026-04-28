/**
 * Vocabulary pool for letter ز (zāy).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const ZAY_VOCAB: VocabularyWord[] = [
  {
    key: "zay_oil",
    letterKey: "zay",
    word: "زَيْتٌ",
    translit: "zayt",
    emoji: "🫒",
    audioText: "زَيْتٌ",
    letters: [
      { base: "ز", harakat: "َ", display: "زَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "zay_giraffe",
    letterKey: "zay",
    word: "زَرَافَةٌ",
    translit: "zarāfa",
    emoji: "🦒",
    audioText: "زَرَافَةٌ",
    letters: [
      { base: "ز", harakat: "َ", display: "زَ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "zay_flower",
    letterKey: "zay",
    word: "زَهْرَةٌ",
    translit: "zahra",
    emoji: "🌺",
    audioText: "زَهْرَةٌ",
    letters: [
      { base: "ز", harakat: "َ", display: "زَ", isTarget: true },
      { base: "ه", harakat: "ْ", display: "هْ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "zay_glass",
    letterKey: "zay",
    word: "زُجَاجٌ",
    translit: "zujāj",
    emoji: "🥛",
    audioText: "زُجَاجٌ",
    letters: [
      { base: "ز", harakat: "ُ", display: "زُ", isTarget: true },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ج", harakat: "ٌ", display: "جٌ", isTarget: false },
    ],
  },
  {
    key: "zay_carrots",
    letterKey: "zay",
    word: "جَزَرٌ",
    translit: "jazar",
    emoji: "🥕",
    audioText: "جَزَرٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ز", harakat: "َ", display: "زَ", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "zay_bread",
    letterKey: "zay",
    word: "خُبْزٌ",
    translit: "khubz",
    emoji: "🍞",
    audioText: "خُبْزٌ",
    letters: [
      { base: "خ", harakat: "ُ", display: "خُ", isTarget: false },
      { base: "ب", harakat: "ْ", display: "بْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: true },
    ],
  },
  {
    key: "zay_banana",
    letterKey: "zay",
    word: "مَوْزٌ",
    translit: "mawz",
    emoji: "🍌",
    audioText: "مَوْزٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: true },
    ],
  },
  {
    key: "zay_rice",
    letterKey: "zay",
    word: "أُرْزٌ",
    translit: "urz",
    emoji: "🍚",
    audioText: "أُرْزٌ",
    letters: [
      { base: "أ", harakat: "ُ", display: "أُ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: true },
    ],
  },
];
