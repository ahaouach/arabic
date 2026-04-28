/**
 * Vocabulary pool for letter ق (qāf).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const QAAF_VOCAB: VocabularyWord[] = [
  {
    key: "qaaf_pen",
    letterKey: "qaaf",
    word: "قَلَمٌ",
    translit: "qalam",
    emoji: "✏️",
    audioText: "قَلَمٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: true },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "qaaf_heart",
    letterKey: "qaaf",
    word: "قَلْبٌ",
    translit: "qalb",
    emoji: "💗",
    audioText: "قَلْبٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: true },
      { base: "ل", harakat: "ْ", display: "لْ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "qaaf_cat",
    letterKey: "qaaf",
    word: "قِطٌّ",
    translit: "qiṭṭ",
    emoji: "🐱",
    audioText: "قِطٌّ",
    letters: [
      { base: "ق", harakat: "ِ", display: "قِ", isTarget: true },
      { base: "ط", harakat: "ٌّ", display: "طٌّ", isTarget: false },
    ],
  },
  {
    key: "qaaf_moon",
    letterKey: "qaaf",
    word: "قَمَرٌ",
    translit: "qamar",
    emoji: "🌙",
    audioText: "قَمَرٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: true },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "qaaf_palace",
    letterKey: "qaaf",
    word: "قَصْرٌ",
    translit: "qaṣr",
    emoji: "🏰",
    audioText: "قَصْرٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: true },
      { base: "ص", harakat: "ْ", display: "صْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "qaaf_train",
    letterKey: "qaaf",
    word: "قِطَارٌ",
    translit: "qiṭār",
    emoji: "🚂",
    audioText: "قِطَارٌ",
    letters: [
      { base: "ق", harakat: "ِ", display: "قِ", isTarget: true },
      { base: "ط", harakat: "َ", display: "طَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "qaaf_friend",
    letterKey: "qaaf",
    word: "صَدِيقٌ",
    translit: "ṣadīq",
    emoji: "👫",
    audioText: "صَدِيقٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: false },
      { base: "د", harakat: "ِ", display: "دِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ق", harakat: "ٌ", display: "قٌ", isTarget: true },
    ],
  },
  {
    key: "qaaf_falcon",
    letterKey: "qaaf",
    word: "صَقْرٌ",
    translit: "ṣaqr",
    emoji: "🦅",
    audioText: "صَقْرٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: false },
      { base: "ق", harakat: "ْ", display: "قْ", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
];
