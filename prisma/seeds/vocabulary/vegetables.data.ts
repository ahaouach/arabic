/**
 * Seed content for the `vegetables` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/vegetables.
 *
 * Vowelisation + pre-split conventions are documented in
 * `prisma/seeds/vocabulary/fruits.data.ts`. This file follows the same
 * rules — read that header for the harakat reminder.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

/* -------------------------------------------------------------------------- */
/*  Shared palette                                                            */
/* -------------------------------------------------------------------------- */

const VEGETABLES_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

/* -------------------------------------------------------------------------- */
/*  Items — 12 vegetables across 3 categories                                 */
/* -------------------------------------------------------------------------- */

const ITEMS: VocabularyLessonSection["items"] = [
  // Root (3)
  { key: "carrot", nameAr: "جَزَرٌ",   transliteration: "jazar",  iconKey: "Carrot", audioText: "جَزَرٌ",   category: "root",      idleAnimation: "wiggle" },
  { key: "potato", nameAr: "بَطَاطَا", transliteration: "baṭāṭā", iconKey: "Potato", audioText: "بَطَاطَا", category: "root",      idleAnimation: "bob" },
  { key: "onion",  nameAr: "بَصَلٌ",   transliteration: "baṣal",  iconKey: "Onion",  audioText: "بَصَلٌ",   category: "root",      idleAnimation: "sway" },

  // Leafy (3)
  { key: "lettuce",  nameAr: "خَسٌّ",       transliteration: "khass",     iconKey: "Lettuce",  audioText: "خَسٌّ",       category: "leafy",     idleAnimation: "breathe" },
  { key: "garlic",   nameAr: "ثَوْمٌ",      transliteration: "thawm",     iconKey: "Garlic",   audioText: "ثَوْمٌ",      category: "leafy",     idleAnimation: "wiggle" },
  { key: "broccoli", nameAr: "بُرُوكُلِي",   transliteration: "burūkulī", iconKey: "Broccoli", audioText: "بُرُوكُلِي",   category: "leafy",     idleAnimation: "bounce" },

  // Fruit-veg (6)
  { key: "tomato",   nameAr: "طَمَاطِمُ",   transliteration: "ṭamāṭim",  iconKey: "Tomato",   audioText: "طَمَاطِمُ",   category: "fruit_veg", idleAnimation: "bounce" },
  { key: "cucumber", nameAr: "خِيَارٌ",     transliteration: "khiyār",   iconKey: "Cucumber", audioText: "خِيَارٌ",     category: "fruit_veg", idleAnimation: "sway" },
  { key: "eggplant", nameAr: "بَاذِنْجَانٌ", transliteration: "bādhinjān", iconKey: "Eggplant", audioText: "بَاذِنْجَانٌ", category: "fruit_veg", idleAnimation: "bob" },
  { key: "pepper",   nameAr: "فِلْفِلٌ",    transliteration: "filfil",    iconKey: "Pepper",   audioText: "فِلْفِلٌ",    category: "fruit_veg", idleAnimation: "breathe" },
  { key: "pumpkin",  nameAr: "قَرْعٌ",      transliteration: "qarʿ",      iconKey: "Pumpkin",  audioText: "قَرْعٌ",      category: "fruit_veg", idleAnimation: "bounce" },
  { key: "corn",     nameAr: "ذُرَةٌ",      transliteration: "dhura",     iconKey: "Corn",     audioText: "ذُرَةٌ",      category: "fruit_veg", idleAnimation: "wiggle" },
];

/* -------------------------------------------------------------------------- */
/*  Pre-split words                                                           */
/* -------------------------------------------------------------------------- */

