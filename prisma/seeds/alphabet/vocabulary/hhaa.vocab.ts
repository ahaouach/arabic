/**
 * Vocabulary pool for letter ح (ḥāʾ, the emphatic "h"). Not to be
 * confused with ه (haa) — different codepoint, different letter.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const HHAA_VOCAB: VocabularyWord[] = [
  {
    key: "hhaa_whale",
    letterKey: "hhaa",
    word: "حُوتٌ",
    translit: "ḥūt",
    emoji: "🐋",
    audioText: "حُوتٌ",
    letters: [
      { base: "ح", harakat: "ُ", display: "حُ", isTarget: true },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", isTarget: false },
    ],
  },
  {
    key: "hhaa_milk",
    letterKey: "hhaa",
    word: "حَلِيبٌ",
    translit: "ḥalīb",
    emoji: "🥛",
    audioText: "حَلِيبٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", isTarget: true },
      { base: "ل", harakat: "ِ", display: "لِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "hhaa_dove",
    letterKey: "hhaa",
    word: "حَمَامَةٌ",
    translit: "ḥamāma",
    emoji: "🕊️",
    audioText: "حَمَامَةٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", isTarget: true },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "hhaa_stone",
    letterKey: "hhaa",
    word: "حَجَرٌ",
    translit: "ḥajar",
    emoji: "🪨",
    audioText: "حَجَرٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", isTarget: true },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "hhaa_bag",
    letterKey: "hhaa",
    word: "حَقِيبَةٌ",
    translit: "ḥaqība",
    emoji: "👜",
    audioText: "حَقِيبَةٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", isTarget: true },
      { base: "ق", harakat: "ِ", display: "قِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "hhaa_horse",
    letterKey: "hhaa",
    word: "حِصَانٌ",
    translit: "ḥiṣān",
    emoji: "🐴",
    audioText: "حِصَانٌ",
    letters: [
      { base: "ح", harakat: "ِ", display: "حِ", isTarget: true },
      { base: "ص", harakat: "َ", display: "صَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", isTarget: false },
    ],
  },
  {
    key: "hhaa_apple",
    letterKey: "hhaa",
    word: "تُفَّاحٌ",
    translit: "tuffāḥ",
    emoji: "🍎",
    audioText: "تُفَّاحٌ",
    letters: [
      { base: "ت", harakat: "ُ", display: "تُ", isTarget: false },
      { base: "ف", harakat: "َّ", display: "فَّ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ح", harakat: "ٌ", display: "حٌ", isTarget: true },
    ],
  },
  {
    key: "hhaa_crocodile",
    letterKey: "hhaa",
    word: "تِمْسَاحٌ",
    translit: "timsāḥ",
    emoji: "🐊",
    audioText: "تِمْسَاحٌ",
    letters: [
      { base: "ت", harakat: "ِ", display: "تِ", isTarget: false },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "س", harakat: "َ", display: "سَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ح", harakat: "ٌ", display: "حٌ", isTarget: true },
    ],
  },
];
