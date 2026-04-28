/**
 * Vocabulary pool for letter ج (jīm). Every ج occurrence flagged.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const JEEM_VOCAB: VocabularyWord[] = [
  {
    key: "jeem_camel",
    letterKey: "jeem",
    word: "جَمَلٌ",
    translit: "jamal",
    emoji: "🐫",
    audioText: "جَمَلٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_carrots",
    letterKey: "jeem",
    word: "جَزَرٌ",
    translit: "jazar",
    emoji: "🥕",
    audioText: "جَزَرٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "ز", harakat: "َ", display: "زَ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_mountain",
    letterKey: "jeem",
    word: "جَبَلٌ",
    translit: "jabal",
    emoji: "⛰️",
    audioText: "جَبَلٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_bell",
    letterKey: "jeem",
    word: "جَرَسٌ",
    translit: "jaras",
    emoji: "🔔",
    audioText: "جَرَسٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_sock",
    letterKey: "jeem",
    word: "جَوْرَبٌ",
    translit: "jawrab",
    emoji: "🧦",
    audioText: "جَوْرَبٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_walnut",
    letterKey: "jeem",
    word: "جَوْزٌ",
    translit: "jawz",
    emoji: "🥜",
    audioText: "جَوْزٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_chicken",
    letterKey: "jeem",
    word: "دَجَاجَةٌ",
    translit: "dajāja",
    emoji: "🐔",
    audioText: "دَجَاجَةٌ",
    letters: [
      { base: "د", harakat: "َ", display: "دَ", isTarget: false },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "jeem_crown",
    letterKey: "jeem",
    word: "تَاجٌ",
    translit: "tāj",
    emoji: "👑",
    audioText: "تَاجٌ",
    letters: [
      { base: "ت", harakat: "َ", display: "تَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ج", harakat: "ٌ", display: "جٌ", isTarget: true },
    ],
  },
];
