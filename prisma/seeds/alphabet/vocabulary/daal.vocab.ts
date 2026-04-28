/**
 * Vocabulary pool for letter د (dāl). Note: ذ (dhāl) is a distinct
 * codepoint and is NOT flagged as target here — it has its own pool.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const DAAL_VOCAB: VocabularyWord[] = [
  {
    key: "daal_chicken",
    letterKey: "daal",
    word: "دَجَاجَةٌ",
    translit: "dajāja",
    emoji: "🐔",
    audioText: "دَجَاجَةٌ",
    letters: [
      { base: "د", harakat: "َ", display: "دَ", isTarget: true },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "daal_bear",
    letterKey: "daal",
    word: "دُبٌّ",
    translit: "dubb",
    emoji: "🐻",
    audioText: "دُبٌّ",
    letters: [
      { base: "د", harakat: "ُ", display: "دُ", isTarget: true },
      { base: "ب", harakat: "ٌّ", display: "بٌّ", isTarget: false },
    ],
  },
  {
    key: "daal_bucket",
    letterKey: "daal",
    word: "دَلْوٌ",
    translit: "dalw",
    emoji: "🪣",
    audioText: "دَلْوٌ",
    letters: [
      { base: "د", harakat: "َ", display: "دَ", isTarget: true },
      { base: "ل", harakat: "ْ", display: "لْ", isTarget: false },
      { base: "و", harakat: "ٌ", display: "وٌ", isTarget: false },
    ],
  },
  {
    key: "daal_bicycle",
    letterKey: "daal",
    word: "دَرَّاجَةٌ",
    translit: "darrāja",
    emoji: "🚲",
    audioText: "دَرَّاجَةٌ",
    letters: [
      { base: "د", harakat: "َ", display: "دَ", isTarget: true },
      { base: "ر", harakat: "َّ", display: "رَّ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "daal_rooster",
    letterKey: "daal",
    word: "دِيكٌ",
    translit: "dīk",
    emoji: "🐓",
    audioText: "دِيكٌ",
    letters: [
      { base: "د", harakat: "ِ", display: "دِ", isTarget: true },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ك", harakat: "ٌ", display: "كٌ", isTarget: false },
    ],
  },
  {
    key: "daal_flower",
    letterKey: "daal",
    word: "وَرْدٌ",
    translit: "ward",
    emoji: "🌹",
    audioText: "وَرْدٌ",
    letters: [
      { base: "و", harakat: "َ", display: "وَ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", isTarget: true },
    ],
  },
  {
    key: "daal_hand",
    letterKey: "daal",
    word: "يَدٌ",
    translit: "yad",
    emoji: "✋",
    audioText: "يَدٌ",
    letters: [
      { base: "ي", harakat: "َ", display: "يَ", isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", isTarget: true },
    ],
  },
  {
    key: "daal_medicine",
    letterKey: "daal",
    word: "دَوَاءٌ",
    translit: "dawāʾ",
    emoji: "💊",
    audioText: "دَوَاءٌ",
    letters: [
      { base: "د", harakat: "َ", display: "دَ", isTarget: true },
      { base: "و", harakat: "َ", display: "وَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
];
