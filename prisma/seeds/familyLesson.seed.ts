/**
 * Seed content for the `family_lesson` section used by
 * /dashboard/courses/arabic/family.
 *
 * Every Arabic string is fully vowelised. Every word is pre-split into
 * `WordLetter` objects so Zone 6 never has to split harakat at runtime.
 * Each letter entry authors `display` = base + harakat in the exact
 * order it appears inside the full word — we never re-concatenate at
 * render time.
 *
 * Editing tips:
 *   - live:  `npm run db:studio` → LessonSection.content JSON.
 *   - code:  edit this file, then `npm run db:seed` (idempotent).
 *
 * Adding a new family member:
 *   1. Add a new SVG component to `lib/svg/family/` (must export
 *      `FamilyMemberSvgProps` and honour `fillColor` + `outlined`).
 *   2. Register the component in `lib/svg/family/index.ts`.
 *   3. Append a `FamilyMember` entry below with the matching
 *      PascalCase `svgComponent` key.
 *   4. Append a pre-split `FamilyWord` entry with the word's letters.
 */

import type { FamilyLessonSection } from "@/lib/types/familyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";

/* -------------------------------------------------------------------------- */
/*  Colour palette — 6-colour child-friendly subset of the colors lesson     */
/* -------------------------------------------------------------------------- */

const FAMILY_COLORS: ArabicColor[] = [
  { key: "red", nameAr: "أَحْمَرُ", transliteration: "aḥmar", hex: "#DC2626", emoji: "🔴", audioText: "أَحْمَرُ" },
  { key: "blue", nameAr: "أَزْرَقُ", transliteration: "azraq", hex: "#2563EB", emoji: "🔵", audioText: "أَزْرَقُ" },
  { key: "green", nameAr: "أَخْضَرُ", transliteration: "akhḍar", hex: "#16A34A", emoji: "🟢", audioText: "أَخْضَرُ" },
  { key: "yellow", nameAr: "أَصْفَرُ", transliteration: "aṣfar", hex: "#EAB308", emoji: "🟡", audioText: "أَصْفَرُ" },
  { key: "orange", nameAr: "بُرْتُقَالِيٌّ", transliteration: "burtuqālī", hex: "#F97316", emoji: "🟠", audioText: "بُرْتُقَالِيٌّ" },
  { key: "purple", nameAr: "بَنَفْسَجِيٌّ", transliteration: "banafsajī", hex: "#9333EA", emoji: "🟣", audioText: "بَنَفْسَجِيٌّ" },
];

/* -------------------------------------------------------------------------- */
/*  Family members — 11 characters across 5 categories                        */
/* -------------------------------------------------------------------------- */

