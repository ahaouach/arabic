/**
 * Seed content for the `transport` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/transport.
 *
 * Note on motorcycle: the standard MSA name is the two-word phrase
 * `دَرَّاجَةٌ نَارِيَّةٌ`. The pre-split letters[] inlines both words'
 * letters in sequence (no space marker) — `ColorLettersZone` lays each
 * letter out as its own tappable card with `gap-3` between cards, so
 * the visual separation falls out naturally.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const TRANSPORT_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Land (6)
  { key: "car",        nameAr: "سَيَّارَةٌ",        transliteration: "sayyāra",       iconKey: "Car",        audioText: "سَيَّارَةٌ",        category: "land",  idleAnimation: "bounce" },
  { key: "bus",        nameAr: "حَافِلَةٌ",         transliteration: "ḥāfila",        iconKey: "Bus",        audioText: "حَافِلَةٌ",         category: "land",  idleAnimation: "sway" },
  { key: "train",      nameAr: "قِطَارٌ",           transliteration: "qiṭār",         iconKey: "Train",      audioText: "قِطَارٌ",           category: "land",  idleAnimation: "hop" },
  { key: "bike",       nameAr: "دَرَّاجَةٌ",        transliteration: "darrāja",       iconKey: "Bike",       audioText: "دَرَّاجَةٌ",        category: "land",  idleAnimation: "wiggle" },
  { key: "motorcycle", nameAr: "دَرَّاجَةٌ نَارِيَّةٌ", transliteration: "darrāja nāriyya", iconKey: "Motorcycle", audioText: "دَرَّاجَةٌ نَارِيَّةٌ", category: "land",  idleAnimation: "wiggle" },
  { key: "truck",      nameAr: "شَاحِنَةٌ",         transliteration: "shāḥina",       iconKey: "Truck",      audioText: "شَاحِنَةٌ",         category: "land",  idleAnimation: "bounce" },

  // Air (2)
  { key: "plane",      nameAr: "طَائِرَةٌ",          transliteration: "ṭā'ira",     iconKey: "Plane",      audioText: "طَائِرَةٌ",          category: "air",   idleAnimation: "sway" },
  { key: "helicopter", nameAr: "مِرْوَحِيَّةٌ",       transliteration: "mirwaḥiyya", iconKey: "Helicopter", audioText: "مِرْوَحِيَّةٌ",       category: "air",   idleAnimation: "bob" },

  // Water (2)
  { key: "boat",       nameAr: "قَارِبٌ",            transliteration: "qārib",      iconKey: "Boat",       audioText: "قَارِبٌ",            category: "water", idleAnimation: "sway" },
  { key: "ship",       nameAr: "سَفِينَةٌ",          transliteration: "safīna",     iconKey: "Ship",       audioText: "سَفِينَةٌ",          category: "water", idleAnimation: "bob" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // car — سَيَّارَةٌ — say-yā-ra-tun
  {
    itemKey: "car",
    word: "سَيَّارَةٌ",
    letters: [
      { base: "س", harakat: "َ",        display: "سَ",  name: "سِينٌ",                 isTarget: false },
      { base: "ي", harakat: "َّ",  display: "يَّ", name: "يَاءٌ",                 isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",                isTarget: false },
      { base: "ر", harakat: "َ",        display: "رَ",  name: "رَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // bus — حَافِلَةٌ — ḥā-fi-la-tun
  {
    itemKey: "bus",
    word: "حَافِلَةٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", name: "حَاءٌ",                 isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",                isTarget: false },
      { base: "ف", harakat: "ِ", display: "فِ", name: "فَاءٌ",                 isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", name: "لَامٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // train — قِطَارٌ — qi-ṭā-run
  {
    itemKey: "train",
    word: "قِطَارٌ",
    letters: [
      { base: "ق", harakat: "ِ", display: "قِ", name: "قَافٌ",  isTarget: false },
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ",  isTarget: false },
    ],
  },
  // bike — دَرَّاجَةٌ — dar-rā-ja-tun
  {
    itemKey: "bike",
    word: "دَرَّاجَةٌ",
    letters: [
      { base: "د", harakat: "َ",        display: "دَ",  name: "دَالٌ",                 isTarget: false },
      { base: "ر", harakat: "َّ",  display: "رَّ", name: "رَاءٌ",                 isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",                isTarget: false },
      { base: "ج", harakat: "َ",        display: "جَ",  name: "جِيمٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // motorcycle — دَرَّاجَةٌ نَارِيَّةٌ — dar-rā-ja-tun nā-riy-ya-tun
  {
    itemKey: "motorcycle",
    word: "دَرَّاجَةٌ نَارِيَّةٌ",
    letters: [
      { base: "د", harakat: "َ",        display: "دَ",  name: "دَالٌ",                 isTarget: false },
      { base: "ر", harakat: "َّ",  display: "رَّ", name: "رَاءٌ",                 isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",                isTarget: false },
      { base: "ج", harakat: "َ",        display: "جَ",  name: "جِيمٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
      { base: "ن", harakat: "َ",        display: "نَ",  name: "نُونٌ",                 isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",                isTarget: false },
      { base: "ر", harakat: "ِ",        display: "رِ",  name: "رَاءٌ",                 isTarget: false },
      { base: "ي", harakat: "َّ",  display: "يَّ", name: "يَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // truck — شَاحِنَةٌ — shā-ḥi-na-tun
  {
    itemKey: "truck",
    word: "شَاحِنَةٌ",
    letters: [
      { base: "ش", harakat: "َ", display: "شَ", name: "شِينٌ",                 isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",                isTarget: false },
      { base: "ح", harakat: "ِ", display: "حِ", name: "حَاءٌ",                 isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // plane — طَائِرَةٌ — ṭā-'i-ra-tun
  {
    itemKey: "plane",
    word: "طَائِرَةٌ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ",                 isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",                isTarget: false },
      { base: "ئ", harakat: "ِ", display: "ئِ", name: "هَمْزَةٌ",              isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // helicopter — مِرْوَحِيَّةٌ — mir-wa-ḥiy-ya-tun
  {
    itemKey: "helicopter",
    word: "مِرْوَحِيَّةٌ",
    letters: [
      { base: "م", harakat: "ِ",        display: "مِ",  name: "مِيمٌ",                 isTarget: false },
      { base: "ر", harakat: "ْ",        display: "رْ",  name: "رَاءٌ",                 isTarget: false },
      { base: "و", harakat: "َ",        display: "وَ",  name: "وَاوٌ",                 isTarget: false },
      { base: "ح", harakat: "ِ",        display: "حِ",  name: "حَاءٌ",                 isTarget: false },
      { base: "ي", harakat: "َّ",  display: "يَّ", name: "يَاءٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ",        display: "ةٌ",  name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // boat — قَارِبٌ — qā-ri-bun
  {
    itemKey: "boat",
    word: "قَارِبٌ",
    letters: [
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ر", harakat: "ِ", display: "رِ", name: "رَاءٌ",  isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ",  isTarget: false },
    ],
  },
  // ship — سَفِينَةٌ — sa-fī-na-tun
  {
    itemKey: "ship",
    word: "سَفِينَةٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ",                 isTarget: false },
      { base: "ف", harakat: "ِ", display: "فِ", name: "فَاءٌ",                 isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",                 isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
];

export const transportLessonContent: VocabularyLessonSection = {
  title: "وَسَائِلُ النَّقْلِ",
  theme: "transport",
  items: ITEMS,
  words: WORDS,
  colors: TRANSPORT_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفْ وَسَائِلَ النَّقْلِ",
      description: "اِضْغَطْ عَلَى كُلِّ وَسِيلَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْوَسِيلَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ وَسَائِلَ النَّقْلِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 10,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْوَسِيلَةَ الْمَطْلُوبَةَ",
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
