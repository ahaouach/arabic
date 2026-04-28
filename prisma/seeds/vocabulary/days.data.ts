/**
 * Seed content for the `days` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/days.
 *
 * Etymology note (kept in the seed so authors can reference it later):
 *   - الْأَحَدُ (Sunday) — "the first" (cardinal #1).
 *   - الِاثْنَيْنِ (Monday) — "the two" (cardinal #2).
 *   - الثُّلَاثَاءُ (Tuesday) — "the third" (#3).
 *   - الْأَرْبِعَاءُ (Wednesday) — "the fourth" (#4).
 *   - الْخَمِيسُ (Thursday) — "the fifth" (#5).
 *   - الْجُمُعَةُ (Friday) — "gathering day" (Jumuʿah prayer).
 *   - السَّبْتُ (Saturday) — "rest / Sabbath day".
 *
 * The icon glyphs render the same `CalendarBlank` for all 7, with the
 * digit 1-7 overlaid showing the position in the Sunday-first week.
 *
 * Sun-letter assimilation (sukun rules) for the lām of the article:
 *   - Moon-letter follow (أ خ ج): لـ ال gets `sukun`.
 *   - Sun-letter follow (ث ر س ش ص): لـ ال is silent and the next
 *     consonant carries `shadda`.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const DAYS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  { key: "sunday",    nameAr: "الْأَحَدُ",       transliteration: "al-aḥad",       iconKey: "Day1", audioText: "الْأَحَدُ",       idleAnimation: "bob" },
  { key: "monday",    nameAr: "الِاثْنَيْنِ",     transliteration: "al-ithnayn",    iconKey: "Day2", audioText: "الِاثْنَيْنِ",     idleAnimation: "bounce" },
  { key: "tuesday",   nameAr: "الثُّلَاثَاءُ",    transliteration: "ath-thulāthā'", iconKey: "Day3", audioText: "الثُّلَاثَاءُ",    idleAnimation: "sway" },
  { key: "wednesday", nameAr: "الْأَرْبِعَاءُ",   transliteration: "al-arbiʿā'",    iconKey: "Day4", audioText: "الْأَرْبِعَاءُ",   idleAnimation: "wiggle" },
  { key: "thursday",  nameAr: "الْخَمِيسُ",      transliteration: "al-khamīs",     iconKey: "Day5", audioText: "الْخَمِيسُ",      idleAnimation: "hop" },
  { key: "friday",    nameAr: "الْجُمُعَةُ",     transliteration: "al-jumuʿa",     iconKey: "Day6", audioText: "الْجُمُعَةُ",     idleAnimation: "breathe" },
  { key: "saturday",  nameAr: "السَّبْتُ",       transliteration: "as-sabt",       iconKey: "Day7", audioText: "السَّبْتُ",       idleAnimation: "breathe" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // Sunday — الْأَحَدُ — al-aḥad-u (moon letter, lam takes sukun)
  {
    itemKey: "sunday",
    word: "الْأَحَدُ",
    letters: [
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",   isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ",   isTarget: false },
      { base: "أ", harakat: "َ", display: "أَ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ح", harakat: "َ", display: "حَ", name: "حَاءٌ",   isTarget: false },
      { base: "د", harakat: "ُ", display: "دُ", name: "دَالٌ",   isTarget: false },
    ],
  },
  // Monday — الِاثْنَيْنِ — al-ithnayn-i (genitive, kasra on lam from wasla assimilation)
  {
    itemKey: "monday",
    word: "الِاثْنَيْنِ",
    letters: [
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "ِ", display: "لِ", name: "لَامٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ث", harakat: "ْ", display: "ثْ", name: "ثَاءٌ",  isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",  isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", name: "يَاءٌ",  isTarget: false },
      { base: "ن", harakat: "ِ", display: "نِ", name: "نُونٌ",  isTarget: false },
    ],
  },
  // Tuesday — الثُّلَاثَاءُ — ath-thulāthā'-u (sun letter ث, shadda)
  {
    itemKey: "tuesday",
    word: "الثُّلَاثَاءُ",
    letters: [
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",  isTarget: false },
      { base: "ل", harakat: "",              display: "ل",    name: "لَامٌ",   isTarget: false },
      { base: "ث", harakat: "ُّ",  display: "ثُّ", name: "ثَاءٌ",   isTarget: false },
      { base: "ل", harakat: "َ",        display: "لَ",  name: "لَامٌ",   isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",  isTarget: false },
      { base: "ث", harakat: "َ",        display: "ثَ",  name: "ثَاءٌ",   isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",  isTarget: false },
      { base: "ء", harakat: "ُ",        display: "ءُ",  name: "هَمْزَةٌ", isTarget: false },
    ],
  },
  // Wednesday — الْأَرْبِعَاءُ — al-arbiʿā'-u (moon letter)
  {
    itemKey: "wednesday",
    word: "الْأَرْبِعَاءُ",
    letters: [
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",   isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ",   isTarget: false },
      { base: "أ", harakat: "َ", display: "أَ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", name: "رَاءٌ",   isTarget: false },
      { base: "ب", harakat: "ِ", display: "بِ", name: "بَاءٌ",   isTarget: false },
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",   isTarget: false },
      { base: "ء", harakat: "ُ", display: "ءُ", name: "هَمْزَةٌ", isTarget: false },
    ],
  },
  // Thursday — الْخَمِيسُ — al-khamīs-u (moon letter)
  {
    itemKey: "thursday",
    word: "الْخَمِيسُ",
    letters: [
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ",  isTarget: false },
      { base: "خ", harakat: "َ", display: "خَ", name: "خَاءٌ",  isTarget: false },
      { base: "م", harakat: "ِ", display: "مِ", name: "مِيمٌ",  isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",  isTarget: false },
      { base: "س", harakat: "ُ", display: "سُ", name: "سِينٌ",  isTarget: false },
    ],
  },
  // Friday — الْجُمُعَةُ — al-jumuʿat-u (moon letter ج)
  {
    itemKey: "friday",
    word: "الْجُمُعَةُ",
    letters: [
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",                isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ",                 isTarget: false },
      { base: "ج", harakat: "ُ", display: "جُ", name: "جِيمٌ",                 isTarget: false },
      { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ",                 isTarget: false },
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ",                isTarget: false },
      { base: "ة", harakat: "ُ", display: "ةُ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // Saturday — السَّبْتُ — as-sabt-u (sun letter س)
  {
    itemKey: "saturday",
    word: "السَّبْتُ",
    letters: [
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "",              display: "ل",    name: "لَامٌ",  isTarget: false },
      { base: "س", harakat: "َّ",  display: "سَّ", name: "سِينٌ",  isTarget: false },
      { base: "ب", harakat: "ْ",        display: "بْ",  name: "بَاءٌ",  isTarget: false },
      { base: "ت", harakat: "ُ",        display: "تُ",  name: "تَاءٌ",  isTarget: false },
    ],
  },
];

export const daysLessonContent: VocabularyLessonSection = {
  title: "أَيَّامُ الْأُسْبُوعِ",
  theme: "days",
  items: ITEMS,
  words: WORDS,
  colors: DAYS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفْ أَيَّامَ الْأُسْبُوعِ",
      description: "اِضْغَطْ عَلَى كُلِّ يَوْمٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْيَوْمَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: false,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْأَيَّامَ",
      rounds: 4,
      minTotalCharacters: 6,
      maxTotalCharacters: 8,
      minTargetCount: 2,
      maxTargetCount: 4,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْيَوْمَ الْمَطْلُوبَ",
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