const MEMBERS: FamilyLessonSection["members"] = [
  {
    key: "father",
    nameAr: "أَبٌ",
    transliteration: "ab",
    svgComponent: "FatherSvg",
    audioText: "أَبٌ",
    category: "parent",
  },
  {
    key: "mother",
    nameAr: "أُمٌّ",
    transliteration: "umm",
    svgComponent: "MotherSvg",
    audioText: "أُمٌّ",
    category: "parent",
  },
  {
    key: "brother",
    nameAr: "أَخٌ",
    transliteration: "akh",
    svgComponent: "BrotherSvg",
    audioText: "أَخٌ",
    category: "sibling",
  },
  {
    key: "sister",
    nameAr: "أُخْتٌ",
    transliteration: "ukht",
    svgComponent: "SisterSvg",
    audioText: "أُخْتٌ",
    category: "sibling",
  },
  {
    key: "grandfather",
    nameAr: "جَدٌّ",
    transliteration: "jadd",
    svgComponent: "GrandfatherSvg",
    audioText: "جَدٌّ",
    category: "grandparent",
  },
  {
    key: "grandmother",
    nameAr: "جَدَّةٌ",
    transliteration: "jadda",
    svgComponent: "GrandmotherSvg",
    audioText: "جَدَّةٌ",
    category: "grandparent",
  },
  {
    key: "uncle_paternal",
    nameAr: "عَمٌّ",
    transliteration: "ʿamm",
    svgComponent: "UnclePaternalSvg",
    audioText: "عَمٌّ",
    category: "uncle_aunt",
  },
  {
    key: "aunt_paternal",
    nameAr: "عَمَّةٌ",
    transliteration: "ʿamma",
    svgComponent: "AuntPaternalSvg",
    audioText: "عَمَّةٌ",
    category: "uncle_aunt",
  },
  {
    key: "uncle_maternal",
    nameAr: "خَالٌ",
    transliteration: "khāl",
    svgComponent: "UncleMaternalSvg",
    audioText: "خَالٌ",
    category: "uncle_aunt",
  },
  {
    key: "aunt_maternal",
    nameAr: "خَالَةٌ",
    transliteration: "khāla",
    svgComponent: "AuntMaternalSvg",
    audioText: "خَالَةٌ",
    category: "uncle_aunt",
  },
  {
    key: "baby",
    nameAr: "طِفْلٌ",
    transliteration: "ṭifl",
    svgComponent: "BabySvg",
    audioText: "طِفْلٌ",
    category: "child",
  },
];

/* -------------------------------------------------------------------------- */
/*  Pre-split words                                                           */
/*                                                                            */
/*  Harakat Unicode reminder (combining marks):                               */
/*    fatha   U+064E  ◌َ                                                      */
/*    kasra   U+0650  ◌ِ                                                      */
/*    damma   U+064F  ◌ُ                                                      */
/*    sukun   U+0652  ◌ْ                                                      */
/*    shadda  U+0651  ◌ّ                                                      */
/*    tanwin  U+064B / U+064C / U+064D  (fathatan / dammatan / kasratan)     */
/*                                                                            */
/*  When a base letter carries shadda + a tanwin (e.g. أُمٌّ), canonical     */
/*  ordering is shadda *first*, then the tanwin.                             */
/* -------------------------------------------------------------------------- */

