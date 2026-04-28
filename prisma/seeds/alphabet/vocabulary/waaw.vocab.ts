/**
 * Vocabulary pool for letter و (wāw). Pedagogically treated as one
 * letter regardless of whether it functions as a consonant or a long
 * ū vowel — both uses are tagged as target.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const WAAW_VOCAB: VocabularyWord[] = [
  {
    key: "waaw_flower",
    letterKey: "waaw",
    word: "وَرْدٌ",
    translit: "ward",
    emoji: "🌹",
    audioText: "وَرْدٌ",
    letters: [
      { base: "و", harakat: "َ", display: "وَ", isTarget: true },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_boy",
    letterKey: "waaw",
    word: "وَلَدٌ",
    translit: "walad",
    emoji: "👦",
    audioText: "وَلَدٌ",
    letters: [
      { base: "و", harakat: "َ", display: "وَ", isTarget: true },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_face",
    letterKey: "waaw",
    word: "وَجْهٌ",
    translit: "wajh",
    emoji: "🙂",
    audioText: "وَجْهٌ",
    letters: [
      { base: "و", harakat: "َ", display: "وَ", isTarget: true },
      { base: "ج", harakat: "ْ", display: "جْ", isTarget: false },
      { base: "ه", harakat: "ٌ", display: "هٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_paper",
    letterKey: "waaw",
    word: "وَرَقَةٌ",
    translit: "waraqa",
    emoji: "📄",
    audioText: "وَرَقَةٌ",
    letters: [
      { base: "و", harakat: "َ", display: "وَ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ق", harakat: "َ", display: "قَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_sheep",
    letterKey: "waaw",
    word: "خَرُوفٌ",
    translit: "kharūf",
    emoji: "🐑",
    audioText: "خَرُوفٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", isTarget: false },
      { base: "ر", harakat: "ُ", display: "رُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: true },
      { base: "ف", harakat: "ٌ", display: "فٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_garlic",
    letterKey: "waaw",
    word: "ثُومٌ",
    translit: "thūm",
    emoji: "🧄",
    audioText: "ثُومٌ",
    letters: [
      { base: "ث", harakat: "ُ", display: "ثُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: true },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_banana",
    letterKey: "waaw",
    word: "مَوْزٌ",
    translit: "mawz",
    emoji: "🍌",
    audioText: "مَوْزٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: true },
      { base: "ز", harakat: "ٌ", display: "زٌ", isTarget: false },
    ],
  },
  {
    key: "waaw_fava",
    letterKey: "waaw",
    word: "فُولٌ",
    translit: "fūl",
    emoji: "🫘",
    audioText: "فُولٌ",
    letters: [
      { base: "ف", harakat: "ُ", display: "فُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: true },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
];
