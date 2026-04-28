/**
 * Seed content for the `body-parts` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/body-parts.
 *
 * See `prisma/seeds/vocabulary/fruits.data.ts` for the harakat
 * combining-mark reference table.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const BODY_PARTS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Head (5)
  { key: "head",   nameAr: "رَأْسٌ", transliteration: "ra's",   iconKey: "Head",   audioText: "رَأْسٌ", category: "head", idleAnimation: "bob" },
  { key: "eye",    nameAr: "عَيْنٌ", transliteration: "ʿayn",   iconKey: "Eye",    audioText: "عَيْنٌ", category: "head", idleAnimation: "wiggle" },
  { key: "nose",   nameAr: "أَنْفٌ", transliteration: "anf",    iconKey: "Nose",   audioText: "أَنْفٌ", category: "head", idleAnimation: "breathe" },
  { key: "mouth",  nameAr: "فَمٌ",   transliteration: "fam",    iconKey: "Mouth",  audioText: "فَمٌ",   category: "head", idleAnimation: "sway" },
  { key: "ear",    nameAr: "أُذُنٌ", transliteration: "udhun",  iconKey: "Ear",    audioText: "أُذُنٌ", category: "head", idleAnimation: "wiggle" },

  // Limbs (5)
  { key: "hand",   nameAr: "يَدٌ",     transliteration: "yad",    iconKey: "Hand",   audioText: "يَدٌ",     category: "limbs", idleAnimation: "sway" },
  { key: "foot",   nameAr: "قَدَمٌ",   transliteration: "qadam",  iconKey: "Foot",   audioText: "قَدَمٌ",   category: "limbs", idleAnimation: "hop" },
  { key: "arm",    nameAr: "ذِرَاعٌ",  transliteration: "dhirāʿ", iconKey: "Arm",    audioText: "ذِرَاعٌ",  category: "limbs", idleAnimation: "bob" },
  { key: "leg",    nameAr: "رِجْلٌ",   transliteration: "rijl",   iconKey: "Leg",    audioText: "رِجْلٌ",   category: "limbs", idleAnimation: "hop" },
  { key: "finger", nameAr: "إِصْبَعٌ", transliteration: "iṣbaʿ",  iconKey: "Finger", audioText: "إِصْبَعٌ", category: "limbs", idleAnimation: "wiggle" },

  // Other (2)
  { key: "hair",   nameAr: "شَعْرٌ", transliteration: "shaʿr", iconKey: "Hair",  audioText: "شَعْرٌ", category: "other", idleAnimation: "sway" },
  { key: "tooth",  nameAr: "سِنٌّ",  transliteration: "sinn",  iconKey: "Tooth", audioText: "سِنٌّ",  category: "other", idleAnimation: "bounce" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // head — رَأْسٌ — ra'-sun
  {
    itemKey: "head",
    word: "رَأْسٌ",
    letters: [
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ",   isTarget: false },
      { base: "أ", harakat: "ْ", display: "أْ", name: "هَمْزَةٌ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", name: "سِينٌ",   isTarget: false },
    ],
  },
  // eye — عَيْنٌ — ʿay-nun
  {
    itemKey: "eye",
    word: "عَيْنٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", name: "يَاءٌ",  isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",  isTarget: false },
    ],
  },
  // nose — أَنْفٌ — an-fun
  {
    itemKey: "nose",
    word: "أَنْفٌ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ن", harakat: "ْ", display: "نْ", name: "نُونٌ",   isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", name: "فَاءٌ",   isTarget: false },
    ],
  },
  // mouth — فَمٌ — fa-mun
  {
    itemKey: "mouth",
    word: "فَمٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", name: "فَاءٌ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", name: "مِيمٌ", isTarget: false },
    ],
  },
  // ear — أُذُنٌ — u-dhu-nun
  {
    itemKey: "ear",
    word: "أُذُنٌ",
    letters: [
      { base: "أ", harakat: "ُ", display: "أُ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ذ", harakat: "ُ", display: "ذُ", name: "ذَالٌ",   isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",   isTarget: false },
    ],
  },
  // hand — يَدٌ — ya-dun
  {
    itemKey: "hand",
    word: "يَدٌ",
    letters: [
      { base: "ي", harakat: "َ", display: "يَ", name: "يَاءٌ", isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", name: "دَالٌ", isTarget: false },
    ],
  },
  // foot — قَدَمٌ — qa-da-mun
  {
    itemKey: "foot",
    word: "قَدَمٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ", isTarget: false },
      { base: "د", harakat: "َ", display: "دَ", name: "دَالٌ", isTarget: false },
      { base: "م", harakat: "ٌ", display: "مٌ", name: "مِيمٌ", isTarget: false },
    ],
  },
  // arm — ذِرَاعٌ — dhi-rā-ʿun
  {
    itemKey: "arm",
    word: "ذِرَاعٌ",
    letters: [
      { base: "ذ", harakat: "ِ", display: "ذِ", name: "ذَالٌ",  isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", name: "عَيْنٌ", isTarget: false },
    ],
  },
  // leg — رِجْلٌ — rij-lun
  {
    itemKey: "leg",
    word: "رِجْلٌ",
    letters: [
      { base: "ر", harakat: "ِ", display: "رِ", name: "رَاءٌ", isTarget: false },
      { base: "ج", harakat: "ْ", display: "جْ", name: "جِيمٌ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
  // finger — إِصْبَعٌ — iṣ-ba-ʿun
  {
    itemKey: "finger",
    word: "إِصْبَعٌ",
    letters: [
      { base: "إ", harakat: "ِ", display: "إِ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ص", harakat: "ْ", display: "صْ", name: "صَادٌ",   isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ",   isTarget: false },
      { base: "ع", harakat: "ٌ", display: "عٌ", name: "عَيْنٌ",  isTarget: false },
    ],
  },
  // hair — شَعْرٌ — shaʿ-run
  {
    itemKey: "hair",
    word: "شَعْرٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", name: "شِينٌ", isTarget: false },
      { base: "ع", harakat: "ْ", display: "عْ", name: "عَيْنٌ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ",  isTarget: false },
    ],
  },
  // tooth — سِنٌّ — sin-nun
  {
    itemKey: "tooth",
    word: "سِنٌّ",
    letters: [
      { base: "س", harakat: "ِ",        display: "سِ",  name: "سِينٌ", isTarget: false },
      { base: "ن", harakat: "ٌّ",  display: "نٌّ", name: "نُونٌ", isTarget: false },
    ],
  },
];

export const bodyPartsLessonContent: VocabularyLessonSection = {
  title: "أَجْزَاءُ الْجِسْمِ",
  theme: "body-parts",
  items: ITEMS,
  words: WORDS,
  colors: BODY_PARTS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفْ أَجْزَاءَ الْجِسْمِ",
      description: "اِضْغَطْ عَلَى كُلِّ جُزْءٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْجُزْءَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْأَجْزَاءَ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 12,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْجُزْءَ الْمَطْلُوبَ",
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
