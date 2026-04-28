/**
 * Vocabulary pool for letter س (sīn). Not to be confused with ص (ṣād).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const SEEN_VOCAB: VocabularyWord[] = [
  {
    key: "seen_fish",
    letterKey: "seen",
    word: "سَمَكَةٌ",
    translit: "samaka",
    emoji: "🐟",
    audioText: "سَمَكَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: true },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ك", harakat: "َ", display: "كَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "seen_car",
    letterKey: "seen",
    word: "سَيَّارَةٌ",
    translit: "sayyāra",
    emoji: "🚗",
    audioText: "سَيَّارَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: true },
      { base: "ي", harakat: "َّ", display: "يَّ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "seen_clock",
    letterKey: "seen",
    word: "سَاعَةٌ",
    translit: "sāʿa",
    emoji: "🕐",
    audioText: "سَاعَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ع", harakat: "َ", display: "عَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "seen_bed",
    letterKey: "seen",
    word: "سَرِيرٌ",
    translit: "sarīr",
    emoji: "🛏️",
    audioText: "سَرِيرٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: true },
      { base: "ر", harakat: "ِ", display: "رِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "seen_basket",
    letterKey: "seen",
    word: "سَلَّةٌ",
    translit: "salla",
    emoji: "🧺",
    audioText: "سَلَّةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", isTarget: true },
      { base: "ل", harakat: "َّ", display: "لَّ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "seen_knife",
    letterKey: "seen",
    word: "سِكِّينٌ",
    translit: "sikkīn",
    emoji: "🔪",
    audioText: "سِكِّينٌ",
    letters: [
      { base: "س", harakat: "ِ", display: "سِ", isTarget: true },
      { base: "ك", harakat: "ِّ", display: "كِّ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "seen_sun",
    letterKey: "seen",
    word: "شَمْسٌ",
    translit: "shams",
    emoji: "☀️",
    audioText: "شَمْسٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: false },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: true },
    ],
  },
  {
    key: "seen_bell",
    letterKey: "seen",
    word: "جَرَسٌ",
    translit: "jaras",
    emoji: "🔔",
    audioText: "جَرَسٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: true },
    ],
  },
];
