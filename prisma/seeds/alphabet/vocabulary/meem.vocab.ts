/**
 * Vocabulary pool for letter م (mīm).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const MEEM_VOCAB: VocabularyWord[] = [
  {
    key: "meem_king",
    letterKey: "meem",
    word: "مَلِكٌ",
    translit: "malik",
    emoji: "👑",
    audioText: "مَلِكٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: true },
      { base: "ل", harakat: "ِ", display: "لِ", isTarget: false },
      { base: "ك", harakat: "ٌ", display: "كٌ", isTarget: false },
    ],
  },
  {
    key: "meem_school",
    letterKey: "meem",
    word: "مَدْرَسَةٌ",
    translit: "madrasa",
    emoji: "🏫",
    audioText: "مَدْرَسَةٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: true },
      { base: "د", harakat: "ْ", display: "دْ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "meem_key",
    letterKey: "meem",
    word: "مِفْتَاحٌ",
    translit: "miftāḥ",
    emoji: "🔑",
    audioText: "مِفْتَاحٌ",
    letters: [
      { base: "م", harakat: "ِ", display: "مِ", isTarget: true },
      { base: "ف", harakat: "ْ", display: "فْ", isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ح", harakat: "ٌ", display: "حٌ", isTarget: false },
    ],
  },
  {
    key: "meem_water",
    letterKey: "meem",
    word: "مَاءٌ",
    translit: "māʾ",
    emoji: "💧",
    audioText: "مَاءٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
  {
    key: "meem_banana",
    letterKey: "meem",
    word: "مَوْزٌ",
    translit: "mawz",
    emoji: "🍌",
    audioText: "مَوْزٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: false },
    ],
  },
  {
    key: "meem_playground",
    letterKey: "meem",
    word: "مَلْعَبٌ",
    translit: "malʿab",
    emoji: "🛝",
    audioText: "مَلْعَبٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: true },
      { base: "ل", harakat: "ْ", display: "لْ", isTarget: false },
      { base: "ع", harakat: "َ", display: "عَ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "meem_camel",
    letterKey: "meem",
    word: "جَمَلٌ",
    translit: "jamal",
    emoji: "🐫",
    audioText: "جَمَلٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: true },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "meem_pen",
    letterKey: "meem",
    word: "قَلَمٌ",
    translit: "qalam",
    emoji: "✏️",
    audioText: "قَلَمٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: true },
    ],
  },
];