const WORDS: VocabularyLessonSection["words"] = [
  // carrot — جَزَرٌ — ja-za-run
  {
    itemKey: "carrot",
    word: "جَزَرٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", name: "جِيمٌ", isTarget: false },
      { base: "ز", harakat: "َ", display: "زَ", name: "زَايٌ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ", isTarget: false },
    ],
  },
  // potato — بَطَاطَا — ba-ṭā-ṭā (loanword form, no tanwin)
  {
    itemKey: "potato",
    word: "بَطَاطَا",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ",  isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
    ],
  },
  // onion — بَصَلٌ — ba-ṣa-lun
  {
    itemKey: "onion",
    word: "بَصَلٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ", isTarget: false },
      { base: "ص", harakat: "َ", display: "صَ", name: "صَادٌ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
  // lettuce — خَسٌّ — khass-un (final shadda + dammatan)
  {
    itemKey: "lettuce",
    word: "خَسٌّ",
    letters: [
      { base: "خ", harakat: "َ",        display: "خَ",  name: "خَاءٌ", isTarget: false },
      { base: "س", harakat: "ٌّ",  display: "سٌّ", name: "سِينٌ", isTarget: false },
    ],
  },
  // garlic — ثَوْمٌ — thaw-mun
  {
    itemKey: "garlic",
    word: "ثَوْمٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", name: "ثَاءٌ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", name: "وَاوٌ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", name: "مِيمٌ", isTarget: false },
    ],
  },
  // broccoli — بُرُوكُلِي — bu-rū-ku-lī (loanword, no tanwin)
  {
    itemKey: "broccoli",
    word: "بُرُوكُلِي",
    letters: [
      { base: "ب", harakat: "ُ", display: "بُ", name: "بَاءٌ", isTarget: false },
      { base: "ر", harakat: "ُ", display: "رُ", name: "رَاءٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ", isTarget: false },
      { base: "ك", harakat: "ُ", display: "كُ", name: "كَافٌ", isTarget: false },
      { base: "ل", harakat: "ِ", display: "لِ", name: "لَامٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
    ],
  },
  // tomato — طَمَاطِمُ — ṭa-mā-ṭi-mu (diptote, ends in damma not tanwin)
  {
    itemKey: "tomato",
    word: "طَمَاطِمُ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ", isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ط", harakat: "ِ", display: "طِ", name: "طَاءٌ", isTarget: false },
      { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ", isTarget: false },
    ],
  },
  // cucumber — خِيَارٌ — khi-yā-run
  {
    itemKey: "cucumber",
    word: "خِيَارٌ",
    letters: [
      { base: "خ", harakat: "ِ", display: "خِ", name: "خَاءٌ", isTarget: false },
      { base: "ي", harakat: "َ", display: "يَ", name: "يَاءٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ", isTarget: false },
    ],
  },
  // eggplant — بَاذِنْجَانٌ — bā-dhin-jā-nun
  {
    itemKey: "eggplant",
    word: "بَاذِنْجَانٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ذ", harakat: "ِ", display: "ذِ", name: "ذَالٌ", isTarget: false },
      { base: "ن", harakat: "ْ", display: "نْ", name: "نُونٌ", isTarget: false },
      { base: "ج", harakat: "َ", display: "جَ", name: "جِيمٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ", isTarget: false },
    ],
  },
  // pepper — فِلْفِلٌ — fil-fi-lun
  {
    itemKey: "pepper",
    word: "فِلْفِلٌ",
    letters: [
      { base: "ف", harakat: "ِ", display: "فِ", name: "فَاءٌ", isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ", isTarget: false },
      { base: "ف", harakat: "ِ", display: "فِ", name: "فَاءٌ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
  // pumpkin — قَرْعٌ — qar-ʿun
  {
    itemKey: "pumpkin",
    word: "قَرْعٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", name: "رَاءٌ", isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", name: "عَيْنٌ", isTarget: false },
    ],
  },
  // corn — ذُرَةٌ — dhu-ra-tun
  {
    itemKey: "corn",
    word: "ذُرَةٌ",
    letters: [
      { base: "ذ", harakat: "ُ", display: "ذُ", name: "ذَالٌ",                 isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const vegetablesLessonContent: VocabularyLessonSection = {
  title: "الْخَضْرَوَاتُ",
  theme: "vegetables",
  items: ITEMS,
  words: WORDS,
  colors: VEGETABLES_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْخَضْرَوَاتِ",
      description: "اِضْغَطْ عَلَى كُلِّ خَضْرَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْخَضْرَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْخَضْرَوَاتِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 12,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْخَضْرَةَ الْمَطْلُوبَةَ",
      minInstructions: 3,
      maxInstructions: 5,
    },
    {
      kind: "vocab_color_letters",
      title: "لَوِّنْ حُرُوفَ الْكَلِمَةِ",
      rounds: 3,
      minLettersToColor: 1,
      maxLettersToColor: 2,
    },
  ],
};
