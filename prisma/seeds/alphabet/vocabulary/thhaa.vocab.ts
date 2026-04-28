/**
 * Vocabulary pool for letter ظ (ẓāʾ, emphatic "th"). Rare in everyday
 * speech — pool leans on nouns visible to a child (gazelle, shadow,
 * envelope, nail, glasses).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const THHAA_VOCAB: VocabularyWord[] = [
  {
    key: "thhaa_gazelle",
    letterKey: "thhaa",
    word: "ظَبْيٌ",
    translit: "ẓaby",
    emoji: "🦌",
    audioText: "ظَبْيٌ",
    letters: [
      { base: "ظ", harakat: "َ", display: "ظَ", isTarget: true },
      { base: "ب", harakat: "ْ", display: "بْ", isTarget: false },
      { base: "ي", harakat: "ٌ", display: "يٌ", isTarget: false },
    ],
  },
  {
    key: "thhaa_shadow",
    letterKey: "thhaa",
    word: "ظِلٌّ",
    translit: "ẓill",
    emoji: "🌑",
    audioText: "ظِلٌّ",
    letters: [
      { base: "ظ", harakat: "ِ", display: "ظِ", isTarget: true },
      { base: "ل", harakat: "ٌّ", display: "لٌّ", isTarget: false },
    ],
  },
  {
    key: "thhaa_back",
    letterKey: "thhaa",
    word: "ظَهْرٌ",
    translit: "ẓahr",
    emoji: "🔙",
    audioText: "ظَهْرٌ",
    letters: [
      { base: "ظ", harakat: "َ", display: "ظَ", isTarget: true },
      { base: "ه", harakat: "ْ", display: "هْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "thhaa_envelope",
    letterKey: "thhaa",
    word: "ظَرْفٌ",
    translit: "ẓarf",
    emoji: "✉️",
    audioText: "ظَرْفٌ",
    letters: [
      { base: "ظ", harakat: "َ", display: "ظَ", isTarget: true },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", isTarget: false },
    ],
  },
  {
    key: "thhaa_nail",
    letterKey: "thhaa",
    word: "ظُفْرٌ",
    translit: "ẓufr",
    emoji: "💅",
    audioText: "ظُفْرٌ",
    letters: [
      { base: "ظ", harakat: "ُ", display: "ظُ", isTarget: true },
      { base: "ف", harakat: "ْ", display: "فْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "thhaa_wallet",
    letterKey: "thhaa",
    word: "مَحْفَظَةٌ",
    translit: "maḥfaẓa",
    emoji: "👛",
    audioText: "مَحْفَظَةٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ح", harakat: "ْ", display: "حْ", isTarget: false },
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ظ", harakat: "َ", display: "ظَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "thhaa_glasses",
    letterKey: "thhaa",
    word: "نَظَّارَاتٌ",
    translit: "naẓẓārāt",
    emoji: "👓",
    audioText: "نَظَّارَاتٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: false },
      { base: "ظ", harakat: "َّ", display: "ظَّ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "thhaa_clean",
    letterKey: "thhaa",
    word: "نَظِيفٌ",
    translit: "naẓīf",
    emoji: "🧽",
    audioText: "نَظِيفٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", isTarget: false },
      { base: "ظ", harakat: "ِ", display: "ظِ", isTarget: true },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", isTarget: false },
    ],
  },
];
