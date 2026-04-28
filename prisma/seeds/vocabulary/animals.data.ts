/**
 * Seed content for the `animals` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/animals.
 *
 * Coexists with the legacy `animals-world` course (`animal_world` /
 * `animal_world_quiz` section types) — different pedagogy, different
 * slug; this is the new 5-zone vocabulary drill.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const ANIMALS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Pets (3)
  { key: "cat",    nameAr: "قِطٌّ",   transliteration: "qiṭṭ",   iconKey: "Cat",    audioText: "قِطٌّ",   category: "pet",   idleAnimation: "wiggle" },
  { key: "dog",    nameAr: "كَلْبٌ",  transliteration: "kalb",   iconKey: "Dog",    audioText: "كَلْبٌ",  category: "pet",   idleAnimation: "hop" },
  { key: "rabbit", nameAr: "أَرْنَبٌ", transliteration: "arnab",  iconKey: "Rabbit", audioText: "أَرْنَبٌ", category: "pet",   idleAnimation: "hop" },

  // Farm (3)
  { key: "cow",   nameAr: "بَقَرَةٌ", transliteration: "baqara", iconKey: "Cow",   audioText: "بَقَرَةٌ", category: "farm",  idleAnimation: "sway" },
  { key: "horse", nameAr: "حِصَانٌ",  transliteration: "ḥiṣān",  iconKey: "Horse", audioText: "حِصَانٌ",  category: "farm",  idleAnimation: "bounce" },
  { key: "sheep", nameAr: "خَرُوفٌ",  transliteration: "kharūf", iconKey: "Sheep", audioText: "خَرُوفٌ",  category: "farm",  idleAnimation: "bob" },

  // Wild (4)
  { key: "lion",     nameAr: "أَسَدٌ",   transliteration: "asad",     iconKey: "Lion",     audioText: "أَسَدٌ",   category: "wild",  idleAnimation: "breathe" },
  { key: "elephant", nameAr: "فِيلٌ",    transliteration: "fīl",      iconKey: "Elephant", audioText: "فِيلٌ",    category: "wild",  idleAnimation: "sway" },
  { key: "monkey",   nameAr: "قِرْدٌ",   transliteration: "qird",     iconKey: "Monkey",   audioText: "قِرْدٌ",   category: "wild",  idleAnimation: "wiggle" },
  { key: "snake",    nameAr: "ثُعْبَانٌ", transliteration: "thuʿbān",  iconKey: "Snake",    audioText: "ثُعْبَانٌ", category: "wild",  idleAnimation: "sway" },

  // Water/Sky (2)
  { key: "fish", nameAr: "سَمَكَةٌ", transliteration: "samaka",  iconKey: "Fish", audioText: "سَمَكَةٌ", category: "water_sky", idleAnimation: "sway" },
  { key: "bird", nameAr: "عُصْفُورٌ", transliteration: "ʿuṣfūr",  iconKey: "Bird", audioText: "عُصْفُورٌ", category: "water_sky", idleAnimation: "bounce" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // cat — قِطٌّ — qiṭṭ-un (final shadda + dammatan)
  {
    itemKey: "cat",
    word: "قِطٌّ",
    letters: [
      { base: "ق", harakat: "ِ",        display: "قِ",  name: "قَافٌ", isTarget: false },
      { base: "ط", harakat: "ٌّ",  display: "طٌّ", name: "طَاءٌ", isTarget: false },
    ],
  },
  // dog — كَلْبٌ — kal-bun
  {
    itemKey: "dog",
    word: "كَلْبٌ",
    letters: [
      { base: "ك", harakat: "َ", display: "كَ", name: "كَافٌ", isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ", isTarget: false },
    ],
  },
  // rabbit — أَرْنَبٌ — ar-na-bun
  {
    itemKey: "rabbit",
    word: "أَرْنَبٌ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", name: "رَاءٌ",   isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",   isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ",   isTarget: false },
    ],
  },
  // cow — بَقَرَةٌ — ba-qa-ra-tun
  {
    itemKey: "cow",
    word: "بَقَرَةٌ",
    letters: [
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ",                 isTarget: false },
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ",                 isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // horse — حِصَانٌ — ḥi-ṣā-nun
  {
    itemKey: "horse",
    word: "حِصَانٌ",
    letters: [
      { base: "ح", harakat: "ِ", display: "حِ", name: "حَاءٌ",  isTarget: false },
      { base: "ص", harakat: "َ", display: "صَ", name: "صَادٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",  isTarget: false },
    ],
  },
  // sheep — خَرُوفٌ — kha-rū-fun
  {
    itemKey: "sheep",
    word: "خَرُوفٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", name: "خَاءٌ", isTarget: false },
      { base: "ر", harakat: "ُ", display: "رُ", name: "رَاءٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", name: "فَاءٌ", isTarget: false },
    ],
  },
  // lion — أَسَدٌ — a-sa-dun
  {
    itemKey: "lion",
    word: "أَسَدٌ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", name: "هَمْزَةٌ", isTarget: false },
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ",   isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", name: "دَالٌ",   isTarget: false },
    ],
  },
  // elephant — فِيلٌ — fī-lun
  {
    itemKey: "elephant",
    word: "فِيلٌ",
    letters: [
      { base: "ف", harakat: "ِ", display: "فِ", name: "فَاءٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
  // monkey — قِرْدٌ — qir-dun
  {
    itemKey: "monkey",
    word: "قِرْدٌ",
    letters: [
      { base: "ق", harakat: "ِ", display: "قِ", name: "قَافٌ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", name: "رَاءٌ", isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", name: "دَالٌ", isTarget: false },
    ],
  },
  // snake — ثُعْبَانٌ — thuʿ-bā-nun
  {
    itemKey: "snake",
    word: "ثُعْبَانٌ",
    letters: [
      { base: "ث", harakat: "ُ", display: "ثُ", name: "ثَاءٌ",  isTarget: false },
      { base: "ع", harakat: "ْ", display: "عْ", name: "عَيْنٌ", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",  isTarget: false },
    ],
  },
  // fish — سَمَكَةٌ — sa-ma-ka-tun
  {
    itemKey: "fish",
    word: "سَمَكَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ",                 isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ",                 isTarget: false },
      { base: "ك", harakat: "َ", display: "كَ", name: "كَافٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // bird — عُصْفُورٌ — ʿuṣ-fū-run
  {
    itemKey: "bird",
    word: "عُصْفُورٌ",
    letters: [
      { base: "ع", harakat: "ُ", display: "عُ", name: "عَيْنٌ", isTarget: false },
      { base: "ص", harakat: "ْ", display: "صْ", name: "صَادٌ",  isTarget: false },
      { base: "ف", harakat: "ُ", display: "فُ", name: "فَاءٌ",  isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ",  isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ",  isTarget: false },
    ],
  },
];

export const animalsLessonContent: VocabularyLessonSection = {
  title: "عَالَمُ الْحَيَوَانَاتِ",
  theme: "animals",
  items: ITEMS,
  words: WORDS,
  colors: ANIMALS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْحَيَوَانَاتِ",
      description: "اِضْغَطْ عَلَى كُلِّ حَيَوَانٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْحَيَوَانَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْحَيَوَانَاتِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 12,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْحَيَوَانَ الْمَطْلُوبَ",
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
