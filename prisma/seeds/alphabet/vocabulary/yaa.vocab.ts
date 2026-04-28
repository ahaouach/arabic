/**
 * Vocabulary pool for letter ي (yāʾ). Like و, this letter is tagged
 * wherever it appears — both as a consonant and as a long ī vowel.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const YAA_VOCAB: VocabularyWord[] = [
  {
    key: "yaa_hand",
    letterKey: "yaa",
    word: "يَدٌ",
    translit: "yad",
    emoji: "✋",
    audioText: "يَدٌ",
    letters: [
      { base: "ي", harakat: "َ", display: "يَ", isTarget: true },
      { base: "د", harakat: "ٌ", display: "دٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_day",
    letterKey: "yaa",
    word: "يَوْمٌ",
    translit: "yawm",
    emoji: "📅",
    audioText: "يَوْمٌ",
    letters: [
      { base: "ي", harakat: "َ", display: "يَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_pumpkin",
    letterKey: "yaa",
    word: "يَقْطِينٌ",
    translit: "yaqṭīn",
    emoji: "🎃",
    audioText: "يَقْطِينٌ",
    letters: [
      { base: "ي", harakat: "َ", display: "يَ", isTarget: true },
      { base: "ق", harakat: "ْ", display: "قْ", isTarget: false },
      { base: "ط", harakat: "ِ", display: "طِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: true },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_house",
    letterKey: "yaa",
    word: "بَيْتٌ",
    translit: "bayt",
    emoji: "🏠",
    audioText: "بَيْتٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: true },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_oil",
    letterKey: "yaa",
    word: "زَيْتٌ",
    translit: "zayt",
    emoji: "🫒",
    audioText: "زَيْتٌ",
    letters: [
      { base: "ز", harakat: "َ", display: "زَ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: true },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_elephant",
    letterKey: "yaa",
    word: "فِيلٌ",
    translit: "fīl",
    emoji: "🐘",
    audioText: "فِيلٌ",
    letters: [
      { base: "ف", harakat: "ِ", display: "فِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: true },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_milk",
    letterKey: "yaa",
    word: "حَلِيبٌ",
    translit: "ḥalīb",
    emoji: "🥛",
    audioText: "حَلِيبٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", isTarget: false },
      { base: "ل", harakat: "ِ", display: "لِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: true },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "yaa_rooster",
    letterKey: "yaa",
    word: "دِيكٌ",
    translit: "dīk",
    emoji: "🐓",
    audioText: "دِيكٌ",
    letters: [
      { base: "د", harakat: "ِ", display: "دِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: true },
      { base: "ك", harakat: "ٌ", display: "كٌ", isTarget: false },
    ],
  },
];
