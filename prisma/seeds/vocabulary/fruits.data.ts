/**
 * Seed content for the `fruits` vocabulary lesson.
 *
 * Lives at /dashboard/courses/arabic/fruits.
 *
 * Authoring rules (apply to every theme — single source of truth here):
 *   - Every Arabic string is fully vowelised.
 *   - Every word is pre-split into `WordLetter` objects so Zone 5 never
 *     splits combining marks at runtime.
 *   - `iconKey` resolves against `lib/icons/themes/fruits.ts` —
 *     authored in lock-step with this file.
 *   - `isTarget` is always `false` in the seed; the runtime chooser
 *     picks targets per round.
 *
 * Harakat Unicode reminder (combining marks):
 *   fatha   U+064E  ◌َ        sukun   U+0652  ◌ْ
 *   kasra   U+0650  ◌ِ        shadda  U+0651  ◌ّ
 *   damma   U+064F  ◌ُ        tanwin  U+064B fa / U+064C da / U+064D ka
 *
 * When a base letter carries shadda + a tanwin (e.g. أُمٌّ), canonical
 * ordering is shadda *first*, then the tanwin.
 */

import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

/* -------------------------------------------------------------------------- */
/*  Shared 6-colour palette                                                   */
/* -------------------------------------------------------------------------- */

const FRUITS_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

/* -------------------------------------------------------------------------- */
/*  Items — 12 fruits across 3 categories                                     */
/* -------------------------------------------------------------------------- */

const ITEMS: VocabularyLessonSection["items"] = [
  // Tropical (5)
  { key: "banana",     nameAr: "مَوْزٌ",          transliteration: "mawz",       iconKey: "Banana",     audioText: "مَوْزٌ",          category: "tropical",  idleAnimation: "sway" },
  { key: "orange",     nameAr: "بُرْتُقَالٌ",     transliteration: "burtuqāl",   iconKey: "Orange",     audioText: "بُرْتُقَالٌ",     category: "tropical",  idleAnimation: "breathe" },
  { key: "pineapple",  nameAr: "أَنَانَاسٌ",       transliteration: "anānās",     iconKey: "Pineapple",  audioText: "أَنَانَاسٌ",       category: "tropical",  idleAnimation: "wiggle" },
  { key: "mango",      nameAr: "مَانْجُو",         transliteration: "mānjū",      iconKey: "Mango",      audioText: "مَانْجُو",         category: "tropical",  idleAnimation: "hop" },
  { key: "watermelon", nameAr: "بِطِّيخٌ",         transliteration: "biṭṭīkh",    iconKey: "Watermelon", audioText: "بِطِّيخٌ",         category: "tropical",  idleAnimation: "bounce" },

  // Temperate (5)
  { key: "apple",      nameAr: "تُفَّاحٌ",         transliteration: "tuffāḥ",     iconKey: "Apple",      audioText: "تُفَّاحٌ",         category: "temperate", idleAnimation: "bounce" },
  { key: "pear",       nameAr: "كُمَّثْرَى",       transliteration: "kummathrā",  iconKey: "Pear",       audioText: "كُمَّثْرَى",       category: "temperate", idleAnimation: "hop" },
  { key: "lemon",      nameAr: "لَيْمُونٌ",        transliteration: "laymūn",     iconKey: "Lemon",      audioText: "لَيْمُونٌ",        category: "temperate", idleAnimation: "breathe" },
  { key: "peach",      nameAr: "خَوْخٌ",           transliteration: "khawkh",     iconKey: "Peach",      audioText: "خَوْخٌ",           category: "temperate", idleAnimation: "bob" },
  { key: "fig",        nameAr: "تِينٌ",            transliteration: "tīn",        iconKey: "Fig",        audioText: "تِينٌ",            category: "temperate", idleAnimation: "breathe" },

  // Berry (2)
  { key: "strawberry", nameAr: "فَرَاوِلَةٌ",       transliteration: "farāwila",   iconKey: "Strawberry", audioText: "فَرَاوِلَةٌ",       category: "berry",     idleAnimation: "wiggle" },
  { key: "grape",      nameAr: "عِنَبٌ",           transliteration: "ʿinab",      iconKey: "Grape",      audioText: "عِنَبٌ",           category: "berry",     idleAnimation: "bob" },
];

/* -------------------------------------------------------------------------- */
/*  Pre-split words                                                           */
/* -------------------------------------------------------------------------- */

