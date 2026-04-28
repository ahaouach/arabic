/**
 * Vocabulary pool for letter ط (ṭāʾ, emphatic t). Not to be confused
 * with ت (tāʾ) — different codepoint, different sound.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const TTAA_VOCAB: VocabularyWord[] = [
  {
    key: "ttaa_doctor",
    letterKey: "ttaa",
    word: "طَبِيبٌ",
    translit: "ṭabīb",
    emoji: "👨‍⚕️",
    audioText: "طَبِيبٌ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", isTarget: true },
      { base: "ب", harakat: "ِ", display: "بِ", isTarget: false },
      { base: "ي", harakat: "", display: "ي", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", isTarget: false },
    ],
  },
  {
    key: "ttaa_bird",
    letterKey: "ttaa",
    word: "طَائِرٌ",
    translit: "ṭāʾir",
    emoji: "🐦",
    audioText: "طَائِرٌ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ئ", harakat: "ِ", display: "ئِ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "ttaa_child",
    letterKey: "ttaa",
    word: "طِفْلٌ",
    translit: "ṭifl",
    emoji: "👶",
    audioText: "طِفْلٌ",
    letters: [
      { base: "ط", harakat: "ِ", display: "طِ", isTarget: true },
      { base: "ف", harakat: "ْ", display: "فْ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "ttaa_tomatoes",
    letterKey: "ttaa",
    word: "طَمَاطِمُ",
    translit: "ṭamāṭim",
    emoji: "🍅",
    audioText: "طَمَاطِمُ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", isTarget: true },
      { base: "م", harakat: "َ", display: "مَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ط", harakat: "ِ", display: "طِ", isTarget: true },
      { base: "م", harakat: "ُ", display: "مُ", isTarget: false },
    ],
  },
  {
    key: "ttaa_peacock",
    letterKey: "ttaa",
    word: "طَاوُوسٌ",
    translit: "ṭāwūs",
    emoji: "🦚",
    audioText: "طَاوُوسٌ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "و", harakat: "ُ", display: "وُ", isTarget: false },
      { base: "و", harakat: "", display: "و", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: false },
    ],
  },
  {
    key: "ttaa_cat",
    letterKey: "ttaa",
    word: "قِطٌّ",
    translit: "qiṭṭ",
    emoji: "🐱",
    audioText: "قِطٌّ",
    letters: [
      { base: "ق", harakat: "ِ", display: "قِ", isTarget: false },
      { base: "ط", harakat: "ٌّ", display: "طٌّ", isTarget: true },
    ],
  },
  {
    key: "ttaa_train",
    letterKey: "ttaa",
    word: "قِطَارٌ",
    translit: "qiṭār",
    emoji: "🚂",
    audioText: "قِطَارٌ",
    letters: [
      { base: "ق", harakat: "ِ", display: "قِ", isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "ttaa_duck",
    letterKey: "ttaa",
    word: "بَطَّةٌ",
    translit: "baṭṭa",
    emoji: "🦆",
    audioText: "بَطَّةٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", isTarget: false },
      { base: "ط", harakat: "َّ", display: "طَّ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
];
