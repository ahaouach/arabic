/**
 * Vocabulary pool for letter ص (ṣād, emphatic s). Not to be confused
 * with س (sīn) or ض (ḍād) — distinct codepoints, distinct sounds.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const SAAD_VOCAB: VocabularyWord[] = [
  {
    key: "saad_falcon",
    letterKey: "saad",
    word: "صَقْرٌ",
    translit: "ṣaqr",
    emoji: "🦅",
    audioText: "صَقْرٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "ق", harakat: "ْ", display: "قْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "saad_soap",
    letterKey: "saad",
    word: "صَابُونٌ",
    translit: "ṣābūn",
    emoji: "🧼",
    audioText: "صَابُونٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ب", harakat: "ُ", display: "بُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "saad_friend",
    letterKey: "saad",
    word: "صَدِيقٌ",
    translit: "ṣadīq",
    emoji: "👫",
    audioText: "صَدِيقٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "د", harakat: "ِ", display: "دِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ق", harakat: "ٌ", display: "قٌ", isTarget: false },
    ],
  },
  {
    key: "saad_plate",
    letterKey: "saad",
    word: "صَحْنٌ",
    translit: "ṣaḥn",
    emoji: "🍽️",
    audioText: "صَحْنٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "ح", harakat: "ْ", display: "حْ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "saad_box",
    letterKey: "saad",
    word: "صَنْدُوقٌ",
    translit: "ṣandūq",
    emoji: "📦",
    audioText: "صَنْدُوقٌ",
    letters: [
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "ن", harakat: "ْ", display: "نْ", isTarget: false },
      { base: "د", harakat: "ُ", display: "دُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ق", harakat: "ٌ", display: "قٌ", isTarget: false },
    ],
  },
  {
    key: "saad_horse",
    letterKey: "saad",
    word: "حِصَانٌ",
    translit: "ḥiṣān",
    emoji: "🐴",
    audioText: "حِصَانٌ",
    letters: [
      { base: "ح", harakat: "ِ", display: "حِ", isTarget: false },
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "saad_palace",
    letterKey: "saad",
    word: "قَصْرٌ",
    translit: "qaṣr",
    emoji: "🏰",
    audioText: "قَصْرٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", isTarget: false },
      { base: "ص", harakat: "ْ", display: "صْ", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "saad_onion",
    letterKey: "saad",
    word: "بَصَلٌ",
    translit: "baṣal",
    emoji: "🧅",
    audioText: "بَصَلٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ص", harakat: "َ", display: "صَ", isTarget: true },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
];
