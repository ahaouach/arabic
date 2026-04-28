/**
 * Seed content for the `shapes_lesson` section used by
 * /dashboard/courses/arabic/shapes.
 *
 * Every Arabic string fully vowelized (harakat included). Letters of
 * each shape's word are pre-split into base + harakat + combined
 * display string so the client never has to split a vowelized word at
 * runtime (combining marks make that brittle).
 *
 * To edit without a code change: open Prisma Studio
 * (`npm run db:studio`) and edit the LessonSection.content JSON. Or
 * update this file and re-run `npm run db:seed`.
 */

import type { ShapesLessonSection } from "@/lib/types/shapesLesson.types";

export const shapesLessonContent: ShapesLessonSection = {
  title: "عَالَمُ الْأَشْكَالِ",
  shapes: [
    {
      key: "circle",
      nameAr: "دَائِرَةٌ",
      transliteration: "dāʾira",
      svgPath:
        "M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0",
      viewBox: "0 0 100 100",
      emoji: "⚪",
      audioText: "دَائِرَةٌ",
    },
    {
      key: "square",
      nameAr: "مُرَبَّعٌ",
      transliteration: "murabbaʿ",
      svgPath: "M10,10 L90,10 L90,90 L10,90 Z",
      viewBox: "0 0 100 100",
      emoji: "⬜",
      audioText: "مُرَبَّعٌ",
    },
    {
      key: "triangle",
      nameAr: "مُثَلَّثٌ",
      transliteration: "muthallath",
      svgPath: "M50,10 L90,90 L10,90 Z",
      viewBox: "0 0 100 100",
      emoji: "🔺",
      audioText: "مُثَلَّثٌ",
    },
    {
      key: "rectangle",
      nameAr: "مُسْتَطِيلٌ",
      transliteration: "mustaṭīl",
      svgPath: "M10,25 L90,25 L90,75 L10,75 Z",
      viewBox: "0 0 100 100",
      emoji: "🟧",
      audioText: "مُسْتَطِيلٌ",
    },
    {
      key: "star",
      nameAr: "نَجْمَةٌ",
      transliteration: "najma",
      svgPath:
        "M50,5 L61,39 L97,39 L68,59 L79,92 L50,73 L21,92 L32,59 L3,39 L39,39 Z",
      viewBox: "0 0 100 100",
      emoji: "⭐",
      audioText: "نَجْمَةٌ",
    },
    {
      key: "heart",
      nameAr: "قَلْبٌ",
      transliteration: "qalb",
      svgPath:
        "M50,85 C50,85 10,60 10,35 A20,20 0 0,1 50,35 A20,20 0 0,1 90,35 C90,60 50,85 50,85 Z",
      viewBox: "0 0 100 100",
      emoji: "❤️",
      audioText: "قَلْبٌ",
    },
  ],
  shapeWords: [
    {
      shapeKey: "circle",
      word: "دَائِرَةٌ",
      letters: [
        { base: "د", harakat: "َ", display: "دَ", name: "دَالٌ" },
        { base: "ا", harakat: "", display: "ا", name: "أَلِفٌ" },
        { base: "ئ", harakat: "ِ", display: "ئِ", name: "يَاءٌ مَهْمُوزَةٌ" },
        { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ" },
        { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ" },
      ],
    },
    {
      shapeKey: "square",
      word: "مُرَبَّعٌ",
      letters: [
        { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ" },
        { base: "ر", harakat: "َ", display: "رَ", name: "رَاءٌ" },
        { base: "ب", harakat: "َّ", display: "بَّ", name: "بَاءٌ مُشَدَّدَةٌ" },
        { base: "ع", harakat: "ٌ", display: "عٌ", name: "عَيْنٌ" },
      ],
    },
    {
      shapeKey: "triangle",
      word: "مُثَلَّثٌ",
      letters: [
        { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ" },
        { base: "ث", harakat: "َ", display: "ثَ", name: "ثَاءٌ" },
        { base: "ل", harakat: "َّ", display: "لَّ", name: "لَامٌ مُشَدَّدَةٌ" },
        { base: "ث", harakat: "ٌ", display: "ثٌ", name: "ثَاءٌ" },
      ],
    },
    {
      shapeKey: "rectangle",
      word: "مُسْتَطِيلٌ",
      letters: [
        { base: "م", harakat: "ُ", display: "مُ", name: "مِيمٌ" },
        { base: "س", harakat: "ْ", display: "سْ", name: "سِينٌ" },
        { base: "ت", harakat: "َ", display: "تَ", name: "تَاءٌ" },
        { base: "ط", harakat: "ِ", display: "طِ", name: "طَاءٌ" },
        { base: "ي", harakat: "", display: "ي", name: "يَاءٌ" },
        { base: "ل", harakat: "ٌ", display: "لٌ", name: "لَامٌ" },
      ],
    },
    {
      shapeKey: "star",
      word: "نَجْمَةٌ",
      letters: [
        { base: "ن", harakat: "َ", display: "نَ", name: "نُونٌ" },
        { base: "ج", harakat: "ْ", display: "جْ", name: "جِيمٌ" },
        { base: "م", harakat: "َ", display: "مَ", name: "مِيمٌ" },
        { base: "ة", harakat: "ٌ", display: "ةٌ", name: "تَاءٌ مَرْبُوطَةٌ" },
      ],
    },
    {
      shapeKey: "heart",
      word: "قَلْبٌ",
      letters: [
        { base: "ق", harakat: "َ", display: "قَ", name: "قَافٌ" },
        { base: "ل", harakat: "ْ", display: "لْ", name: "لَامٌ" },
        { base: "ب", harakat: "ٌ", display: "بٌ", name: "بَاءٌ" },
      ],
    },
  ],
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
      key: "purple",
      nameAr: "بَنَفْسَجِيٌّ",
      transliteration: "banafsajī",
      hex: "#9333EA",
      emoji: "🟣",
      audioText: "بَنَفْسَجِيٌّ",
    },
    {
      key: "orange",
      nameAr: "بُرْتُقَالِيٌّ",
      transliteration: "burtuqālī",
      hex: "#F97316",
      emoji: "🟠",
      audioText: "بُرْتُقَالِيٌّ",
    },
  ],
  zones: [
    {
      kind: "discovery",
      title: "عَالَمُ الْأَشْكَالِ",
      description: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ شَكْلٍ لِتَسْمَعَ اسْمَهُ!",
    },
    {
      kind: "listen_pick",
      title: "اِسْتَمِعْ وَاخْتَرِ الشَّكْلَ",
      description: "اِسْمَعِ الشَّكْلَ ثُمَّ اخْتَرْهُ مِنْ بَيْنِ الْبِطَاقَاتِ",
      rounds: 5,
      optionsPerRound: 3,
    },
    {
      kind: "count_shapes",
      title: "عُدَّ الْأَشْكَالَ",
      description: "كَمْ شَكْلًا مِنَ الْمَطْلُوبِ تَرَى فِي الْمَشْهَدِ؟",
      rounds: 4,
      minShapes: 6,
      maxShapes: 12,
      minTargetCount: 2,
      maxTargetCount: 6,
    },
    {
      kind: "color_shape",
      title: "لَوِّنِ الشَّكْلَ الْمَطْلُوبَ",
      description: "لَوِّنْ كُلَّ شَكْلٍ بِاللَّوْنِ الْمَطْلُوبِ",
      minInstructions: 3,
      maxInstructions: 5,
    },
    {
      kind: "color_letters_word",
      title: "لَوِّنْ حُرُوفَ الْكَلِمَةِ",
      description: "لَوِّنْ كُلَّ حَرْفٍ بِاللَّوْنِ الْمَطْلُوبِ",
      rounds: 3,
      minLettersToColor: 1,
      maxLettersToColor: 3,
    },
    {
      kind: "draw_shape",
      title: "اُرْسُمِ الشَّكْلَ",
      description: "اِسْتَخْدِمِ الْفُرْشَاةَ وَالْأَلْوَانَ لِرَسْمِ الشَّكْلِ",
      showGuideByDefault: true,
      brushSizes: [4, 8, 14],
      maxUndoStack: 50,
    },
  ],
};
