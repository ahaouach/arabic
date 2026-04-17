/**
 * Seed content for the `numbers_lesson` section used by
 * /dashboard/courses/arabic/numbers.
 *
 * Every Arabic string is fully vowelized (harakat). Western digits are
 * strings "1".."10" — the UI enforces this via Zod. `colorTheme` gives
 * each number a consistent pastel identity across every zone.
 *
 * To edit the lesson without a code change, update a row directly via
 * `npm run db:studio` on the `LessonSection.content` column, or edit
 * this file and rerun `npm run db:seed`.
 */

import type { NumbersLessonSection } from "@/lib/types/numbersLesson.types";

export const numbersLessonContent: NumbersLessonSection = {
  title: "عَالَمُ الْأَرْقَامِ",
  numbers: [
    {
      value: 1,
      display: "1",
      displayEastern: "١",
      nameAr: "وَاحِدٌ",
      transliteration: "wahidun",
      audioText: "وَاحِدٌ",
      audioUrl: "/audio/numbers/1.mp3",
      colorTheme: { bg: "#e0f2fe", ring: "#0ea5e9", text: "#0c4a6e" },
    },
    {
      value: 2,
      display: "2",
      displayEastern: "٢",
      nameAr: "اِثْنَانِ",
      transliteration: "ithnani",
      audioText: "اِثْنَانِ",
      audioUrl: "/audio/numbers/2.mp3",
      colorTheme: { bg: "#fef3c7", ring: "#f59e0b", text: "#92400e" },
    },
    {
      value: 3,
      display: "3",
      displayEastern: "٣",
      nameAr: "ثَلَاثَةٌ",
      transliteration: "thalathatun",
      audioText: "ثَلَاثَةٌ",
      audioUrl: "/audio/numbers/3.mp3",
      colorTheme: { bg: "#d1fae5", ring: "#10b981", text: "#065f46" },
    },
    {
      value: 4,
      display: "4",
      displayEastern: "٤",
      nameAr: "أَرْبَعَةٌ",
      transliteration: "arbaatun",
      audioText: "أَرْبَعَةٌ",
      audioUrl: "/audio/numbers/4.mp3",
      colorTheme: { bg: "#fce7f3", ring: "#ec4899", text: "#9d174d" },
    },
    {
      value: 5,
      display: "5",
      displayEastern: "٥",
      nameAr: "خَمْسَةٌ",
      transliteration: "khamsatun",
      audioText: "خَمْسَةٌ",
      audioUrl: "/audio/numbers/5.mp3",
      colorTheme: { bg: "#ede9fe", ring: "#8b5cf6", text: "#4c1d95" },
    },
    {
      value: 6,
      display: "6",
      displayEastern: "٦",
      nameAr: "سِتَّةٌ",
      transliteration: "sittatun",
      audioText: "سِتَّةٌ",
      audioUrl: "/audio/numbers/6.mp3",
      colorTheme: { bg: "#ccfbf1", ring: "#14b8a6", text: "#134e4a" },
    },
    {
      value: 7,
      display: "7",
      displayEastern: "٧",
      nameAr: "سَبْعَةٌ",
      transliteration: "sabatun",
      audioText: "سَبْعَةٌ",
      audioUrl: "/audio/numbers/7.mp3",
      colorTheme: { bg: "#ffedd5", ring: "#f97316", text: "#7c2d12" },
    },
    {
      value: 8,
      display: "8",
      displayEastern: "٨",
      nameAr: "ثَمَانِيَةٌ",
      transliteration: "thamaniyatun",
      audioText: "ثَمَانِيَةٌ",
      audioUrl: "/audio/numbers/8.mp3",
      colorTheme: { bg: "#ecfccb", ring: "#84cc16", text: "#3f6212" },
    },
    {
      value: 9,
      display: "9",
      displayEastern: "٩",
      nameAr: "تِسْعَةٌ",
      transliteration: "tisatun",
      audioText: "تِسْعَةٌ",
      audioUrl: "/audio/numbers/9.mp3",
      colorTheme: { bg: "#e0e7ff", ring: "#6366f1", text: "#312e81" },
    },
    {
      value: 10,
      display: "10",
      displayEastern: "١٠",
      nameAr: "عَشَرَةٌ",
      transliteration: "asharatun",
      audioText: "عَشَرَةٌ",
      audioUrl: "/audio/numbers/10.mp3",
      colorTheme: { bg: "#fae8ff", ring: "#d946ef", text: "#701a75" },
    },
  ],
  zones: [
    // Zone 1 — Discovery: explore every number, hover/click to hear it.
    {
      kind: "discovery",
      title: "تَعَرَّفْ عَلَى الْأَرْقَامِ",
      instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ رَقْمٍ لِتَسْمَعَ اسْمَهُ",
    },
    // Zone 2 — Listen & Pick: hear a number, pick the correct Western digit.
    {
      kind: "listen_pick",
      title: "اِسْمَعْ وَاخْتَرْ",
      instructions: "اِسْمَعِ الرَّقْمَ ثُمَّ اِخْتَرْ الرَّقْمَ الصَّحِيحَ",
      rounds: [
        { answer: 3, options: [1, 3, 5] },
        { answer: 7, options: [6, 7, 9] },
        { answer: 2, options: [2, 4, 8] },
        { answer: 10, options: [8, 9, 10] },
        { answer: 5, options: [5, 6, 7] },
      ],
    },
    // Zone 3 — Count & Color: tap exactly N objects out of M.
    {
      kind: "count_color",
      title: "عُدَّ وَلَوِّنْ",
      instructions: "اِضْغَطْ عَلَى الْعَدَدِ الصَّحِيحِ مِنَ الْأَشْيَاءِ",
      rounds: [
        { target: 3, objectEmoji: "🍎", totalObjects: 6 },
        { target: 5, objectEmoji: "⭐", totalObjects: 8 },
        { target: 2, objectEmoji: "🐟", totalObjects: 5 },
        { target: 7, objectEmoji: "🌸", totalObjects: 10 },
      ],
    },
    // Zone 4 — Matching: pair each digit with its quantity visual.
    {
      kind: "matching",
      title: "طَابِقْ",
      instructions: "وَصِّلِ الرَّقْمَ بِالصُّورَةِ الْمُنَاسِبَةِ",
      pairs: [
        { value: 1, emoji: "🐻" },
        { value: 2, emoji: "🐝" },
        { value: 3, emoji: "🦋" },
        { value: 4, emoji: "🐸" },
        { value: 5, emoji: "🐞" },
      ],
    },
    // Zone 5 — Write Number: count the objects, type the digit.
    {
      kind: "write_number",
      title: "اُكْتُبِ الرَّقْمَ",
      instructions: "عُدَّ الصُّوَرَ ثُمَّ اُكْتُبِ الرَّقْمَ",
      rounds: [
        { answer: 4, visualEmoji: "🎈", prompt: "كَمْ بَالُونًا تَرَى؟" },
        { answer: 6, visualEmoji: "🍓", prompt: "كَمْ فَرَاوْلَةً تَرَى؟" },
        { answer: 8, visualEmoji: "🌟", prompt: "كَمْ نَجْمَةً تَرَى؟" },
        { answer: 10, visualEmoji: "🌼", prompt: "كَمْ زَهْرَةً تَرَى؟" },
      ],
    },
    // Zone 6 — Color the Target Digit: reinforces visual recognition of a
    // specific digit (here 9, currently underrepresented elsewhere). The
    // shape is reusable — change `targetDigit` + `distractorDigits` to
    // create variants like "color all the 5s in blue" without any code.
    {
      kind: "color_target_digit",
      title: "لَوِّنِ الرَّقْمَ تِسْعَةً بِاللَّوْنِ الْأَحْمَرِ",
      instructions: "اُنْقُرْ عَلَى كُلِّ رَقْمِ 9",
      targetDigit: 9,
      targetColor: "red",
      gridCols: 5,
      gridRows: 6,
      targetCount: 6,
      distractorDigits: [1, 2, 3, 4, 5, 6, 7, 8],
    },
  ],
};
