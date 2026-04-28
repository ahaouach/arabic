/**
 * Seed content for the `weather` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/weather.
 *
 * Note on rainbow: the standard MSA name is the two-word phrase
 * `قَوْسُ قُزَحٍ` ("the bow of Quzaḥ"). Pre-split letters[] inlines
 * both words' letters in sequence with no space marker — same
 * convention as `motorcycle` in the transport theme.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const WEATHER_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  { key: "sun",     nameAr: "شَمْسٌ",       transliteration: "shams",       iconKey: "Sun",     audioText: "شَمْسٌ",       idleAnimation: "breathe" },
  { key: "rain",    nameAr: "مَطَرٌ",       transliteration: "maṭar",       iconKey: "Rain",    audioText: "مَطَرٌ",       idleAnimation: "bob" },
  { key: "cloud",   nameAr: "غَيْمَةٌ",     transliteration: "ghayma",      iconKey: "Cloud",   audioText: "غَيْمَةٌ",     idleAnimation: "sway" },
  { key: "snow",    nameAr: "ثَلْجٌ",       transliteration: "thalj",       iconKey: "Snow",    audioText: "ثَلْجٌ",       idleAnimation: "bob" },
  { key: "wind",    nameAr: "رِيحٌ",         transliteration: "rīḥ",         iconKey: "Wind",    audioText: "رِيحٌ",         idleAnimation: "sway" },
  { key: "storm",   nameAr: "عَاصِفَةٌ",    transliteration: "ʿāṣifa",      iconKey: "Storm",   audioText: "عَاصِفَةٌ",    idleAnimation: "wiggle" },
  { key: "rainbow", nameAr: "قَوْسُ قُزَحٍ", transliteration: "qaws quzaḥ",  iconKey: "Rainbow", audioText: "قَوْسُ قُزَحٍ", idleAnimation: "bounce" },
  { key: "fog",     nameAr: "ضَبَابٌ",      transliteration: "ḍabāb",       iconKey: "Fog",     audioText: "ضَبَابٌ",      idleAnimation: "sway" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // sun — شَمْسٌ — sham-sun
  {
    itemKey: "sun",
    word: "شَمْسٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", name: "شِينٌ", isTarget: false },
      { base: "م", harakat: "ْ", display: "مْ", name: "مِيمٌ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", name: "سِينٌ", isTarget: false },
    ],
  },
  // rain — مَطَرٌ — ma-ṭa-run
  {
    itemKey: "rain",
    word: "مَطَرٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ", isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ", isTarget: false },
    ],
  },
  // cloud — غَيْمَةٌ — ghay-ma-tun
  {
    itemKey: "cloud",
    word: "غَيْمَةٌ",
    letters: [
      { base: "غ", harakat: "َ", display: "غَ", name: "غَيْنٌ",                isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", name: "يَاءٌ",                 isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // snow — ثَلْجٌ — thal-jun
  {
    itemKey: "snow",
    word: "ثَلْجٌ",
    letters: [
      { base: "ث", harakat: "َ", display: "ثَ", name: "ثَاءٌ", isTarget: false },
      { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ", isTarget: false },
      { base: "ج", harakat: "ٌ", display: "جٌ", name: "جِيمٌ", isTarget: false },
    ],
  },
  // wind — رِيحٌ — rī-ḥun
  {
    itemKey: "wind",
    word: "رِيحٌ",
    letters: [
      { base: "ر", harakat: "ِ", display: "رِ", name: "رَاءٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ح", harakat: "ٌ", display: "حٌ", name: "حَاءٌ", isTarget: false },
    ],
  },
  // storm — عَاصِفَةٌ — ʿā-ṣi-fa-tun
  {
    itemKey: "storm",
    word: "عَاصِفَةٌ",
    letters: [
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ",                isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",                isTarget: false },
      { base: "ص", harakat: "ِ", display: "صِ", name: "صَادٌ",                 isTarget: false },
      { base: "ف", harakat: "َ", display: "فَ", name: "فَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // rainbow — قَوْسُ قُزَحٍ — qaws-u quzaḥ-in (two words; iḍāfa construction)
  {
    itemKey: "rainbow",
    word: "قَوْسُ قُزَحٍ",
    letters: [
      // First word: قَوْسُ
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", name: "وَاوٌ", isTarget: false },
      { base: "س", harakat: "ُ", display: "سُ", name: "سِينٌ", isTarget: false },
      // Second word: قُزَحٍ
      { base: "ق", harakat: "ُ", display: "قُ", name: "قَافٌ", isTarget: false },
      { base: "ز", harakat: "َ", display: "زَ", name: "زَايٌ", isTarget: false },
      { base: "ح", harakat: "ٍ", display: "حٍ", name: "حَاءٌ", isTarget: false },
    ],
  },
  // fog — ضَبَابٌ — ḍa-bā-bun
  {
    itemKey: "fog",
    word: "ضَبَابٌ",
    letters: [
      { base: "ض", harakat: "َ", display: "ضَ", name: "ضَادٌ", isTarget: false },
      { base: "ب", harakat: "َ", display: "بَ", name: "بَاءٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ", isTarget: false },
    ],
  },
];

export const weatherLessonContent: VocabularyLessonSection = {
  title: "الطَّقْسُ",
  theme: "weather",
  items: ITEMS,
  words: WORDS,
  colors: WEATHER_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الطَّقْسَ",
      description: "اِضْغَطْ عَلَى كُلِّ حَالَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْحَالَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: false,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ حَالَاتِ الطَّقْسِ",
      rounds: 4,
      minTotalCharacters: 6,
      maxTotalCharacters: 8,
      minTargetCount: 2,
      maxTargetCount: 4,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْحَالَةَ الْمَطْلُوبَةَ",
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
