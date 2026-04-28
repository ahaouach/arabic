/**
 * Vocabulary pool for letter ث (thāʾ). Less common than the previous
 * three letters, so the pool leans on animals and concrete nouns kids
 * can associate with. Every ث occurrence is flagged as target.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const THAA_VOCAB: VocabularyWord[] = [
  {
    key: "thaa_fox",
    letterKey: "thaa",
    word: "ثَعْلَبٌ",
    translit: "thaʿlab",
    emoji: "🦊",
    audioText: "ثَعْلَبٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "ع", harakat: "ْ", display: "عْ", isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_garment",
    letterKey: "thaa",
    word: "ثَوْبٌ",
    translit: "thawb",
    emoji: "👔",
    audioText: "ثَوْبٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_bull",
    letterKey: "thaa",
    word: "ثَوْرٌ",
    translit: "thawr",
    emoji: "🐂",
    audioText: "ثَوْرٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_snow",
    letterKey: "thaa",
    word: "ثَلْجٌ",
    translit: "thalj",
    emoji: "❄️",
    audioText: "ثَلْجٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "ل", harakat: "ْ", display: "لْ", isTarget: false },
      { base: "ج", harakat: "ٌ", display: "جٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_garlic",
    letterKey: "thaa",
    word: "ثُومٌ",
    translit: "thūm",
    emoji: "🧄",
    audioText: "ثُومٌ",
    letters: [
      { base: "ث", harakat: "ُ", display: "ثُ", isTarget: true },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_snake",
    letterKey: "thaa",
    word: "ثُعْبَانٌ",
    translit: "thuʿbān",
    emoji: "🐍",
    audioText: "ثُعْبَانٌ",
    letters: [
      { base: "ث", harakat: "ُ", display: "ثُ", isTarget: true },
      { base: "ع", harakat: "ْ", display: "عْ", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_three",
    letterKey: "thaa",
    word: "ثَلَاثَةٌ",
    translit: "thalātha",
    emoji: "3️⃣",
    audioText: "ثَلَاثَةٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "thaa_fruit",
    letterKey: "thaa",
    word: "ثَمَرٌ",
    translit: "thamar",
    emoji: "🍎",
    audioText: "ثَمَرٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", isTarget: true },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
];
