/**
 * Seed content for the `instruments` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/instruments.
 *
 * The Arabic oud (`عُودٌ`) is the cultural anchor of this theme — it's
 * the only instrument that's purpose-drawn in `lib/icons/themes/
 * instruments.tsx` even though most other instruments also lack
 * library glyphs. Standard Arabic spellings used throughout; loanwords
 * (جِيتَارٌ, بِيَانُو, إِكْسِيلُوفُونٌ) follow conventional Arabic-textbook
 * vowelization.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

const INSTRUMENTS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

const ITEMS: VocabularyLessonSection["items"] = [
  // String (3)
  { key: "oud",    nameAr: "عُودٌ",   transliteration: "ʿūd",    iconKey: "Oud",    audioText: "عُودٌ",   category: "string",     idleAnimation: "sway" },
  { key: "guitar", nameAr: "جِيتَارٌ", transliteration: "jītār",  iconKey: "Guitar", audioText: "جِيتَارٌ", category: "string",     idleAnimation: "sway" },
  { key: "violin", nameAr: "كَمَانٌ",  transliteration: "kamān",  iconKey: "Violin", audioText: "كَمَانٌ",  category: "string",     idleAnimation: "sway" },

  // Wind (2)
  { key: "flute",   nameAr: "نَايٌ", transliteration: "nāy",  iconKey: "Flute",   audioText: "نَايٌ", category: "wind",        idleAnimation: "sway" },
  { key: "trumpet", nameAr: "بُوقٌ", transliteration: "būq",  iconKey: "Trumpet", audioText: "بُوقٌ", category: "wind",        idleAnimation: "bounce" },

  // Keyboard (1)
  { key: "piano", nameAr: "بِيَانُو", transliteration: "biyānū", iconKey: "Piano", audioText: "بِيَانُو", category: "keyboard",   idleAnimation: "bob" },

  // Percussion (3)
  { key: "drum",       nameAr: "طَبْلَةٌ",       transliteration: "ṭabla",     iconKey: "Drum",       audioText: "طَبْلَةٌ",       category: "percussion", idleAnimation: "bounce" },
  { key: "tambourine", nameAr: "دُفٌّ",          transliteration: "duff",      iconKey: "Tambourine", audioText: "دُفٌّ",          category: "percussion", idleAnimation: "wiggle" },
  { key: "xylophone",  nameAr: "إِكْسِيلُوفُونٌ", transliteration: "iksīlūfūn", iconKey: "Xylophone",  audioText: "إِكْسِيلُوفُونٌ", category: "percussion", idleAnimation: "bounce" },

  // Other (1)
  { key: "bell", nameAr: "جَرَسٌ", transliteration: "jaras", iconKey: "Bell", audioText: "جَرَسٌ", category: "other", idleAnimation: "wiggle" },
];

const WORDS: VocabularyLessonSection["words"] = [
  // oud — عُودٌ — ʿū-dun
  {
    itemKey: "oud",
    word: "عُودٌ",
    letters: [
      { base: "ع", harakat: "ُ", display: "عُ", name: "عَيْنٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ",  isTarget: false },
      { base: "د", harakat: "ٌ", display: "دٌ", name: "دَالٌ",  isTarget: false },
    ],
  },
  // guitar — جِيتَارٌ — jī-tā-run (loanword)
  {
    itemKey: "guitar",
    word: "جِيتَارٌ",
    letters: [
      { base: "ج", harakat: "ِ", display: "جِ", name: "جِيمٌ",  isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",  isTarget: false },
      { base: "ت", harakat: "َ", display: "تَ", name: "تَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ر", harakat: "ٌ", display: "رٌ", name: "رَاءٌ",  isTarget: false },
    ],
  },
  // violin — كَمَانٌ — ka-mā-nun
  {
    itemKey: "violin",
    word: "كَمَانٌ",
    letters: [
      { base: "ك", harakat: "َ", display: "كَ", name: "كَافٌ",  isTarget: false },
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",  isTarget: false },
    ],
  },
  // flute — نَايٌ — nā-yun
  {
    itemKey: "flute",
    word: "نَايٌ",
    letters: [
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ي", harakat: "ٌ", display: "يٌ", name: "يَاءٌ",  isTarget: false },
    ],
  },
  // trumpet — بُوقٌ — bū-qun
  {
    itemKey: "trumpet",
    word: "بُوقٌ",
    letters: [
      { base: "ب", harakat: "ُ", display: "بُ", name: "بَاءٌ",  isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ",  isTarget: false },
      { base: "ق", harakat: "ٌ", display: "قٌ", name: "قَافٌ",  isTarget: false },
    ],
  },
  // piano — بِيَانُو — bi-yā-nū (loanword, no tanwin)
  {
    itemKey: "piano",
    word: "بِيَانُو",
    letters: [
      { base: "ب", harakat: "ِ", display: "بِ", name: "بَاءٌ", isTarget: false },
      { base: "ي", harakat: "َ", display: "يَ", name: "يَاءٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ُ", display: "نُ", name: "نُونٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ", isTarget: false },
    ],
  },
  // drum — طَبْلَةٌ — ṭab-la-tun
  {
    itemKey: "drum",
    word: "طَبْلَةٌ",
    letters: [
      { base: "ط", harakat: "َ", display: "طَ", name: "طَاءٌ",                 isTarget: false },
      { base: "ب", harakat: "ْ", display: "بْ", name: "بَاءٌ",                 isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", name: "لَامٌ",                 isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ",     isTarget: false },
    ],
  },
  // tambourine — دُفٌّ — duff-un (final shadda + dammatan)
  {
    itemKey: "tambourine",
    word: "دُفٌّ",
    letters: [
      { base: "د", harakat: "ُ",        display: "دُ",  name: "دَالٌ", isTarget: false },
      { base: "ف", harakat: "ٌّ",  display: "فٌّ", name: "فَاءٌ", isTarget: false },
    ],
  },
  // bell — جَرَسٌ — ja-ra-sun
  {
    itemKey: "bell",
    word: "جَرَسٌ",
    letters: [
      { base: "ج", harakat: "َ", display: "جَ", name: "جِيمٌ", isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ", isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", name: "سِينٌ", isTarget: false },
    ],
  },
  // xylophone — إِكْسِيلُوفُونٌ — ik-sī-lū-fūn-un (loanword)
  {
    itemKey: "xylophone",
    word: "إِكْسِيلُوفُونٌ",
    letters: [
      { base: "إ", harakat: "ِ", display: "إِ", name: "هَمْزَةٌ", isTarget: false },
      { base: "ك", harakat: "ْ", display: "كْ", name: "كَافٌ",   isTarget: false },
      { base: "س", harakat: "ِ", display: "سِ", name: "سِينٌ",   isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ",   isTarget: false },
      { base: "ل", harakat: "ُ", display: "لُ", name: "لَامٌ",   isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ",   isTarget: false },
      { base: "ف", harakat: "ُ", display: "فُ", name: "فَاءٌ",   isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ",   isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ",   isTarget: false },
    ],
  },
];

export const instrumentsLessonContent: VocabularyLessonSection = {
  title: "الْآلَاتُ الْمُوسِيقِيَّةُ",
  theme: "instruments",
  items: ITEMS,
  words: WORDS,
  colors: INSTRUMENTS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْآلَاتِ الْمُوسِيقِيَّةَ",
      description: "اِضْغَطْ عَلَى كُلِّ آلَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْآلَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْآلَاتِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 10,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْآلَةَ الْمَطْلُوبَةَ",
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
