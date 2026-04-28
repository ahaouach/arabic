/**
 * Seed content for the `clothes` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/clothes.
 *
 * See `prisma/seeds/vocabulary/fruits.data.ts` for the harakat
 * combining-mark reference table.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const CLOTHES_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Tops (3)
  { key: "shirt",  nameAr: "قَمِيصٌ",   transliteration: "qamīṣ",  iconKey: "Shirt",  audioText: "قَمِيصٌ",   category: "tops",        idleAnimation: "sway" },
  { key: "dress",  nameAr: "فُسْتَانٌ", transliteration: "fustān", iconKey: "Dress",  audioText: "فُسْتَانٌ", category: "tops",        idleAnimation: "sway" },
  { key: "jacket", nameAr: "مِعْطَفٌ",  transliteration: "miʿṭaf", iconKey: "Jacket", audioText: "مِعْطَفٌ",  category: "tops",        idleAnimation: "sway" },

  // Bottoms (3)
  { key: "pants",  nameAr: "بَنْطَلُونٌ", transliteration: "banṭalūn", iconKey: "Pants", audioText: "بَنْطَلُونٌ", category: "bottoms",     idleAnimation: "sway" },
  { key: "shoes",  nameAr: "حِذَاءٌ",     transliteration: "ḥidhā'",   iconKey: "Shoes", audioText: "حِذَاءٌ",     category: "bottoms",     idleAnimation: "hop" },
  { key: "socks",  nameAr: "جَوْرَبٌ",    transliteration: "jawrab",   iconKey: "Socks", audioText: "جَوْرَبٌ",    category: "bottoms",     idleAnimation: "wiggle" },

  // Accessories (4)
  { key: "hat",     nameAr: "قُبَّعَةٌ",  transliteration: "qubbaʿa", iconKey: "Hat",     audioText: "قُبَّعَةٌ",  category: "accessories", idleAnimation: "bounce" },
  { key: "scarf",   nameAr: "وِشَاحٌ",   transliteration: "wishāḥ",  iconKey: "Scarf",   audioText: "وِشَاحٌ",   category: "accessories", idleAnimation: "sway" },
  { key: "gloves",  nameAr: "قُفَّازٌ",   transliteration: "quffāz",  iconKey: "Gloves",  audioText: "قُفَّازٌ",   category: "accessories", idleAnimation: "wiggle" },
  { key: "glasses", nameAr: "نَظَّارَةٌ", transliteration: "naẓẓāra", iconKey: "Glasses", audioText: "نَظَّارَةٌ", category: "accessories", idleAnimation: "bob" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // shirt — قَمِيصٌ — qa-mī-ṣun
  {
    itemKey: "shirt",
    word: "قَمِيصٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ", isTarget: false },
      { base: "م", harakat: "ِ", display: "مِ", name: "مِيمٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ص", harakat: "ٌ", display: "صٌ", name: "صَادٌ", isTarget: false },
    ],
  },
  // dress — فُسْتَانٌ — fus-tā-nun
  {
    itemKey: "dress",
    word: "فُسْتَانٌ",
    letters: [
      { base: "ف", harakat: "ُ", display: "فُ", name: "فَاءٌ",  isTarget: false },
      { base: "س", harakat: "ْ", display: "سْ", name: "سِينٌ",  isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", name: "تَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",  isTarget: false },
    ],
  },
  // jacket — مِعْطَفٌ — miʿ-ṭa-fun
  {
    itemKey: "jacket",
    word: "مِعْطَفٌ",
    letters: [
      { base: "م", harakat: "ِ", display: "مِ", name: "مِيمٌ",  isTarget: false },
      { base: "ع", harakat: "ْ", display: "عْ", name: "عَيْنٌ", isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ",  isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", name: "فَاءٌ",  isTarget: false },
    ],
  },
  // pants — بَنْطَلُونٌ — ban-ṭa-lū-nun
  {
    itemKey: "pants",
    word: "بَنْطَلُونٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ", isTarget: false },
      { base: "ن", harakat: "ْ", display: "نْ", name: "نُونٌ", isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ", isTarget: false },
      { base: "ل", harakat: "ُ", display: "لُ", name: "لَامٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ", isTarget: false },
    ],
  },
  // shoes — حِذَاءٌ — ḥi-dhā-'un
  {
    itemKey: "shoes",
    word: "حِذَاءٌ",
    letters: [
      { base: "ح", harakat: "ِ", display: "حِ", name: "حَاءٌ",  isTarget: false },
      { base: "ذ", harakat: "َ", display: "ذَ", name: "ذَالٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ء", harakat: "ٌ", display: "ءٌ", name: "هَمْزَةٌ", isTarget: false },
    ],
  },
  // socks — جَوْرَبٌ — jaw-ra-bun
  {
    itemKey: "socks",
    word: "جَوْرَبٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", name: "جِيمٌ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", name: "وَاوٌ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ", isTarget: false },
    ],
  },
  // hat — قُبَّعَةٌ — qub-ba-ʿa-tun
  {
    itemKey: "hat",
    word: "قُبَّعَةٌ",
    letters: [
      { base: "ق", harakat: "ُ",        display: "قُ",  name: "قَافٌ",                 isTarget: false },
      { base: "ب", harakat: "َّ",  display: "بَّ", name: "بَاءٌ",                 isTarget: false },
      { base: "ع", harakat: "َ",        display: "عَ",  name: "عَيْنٌ",                isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // scarf — وِشَاحٌ — wi-shā-ḥun
  {
    itemKey: "scarf",
    word: "وِشَاحٌ",
    letters: [
      { base: "و", harakat: "ِ", display: "وِ", name: "وَاوٌ", isTarget: false },
      { base: "ش", harakat: "َ", display: "شَ", name: "شِينٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ح", harakat: "ٌ", display: "حٌ", name: "حَاءٌ", isTarget: false },
    ],
  },
  // gloves — قُفَّازٌ — quf-fā-zun
  {
    itemKey: "gloves",
    word: "قُفَّازٌ",
    letters: [
      { base: "ق", harakat: "ُ",        display: "قُ",  name: "قَافٌ", isTarget: false },
      { base: "ف", harakat: "َّ",  display: "فَّ", name: "فَاءٌ", isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "ز", harakat: "ٌ",        display: "زٌ",  name: "زَايٌ", isTarget: false },
    ],
  },
  // glasses — نَظَّارَةٌ — naẓ-ẓā-ra-tun
  {
    itemKey: "glasses",
    word: "نَظَّارَةٌ",
    letters: [
      { base: "ن", harakat: "َ",        display: "نَ",  name: "نُونٌ",                 isTarget: false },
      { base: "ظ", harakat: "َّ",  display: "ظَّ", name: "ظَاءٌ",                 isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",                isTarget: false },
      { base: "ر", harakat: "َ",        display: "رَ",  name: "رَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
];

export const clothesLessonContent: VocabularyLessonSection = {
  title: "الْمَلَابِسُ",
  theme: "clothes",
  items: ITEMS,
  words: WORDS,
  colors: CLOTHES_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْمَلَابِسَ",
      description: "اِضْغَطْ عَلَى كُلِّ قِطْعَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْقِطْعَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ قِطَعَ الْمَلَابِسِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 10,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْقِطْعَةَ الْمَطْلُوبَةَ",
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
