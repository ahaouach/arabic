/**
 * Seed content for the `emotions` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/emotions.
 *
 * All emotions use the **active masculine adjective form** (سَعِيدٌ,
 * حَزِينٌ, …) — the kid-friendly conventional starting form. Feminine
 * variants (سَعِيدَةٌ, …) can be added in a future expansion under
 * separate keys.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const EMOTIONS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Positive (3)
  { key: "happy",     nameAr: "سَعِيدٌ",      transliteration: "saʿīd",     iconKey: "Happy",     audioText: "سَعِيدٌ",      category: "positive", idleAnimation: "bounce" },
  { key: "excited",   nameAr: "مُتَحَمِّسٌ",   transliteration: "mutaḥammis", iconKey: "Excited",   audioText: "مُتَحَمِّسٌ",   category: "positive", idleAnimation: "hop" },
  { key: "calm",      nameAr: "هَادِئٌ",      transliteration: "hādi'",     iconKey: "Calm",      audioText: "هَادِئٌ",      category: "positive", idleAnimation: "breathe" },

  // Negative (4)
  { key: "sad",       nameAr: "حَزِينٌ",      transliteration: "ḥazīn",     iconKey: "Sad",       audioText: "حَزِينٌ",      category: "negative", idleAnimation: "bob" },
  { key: "angry",     nameAr: "غَاضِبٌ",      transliteration: "ghāḍib",    iconKey: "Angry",     audioText: "غَاضِبٌ",      category: "negative", idleAnimation: "wiggle" },
  { key: "scared",    nameAr: "خَائِفٌ",      transliteration: "khā'if",    iconKey: "Scared",    audioText: "خَائِفٌ",      category: "negative", idleAnimation: "wiggle" },
  { key: "tired",     nameAr: "مُتْعَبٌ",      transliteration: "mutʿab",    iconKey: "Tired",     audioText: "مُتْعَبٌ",      category: "negative", idleAnimation: "bob" },

  // Neutral (1)
  { key: "surprised", nameAr: "مُتَفَاجِئٌ",   transliteration: "mutafāji'", iconKey: "Surprised", audioText: "مُتَفَاجِئٌ",   category: "neutral",  idleAnimation: "bounce" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // happy — سَعِيدٌ — sa-ʿī-dun
  {
    itemKey: "happy",
    word: "سَعِيدٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ",  isTarget: false },
      { base: "ع", harakat: "ِ", display: "عِ", name: "عَيْنٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",  isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", name: "دَالٌ",  isTarget: false },
    ],
  },
  // excited — مُتَحَمِّسٌ — mu-ta-ḥam-mi-sun
  {
    itemKey: "excited",
    word: "مُتَحَمِّسٌ",
    letters: [
      { base: "م", harakat: "ُ",        display: "مُ",  name: "مِيمٌ", isTarget: false },
      { base: "ت", harakat: "َ",        display: "تَ",  name: "تَاءٌ", isTarget: false },
      { base: "ح", harakat: "َ",        display: "حَ",  name: "حَاءٌ", isTarget: false },
      { base: "م", harakat: "ِّ",  display: "مِّ", name: "مِيمٌ", isTarget: false },
      { base: "س", harakat: "ٌ",        display: "سٌ",  name: "سِينٌ", isTarget: false },
    ],
  },
  // calm — هَادِئٌ — hā-di-'un
  {
    itemKey: "calm",
    word: "هَادِئٌ",
    letters: [
      { base: "ه", harakat: "َ", display: "هَ", name: "هَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "د", harakat: "ِ", display: "دِ", name: "دَالٌ",  isTarget: false },
      { base: "ئ", harakat: "ٌ", display: "ئٌ", name: "هَمْزَةٌ", isTarget: false },
    ],
  },
  // sad — حَزِينٌ — ḥa-zī-nun
  {
    itemKey: "sad",
    word: "حَزِينٌ",
    letters: [
      { base: "ح", harakat: "َ", display: "حَ", name: "حَاءٌ", isTarget: false },
      { base: "ز", harakat: "ِ", display: "زِ", name: "زَايٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ", isTarget: false },
    ],
  },
  // angry — غَاضِبٌ — ghā-ḍi-bun
  {
    itemKey: "angry",
    word: "غَاضِبٌ",
    letters: [
      { base: "غ", harakat: "َ", display: "غَ", name: "غَيْنٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ض", harakat: "ِ", display: "ضِ", name: "ضَادٌ",  isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ",  isTarget: false },
    ],
  },
  // scared — خَائِفٌ — khā-'i-fun
  {
    itemKey: "scared",
    word: "خَائِفٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", name: "خَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ئ", harakat: "ِ", display: "ئِ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ف", harakat: "ٌ", display: "فٌ", name: "فَاءٌ",  isTarget: false },
    ],
  },
  // tired — مُتْعَبٌ — mut-ʿa-bun
  {
    itemKey: "tired",
    word: "مُتْعَبٌ",
    letters: [
      { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ",  isTarget: false },
      { base: "ت", harakat: "ْ", display: "تْ", name: "تَاءٌ",  isTarget: false },
      { base: "ع", harakat: "َ", display: "عَ", name: "عَيْنٌ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ",  isTarget: false },
    ],
  },
  // surprised — مُتَفَاجِئٌ — mu-ta-fā-ji-'un
  {
    itemKey: "surprised",
    word: "مُتَفَاجِئٌ",
    letters: [
      { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ",  isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", name: "تَاءٌ",  isTarget: false },
      { base: "ف", harakat: "َ", display: "فَ", name: "فَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ج", harakat: "ِ", display: "جِ", name: "جِيمٌ",  isTarget: false },
      { base: "ئ", harakat: "ٌ", display: "ئٌ", name: "هَمْزَةٌ", isTarget: false },
    ],
  },
];

export const emotionsLessonContent: VocabularyLessonSection = {
  title: "الْمَشَاعِرُ",
  theme: "emotions",
  items: ITEMS,
  words: WORDS,
  colors: EMOTIONS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْمَشَاعِرَ",
      description: "اِضْغَطْ عَلَى كُلِّ شُعُورٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الشُّعُورَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْمَشَاعِرَ",
      rounds: 4,
      minTotalCharacters: 6,
      maxTotalCharacters: 8,
      minTargetCount: 2,
      maxTargetCount: 4,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الشُّعُورَ الْمَطْلُوبَ",
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
