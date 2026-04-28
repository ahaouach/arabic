/**
 * Vocabulary pool for letter ع (ʿayn). A cornerstone letter appearing
 * in tons of everyday vocabulary — pool is broad and concrete.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const AYN_VOCAB: VocabularyWord[] = [
  {
    key: "ayn_eye",
    letterKey: "ayn",
    word: "عَيْنٌ",
    translit: "ʿayn",
    emoji: "👁️",
    audioText: "عَيْنٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "ayn_grapes",
    letterKey: "ayn",
    word: "عِنَبٌ",
    translit: "ʿinab",
    emoji: "🍇",
    audioText: "عِنَبٌ",
    letters: [
      { base: "ع", harakat: "ِ", display: "عِ", isTarget: true },
      { base: "ن", harakat: "َ", display: "نَ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "ayn_honey",
    letterKey: "ayn",
    word: "عَسَلٌ",
    translit: "ʿasal",
    emoji: "🍯",
    audioText: "عَسَلٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", isTarget: true },
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "ayn_flag",
    letterKey: "ayn",
    word: "عَلَمٌ",
    translit: "ʿalam",
    emoji: "🏁",
    audioText: "عَلَمٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", isTarget: true },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", isTarget: false },
    ],
  },
  {
    key: "ayn_sparrow",
    letterKey: "ayn",
    word: "عُصْفُورٌ",
    translit: "ʿuṣfūr",
    emoji: "🐦",
    audioText: "عُصْفُورٌ",
    letters: [
      { base: "ع", harakat: "ُ", display: "عُ", isTarget: true },
      { base: "ص", harakat: "ْ", display: "صْ", isTarget: false },
      { base: "ف", harakat: "ُ", display: "فُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "ayn_clock",
    letterKey: "ayn",
    word: "سَاعَةٌ",
    translit: "sāʿa",
    emoji: "🕐",
    audioText: "سَاعَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ع", harakat: "َ", display: "عَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "ayn_street",
    letterKey: "ayn",
    word: "شَارِعٌ",
    translit: "shāriʿ",
    emoji: "🛣️",
    audioText: "شَارِعٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "ِ", display: "رِ", isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", isTarget: true },
    ],
  },
  {
    key: "ayn_frog",
    letterKey: "ayn",
    word: "ضَفْدَعٌ",
    translit: "ḍafdaʿ",
    emoji: "🐸",
    audioText: "ضَفْدَعٌ",
    letters: [
      { base: "ض", harakat: "َ", display: "ضَ", isTarget: false },
      { base: "ف", harakat: "ْ", display: "فْ", isTarget: false },
      { base: "د", harakat: "َ", display: "دَ", isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", isTarget: true },
    ],
  },
];
