/**
 * Vocabulary pool for letter ذ (dhāl). Less common than د, so the
 * pool leans on iconic nouns kids know: gold, wolf, fly, ear, etc.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const DHAAL_VOCAB: VocabularyWord[] = [
  {
    key: "dhaal_gold",
    letterKey: "dhaal",
    word: "ذَهَبٌ",
    translit: "dhahab",
    emoji: "🏆",
    audioText: "ذَهَبٌ",
    letters: [
      { base: "ذ", harakat: "َ", display: "ذَ", isTarget: true },
      { base: "ه", harakat: "َ", display: "هَ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "dhaal_wolf",
    letterKey: "dhaal",
    word: "ذِئْبٌ",
    translit: "dhiʾb",
    emoji: "🐺",
    audioText: "ذِئْبٌ",
    letters: [
      { base: "ذ", harakat: "ِ", display: "ذِ", isTarget: true },
      { base: "ئ", harakat: "ْ", display: "ئْ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "dhaal_fly",
    letterKey: "dhaal",
    word: "ذُبَابَةٌ",
    translit: "dhubāba",
    emoji: "🪰",
    audioText: "ذُبَابَةٌ",
    letters: [
      { base: "ذ", harakat: "ُ", display: "ذُ", isTarget: true },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "dhaal_tail",
    letterKey: "dhaal",
    word: "ذَيْلٌ",
    translit: "dhayl",
    emoji: "🦎",
    audioText: "ذَيْلٌ",
    letters: [
      { base: "ذ", harakat: "َ", display: "ذَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "dhaal_corn",
    letterKey: "dhaal",
    word: "ذُرَةٌ",
    translit: "dhura",
    emoji: "🌽",
    audioText: "ذُرَةٌ",
    letters: [
      { base: "ذ", harakat: "ُ", display: "ذُ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "dhaal_smart",
    letterKey: "dhaal",
    word: "ذَكِيٌّ",
    translit: "dhakiyy",
    emoji: "🧠",
    audioText: "ذَكِيٌّ",
    letters: [
      { base: "ذ", harakat: "َ", display: "ذَ", isTarget: true },
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: false },
      { base: "ي", harakat: "ٌّ", display: "يٌّ", isTarget: false },
    ],
  },
  {
    key: "dhaal_ear",
    letterKey: "dhaal",
    word: "أُذُنٌ",
    translit: "udhun",
    emoji: "👂",
    audioText: "أُذُنٌ",
    letters: [
      { base: "أ", harakat: "ُ", display: "أُ", isTarget: false },
      { base: "ذ", harakat: "ُ", display: "ذُ", isTarget: true },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "dhaal_adhan",
    letterKey: "dhaal",
    word: "أَذَانٌ",
    translit: "adhān",
    emoji: "🕌",
    audioText: "أَذَانٌ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", isTarget: false },
      { base: "ذ", harakat: "َ", display: "ذَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
];
