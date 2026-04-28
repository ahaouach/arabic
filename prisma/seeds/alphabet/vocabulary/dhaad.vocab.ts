/**
 * Vocabulary pool for letter ض (ḍād). Less common but iconic — Arabic
 * is often called "the language of ḍād" (لُغَةُ الضَّادِ).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const DHAAD_VOCAB: VocabularyWord[] = [
  {
    key: "dhaad_light",
    letterKey: "dhaad",
    word: "ضَوْءٌ",
    translit: "ḍawʾ",
    emoji: "💡",
    audioText: "ضَوْءٌ",
    letters: [
      { base: "ض", harakat: "َ", display: "ضَ", isTarget: true },
      { base: "و", harakat: "ْ", display: "وْ", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
  {
    key: "dhaad_frog",
    letterKey: "dhaad",
    word: "ضَفْدَعٌ",
    translit: "ḍafdaʿ",
    emoji: "🐸",
    audioText: "ضَفْدَعٌ",
    letters: [
      { base: "ض", harakat: "َ", display: "ضَ", isTarget: true },
      { base: "ف", harakat: "ْ", display: "فْ", isTarget: false },
      { base: "د", harakat: "َ", display: "دَ", isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", isTarget: false },
    ],
  },
  {
    key: "dhaad_tooth",
    letterKey: "dhaad",
    word: "ضِرْسٌ",
    translit: "ḍirs",
    emoji: "🦷",
    audioText: "ضِرْسٌ",
    letters: [
      { base: "ض", harakat: "ِ", display: "ضِ", isTarget: true },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: false },
    ],
  },
  {
    key: "dhaad_fog",
    letterKey: "dhaad",
    word: "ضَبَابٌ",
    translit: "ḍabāb",
    emoji: "🌫️",
    audioText: "ضَبَابٌ",
    letters: [
      { base: "ض", harakat: "َ", display: "ضَ", isTarget: true },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "dhaad_guest",
    letterKey: "dhaad",
    word: "ضَيْفٌ",
    translit: "ḍayf",
    emoji: "👋",
    audioText: "ضَيْفٌ",
    letters: [
      { base: "ض", harakat: "َ", display: "ضَ", isTarget: true },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", isTarget: false },
    ],
  },
  {
    key: "dhaad_earth",
    letterKey: "dhaad",
    word: "أَرْضٌ",
    translit: "arḍ",
    emoji: "🌍",
    audioText: "أَرْضٌ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "ض", harakat: "ٌ", display: "ضٌ", isTarget: true },
    ],
  },
  {
    key: "dhaad_egg",
    letterKey: "dhaad",
    word: "بَيْضَةٌ",
    translit: "bayḍa",
    emoji: "🥚",
    audioText: "بَيْضَةٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", isTarget: false },
      { base: "ض", harakat: "َ", display: "ضَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "dhaad_white",
    letterKey: "dhaad",
    word: "أَبْيَضُ",
    translit: "abyaḍ",
    emoji: "⚪",
    audioText: "أَبْيَضُ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", isTarget: false },
      { base: "ب", harakat: "ْ", display: "بْ", isTarget: false },
      { base: "ي", harakat: "َ", display: "يَ", isTarget: false },
      { base: "ض", harakat: "ُ", display: "ضُ", isTarget: true },
    ],
  },
];
