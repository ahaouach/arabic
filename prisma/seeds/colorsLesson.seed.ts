/**
 * Seed content for the `colors_lesson` section used by
 * /dashboard/courses/arabic/colors.
 *
 * Every Arabic string fully vowelized (harakat included).
 *
 * To edit without a code change: open Prisma Studio
 * (`npm run db:studio`) and edit the LessonSection.content JSON. Or
 * update this file and re-run `npm run db:seed`.
 */

import type { ColorsLessonSection } from "@/lib/types/colorsLesson.types";

export const colorsLessonContent: ColorsLessonSection = {
  title: "عَالَمُ الْأَلْوَانِ",
  colors: [
    {
      key: "red",
      nameAr: "أَحْمَرُ",
      transliteration: "aḥmar",
      hex: "#DC2626",
      emoji: "🔴",
      audioText: "أَحْمَرُ",
    },
    {
      key: "blue",
      nameAr: "أَزْرَقُ",
      transliteration: "azraq",
      hex: "#2563EB",
      emoji: "🔵",
      audioText: "أَزْرَقُ",
    },
    {
      key: "green",
      nameAr: "أَخْضَرُ",
      transliteration: "akhḍar",
      hex: "#16A34A",
      emoji: "🟢",
      audioText: "أَخْضَرُ",
    },
    {
      key: "yellow",
      nameAr: "أَصْفَرُ",
      transliteration: "aṣfar",
      hex: "#EAB308",
      emoji: "🟡",
      audioText: "أَصْفَرُ",
    },
    {
      key: "orange",
      nameAr: "بُرْتُقَالِيٌّ",
      transliteration: "burtuqālī",
      hex: "#F97316",
      emoji: "🟠",
      audioText: "بُرْتُقَالِيٌّ",
    },
    {
      key: "purple",
      nameAr: "بَنَفْسَجِيٌّ",
      transliteration: "banafsajī",
      hex: "#9333EA",
      emoji: "🟣",
      audioText: "بَنَفْسَجِيٌّ",
    },
    {
      key: "pink",
      nameAr: "وَرْدِيٌّ",
      transliteration: "wardī",
      hex: "#EC4899",
      emoji: "🌸",
      audioText: "وَرْدِيٌّ",
    },
    {
      key: "brown",
      nameAr: "بُنِّيٌّ",
      transliteration: "bunnī",
      hex: "#92400E",
      emoji: "🟤",
      audioText: "بُنِّيٌّ",
    },
    {
      key: "black",
      nameAr: "أَسْوَدُ",
      transliteration: "aswad",
      hex: "#111827",
      emoji: "⚫",
      audioText: "أَسْوَدُ",
    },
    {
      key: "white",
      nameAr: "أَبْيَضُ",
      transliteration: "abyaḍ",
      hex: "#F8FAFC",
      emoji: "⚪",
      audioText: "أَبْيَضُ",
    },
  ],
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  letters: [
    { char: "س", nameAr: "سِينٌ", transliteration: "sīn", audioText: "سِينٌ" },
    { char: "ص", nameAr: "صَادٌ", transliteration: "ṣād", audioText: "صَادٌ" },
    { char: "و", nameAr: "وَاوٌ", transliteration: "wāw", audioText: "وَاوٌ" },
    { char: "م", nameAr: "مِيمٌ", transliteration: "mīm", audioText: "مِيمٌ" },
    { char: "ب", nameAr: "بَاءٌ", transliteration: "bāʾ", audioText: "بَاءٌ" },
    { char: "ت", nameAr: "تَاءٌ", transliteration: "tāʾ", audioText: "تَاءٌ" },
    { char: "ن", nameAr: "نُونٌ", transliteration: "nūn", audioText: "نُونٌ" },
    { char: "ل", nameAr: "لَامٌ", transliteration: "lām", audioText: "لَامٌ" },
    { char: "ر", nameAr: "رَاءٌ", transliteration: "rāʾ", audioText: "رَاءٌ" },
    { char: "ك", nameAr: "كَافٌ", transliteration: "kāf", audioText: "كَافٌ" },
  ],
  zones: [
    {
      kind: "discovery",
      title: "عَالَمُ الْأَلْوَانِ",
      description: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ لَوْنٍ لِتَسْمَعَ اسْمَهُ!",
    },
    {
      kind: "listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ اللَّوْنَ",
      description: "اِسْمَعِ اللَّوْنَ ثُمَّ اخْتَرْهُ مِنْ بَيْنِ الْبِطَاقَاتِ",
      rounds: 5,
      optionsPerRound: 3,
    },
    {
      kind: "color_digits",
      title: "لَوِّنِ الْأَرْقَامَ",
      description: "لَوِّنْ كُلَّ رَقْمٍ بِاللَّوْنِ الْمَطْلُوبِ",
      minDigits: 3,
      maxDigits: 5,
    },
    {
      kind: "color_letters",
      title: "لَوِّنِ الْحُرُوفَ",
      description: "لَوِّنْ كُلَّ حَرْفٍ بِاللَّوْنِ الْمَطْلُوبِ",
      minLetters: 3,
      maxLetters: 5,
    },
    {
      kind: "pick_objects",
      title: "اِخْتَرِ الْأَشْيَاءَ حَسَبَ اللَّوْنِ",
      description: "اِخْتَرْ كُلَّ الْأَشْيَاءِ بِاللَّوْنِ الْمَطْلُوبِ",
      rounds: 5,
      gridCols: 4,
      gridRows: 4,
      targetCountMin: 3,
      targetCountMax: 6,
      shapePool: [
        "circle",
        "square",
        "triangle",
        "heart",
        "star",
        "flower",
        "apple",
        "balloon",
        "car",
        "ball",
      ],
    },
  ],
};