const WORDS: FamilyLessonSection["words"] = [
  {
    memberKey: "father",
    word: "أَبٌ",
    letters: [
      { base: "أ", harakat: "\u064E", display: "أَ", name: "أَلِفٌ", isTarget: false },
      { base: "ب", harakat: "\u064C", display: "بٌ", name: "بَاءٌ", isTarget: false },
    ],
  },
  {
    memberKey: "mother",
    word: "أُمٌّ",
    letters: [
      { base: "أ", harakat: "\u064F", display: "أُ", name: "أَلِفٌ", isTarget: false },
      { base: "م", harakat: "\u0651\u064C", display: "مٌّ", name: "مِيمٌ", isTarget: false },
    ],
  },
  {
    memberKey: "brother",
    word: "أَخٌ",
    letters: [
      { base: "أ", harakat: "\u064E", display: "أَ", name: "أَلِفٌ", isTarget: false },
      { base: "خ", harakat: "\u064C", display: "خٌ", name: "خَاءٌ", isTarget: false },
    ],
  },
  {
    memberKey: "sister",
    word: "أُخْتٌ",
    letters: [
      { base: "أ", harakat: "\u064F", display: "أُ", name: "أَلِفٌ", isTarget: false },
      { base: "خ", harakat: "\u0652", display: "خْ", name: "خَاءٌ", isTarget: false },
      { base: "ت", harakat: "\u064C", display: "تٌ", name: "تَاءٌ", isTarget: false },
    ],
  },
  {
    memberKey: "grandfather",
    word: "جَدٌّ",
    letters: [
      { base: "ج", harakat: "\u064E", display: "جَ", name: "جِيمٌ", isTarget: false },
      { base: "د", harakat: "\u0651\u064C", display: "دٌّ", name: "دَالٌ", isTarget: false },
    ],
  },
  {
    memberKey: "grandmother",
    word: "جَدَّةٌ",
    letters: [
      { base: "ج", harakat: "\u064E", display: "جَ", name: "جِيمٌ", isTarget: false },
      { base: "د", harakat: "\u0651\u064E", display: "دَّ", name: "دَالٌ", isTarget: false },
      { base: "ة", harakat: "\u064C", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ", isTarget: false },
    ],
  },
  {
    memberKey: "uncle_paternal",
    word: "عَمٌّ",
    letters: [
      { base: "ع", harakat: "\u064E", display: "عَ", name: "عَيْنٌ", isTarget: false },
      { base: "م", harakat: "\u0651\u064C", display: "مٌّ", name: "مِيمٌ", isTarget: false },
    ],
  },
  {
    memberKey: "aunt_paternal",
    word: "عَمَّةٌ",
    letters: [
      { base: "ع", harakat: "\u064E", display: "عَ", name: "عَيْنٌ", isTarget: false },
      { base: "م", harakat: "\u0651\u064E", display: "مَّ", name: "مِيمٌ", isTarget: false },
      { base: "ة", harakat: "\u064C", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ", isTarget: false },
    ],
  },
  {
    memberKey: "uncle_maternal",
    word: "خَالٌ",
    letters: [
      { base: "خ", harakat: "\u064E", display: "خَ", name: "خَاءٌ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "\u064C", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
  {
    memberKey: "aunt_maternal",
    word: "خَالَةٌ",
    letters: [
      { base: "خ", harakat: "\u064E", display: "خَ", name: "خَاءٌ", isTarget: false },
      { base: "ا", harakat: "", display: "ا", name: "أَلِفٌ", isTarget: false },
      { base: "ل", harakat: "\u064E", display: "لَ", name: "لَامٌ", isTarget: false },
      { base: "ة", harakat: "\u064C", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ", isTarget: false },
    ],
  },
  {
    memberKey: "baby",
    word: "طِفْلٌ",
    letters: [
      { base: "ط", harakat: "\u0650", display: "طِ", name: "طَاءٌ", isTarget: false },
      { base: "ف", harakat: "\u0652", display: "فْ", name: "فَاءٌ", isTarget: false },
      { base: "ل", harakat: "\u064C", display: "لٌ", name: "لَامٌ", isTarget: false },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Top-level content                                                         */
/* -------------------------------------------------------------------------- */

export const familyLessonContent: FamilyLessonSection = {
  title: "الْعَائِلَةُ",
  members: MEMBERS,
  words: WORDS,
  colors: FAMILY_COLORS,
  zones: [
    {
      kind: "family_discovery",
      title: "أَفْرَادُ الْعَائِلَةِ",
      description: "اِضْغَطْ عَلَى كُلِّ فَرْدٍ لِتَسْمَعَ اسْمَهُ",
    },
    {
      kind: "family_listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الْفَرْدَ",
      rounds: 5,
      optionsPerRound: 3,
      preferSameCategoryDistractors: true,
    },
    {
      kind: "family_matching",
      title: "طَابِقِ الْكَلِمَةَ بِالصُّورَةِ",
      rounds: 3,
      pairsPerRound: 4,
      allowDragAndDrop: false,
    },
    {
      kind: "family_count",
      title: "عُدَّ أَفْرَادَ الْعَائِلَةِ",
      rounds: 4,
      minTotalCharacters: 8,
      maxTotalCharacters: 12,
      minTargetCount: 2,
      maxTargetCount: 5,
    },
    {
      kind: "family_color_member",
      title: "لَوِّنِ الْفَرْدَ الْمَطْلُوبَ",
      minInstructions: 3,
      maxInstructions: 5,
    },
    {
      kind: "family_color_letters",
      title: "لَوِّنْ حُرُوفَ الْكَلِمَةِ",
      rounds: 3,
      minLettersToColor: 1,
      maxLettersToColor: 2,
    },
  ],
};
