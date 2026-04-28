/**
 * Vocabulary pool for letter ن (nūn).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const NOON_VOCAB: VocabularyWord[] = [
  {
    key: "noon_fire",
    letterKey: "noon",
    word: "نَارٌ",
    translit: "nār",
    emoji: "🔥",
    audioText: "نَارٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "noon_ant",
    letterKey: "noon",
    word: "نَمْلَةٌ",
    translit: "namla",
    emoji: "🐜",
    audioText: "نَمْلَةٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: true },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "noon_star",
    letterKey: "noon",
    word: "نَجْمَةٌ",
    translit: "najma",
    emoji: "⭐",
    audioText: "نَجْمَةٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: true },
      { base: "ج", harakat: "ْ", display: "جْ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "noon_bee",
    letterKey: "noon",
    word: "نَحْلَةٌ",
    translit: "naḥla",
    emoji: "🐝",
    audioText: "نَحْلَةٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: true },
      { base: "ح", harakat: "ْ", display: "حْ", isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "noon_river",
    letterKey: "noon",
    word: "نَهْرٌ",
    translit: "nahr",
    emoji: "🏞️",
    audioText: "نَهْرٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: true },
      { base: "ه", harakat: "ْ", display: "هْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "noon_tiger",
    letterKey: "noon",
    word: "نَمِرٌ",
    translit: "namir",
    emoji: "🐅",
    audioText: "نَمِرٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: true },
      { base: "م", harakat: "ِ", display: "مِ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "noon_eye",
    letterKey: "noon",
    word: "عَيْنٌ",
    translit: "ʿayn",
    emoji: "👁️",
    audioText: "عَيْنٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: true },
    ],
  },
  {
    key: "noon_yogurt",
    letterKey: "noon",
    word: "لَبَنٌ",
    translit: "laban",
    emoji: "🥛",
    audioText: "لَبَنٌ",
    letters: [
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: true },
    ],
  },
];
