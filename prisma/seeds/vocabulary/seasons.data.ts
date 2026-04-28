/**
 * Seed content for the `seasons` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/seasons.
 *
 * Sun-letter assimilation appears in three of the four words:
 *   - الرَّبِيعُ — sun letter ر, lām silent + shadda
 *   - الصَّيْفُ — sun letter ص, lām silent + shadda
 *   - الشِّتَاءُ — sun letter ش, lām silent + shadda
 * الْخَرِيفُ has a moon letter (خ), so the lām takes a sukun instead.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const SEASONS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  { key: "spring", nameAr: "الرَّبِيعُ",  transliteration: "ar-rabīʿ",  iconKey: "Spring", audioText: "الرَّبِيعُ",  idleAnimation: "sway" },
  { key: "summer", nameAr: "الصَّيْفُ",    transliteration: "aṣ-ṣayf",   iconKey: "Summer", audioText: "الصَّيْفُ",    idleAnimation: "breathe" },
  { key: "autumn", nameAr: "الْخَرِيفُ",   transliteration: "al-kharīf", iconKey: "Autumn", audioText: "الْخَرِيفُ",   idleAnimation: "hop" },
  { key: "winter", nameAr: "الشِّتَاءُ",   transliteration: "ash-shitā'", iconKey: "Winter", audioText: "الشِّتَاءُ",   idleAnimation: "bob" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // spring — الرَّبِيعُ — ar-rabīʿ-u (sun letter ر)
  {
    itemKey: "spring",
    word: "الرَّبِيعُ",
    letters: [
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "",              display: "ل",    name: "لَامٌ",  isTarget: false },
      { base: "ر", harakat: "َّ",  display: "رَّ", name: "رَاءٌ",  isTarget: false },
      { base: "ب", harakat: "ِ",        display: "بِ",  name: "بَاءٌ",  isTarget: false },
      { base: "ي", harakat: "",              display: "ي",    name: "يَاءٌ",  isTarget: false },
      { base: "ع", harakat: "ُ",        display: "عُ",  name: "عَيْنٌ", isTarget: false },
    ],
  },
  // summer — الصَّيْفُ — aṣ-ṣayf-u (sun letter ص)
  {
    itemKey: "summer",
    word: "الصَّيْفُ",
    letters: [
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "",              display: "ل",    name: "لَامٌ",  isTarget: false },
      { base: "ص", harakat: "َّ",  display: "صَّ", name: "صَادٌ", isTarget: false },
      { base: "ي", harakat: "ْ",        display: "يْ",  name: "يَاءٌ",  isTarget: false },
      { base: "ف", harakat: "ُ",        display: "فُ",  name: "فَاءٌ",  isTarget: false },
    ],
  },
  // autumn — الْخَرِيفُ — al-kharīf-u (moon letter خ)
  {
    itemKey: "autumn",
    word: "الْخَرِيفُ",
    letters: [
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ",  isTarget: false },
      { base: "خ", harakat: "َ", display: "خَ", name: "خَاءٌ",  isTarget: false },
      { base: "ر", harakat: "ِ", display: "رِ", name: "رَاءٌ",  isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",  isTarget: false },
      { base: "ف", harakat: "ُ", display: "فُ", name: "فَاءٌ",  isTarget: false },
    ],
  },
  // winter — الشِّتَاءُ — ash-shitā'-u (sun letter ش)
  {
    itemKey: "winter",
    word: "الشِّتَاءُ",
    letters: [
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",   isTarget: false },
      { base: "ل", harakat: "",              display: "ل",    name: "لَامٌ",    isTarget: false },
      { base: "ش", harakat: "ِّ",  display: "شِّ", name: "شِينٌ",    isTarget: false },
      { base: "ت", harakat: "َ",        display: "تَ",  name: "تَاءٌ",    isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",   isTarget: false },
      { base: "ء", harakat: "ُ",        display: "ءُ",  name: "هَمْزَةٌ", isTarget: false },
    ],
  },
];

export const seasonsLessonContent: VocabularyLessonSection = {
  title: "الْفُصُولُ الْأَرْبَعَةُ",
  theme: "seasons",
  items: ITEMS,
  words: WORDS,
  colors: SEASONS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْفُصُولَ",
      description: "اِضْغَطْ عَلَى كُلِّ فَصْلٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْفَصْلَ",
      rounds: 4,
      optionsPerRound: 3,
      preferSameCategoryDistractors: false,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْفُصُولَ",
      rounds: 3,
      minTotalCharacters: 4,
      maxTotalCharacters: 6,
      minTargetCount: 1,
      maxTargetCount: 3,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْفَصْلَ الْمَطْلُوبَ",
      minInstructions: 2,
      maxInstructions: 4,
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
