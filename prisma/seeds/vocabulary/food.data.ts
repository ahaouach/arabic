/**
 * Seed content for the `food` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/food.
 *
 * Categories: savory (4) · mixed-savory (2) · drink (3) · sweet (3).
 * Several entries are loanwords (بِيتْزَا, بِسْكُوِيتٌ) authored without
 * a tanwin or with the conventional vowelization for Arabic textbooks.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const FOOD_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Savory (4)
  { key: "bread", nameAr: "خُبْزٌ",      transliteration: "khubz",       iconKey: "Bread", audioText: "خُبْزٌ",      category: "savory",        idleAnimation: "wiggle" },
  { key: "rice",  nameAr: "أَرُزٌّ",      transliteration: "aruzz",       iconKey: "Rice",  audioText: "أَرُزٌّ",      category: "savory",        idleAnimation: "bob" },
  { key: "pasta", nameAr: "مَعْكَرُونَةٌ", transliteration: "maʿkarūna",   iconKey: "Pasta", audioText: "مَعْكَرُونَةٌ", category: "savory",        idleAnimation: "sway" },
  { key: "soup",  nameAr: "حَسَاءٌ",      transliteration: "ḥasā'",       iconKey: "Soup",  audioText: "حَسَاءٌ",      category: "savory",        idleAnimation: "sway" },

  // Mixed-savory (2)
  { key: "pizza",  nameAr: "بِيتْزَا", transliteration: "bītzā", iconKey: "Pizza",  audioText: "بِيتْزَا", category: "mixed_savory", idleAnimation: "wiggle" },
  { key: "cheese", nameAr: "جُبْنٌ",   transliteration: "jubn",  iconKey: "Cheese", audioText: "جُبْنٌ",   category: "mixed_savory", idleAnimation: "bob" },

  // Drink (3)
  { key: "milk",  nameAr: "حَلِيبٌ",  transliteration: "ḥalīb", iconKey: "Milk",  audioText: "حَلِيبٌ",  category: "drink", idleAnimation: "bob" },
  { key: "water", nameAr: "مَاءٌ",    transliteration: "mā'",   iconKey: "Water", audioText: "مَاءٌ",    category: "drink", idleAnimation: "bob" },
  { key: "juice", nameAr: "عَصِيرٌ",  transliteration: "ʿaṣīr", iconKey: "Juice", audioText: "عَصِيرٌ",  category: "drink", idleAnimation: "sway" },

  // Sweet (3)
  { key: "cake",   nameAr: "كَعْكَةٌ",     transliteration: "kaʿka",    iconKey: "Cake",   audioText: "كَعْكَةٌ",     category: "sweet", idleAnimation: "bounce" },
  { key: "cookie", nameAr: "بِسْكُوِيتٌ",  transliteration: "biskuwīt", iconKey: "Cookie", audioText: "بِسْكُوِيتٌ",  category: "sweet", idleAnimation: "bounce" },
  { key: "honey",  nameAr: "عَسَلٌ",       transliteration: "ʿasal",    iconKey: "Honey",  audioText: "عَسَلٌ",       category: "sweet", idleAnimation: "breathe" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // bread — خُبْزٌ — khub-zun
  {
    itemKey: "bread",
    word: "خُبْزٌ",
    letters: [
      { base: "خ", harakat: "ُ", display: "خُ", name: "خَاءٌ", isTarget: false },
      { base: "ب", harakat: "ْ", display: "بْ", name: "بَاءٌ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", name: "زَايٌ", isTarget: false },
    ],
  },
  // rice — أَرُزٌّ — a-ruz-zun
  {
    itemKey: "rice",
    word: "أَرُزٌّ",
    letters: [
      { base: "أ", harakat: "َ",        display: "أَ",  name: "هَمْزَةٌ", isTarget: false },
      { base: "ر", harakat: "ُ",        display: "رُ",  name: "رَاءٌ",   isTarget: false },
      { base: "ز", harakat: "ٌّ",  display: "زٌّ", name: "زَايٌ",   isTarget: false },
    ],
  },
  // pasta — مَعْكَرُونَةٌ — maʿ-ka-rū-na-tun
  {
    itemKey: "pasta",
    word: "مَعْكَرُونَةٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ",                 isTarget: false },
      { base: "ع", harakat: "ْ", display: "عْ", name: "عَيْنٌ",                isTarget: false },
      { base: "ك", harakat: "َ", display: "كَ", name: "كَافٌ",                 isTarget: false },
      { base: "ر", harakat: "ُ", display: "رُ", name: "رَاءٌ",                 isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ",                 isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // soup — حَسَاءٌ — ḥa-sā-'un
  {
    itemKey: "soup",
    word: "حَسَاءٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", name: "حَاءٌ",   isTarget: false },
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ",   isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",  isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", name: "هَمْزَةٌ", isTarget: false },
    ],
  },
  // pizza — بِيتْزَا — bī-tzā (loanword, no tanwin)
  {
    itemKey: "pizza",
    word: "بِيتْزَا",
    letters: [
      { base: "ب", harakat: "ِ", display: "بِ", name: "بَاءٌ",  isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",  isTarget: false },
      { base: "ت", harakat: "ْ", display: "تْ", name: "تَاءٌ",  isTarget: false },
      { base: "ز", harakat: "َ", display: "زَ", name: "زَايٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
    ],
  },
  // cheese — جُبْنٌ — jub-nun
  {
    itemKey: "cheese",
    word: "جُبْنٌ",
    letters: [
      { base: "ج", harakat: "ُ", display: "جُ", name: "جِيمٌ", isTarget: false },
      { base: "ب", harakat: "ْ", display: "بْ", name: "بَاءٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ", isTarget: false },
    ],
  },
  // milk — حَلِيبٌ — ḥa-lī-bun
  {
    itemKey: "milk",
    word: "حَلِيبٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", name: "حَاءٌ", isTarget: false },
      { base: "ل", harakat: "ِ", display: "لِ", name: "لَامٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ", isTarget: false },
    ],
  },
  // water — مَاءٌ — mā-'un
  {
    itemKey: "water",
    word: "مَاءٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ",   isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",  isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", name: "هَمْزَةٌ", isTarget: false },
    ],
  },
  // juice — عَصِيرٌ — ʿa-ṣī-run
  {
    itemKey: "juice",
    word: "عَصِيرٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ", isTarget: false },
      { base: "ص", harakat: "ِ", display: "صِ", name: "صَادٌ",  isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",  isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ",  isTarget: false },
    ],
  },
  // cake — كَعْكَةٌ — kaʿ-ka-tun
  {
    itemKey: "cake",
    word: "كَعْكَةٌ",
    letters: [
      { base: "ك", harakat: "َ", display: "كَ", name: "كَافٌ",                 isTarget: false },
      { base: "ع", harakat: "ْ", display: "عْ", name: "عَيْنٌ",                isTarget: false },
      { base: "ك", harakat: "َ", display: "كَ", name: "كَافٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // cookie — بِسْكُوِيتٌ — bi-sku-wīt-un (loanword)
  {
    itemKey: "cookie",
    word: "بِسْكُوِيتٌ",
    letters: [
      { base: "ب", harakat: "ِ", display: "بِ", name: "بَاءٌ", isTarget: false },
      { base: "س", harakat: "ْ", display: "سْ", name: "سِينٌ", isTarget: false },
      { base: "ك", harakat: "ُ", display: "كُ", name: "كَافٌ", isTarget: false },
      { base: "و", harakat: "ِ", display: "وِ", name: "وَاوٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ت", harakat: "ٌ", display: "تٌ", name: "تَاءٌ", isTarget: false },
    ],
  },
  // honey — عَسَلٌ — ʿa-sa-lun
  {
    itemKey: "honey",
    word: "عَسَلٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ", isTarget: false },
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
];

export const foodLessonContent: VocabularyLessonSection = {
  title: "الطَّعَامُ",
  theme: "food",
  items: ITEMS,
  words: WORDS,
  colors: FOOD_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الطَّعَامَ",
      description: "اِضْغَطْ عَلَى كُلِّ طَعَامٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الطَّعَامَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْأَطْعِمَةَ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 12,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الطَّعَامَ الْمَطْلُوبَ",
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
