/**
 * Vocabulary pool for letter ه (hāʾ, the soft "h"). Not to be confused
 * with ح (ḥāʾ) — different codepoint, different sound.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const HAA_VOCAB: VocabularyWord[] = [
  {
    key: "haa_hoopoe",
    letterKey: "haa",
    word: "هُدْهُدٌ",
    translit: "hudhud",
    emoji: "🐦",
    audioText: "هُدْهُدٌ",
    letters: [
      { base: "ه", harakat: "ُ", display: "هُ", isTarget: true },
      { base: "د", harakat: "ْ", display: "دْ", isTarget: false },
      { base: "ه", harakat: "ُ", display: "هُ", isTarget: true },
      { base: "د", harakat: "ٌ", display: "دٌ", isTarget: false },
    ],
  },
  {
    key: "haa_gift",
    letterKey: "haa",
    word: "هَدِيَّةٌ",
    translit: "hadiyya",
    emoji: "🎁",
    audioText: "هَدِيَّةٌ",
    letters: [
      { base: "ه", harakat: "َ", display: "هَ", isTarget: true },
      { base: "د", harakat: "ِ", display: "دِ", isTarget: false },
      { base: "ي", harakat: "َّ", display: "يَّ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "haa_crescent",
    letterKey: "haa",
    word: "هِلَالٌ",
    translit: "hilāl",
    emoji: "🌙",
    audioText: "هِلَالٌ",
    letters: [
      { base: "ه", harakat: "ِ", display: "هِ", isTarget: true },
      { base: "ل", harakat: "َ", display: "لَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", isTarget: false },
    ],
  },
  {
    key: "haa_air",
    letterKey: "haa",
    word: "هَوَاءٌ",
    translit: "hawāʾ",
    emoji: "🌬️",
    audioText: "هَوَاءٌ",
    letters: [
      { base: "ه", harakat: "َ", display: "هَ", isTarget: true },
      { base: "و", harakat: "َ", display: "وَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
  {
    key: "haa_flower",
    letterKey: "haa",
    word: "زَهْرَةٌ",
    translit: "zahra",
    emoji: "🌺",
    audioText: "زَهْرَةٌ",
    letters: [
      { base: "ز", harakat: "َ", display: "زَ", isTarget: false },
      { base: "ه", harakat: "ْ", display: "هْ", isTarget: true },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "haa_back",
    letterKey: "haa",
    word: "ظَهْرٌ",
    translit: "ẓahr",
    emoji: "🔙",
    audioText: "ظَهْرٌ",
    letters: [
      { base: "ظ", harakat: "َ", display: "ظَ", isTarget: false },
      { base: "ه", harakat: "ْ", display: "هْ", isTarget: true },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "haa_fruit",
    letterKey: "haa",
    word: "فَاكِهَةٌ",
    translit: "fākiha",
    emoji: "🍎",
    audioText: "فَاكِهَةٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ك", harakat: "ِ", display: "كِ", isTarget: false },
      { base: "ه", harakat: "َ", display: "هَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "haa_face",
    letterKey: "haa",
    word: "وَجْهٌ",
    translit: "wajh",
    emoji: "🙂",
    audioText: "وَجْهٌ",
    letters: [
      { base: "و", harakat: "َ", display: "وَ", isTarget: false },
      { base: "ج", harakat: "ْ", display: "جْ", isTarget: false },
      { base: "ه", harakat: "ٌ", display: "هٌ", isTarget: true },
    ],
  },
];
