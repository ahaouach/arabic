/**
 * Vocabulary pool for letter ا (alif). Only words with a plain ا
 * (U+0627) are included — أ / إ / آ / ى are distinct codepoints and
 * would not match `letter.char` at runtime, so they never carry
 * `isTarget: true` here.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const ALIF_VOCAB: VocabularyWord[] = [
  {
    key: "alif_door",
    letterKey: "alif",
    word: "بَابٌ",
    translit: "bāb",
    emoji: "🚪",
    audioText: "بَابٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "alif_book",
    letterKey: "alif",
    word: "كِتَابٌ",
    translit: "kitāb",
    emoji: "📖",
    audioText: "كِتَابٌ",
    letters: [
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "alif_fire",
    letterKey: "alif",
    word: "نَارٌ",
    translit: "nār",
    emoji: "🔥",
    audioText: "نَارٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "alif_water",
    letterKey: "alif",
    word: "مَاءٌ",
    translit: "māʾ",
    emoji: "💧",
    audioText: "مَاءٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
  {
    key: "alif_donkey",
    letterKey: "alif",
    word: "حِمَارٌ",
    translit: "ḥimār",
    emoji: "🫏",
    audioText: "حِمَارٌ",
    letters: [
      { base: "ح", harakat: "ِ", display: "حِ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "alif_chicken",
    letterKey: "alif",
    word: "دَجَاجَةٌ",
    translit: "dajāja",
    emoji: "🐔",
    audioText: "دَجَاجَةٌ",
    letters: [
      { base: "د", harakat: "َ", display: "دَ", isTarget: false },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "alif_butterfly",
    letterKey: "alif",
    word: "فَرَاشَةٌ",
    translit: "farāsha",
    emoji: "🦋",
    audioText: "فَرَاشَةٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ش", harakat: "َ", display: "شَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "alif_crow",
    letterKey: "alif",
    word: "غُرَابٌ",
    translit: "ghurāb",
    emoji: "🐦‍⬛",
    audioText: "غُرَابٌ",
    letters: [
      { base: "غ", harakat: "ُ", display: "غُ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: true },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
];