const WORDS: VocabularyLessonSection["words"] = [
  // apple — تُفَّاحٌ — tu-ffā-ḥun
  {
    itemKey: "apple",
    word: "تُفَّاحٌ",
    letters: [
      { base: "ت", harakat: "ُ",         display: "تُ", name: "تَاءٌ",  isTarget: false },
      { base: "ف", harakat: "َّ",   display: "فَّ", name: "فَاءٌ",  isTarget: false },
      { base: "ا", harakat: "",                display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ح", harakat: "ٌ",          display: "حٌ", name: "حَاءٌ",  isTarget: false },
    ],
  },
  // banana — مَوْزٌ — maw-zun
  {
    itemKey: "banana",
    word: "مَوْزٌ",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", name: "وَاوٌ", isTarget: false },
      { base: "ز", harakat: "ٌ", display: "زٌ", name: "زَايٌ", isTarget: false },
    ],
  },
  // orange — بُرْتُقَالٌ — bur-tu-qā-lun
  {
    itemKey: "orange",
    word: "بُرْتُقَالٌ",
    letters: [
      { base: "ب", harakat: "ُ", display: "بُ", name: "بَاءٌ",  isTarget: false },
      { base: "ر", harakat: "ْ", display: "رْ", name: "رَاءٌ",  isTarget: false },
      { base: "ت", harakat: "ُ", display: "تُ", name: "تَاءٌ",  isTarget: false },
      { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ",  isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ",  isTarget: false },
    ],
  },
  // strawberry — فَرَاوِلَةٌ — fa-rā-wi-la-tun
  {
    itemKey: "strawberry",
    word: "فَرَاوِلَةٌ",
    letters: [
      { base: "ف", harakat: "َ", display: "فَ", name: "فَاءٌ",            isTarget: false },
      { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ",            isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",           isTarget: false },
      { base: "و", harakat: "ِ", display: "وِ", name: "وَاوٌ",            isTarget: false },
      { base: "ل", harakat: "َ", display: "لَ", name: "لَامٌ",            isTarget: false },
      { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ", isTarget: false },
    ],
  },
  // grape — عِنَبٌ — ʿi-na-bun
  {
    itemKey: "grape",
    word: "عِنَبٌ",
    letters: [
      { base: "ع", harakat: "ِ", display: "عِ", name: "عَيْنٌ", isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",  isTarget: false },
      { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ",  isTarget: false },
    ],
  },
  // watermelon — بِطِّيخٌ — biṭ-ṭī-khun
  {
    itemKey: "watermelon",
    word: "بِطِّيخٌ",
    letters: [
      { base: "ب", harakat: "ِ",        display: "بِ", name: "بَاءٌ", isTarget: false },
      { base: "ط", harakat: "ِّ",  display: "طِّ", name: "طَاءٌ", isTarget: false },
      { base: "ي", harakat: "",              display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "خ", harakat: "ٌ",        display: "خٌ", name: "خَاءٌ", isTarget: false },
    ],
  },
  // pear — كُمَّثْرَى — kum-math-rā
  {
    itemKey: "pear",
    word: "كُمَّثْرَى",
    letters: [
      { base: "ك", harakat: "ُ",        display: "كُ",  name: "كَافٌ",                  isTarget: false },
      { base: "م", harakat: "َّ",  display: "مَّ", name: "مِيمٌ",                  isTarget: false },
      { base: "ث", harakat: "ْ",        display: "ثْ",  name: "ثَاءٌ",                  isTarget: false },
      { base: "ر", harakat: "َ",        display: "رَ",  name: "رَاءٌ",                  isTarget: false },
      { base: "ى", harakat: "",              display: "ى",    name: "أَلِفٌ مَقْصُورَةٌ",     isTarget: false },
    ],
  },
  // lemon — لَيْمُونٌ — lay-mū-nun
  {
    itemKey: "lemon",
    word: "لَيْمُونٌ",
    letters: [
      { base: "ل", harakat: "َ", display: "لَ", name: "لَامٌ", isTarget: false },
      { base: "ي", harakat: "ْ", display: "يْ", name: "يَاءٌ", isTarget: false },
      { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ", isTarget: false },
    ],
  },
  // peach — خَوْخٌ — khaw-khun
  {
    itemKey: "peach",
    word: "خَوْخٌ",
    letters: [
      { base: "خ", harakat: "َ", display: "خَ", name: "خَاءٌ", isTarget: false },
      { base: "و", harakat: "ْ", display: "وْ", name: "وَاوٌ", isTarget: false },
      { base: "خ", harakat: "ٌ", display: "خٌ", name: "خَاءٌ", isTarget: false },
    ],
  },
  // pineapple — أَنَانَاسٌ — a-nā-nā-sun
  {
    itemKey: "pineapple",
    word: "أَنَانَاسٌ",
    letters: [
      { base: "أ", harakat: "َ", display: "أَ", name: "أَلِفٌ",  isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",   isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",  isTarget: false },
      { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ",   isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ",  isTarget: false },
      { base: "س", harakat: "ٌ", display: "سٌ", name: "سِينٌ",   isTarget: false },
    ],
  },
  // mango — مَانْجُو — mān-jū (loanword, no tanwin)
  {
    itemKey: "mango",
    word: "مَانْجُو",
    letters: [
      { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ", isTarget: false },
      { base: "ا", harakat: "",       display: "ا",   name: "أَلِفٌ", isTarget: false },
      { base: "ن", harakat: "ْ", display: "نْ", name: "نُونٌ", isTarget: false },
      { base: "ج", harakat: "ُ", display: "جُ", name: "جِيمٌ", isTarget: false },
      { base: "و", harakat: "",       display: "و",   name: "وَاوٌ", isTarget: false },
    ],
  },
  // fig — تِينٌ — tī-nun
  {
    itemKey: "fig",
    word: "تِينٌ",
    letters: [
      { base: "ت", harakat: "ِ", display: "تِ", name: "تَاءٌ", isTarget: false },
      { base: "ي", harakat: "",       display: "ي",   name: "يَاءٌ", isTarget: false },
      { base: "ن", harakat: "ٌ", display: "نٌ", name: "نُونٌ", isTarget: false },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const fruitsLessonContent: VocabularyLessonSection = {
  title: "الْفَوَاكِهُ",
  theme: "fruits",
  items: ITEMS,
  words: WORDS,
  colors: FRUITS_COLORS,
  zones: [
    {
      kind: "vocab_discovery",
      title: "اِكْتَشِفِ الْفَوَاكِهَ",
      description: "اِضْغَطْ عَلَى كُلِّ فَاكِهَةٍ لِتَسْمَعَ اسْمَهَا",
    },
    {
      kind: "vocab_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْفَاكِهَةَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "vocab_count",
      title: "عُدَّ الْفَوَاكِهَ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 12,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "vocab_color_item",
      title: "لَوِّنِ الْفَاكِهَةَ الْمَطْلُوبَةَ",
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
