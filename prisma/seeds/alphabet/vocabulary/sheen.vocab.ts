/**
 * Vocabulary pool for letter ش (shīn).
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

export const SHEEN_VOCAB: VocabularyWord[] = [
  {
    key: "sheen_sun",
    letterKey: "sheen",
    word: "شَمْسٌ",
    translit: "shams",
    emoji: "☀️",
    audioText: "شَمْسٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "م", harakat: "ْ", display: "مْ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", isTarget: false },
    ],
  },
  {
    key: "sheen_tree",
    letterKey: "sheen",
    word: "شَجَرَةٌ",
    translit: "shajara",
    emoji: "🌳",
    audioText: "شَجَرَةٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "ج", harakat: "َ", display: "جَ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "sheen_tea",
    letterKey: "sheen",
    word: "شَايٌ",
    translit: "shāy",
    emoji: "🍵",
    audioText: "شَايٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ي", harakat: "ٌ", display: "يٌ", isTarget: false },
    ],
  },
  {
    key: "sheen_hair",
    letterKey: "sheen",
    word: "شَعْرٌ",
    translit: "shaʿr",
    emoji: "💇",
    audioText: "شَعْرٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "ع", harakat: "ْ", display: "عْ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", isTarget: false },
    ],
  },
  {
    key: "sheen_police",
    letterKey: "sheen",
    word: "شُرْطِيٌّ",
    translit: "shurṭiyy",
    emoji: "👮",
    audioText: "شُرْطِيٌّ",
    letters: [
      { base: "ش", harakat: "ُ", display: "شُ", isTarget: true },
      { base: "ر", harakat: "ْ", display: "رْ", isTarget: false },
      { base: "ط", harakat: "ِ", display: "طِ", isTarget: false },
      { base: "ي", harakat: "ٌّ", display: "يٌّ", isTarget: false },
    ],
  },
  {
    key: "sheen_street",
    letterKey: "sheen",
    word: "شَارِعٌ",
    translit: "shāriʿ",
    emoji: "🛣️",
    audioText: "شَارِعٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ر", harakat: "ِ", display: "رِ", isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", isTarget: false },
    ],
  },
  {
    key: "sheen_butterfly",
    letterKey: "sheen",
    word: "فَرَاشَةٌ",
    translit: "farāsha",
    emoji: "🦋",
    audioText: "فَرَاشَةٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "ة", harakat: "ٌ", display: "ةٌ", isTarget: false },
    ],
  },
  {
    key: "sheen_dinner",
    letterKey: "sheen",
    word: "عَشَاءٌ",
    translit: "ʿashāʾ",
    emoji: "🍽️",
    audioText: "عَشَاءٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", isTarget: false },
      { base: "ش", harakat: "َ", display: "شَ", isTarget: true },
      { base: "ا", harakat: "", display: "ا", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", isTarget: false },
    ],
  },
];
