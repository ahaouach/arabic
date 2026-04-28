/**
 * Seed content for the `jobs` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/jobs.
 *
 * All names use the **agentive masculine singular** (طَبِيبٌ, مُعَلِّمٌ,
 * …). Feminine forms (طَبِيبَةٌ, مُعَلِّمَةٌ) are a future expansion.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const JOBS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // Service (4)
  { key: "doctor",      nameAr: "طَبِيبٌ",     transliteration: "ṭabīb",      iconKey: "Doctor",      audioText: "طَبِيبٌ",     category: "service",   idleAnimation: "bob" },
  { key: "teacher",     nameAr: "مُعَلِّمٌ",   transliteration: "muʿallim",   iconKey: "Teacher",     audioText: "مُعَلِّمٌ",   category: "service",   idleAnimation: "bounce" },
  { key: "firefighter", nameAr: "إِطْفَائِيٌّ", transliteration: "iṭfā'iyy",   iconKey: "Firefighter", audioText: "إِطْفَائِيٌّ", category: "service",   idleAnimation: "wiggle" },
  { key: "police",      nameAr: "شُرْطِيٌّ",    transliteration: "shurṭiyy",   iconKey: "Police",      audioText: "شُرْطِيٌّ",    category: "service",   idleAnimation: "sway" },

  // Creative (3)
  { key: "chef",   nameAr: "طَبَّاخٌ", transliteration: "ṭabbākh", iconKey: "Chef",   audioText: "طَبَّاخٌ", category: "creative", idleAnimation: "bob" },
  { key: "baker",  nameAr: "خَبَّازٌ", transliteration: "khabbāz", iconKey: "Baker",  audioText: "خَبَّازٌ", category: "creative", idleAnimation: "wiggle" },
  { key: "artist", nameAr: "رَسَّامٌ", transliteration: "rassām",  iconKey: "Artist", audioText: "رَسَّامٌ", category: "creative", idleAnimation: "sway" },

  // Technical (3)
  { key: "farmer",   nameAr: "فَلَّاحٌ",  transliteration: "fallāḥ",  iconKey: "Farmer",   audioText: "فَلَّاحٌ",  category: "technical", idleAnimation: "hop" },
  { key: "engineer", nameAr: "مُهَنْدِسٌ", transliteration: "muhandis", iconKey: "Engineer", audioText: "مُهَنْدِسٌ", category: "technical", idleAnimation: "breathe" },
  { key: "driver",   nameAr: "سَائِقٌ",   transliteration: "sā'iq",    iconKey: "Driver",   audioText: "سَائِقٌ",   category: "technical", idleAnimation: "wiggle" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // doctor — طَبِيبٌ — ṭa-bī-bun
  {
    itemKey: "doctor",
    word: "طَبِيبٌ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ", isTarget: false },
      { base: "ب", harakat: "ِ", display: "بِ", name: "بَاءٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ", isTarget: false },
    ],
  },
  // teacher — مُعَلِّمٌ — mu-ʿal-li-mun
  {
    itemKey: "teacher",
    word: "مُعَلِّمٌ",
    letters: [
      { base: "م", harakat: "ُ",        display: "مُ",  name: "مِيمٌ",  isTarget: false },
      { base: "ع", harakat: "َ",        display: "عَ",  name: "عَيْنٌ", isTarget: false },
      { base: "ل", harakat: "ِّ",  display: "لِّ", name: "لَامٌ",  isTarget: false },
      { base: "م", harakat: "ٌ",        display: "مٌ",  name: "مِيمٌ",  isTarget: false },
    ],
  },
  // firefighter — إِطْفَائِيٌّ — iṭ-fā-'iy-yun
  {
    itemKey: "firefighter",
    word: "إِطْفَائِيٌّ",
    letters: [
      { base: "إ", harakat: "ِ",        display: "إِ",  name: "هَمْزَةٌ", isTarget: false },
      { base: "ط", harakat: "ْ",        display: "طْ",  name: "طَاءٌ",   isTarget: false },
      { base: "ف", harakat: "َ",        display: "فَ",  name: "فَاءٌ",   isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ",  isTarget: false },
      { base: "ئ", harakat: "ِ",        display: "ئِ",  name: "هَمْزَةٌ", isTarget: false },
      { base: "ي", harakat: "ٌّ",  display: "يٌّ", name: "يَاءٌ",   isTarget: false },
    ],
  },
  // police — شُرْطِيٌّ — shur-ṭiy-yun
  {
    itemKey: "police",
    word: "شُرْطِيٌّ",
    letters: [
      { base: "ش", harakat: "ُ",        display: "شُ",  name: "شِينٌ", isTarget: false },
      { base: "ر", harakat: "ْ",        display: "رْ",  name: "رَاءٌ", isTarget: false },
      { base: "ط", harakat: "ِ",        display: "طِ",  name: "طَاءٌ", isTarget: false },
      { base: "ي", harakat: "ٌّ",  display: "يٌّ", name: "يَاءٌ", isTarget: false },
    ],
  },
  // chef — طَبَّاخٌ — ṭab-bā-khun
  {
    itemKey: "chef",
    word: "طَبَّاخٌ",
    letters: [
      { base: "ط", harakat: "َ",        display: "طَ",  name: "طَاءٌ", isTarget: false },
      { base: "ب", harakat: "َّ",  display: "بَّ", name: "بَاءٌ", isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "خ", harakat: "ٌ",        display: "خٌ",  name: "خَاءٌ", isTarget: false },
    ],
  },
  // baker — خَبَّازٌ — khab-bā-zun
  {
    itemKey: "baker",
    word: "خَبَّازٌ",
    letters: [
      { base: "خ", harakat: "َ",        display: "خَ",  name: "خَاءٌ", isTarget: false },
      { base: "ب", harakat: "َّ",  display: "بَّ", name: "بَاءٌ", isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "ز", harakat: "ٌ",        display: "زٌ",  name: "زَايٌ", isTarget: false },
    ],
  },
  // artist — رَسَّامٌ — ras-sā-mun
  {
    itemKey: "artist",
    word: "رَسَّامٌ",
    letters: [
      { base: "ر", harakat: "َ",        display: "رَ",  name: "رَاءٌ", isTarget: false },
      { base: "س", harakat: "َّ",  display: "سَّ", name: "سِينٌ", isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "م", harakat: "ٌ",        display: "مٌ",  name: "مِيمٌ", isTarget: false },
    ],
  },
  // farmer — فَلَّاحٌ — fal-lā-ḥun
  {
    itemKey: "farmer",
    word: "فَلَّاحٌ",
    letters: [
      { base: "ف", harakat: "َ",        display: "فَ",  name: "فَاءٌ", isTarget: false },
      { base: "ل", harakat: "َّ",  display: "لَّ", name: "لَامٌ", isTarget: false },
      { base: "ا", harakat: "",              display: "ا",    name: "أَلِفٌ", isTarget: false },
      { base: "ح", harakat: "ٌ",        display: "حٌ",  name: "حَاءٌ", isTarget: false },
    ],
  },
  // engineer — مُهَنْدِسٌ — mu-han-di-sun
  {
    itemKey: "engineer",
    word: "مُهَنْدِسٌ",
    letters: [
      { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ", isTarget: false },
      { base: "ه", harakat: "َ", display: "هَ", name: "هَاءٌ", isTarget: false },
      { base: "ن", harakat: "ْ", display: "نْ", name: "نُونٌ", isTarget: false },
      { base: "د", harakat: "ِ", display: "دِ", name: "دَالٌ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", name: "سِينٌ", isTarget: false },
    ],
  },
  // driver — سَائِقٌ — sā-'i-qun
  {
    itemKey: "driver",
    word: "سَائِقٌ",
    letters: [
      { base: "س", harakat: "َ", display: "سَ", name: "سِينٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ئ", harakat: "ِ", display: "ئِ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ق", harakat: "ٌ", display: "قٌ", name: "قَافٌ", isTarget: false },
    ],
  },
];

export const jobsLessonContent: VocabularyLessonSection = {
  title: "الْمِهَنُ",
  theme: "jobs",
  items: ITEMS,
  words: WORDS,
  colors: JOBS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْمِهَنَ",
      description: "اِضْغَطْ عَلَى كُلِّ مِهْنَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْمِهْنَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ أَصْحَابَ الْمِهَنِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 10,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنْ صَاحِبَ الْمِهْنَةِ الْمَطْلُوبِ",
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
