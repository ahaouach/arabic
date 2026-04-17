/**
 * Prisma seed script.
 *
 * Run with:  npx prisma db seed
 *
 * Creates:
 *  - 1 admin user
 *  - 4 teacher users (with Teacher profiles)
 *  - 2 parent users (each with 2 students enrolled in courses)
 *  - 4 Arabic courses + 2 Quran courses
 *  - 5 homework assignments
 *  - 5 community posts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { numbersLessonContent } from "./seeds/numbersLesson.seed";
import type { NumbersLessonSection } from "@/lib/types/numbersLesson.types";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function hash(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Themes --------------------------------------------------------------
  // `name` is the URL-safe slug; `title` is the display label.
  const themeSeeds = [
    { name: "arabic", title: "Arabic", description: "Letters, words & stories", sortOrder: 1 },
    { name: "islamic", title: "Islamic", description: "Values, stories & duas", sortOrder: 2 },
    { name: "quran", title: "Quran", description: "Memorize with Tajweed", sortOrder: 3 },
    { name: "others", title: "Others", description: "Games, crafts & more", sortOrder: 4 },
  ];
  for (const t of themeSeeds) {
    await prisma.theme.upsert({
      where: { name: t.name },
      update: { title: t.title, description: t.description, sortOrder: t.sortOrder },
      create: t,
    });
  }
  console.log("  ✓ Themes seeded");

  // ---- ThemeLessons --------------------------------------------------------
  type SectionInput =
    | { type: "text"; content: { title?: string; body: string } }
    | { type: "image"; content: { url?: string; alt?: string; caption?: string; letter?: string } }
    | {
        type: "audio";
        content: { title?: string; audioUrl: string; autoPlay?: boolean; caption?: string };
      }
    | {
        type: "quiz";
        content: { question: string; options: string[]; answer: string };
      }
    | {
        type: "numbers";
        content: {
          numbers: Array<{
            number?: number;
            arabic_simple: string;
            arabic_full: string;
            latin: string;
            transliteration: string;
            audioText?: string;
            image?: string;
            audio?: string;
          }>;
        };
      }
    | {
        type: "quiz_match";
        content: {
          question: string;
          pairs: Array<{ audio: string; answer: string }>;
        };
      }
    | {
        type: "game_numbers";
        content: {
          instructions: string;
          questions: Array<{ audio: string; options: string[]; answer: string }>;
        };
      }
    | {
        type: "paint_game";
        content: {
          title?: string;
          instructions?: string;
          objects: Array<{
            name: string;
            kind: "apple" | "car" | "house" | "sun" | "fish" | "star";
            correctColor: string;
          }>;
          colors: Array<{ name: string; hex: string; audioText?: string }>;
        };
      }
    | {
        type: "interactive_color_world";
        content: {
          title?: string;
          instructions?: string;
          colors: Array<{
            name: string;
            hex: string;
            audioText?: string;
            transliteration?: string;
            example?: string;
          }>;
        };
      }
    | {
        type: "interactive_shapes_world";
        content: {
          title?: string;
          instructions?: string;
          shapes: Array<{
            name: string;
            emoji: string;
            audioText?: string;
            transliteration?: string;
          }>;
        };
      }
    | {
        type: "draw_shapes";
        content: {
          title?: string;
          instructions?: string;
          challenges: Array<{
            name: string;
            audioText?: string;
            dots: Array<{ x: number; y: number }>;
          }>;
        };
      }
    | {
        type: "color_shapes";
        content: {
          title?: string;
          instructions?: string;
          colors: Array<{ name: string; hex: string; audioText?: string }>;
          objects: Array<{
            name: string;
            kind: "circle" | "square" | "triangle" | "rectangle";
            correctColor: string;
          }>;
        };
      }
    | {
        type: "letter_intro";
        content: {
          title?: string;
          letter: string;
          name: string;
          audioText?: string;
          transliteration?: string;
        };
      }
    | {
        type: "letter_vowels";
        content: {
          title?: string;
          instructions?: string;
          letter: string;
          forms: Array<{
            form: string;
            vowel: "fatha" | "kasra" | "damma" | "sukun";
            audioText?: string;
          }>;
        };
      }
    | {
        type: "letter_coloring";
        content: {
          title?: string;
          instructions?: string;
          letter: string;
          colors: Array<{ name: string; hex: string; audioText?: string }>;
        };
      }
    | {
        type: "letter_tracing";
        content: {
          title?: string;
          instructions?: string;
          letter: string;
          points: Array<{ x: number; y: number }>;
        };
      }
    | {
        type: "letter_word_match";
        content: {
          title?: string;
          instructions?: string;
          words: Array<{
            word: string;
            letter: string;
            meaning?: string;
            emoji?: string;
            audioText?: string;
          }>;
        };
      }
    | {
        type: "family_intro";
        content: {
          title?: string;
          instructions?: string;
          members: Array<{
            name: string;
            emoji: string;
            audioText?: string;
            meaning?: string;
          }>;
        };
      }
    | {
        type: "family_tree";
        content: {
          title?: string;
          instructions?: string;
          nodes: Array<{
            id: string;
            name: string;
            emoji: string;
            audioText?: string;
            level: number;
            parents?: string[];
          }>;
        };
      }
    | {
        type: "family_match";
        content: {
          title?: string;
          instructions?: string;
          rounds: Array<{
            prompt: string;
            audioText?: string;
            answer: string;
            options: Array<{ name: string; emoji: string }>;
          }>;
        };
      }
    | {
        type: "body_map";
        content: {
          title?: string;
          instructions?: string;
          parts: Array<{
            key: "head" | "eye" | "ear" | "nose" | "mouth" | "hand" | "foot";
            name: string;
            audioText?: string;
            meaning?: string;
          }>;
        };
      }
    | {
        type: "pronoun_cards";
        content: {
          title?: string;
          instructions?: string;
          pronouns: Array<{
            pronoun: string;
            audioText?: string;
            meaning?: string;
            emoji?: string;
          }>;
        };
      }
    | {
        type: "pronoun_object";
        content: {
          title?: string;
          instructions?: string;
          pairs: Array<{
            subject: string;
            object: string;
            subjectAudio?: string;
            objectAudio?: string;
            meaning?: string;
            emoji?: string;
          }>;
        };
      }
    | {
        type: "pronoun_sentences";
        content: {
          title?: string;
          instructions?: string;
          sentences: Array<{
            sentence: string;
            pronoun: string;
            translation?: string;
            audioText?: string;
            emoji?: string;
          }>;
        };
      }
    | {
        type: "pronoun_quiz";
        content: {
          title?: string;
          instructions?: string;
          questions: Array<{
            prompt: string;
            answer: string;
            options: string[];
            translation?: string;
          }>;
        };
      }
    | {
        type: "animal_world";
        content: {
          title?: string;
          instructions?: string;
          world: "farm" | "jungle" | "sky" | "ocean";
          animals: Array<{
            name: string;
            emoji: string;
            audioText?: string;
            meaning?: string;
          }>;
        };
      }
    | {
        type: "animal_world_quiz";
        content: {
          title?: string;
          instructions?: string;
          rounds: Array<{
            prompt: string;
            audioText?: string;
            answer: string;
            options: Array<{ name: string; emoji: string }>;
          }>;
        };
      }
    | {
        type: "numbers_lesson";
        content: NumbersLessonSection;
      };

  interface LessonSeed {
    themeSlug: string;
    slug: string;
    title: string;
    description?: string;
    icon?: string;
    level: "basic" | "intermediate" | "advanced";
    order: number;
    isLocked?: boolean;
    sections?: SectionInput[];
  }

  // ---- Arabic alphabet data ------------------------------------------------
  // Each entry drives a full 5-step letter lesson (intro / vowels / coloring
  // / tracing / word match). Adding a new letter is as simple as pushing a
  // new row here.
  interface AlphabetLetter {
    letter: string;
    name: string;
    trans: string;
    forms: [string, string, string]; // fatha, kasra, damma
    word: string;
    meaning: string;
    emoji: string;
    // Ordered tracing dots (0-100 coords) approximating the letter's main
    // stroke. Arabic is read right-to-left, so most paths start from the
    // right side. The ghost letter in the background gives the real visual
    // reference — these dots just need to feel shaped like the letter.
    tracingPoints: Array<{ x: number; y: number }>;
  }

  // Common skeleton shapes shared across letter families.
  const SHAPE = {
    vertical: [
      { x: 50, y: 18 },
      { x: 50, y: 40 },
      { x: 50, y: 62 },
      { x: 50, y: 85 },
    ],
    bowl: [
      { x: 78, y: 42 },
      { x: 62, y: 58 },
      { x: 50, y: 62 },
      { x: 38, y: 58 },
      { x: 22, y: 42 },
    ],
    camShape: [
      { x: 72, y: 30 },
      { x: 62, y: 45 },
      { x: 50, y: 58 },
      { x: 35, y: 68 },
      { x: 22, y: 55 },
    ],
    dalShape: [
      { x: 68, y: 32 },
      { x: 68, y: 50 },
      { x: 52, y: 60 },
      { x: 35, y: 62 },
    ],
    raShape: [
      { x: 65, y: 32 },
      { x: 58, y: 50 },
      { x: 45, y: 65 },
      { x: 32, y: 78 },
    ],
    humps: [
      { x: 80, y: 48 },
      { x: 68, y: 58 },
      { x: 58, y: 48 },
      { x: 46, y: 58 },
      { x: 35, y: 48 },
      { x: 22, y: 58 },
    ],
    sadShape: [
      { x: 80, y: 40 },
      { x: 68, y: 55 },
      { x: 52, y: 58 },
      { x: 35, y: 52 },
      { x: 25, y: 38 },
      { x: 32, y: 68 },
      { x: 20, y: 78 },
    ],
    taaEmphatic: [
      { x: 72, y: 20 },
      { x: 72, y: 55 },
      { x: 55, y: 65 },
      { x: 35, y: 60 },
      { x: 25, y: 45 },
    ],
    ainShape: [
      { x: 72, y: 28 },
      { x: 60, y: 42 },
      { x: 52, y: 58 },
      { x: 38, y: 68 },
      { x: 25, y: 58 },
    ],
    faaShape: [
      { x: 68, y: 32 },
      { x: 72, y: 48 },
      { x: 60, y: 58 },
      { x: 45, y: 55 },
      { x: 32, y: 68 },
    ],
    kafShape: [
      { x: 78, y: 25 },
      { x: 60, y: 35 },
      { x: 55, y: 55 },
      { x: 40, y: 55 },
      { x: 28, y: 48 },
      { x: 28, y: 68 },
    ],
    lamShape: [
      { x: 60, y: 20 },
      { x: 58, y: 40 },
      { x: 55, y: 58 },
      { x: 48, y: 72 },
      { x: 35, y: 85 },
    ],
    mimShape: [
      { x: 65, y: 35 },
      { x: 72, y: 48 },
      { x: 62, y: 58 },
      { x: 48, y: 55 },
      { x: 42, y: 72 },
      { x: 48, y: 90 },
    ],
    haaSoftShape: [
      { x: 60, y: 38 },
      { x: 68, y: 50 },
      { x: 58, y: 62 },
      { x: 42, y: 58 },
      { x: 50, y: 42 },
    ],
    wawShape: [
      { x: 58, y: 28 },
      { x: 70, y: 42 },
      { x: 58, y: 52 },
      { x: 42, y: 48 },
      { x: 52, y: 65 },
      { x: 55, y: 85 },
    ],
  } as const;

  const ALPHABET_LETTERS: AlphabetLetter[] = [
    { letter: "ا", name: "أَلِفٌ", trans: "alif", forms: ["أَ", "إِ", "أُ"], word: "أَسَدٌ", meaning: "lion", emoji: "🦁", tracingPoints: [...SHAPE.vertical] },
    { letter: "ب", name: "بَاءٌ", trans: "baa", forms: ["بَ", "بِ", "بُ"], word: "بَطَّةٌ", meaning: "duck", emoji: "🦆", tracingPoints: [...SHAPE.bowl] },
    { letter: "ت", name: "تَاءٌ", trans: "taa", forms: ["تَ", "تِ", "تُ"], word: "تُفَّاحَةٌ", meaning: "apple", emoji: "🍎", tracingPoints: [...SHAPE.bowl] },
    { letter: "ث", name: "ثَاءٌ", trans: "thaa", forms: ["ثَ", "ثِ", "ثُ"], word: "ثَعْلَبٌ", meaning: "fox", emoji: "🦊", tracingPoints: [...SHAPE.bowl] },
    { letter: "ج", name: "جِيمٌ", trans: "jim", forms: ["جَ", "جِ", "جُ"], word: "جَمَلٌ", meaning: "camel", emoji: "🐪", tracingPoints: [...SHAPE.camShape] },
    { letter: "ح", name: "حَاءٌ", trans: "haa", forms: ["حَ", "حِ", "حُ"], word: "حِصَانٌ", meaning: "horse", emoji: "🐎", tracingPoints: [...SHAPE.camShape] },
    { letter: "خ", name: "خَاءٌ", trans: "khaa", forms: ["خَ", "خِ", "خُ"], word: "خُبْزٌ", meaning: "bread", emoji: "🍞", tracingPoints: [...SHAPE.camShape] },
    { letter: "د", name: "دَالٌ", trans: "dal", forms: ["دَ", "دِ", "دُ"], word: "دُبٌّ", meaning: "bear", emoji: "🐻", tracingPoints: [...SHAPE.dalShape] },
    { letter: "ذ", name: "ذَالٌ", trans: "dhal", forms: ["ذَ", "ذِ", "ذُ"], word: "ذِئْبٌ", meaning: "wolf", emoji: "🐺", tracingPoints: [...SHAPE.dalShape] },
    { letter: "ر", name: "رَاءٌ", trans: "ra", forms: ["رَ", "رِ", "رُ"], word: "رُمَّانٌ", meaning: "pomegranate", emoji: "🍎", tracingPoints: [...SHAPE.raShape] },
    { letter: "ز", name: "زَايٌ", trans: "zay", forms: ["زَ", "زِ", "زُ"], word: "زَرَافَةٌ", meaning: "giraffe", emoji: "🦒", tracingPoints: [...SHAPE.raShape] },
    { letter: "س", name: "سِينٌ", trans: "sin", forms: ["سَ", "سِ", "سُ"], word: "سَمَكَةٌ", meaning: "fish", emoji: "🐟", tracingPoints: [...SHAPE.humps] },
    { letter: "ش", name: "شِينٌ", trans: "shin", forms: ["شَ", "شِ", "شُ"], word: "شَمْسٌ", meaning: "sun", emoji: "☀️", tracingPoints: [...SHAPE.humps] },
    { letter: "ص", name: "صَادٌ", trans: "sad", forms: ["صَ", "صِ", "صُ"], word: "صَقْرٌ", meaning: "falcon", emoji: "🦅", tracingPoints: [...SHAPE.sadShape] },
    { letter: "ض", name: "ضَادٌ", trans: "dad", forms: ["ضَ", "ضِ", "ضُ"], word: "ضِفْدَعٌ", meaning: "frog", emoji: "🐸", tracingPoints: [...SHAPE.sadShape] },
    { letter: "ط", name: "طَاءٌ", trans: "taa-emphatic", forms: ["طَ", "طِ", "طُ"], word: "طَائِرٌ", meaning: "bird", emoji: "🐦", tracingPoints: [...SHAPE.taaEmphatic] },
    { letter: "ظ", name: "ظَاءٌ", trans: "zaa", forms: ["ظَ", "ظِ", "ظُ"], word: "ظَبْيٌ", meaning: "gazelle", emoji: "🦌", tracingPoints: [...SHAPE.taaEmphatic] },
    { letter: "ع", name: "عَيْنٌ", trans: "ain", forms: ["عَ", "عِ", "عُ"], word: "عَيْنٌ", meaning: "eye", emoji: "👁️", tracingPoints: [...SHAPE.ainShape] },
    { letter: "غ", name: "غَيْنٌ", trans: "ghain", forms: ["غَ", "غِ", "غُ"], word: "غُرَابٌ", meaning: "crow", emoji: "🐦", tracingPoints: [...SHAPE.ainShape] },
    { letter: "ف", name: "فَاءٌ", trans: "faa", forms: ["فَ", "فِ", "فُ"], word: "فِيلٌ", meaning: "elephant", emoji: "🐘", tracingPoints: [...SHAPE.faaShape] },
    { letter: "ق", name: "قَافٌ", trans: "qaf", forms: ["قَ", "قِ", "قُ"], word: "قِطَّةٌ", meaning: "cat", emoji: "🐱", tracingPoints: [...SHAPE.faaShape] },
    { letter: "ك", name: "كَافٌ", trans: "kaf", forms: ["كَ", "كِ", "كُ"], word: "كَلْبٌ", meaning: "dog", emoji: "🐕", tracingPoints: [...SHAPE.kafShape] },
    { letter: "ل", name: "لَامٌ", trans: "lam", forms: ["لَ", "لِ", "لُ"], word: "لَيْمُونٌ", meaning: "lemon", emoji: "🍋", tracingPoints: [...SHAPE.lamShape] },
    { letter: "م", name: "مِيمٌ", trans: "mim", forms: ["مَ", "مِ", "مُ"], word: "مَوْزٌ", meaning: "banana", emoji: "🍌", tracingPoints: [...SHAPE.mimShape] },
    { letter: "ن", name: "نُونٌ", trans: "nun", forms: ["نَ", "نِ", "نُ"], word: "نَحْلَةٌ", meaning: "bee", emoji: "🐝", tracingPoints: [...SHAPE.bowl] },
    { letter: "ه", name: "هَاءٌ", trans: "haa-soft", forms: ["هَ", "هِ", "هُ"], word: "هُدْهُدٌ", meaning: "hoopoe", emoji: "🐦", tracingPoints: [...SHAPE.haaSoftShape] },
    { letter: "و", name: "وَاوٌ", trans: "waw", forms: ["وَ", "وِ", "وُ"], word: "وَرْدَةٌ", meaning: "rose", emoji: "🌹", tracingPoints: [...SHAPE.wawShape] },
    { letter: "ي", name: "يَاءٌ", trans: "yaa", forms: ["يَ", "يِ", "يُ"], word: "يَدٌ", meaning: "hand", emoji: "✋", tracingPoints: [...SHAPE.bowl] },
  ];

  // Shared palette so we don't repeat JSON 28 times.
  const LETTER_PALETTE: Array<{ name: string; hex: string; audioText: string }> = [
    { name: "أَحْمَرُ", hex: "#ef4444", audioText: "أَحْمَرُ" },
    { name: "أَزْرَقُ", hex: "#3b82f6", audioText: "أَزْرَقُ" },
    { name: "أَخْضَرُ", hex: "#22c55e", audioText: "أَخْضَرُ" },
  ];

  function buildLetterLesson(l: AlphabetLetter, order: number): LessonSeed {
    return {
      themeSlug: "arabic",
      slug: `letter-${l.trans}`,
      title: `الْحَرْفُ: ${l.name}`,
      description: `Meet the letter ${l.letter} (${l.name}).`,
      icon: "🔤",
      level: "basic",
      order,
      sections: [
        {
          type: "letter_intro",
          content: {
            title: "تَعَرَّفْ عَلَى الْحَرْفِ",
            letter: l.letter,
            name: l.name,
            audioText: l.name,
            transliteration: l.trans,
          },
        },
        {
          type: "letter_vowels",
          content: {
            title: "الْحَرَكَاتُ",
            instructions: "اِضْغَطْ عَلَى كُلِّ حَرَكَةٍ لِتَسْمَعَ الصَّوْتَ",
            letter: l.letter,
            forms: [
              { form: l.forms[0], vowel: "fatha", audioText: l.forms[0] },
              { form: l.forms[1], vowel: "kasra", audioText: l.forms[1] },
              { form: l.forms[2], vowel: "damma", audioText: l.forms[2] },
            ],
          },
        },
        {
          type: "letter_coloring",
          content: {
            title: "لَوِّنِ الْحَرْفَ",
            instructions: "اِخْتَرْ لَوْنًا ثُمَّ اضْغَطْ عَلَى الْحَرْفِ",
            letter: l.letter,
            colors: LETTER_PALETTE,
          },
        },
        {
          type: "letter_word_match",
          content: {
            title: "كَلِمَةٌ تَبْدَأُ بِالْحَرْفِ",
            instructions: "اِضْغَطْ عَلَى الْكَلِمَةِ لِتَسْمَعَهَا",
            words: [
              {
                word: l.word,
                letter: l.letter,
                meaning: l.meaning,
                emoji: l.emoji,
                audioText: l.word,
              },
            ],
          },
        },
      ],
    };
  }

  // Generated letter lessons occupy orders 4..31 (28 letters).
  const letterLessons: LessonSeed[] = ALPHABET_LETTERS.map((l, i) =>
    buildLetterLesson(l, 4 + i),
  );

  const lessonSeeds: LessonSeed[] = [
    // -------- Arabic (basic, gamified catalogue) --------
    {
      themeSlug: "arabic",
      slug: "numbers",
      title: "عَالَمُ الْأَرْقَامِ",
      description: "Discover, listen, count, match, and write numbers 1–10.",
      icon: "🔢",
      level: "basic",
      order: 1,
      sections: [
        // Single numbers_lesson section — content is the idempotent JSON
        // object defined in ./seeds/numbersLesson.seed.ts, which is the
        // only place to edit lesson content (or do it live via
        // `npm run db:studio`).
        {
          type: "numbers_lesson",
          content: numbersLessonContent,
        },
      ],
    },
    {
      themeSlug: "arabic",
      slug: "colors",
      title: "الأَلْوَانُ",
      description: "Play, paint, and learn Arabic colors.",
      icon: "🎨",
      level: "basic",
      order: 2,
      sections: [
        {
          type: "interactive_color_world",
          content: {
            title: "عَالَمُ الأَلْوَانِ",
            instructions: "مَرِّرْ مُؤَشِّرَكَ أَوِ اضْغَطْ عَلَى كُلِّ لَوْنٍ لِتَسْمَعَ اسْمَهُ!",
            colors: [
              { name: "أَحْمَرُ", hex: "#ef4444", audioText: "أَحْمَرُ", transliteration: "ahmaru", example: "🍎" },
              { name: "أَزْرَقُ", hex: "#3b82f6", audioText: "أَزْرَقُ", transliteration: "azraqu", example: "🐳" },
              { name: "أَخْضَرُ", hex: "#22c55e", audioText: "أَخْضَرُ", transliteration: "akhdaru", example: "🌳" },
              { name: "أَصْفَرُ", hex: "#facc15", audioText: "أَصْفَرُ", transliteration: "asfaru", example: "🌟" },
              { name: "أَسْوَدُ", hex: "#111827", audioText: "أَسْوَدُ", transliteration: "aswadu", example: "🐈‍⬛" },
              { name: "أَبْيَضُ", hex: "#f8fafc", audioText: "أَبْيَضُ", transliteration: "abyadu", example: "☁️" },
            ],
          },
        },
        {
          type: "paint_game",
          content: {
            title: "اِلْعَبْ وَتَعَلَّمِ الأَلْوَانَ",
            instructions: "اِخْتَرْ لَوْنًا ثُمَّ اضْغَطْ عَلَى الصُّورَةِ الصَّحِيحَةِ",
            colors: [
              { name: "أَحْمَرُ", hex: "#ef4444", audioText: "أَحْمَرُ" },
              { name: "أَزْرَقُ", hex: "#3b82f6", audioText: "أَزْرَقُ" },
              { name: "أَخْضَرُ", hex: "#22c55e", audioText: "أَخْضَرُ" },
              { name: "أَصْفَرُ", hex: "#facc15", audioText: "أَصْفَرُ" },
              { name: "أَسْوَدُ", hex: "#111827", audioText: "أَسْوَدُ" },
              { name: "أَبْيَضُ", hex: "#f8fafc", audioText: "أَبْيَضُ" },
            ],
            objects: [
              { name: "تُفَّاحَةٌ", kind: "apple", correctColor: "أَحْمَرُ" },
              { name: "سَيَّارَةٌ", kind: "car", correctColor: "أَزْرَقُ" },
              { name: "بَيْتٌ", kind: "house", correctColor: "أَخْضَرُ" },
              { name: "شَمْسٌ", kind: "sun", correctColor: "أَصْفَرُ" },
              { name: "سَمَكَةٌ", kind: "fish", correctColor: "أَزْرَقُ" },
              { name: "نَجْمَةٌ", kind: "star", correctColor: "أَصْفَرُ" },
            ],
          },
        },
      ],
    },
    {
      themeSlug: "arabic",
      slug: "shapes",
      title: "الأَشْكَالُ الْهَنْدَسِيَّةُ",
      description: "Learn geometric shapes in Arabic with sound.",
      icon: "🔺",
      level: "basic",
      order: 3,
      sections: [
        {
          type: "interactive_shapes_world",
          content: {
            title: "عَالَمُ الأَشْكَالِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ شَكْلٍ لِتَسْمَعَ اسْمَهُ!",
            shapes: [
              { name: "دَائِرَةٌ", emoji: "⚪", audioText: "دَائِرَةٌ", transliteration: "daairatun" },
              { name: "مُرَبَّعٌ", emoji: "⬜", audioText: "مُرَبَّعٌ", transliteration: "murabbaun" },
              { name: "مُثَلَّثٌ", emoji: "🔺", audioText: "مُثَلَّثٌ", transliteration: "muthallathun" },
              { name: "مُسْتَطِيلٌ", emoji: "▭", audioText: "مُسْتَطِيلٌ", transliteration: "mustatilun" },
            ],
          },
        },
        {
          type: "draw_shapes",
          content: {
            title: "اِرْسُمْ الأَشْكَالَ",
            instructions: "اِضْغَطْ عَلَى النِّقَاطِ بِالتَّرْتِيبِ لِتَرْسُمَ الشَّكْلَ",
            challenges: [
              {
                name: "مُرَبَّعٌ",
                audioText: "مُرَبَّعٌ",
                dots: [
                  { x: 25, y: 25 },
                  { x: 75, y: 25 },
                  { x: 75, y: 75 },
                  { x: 25, y: 75 },
                ],
              },
              {
                name: "مُثَلَّثٌ",
                audioText: "مُثَلَّثٌ",
                dots: [
                  { x: 50, y: 18 },
                  { x: 85, y: 80 },
                  { x: 15, y: 80 },
                ],
              },
              {
                name: "مُسْتَطِيلٌ",
                audioText: "مُسْتَطِيلٌ",
                dots: [
                  { x: 15, y: 30 },
                  { x: 85, y: 30 },
                  { x: 85, y: 70 },
                  { x: 15, y: 70 },
                ],
              },
            ],
          },
        },
        {
          type: "color_shapes",
          content: {
            title: "لَوِّنِ الأَشْكَالَ",
            instructions: "اِخْتَرْ لَوْنًا ثُمَّ اضْغَطْ عَلَى الشَّكْلِ الصَّحِيحِ",
            colors: [
              { name: "أَحْمَرُ", hex: "#ef4444", audioText: "أَحْمَرُ" },
              { name: "أَزْرَقُ", hex: "#3b82f6", audioText: "أَزْرَقُ" },
              { name: "أَخْضَرُ", hex: "#22c55e", audioText: "أَخْضَرُ" },
              { name: "أَصْفَرُ", hex: "#facc15", audioText: "أَصْفَرُ" },
            ],
            objects: [
              { name: "دَائِرَةٌ", kind: "circle", correctColor: "أَحْمَرُ" },
              { name: "مُرَبَّعٌ", kind: "square", correctColor: "أَزْرَقُ" },
              { name: "مُثَلَّثٌ", kind: "triangle", correctColor: "أَخْضَرُ" },
              { name: "مُسْتَطِيلٌ", kind: "rectangle", correctColor: "أَصْفَرُ" },
            ],
          },
        },
      ],
    },
    // All 28 Arabic letters — generated above.
    ...letterLessons,
    {
      themeSlug: "arabic",
      slug: "family",
      title: "العَائِلَةُ",
      description: "Learn the names of your family members in Arabic.",
      icon: "👨‍👩‍👧‍👦",
      level: "basic",
      order: 32,
      sections: [
        {
          type: "family_intro",
          content: {
            title: "أَفْرَادُ العَائِلَةِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ بِطَاقَةٍ لِتَسْمَعَ اسْمَهَا",
            members: [
              { name: "الأَبُ", emoji: "👨", audioText: "الأَبُ", meaning: "father" },
              { name: "الأُمُّ", emoji: "👩", audioText: "الأُمُّ", meaning: "mother" },
              { name: "الأَخُ", emoji: "🧑", audioText: "الأَخُ", meaning: "brother" },
              { name: "الأُخْتُ", emoji: "👧", audioText: "الأُخْتُ", meaning: "sister" },
              { name: "الجَدُّ", emoji: "👴", audioText: "الجَدُّ", meaning: "grandfather" },
              { name: "الجَدَّةُ", emoji: "👵", audioText: "الجَدَّةُ", meaning: "grandmother" },
            ],
          },
        },
        {
          type: "family_tree",
          content: {
            title: "شَجَرَةُ العَائِلَةِ",
            instructions: "اِضْغَطْ عَلَى كُلِّ فَرْدٍ لِتَسْمَعَ اسْمَهُ",
            nodes: [
              { id: "grandfather", name: "الجَدُّ", emoji: "👴", audioText: "الجَدُّ", level: 0 },
              { id: "grandmother", name: "الجَدَّةُ", emoji: "👵", audioText: "الجَدَّةُ", level: 0 },
              { id: "father", name: "الأَبُ", emoji: "👨", audioText: "الأَبُ", level: 1, parents: ["grandfather", "grandmother"] },
              { id: "mother", name: "الأُمُّ", emoji: "👩", audioText: "الأُمُّ", level: 1 },
              { id: "brother", name: "الأَخُ", emoji: "🧑", audioText: "الأَخُ", level: 2, parents: ["father", "mother"] },
              { id: "sister", name: "الأُخْتُ", emoji: "👧", audioText: "الأُخْتُ", level: 2, parents: ["father", "mother"] },
            ],
          },
        },
        {
          type: "family_match",
          content: {
            title: "لُعْبَةُ المُطَابَقَةِ",
            instructions: "اِسْمَعْ ثُمَّ اخْتَرِ الصُّورَةَ الصَّحِيحَةَ",
            rounds: [
              {
                prompt: "الأُمُّ",
                audioText: "الأُمُّ",
                answer: "الأُمُّ",
                options: [
                  { name: "الأَبُ", emoji: "👨" },
                  { name: "الأُمُّ", emoji: "👩" },
                  { name: "الأُخْتُ", emoji: "👧" },
                ],
              },
              {
                prompt: "الأَبُ",
                audioText: "الأَبُ",
                answer: "الأَبُ",
                options: [
                  { name: "الجَدُّ", emoji: "👴" },
                  { name: "الأَخُ", emoji: "🧑" },
                  { name: "الأَبُ", emoji: "👨" },
                ],
              },
              {
                prompt: "الجَدَّةُ",
                audioText: "الجَدَّةُ",
                answer: "الجَدَّةُ",
                options: [
                  { name: "الأُمُّ", emoji: "👩" },
                  { name: "الجَدَّةُ", emoji: "👵" },
                  { name: "الأُخْتُ", emoji: "👧" },
                ],
              },
              {
                prompt: "الأَخُ",
                audioText: "الأَخُ",
                answer: "الأَخُ",
                options: [
                  { name: "الأَخُ", emoji: "🧑" },
                  { name: "الأَبُ", emoji: "👨" },
                  { name: "الجَدُّ", emoji: "👴" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      themeSlug: "arabic",
      slug: "animals-world",
      title: "عَالَمُ الْحَيَوَانَاتِ",
      description: "Explore animals grouped by their natural environments.",
      icon: "🐾",
      level: "basic",
      order: 33,
      sections: [
        {
          type: "animal_world",
          content: {
            title: "حَيَوَانَاتُ الْمَزْرَعَةِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ حَيَوَانٍ لِتَسْمَعَ اسْمَهُ",
            world: "farm",
            animals: [
              { name: "بَقَرَةٌ", emoji: "🐄", audioText: "بَقَرَةٌ", meaning: "cow" },
              { name: "دَجَاجَةٌ", emoji: "🐔", audioText: "دَجَاجَةٌ", meaning: "chicken" },
              { name: "خَرُوفٌ", emoji: "🐑", audioText: "خَرُوفٌ", meaning: "sheep" },
              { name: "حِصَانٌ", emoji: "🐎", audioText: "حِصَانٌ", meaning: "horse" },
              { name: "حِمَارٌ", emoji: "🫏", audioText: "حِمَارٌ", meaning: "donkey" },
            ],
          },
        },
        {
          type: "animal_world",
          content: {
            title: "حَيَوَانَاتُ الْغَابَةِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ حَيَوَانٍ لِتَسْمَعَ اسْمَهُ",
            world: "jungle",
            animals: [
              { name: "أَسَدٌ", emoji: "🦁", audioText: "أَسَدٌ", meaning: "lion" },
              { name: "نَمِرٌ", emoji: "🐯", audioText: "نَمِرٌ", meaning: "tiger" },
              { name: "قِرْدٌ", emoji: "🐒", audioText: "قِرْدٌ", meaning: "monkey" },
              { name: "فِيلٌ", emoji: "🐘", audioText: "فِيلٌ", meaning: "elephant" },
              { name: "زَرَافَةٌ", emoji: "🦒", audioText: "زَرَافَةٌ", meaning: "giraffe" },
            ],
          },
        },
        {
          type: "animal_world",
          content: {
            title: "حَيَوَانَاتٌ تَطِيرُ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ حَيَوَانٍ لِتَسْمَعَ اسْمَهُ",
            world: "sky",
            animals: [
              { name: "طَائِرٌ", emoji: "🐦", audioText: "طَائِرٌ", meaning: "bird" },
              { name: "بَطَّةٌ", emoji: "🦆", audioText: "بَطَّةٌ", meaning: "duck" },
              { name: "دِيكٌ", emoji: "🐓", audioText: "دِيكٌ", meaning: "rooster" },
              { name: "نَسْرٌ", emoji: "🦅", audioText: "نَسْرٌ", meaning: "eagle" },
            ],
          },
        },
        {
          type: "animal_world",
          content: {
            title: "حَيَوَانَاتُ الْبَحْرِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ حَيَوَانٍ لِتَسْمَعَ اسْمَهُ",
            world: "ocean",
            animals: [
              { name: "سَمَكَةٌ", emoji: "🐟", audioText: "سَمَكَةٌ", meaning: "fish" },
              { name: "حُوتٌ", emoji: "🐋", audioText: "حُوتٌ", meaning: "whale" },
              { name: "دُلْفِينٌ", emoji: "🐬", audioText: "دُلْفِينٌ", meaning: "dolphin" },
              { name: "سُلَحْفَاةٌ", emoji: "🐢", audioText: "سُلَحْفَاةٌ", meaning: "turtle" },
              { name: "أُخْطُبُوطٌ", emoji: "🐙", audioText: "أُخْطُبُوطٌ", meaning: "octopus" },
            ],
          },
        },
        {
          type: "animal_world_quiz",
          content: {
            title: "لُعْبَةُ الْحَيَوَانَاتِ",
            instructions: "اِسْمَعْ ثُمَّ اخْتَرِ الْحَيَوَانَ الصَّحِيحَ",
            rounds: [
              {
                prompt: "أَسَدٌ",
                audioText: "أَسَدٌ",
                answer: "أَسَدٌ",
                options: [
                  { name: "أَسَدٌ", emoji: "🦁" },
                  { name: "فِيلٌ", emoji: "🐘" },
                  { name: "قِرْدٌ", emoji: "🐒" },
                ],
              },
              {
                prompt: "بَقَرَةٌ",
                audioText: "بَقَرَةٌ",
                answer: "بَقَرَةٌ",
                options: [
                  { name: "خَرُوفٌ", emoji: "🐑" },
                  { name: "بَقَرَةٌ", emoji: "🐄" },
                  { name: "حِصَانٌ", emoji: "🐎" },
                ],
              },
              {
                prompt: "حُوتٌ",
                audioText: "حُوتٌ",
                answer: "حُوتٌ",
                options: [
                  { name: "سَمَكَةٌ", emoji: "🐟" },
                  { name: "حُوتٌ", emoji: "🐋" },
                  { name: "دُلْفِينٌ", emoji: "🐬" },
                ],
              },
              {
                prompt: "نَسْرٌ",
                audioText: "نَسْرٌ",
                answer: "نَسْرٌ",
                options: [
                  { name: "دِيكٌ", emoji: "🐓" },
                  { name: "نَسْرٌ", emoji: "🦅" },
                  { name: "بَطَّةٌ", emoji: "🦆" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      themeSlug: "arabic",
      slug: "body",
      title: "أَعْضَاءُ الْجِسْمِ الْبَشَرِيِّ",
      description: "Explore the human body by hovering each part.",
      icon: "👤",
      level: "basic",
      order: 34,
      sections: [
        {
          type: "body_map",
          content: {
            title: "اِكْتَشِفْ أَعْضَاءَ الْجِسْمِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ جُزْءٍ لِتَسْمَعَ اسْمَهُ",
            parts: [
              { key: "head", name: "الرَّأْسُ", audioText: "الرَّأْسُ", meaning: "head" },
              { key: "eye", name: "الْعَيْنُ", audioText: "الْعَيْنُ", meaning: "eye" },
              { key: "ear", name: "الْأُذُنُ", audioText: "الْأُذُنُ", meaning: "ear" },
              { key: "nose", name: "الْأَنْفُ", audioText: "الْأَنْفُ", meaning: "nose" },
              { key: "mouth", name: "الْفَمُ", audioText: "الْفَمُ", meaning: "mouth" },
              { key: "hand", name: "الْيَدُ", audioText: "الْيَدُ", meaning: "hand" },
              { key: "foot", name: "الرِّجْلُ", audioText: "الرِّجْلُ", meaning: "foot" },
            ],
          },
        },
      ],
    },
    // ضَمَائِرُ الْمُتَكَلِّمِ
    {
      themeSlug: "arabic",
      slug: "pronouns-mutakallim",
      title: "ضَمَائِرُ الْمُتَكَلِّمِ",
      description: "First-person pronouns in Arabic.",
      icon: "👤",
      level: "basic",
      order: 35,
      sections: [
        {
          type: "pronoun_cards",
          content: {
            title: "تَعَرَّفْ عَلَى الضَّمَائِرِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ ضَمِيرٍ لِتَسْمَعَ اسْمَهُ",
            pronouns: [
              { pronoun: "أَنَا", audioText: "أَنَا", meaning: "I", emoji: "🙋" },
              { pronoun: "نَحْنُ", audioText: "نَحْنُ", meaning: "We", emoji: "👥" },
            ],
          },
        },
        {
          type: "pronoun_object",
          content: {
            title: "الضَّمَائِرُ الْمَفْعُولِيَّةُ",
            instructions: "لَاحِظْ كَيْفَ يَتَحَوَّلُ الضَّمِيرُ إِلَى صِيغَةِ الْمَفْعُولِ",
            pairs: [
              { subject: "أَنَا", object: "إِيَّايَ", subjectAudio: "أَنَا", objectAudio: "إِيَّايَ", meaning: "me" },
              { subject: "نَحْنُ", object: "إِيَّانَا", subjectAudio: "نَحْنُ", objectAudio: "إِيَّانَا", meaning: "us" },
            ],
          },
        },
        {
          type: "pronoun_sentences",
          content: {
            title: "الضَّمَائِرُ فِي الْجُمَلِ",
            instructions: "اِضْغَطْ عَلَى الْجُمْلَةِ لِتَسْمَعَهَا",
            sentences: [
              { sentence: "أَنَا أَكْتُبُ", pronoun: "أَنَا", translation: "I am writing", audioText: "أَنَا أَكْتُبُ", emoji: "✍️" },
              { sentence: "نَحْنُ نَلْعَبُ", pronoun: "نَحْنُ", translation: "We are playing", audioText: "نَحْنُ نَلْعَبُ", emoji: "⚽" },
              { sentence: "أَنَا أَقْرَأُ", pronoun: "أَنَا", translation: "I am reading", audioText: "أَنَا أَقْرَأُ", emoji: "📖" },
              { sentence: "نَحْنُ نَأْكُلُ", pronoun: "نَحْنُ", translation: "We are eating", audioText: "نَحْنُ نَأْكُلُ", emoji: "🍽️" },
            ],
          },
        },
        {
          type: "pronoun_quiz",
          content: {
            title: "لُعْبَةُ الضَّمَائِرِ",
            instructions: "اِخْتَرِ الضَّمِيرَ الْمُنَاسِبَ",
            questions: [
              { prompt: "____ أَلْعَبُ", answer: "أَنَا", options: ["أَنَا", "نَحْنُ", "هُوَ"], translation: "__ play" },
              { prompt: "____ نَدْرُسُ", answer: "نَحْنُ", options: ["أَنَا", "نَحْنُ", "هِيَ"], translation: "__ study" },
              { prompt: "____ أَكْتُبُ", answer: "أَنَا", options: ["أَنَا", "أَنْتَ", "نَحْنُ"], translation: "__ write" },
            ],
          },
        },
      ],
    },
    // ضَمَائِرُ الْمُخَاطَبِ
    {
      themeSlug: "arabic",
      slug: "pronouns-mukhatab",
      title: "ضَمَائِرُ الْمُخَاطَبِ",
      description: "Second-person pronouns in Arabic.",
      icon: "🗣️",
      level: "basic",
      order: 36,
      sections: [
        {
          type: "pronoun_cards",
          content: {
            title: "تَعَرَّفْ عَلَى الضَّمَائِرِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ ضَمِيرٍ لِتَسْمَعَ اسْمَهُ",
            pronouns: [
              { pronoun: "أَنْتَ", audioText: "أَنْتَ", meaning: "You (m.)", emoji: "👦" },
              { pronoun: "أَنْتِ", audioText: "أَنْتِ", meaning: "You (f.)", emoji: "👧" },
              { pronoun: "أَنْتُمَا", audioText: "أَنْتُمَا", meaning: "You two", emoji: "👬" },
              { pronoun: "أَنْتُمْ", audioText: "أَنْتُمْ", meaning: "You (m. pl.)", emoji: "👨‍👦‍👦" },
              { pronoun: "أَنْتُنَّ", audioText: "أَنْتُنَّ", meaning: "You (f. pl.)", emoji: "👩‍👧‍👧" },
            ],
          },
        },
        {
          type: "pronoun_object",
          content: {
            title: "الضَّمَائِرُ الْمَفْعُولِيَّةُ",
            instructions: "لَاحِظْ كَيْفَ يَتَحَوَّلُ الضَّمِيرُ إِلَى صِيغَةِ الْمَفْعُولِ",
            pairs: [
              { subject: "أَنْتَ", object: "إِيَّاكَ", subjectAudio: "أَنْتَ", objectAudio: "إِيَّاكَ", meaning: "you (m.)" },
              { subject: "أَنْتِ", object: "إِيَّاكِ", subjectAudio: "أَنْتِ", objectAudio: "إِيَّاكِ", meaning: "you (f.)" },
              { subject: "أَنْتُمَا", object: "إِيَّاكُمَا", subjectAudio: "أَنْتُمَا", objectAudio: "إِيَّاكُمَا", meaning: "you two" },
              { subject: "أَنْتُمْ", object: "إِيَّاكُمْ", subjectAudio: "أَنْتُمْ", objectAudio: "إِيَّاكُمْ", meaning: "you (m. pl.)" },
              { subject: "أَنْتُنَّ", object: "إِيَّاكُنَّ", subjectAudio: "أَنْتُنَّ", objectAudio: "إِيَّاكُنَّ", meaning: "you (f. pl.)" },
            ],
          },
        },
        {
          type: "pronoun_sentences",
          content: {
            title: "الضَّمَائِرُ فِي الْجُمَلِ",
            instructions: "اِضْغَطْ عَلَى الْجُمْلَةِ لِتَسْمَعَهَا",
            sentences: [
              { sentence: "أَنْتَ تَدْرُسُ", pronoun: "أَنْتَ", translation: "You (m.) study", audioText: "أَنْتَ تَدْرُسُ", emoji: "📚" },
              { sentence: "أَنْتِ تَكْتُبِينَ", pronoun: "أَنْتِ", translation: "You (f.) write", audioText: "أَنْتِ تَكْتُبِينَ", emoji: "✏️" },
              { sentence: "أَنْتُمْ تَلْعَبُونَ", pronoun: "أَنْتُمْ", translation: "You (m. pl.) play", audioText: "أَنْتُمْ تَلْعَبُونَ", emoji: "⚽" },
            ],
          },
        },
        {
          type: "pronoun_quiz",
          content: {
            title: "لُعْبَةُ الضَّمَائِرِ",
            instructions: "اِخْتَرِ الضَّمِيرَ الْمُنَاسِبَ",
            questions: [
              { prompt: "____ تَدْرُسُ", answer: "أَنْتَ", options: ["أَنَا", "أَنْتَ", "هُوَ"], translation: "__ study (m.)" },
              { prompt: "____ تَكْتُبِينَ", answer: "أَنْتِ", options: ["أَنْتِ", "أَنْتَ", "هِيَ"], translation: "__ write (f.)" },
              { prompt: "____ تَلْعَبُونَ", answer: "أَنْتُمْ", options: ["نَحْنُ", "أَنْتُمْ", "هُمْ"], translation: "__ play (m. pl.)" },
            ],
          },
        },
      ],
    },
    // ضَمَائِرُ الْغَائِبِ
    {
      themeSlug: "arabic",
      slug: "pronouns-ghaib",
      title: "ضَمَائِرُ الْغَائِبِ",
      description: "Third-person pronouns in Arabic.",
      icon: "👀",
      level: "basic",
      order: 37,
      sections: [
        {
          type: "pronoun_cards",
          content: {
            title: "تَعَرَّفْ عَلَى الضَّمَائِرِ",
            instructions: "مَرِّرْ أَوِ اضْغَطْ عَلَى كُلِّ ضَمِيرٍ لِتَسْمَعَ اسْمَهُ",
            pronouns: [
              { pronoun: "هُوَ", audioText: "هُوَ", meaning: "He", emoji: "👨" },
              { pronoun: "هِيَ", audioText: "هِيَ", meaning: "She", emoji: "👩" },
              { pronoun: "هُمَا", audioText: "هُمَا", meaning: "They two", emoji: "👥" },
              { pronoun: "هُمْ", audioText: "هُمْ", meaning: "They (m.)", emoji: "👨‍👨‍👦" },
              { pronoun: "هُنَّ", audioText: "هُنَّ", meaning: "They (f.)", emoji: "👩‍👩‍👧" },
            ],
          },
        },
        {
          type: "pronoun_object",
          content: {
            title: "الضَّمَائِرُ الْمَفْعُولِيَّةُ",
            instructions: "لَاحِظْ كَيْفَ يَتَحَوَّلُ الضَّمِيرُ إِلَى صِيغَةِ الْمَفْعُولِ",
            pairs: [
              { subject: "هُوَ", object: "إِيَّاهُ", subjectAudio: "هُوَ", objectAudio: "إِيَّاهُ", meaning: "him" },
              { subject: "هِيَ", object: "إِيَّاهَا", subjectAudio: "هِيَ", objectAudio: "إِيَّاهَا", meaning: "her" },
              { subject: "هُمَا", object: "إِيَّاهُمَا", subjectAudio: "هُمَا", objectAudio: "إِيَّاهُمَا", meaning: "them two" },
              { subject: "هُمْ", object: "إِيَّاهُمْ", subjectAudio: "هُمْ", objectAudio: "إِيَّاهُمْ", meaning: "them (m.)" },
              { subject: "هُنَّ", object: "إِيَّاهُنَّ", subjectAudio: "هُنَّ", objectAudio: "إِيَّاهُنَّ", meaning: "them (f.)" },
            ],
          },
        },
        {
          type: "pronoun_sentences",
          content: {
            title: "الضَّمَائِرُ فِي الْجُمَلِ",
            instructions: "اِضْغَطْ عَلَى الْجُمْلَةِ لِتَسْمَعَهَا",
            sentences: [
              { sentence: "هُوَ يَأْكُلُ", pronoun: "هُوَ", translation: "He eats", audioText: "هُوَ يَأْكُلُ", emoji: "🍎" },
              { sentence: "هِيَ تَقْرَأُ", pronoun: "هِيَ", translation: "She reads", audioText: "هِيَ تَقْرَأُ", emoji: "📖" },
              { sentence: "هُمْ يَلْعَبُونَ", pronoun: "هُمْ", translation: "They (m.) play", audioText: "هُمْ يَلْعَبُونَ", emoji: "⚽" },
              { sentence: "هُنَّ يَضْحَكْنَ", pronoun: "هُنَّ", translation: "They (f.) laugh", audioText: "هُنَّ يَضْحَكْنَ", emoji: "😄" },
            ],
          },
        },
        {
          type: "pronoun_quiz",
          content: {
            title: "لُعْبَةُ الضَّمَائِرِ",
            instructions: "اِخْتَرِ الضَّمِيرَ الْمُنَاسِبَ",
            questions: [
              { prompt: "____ يَأْكُلُ", answer: "هُوَ", options: ["هُوَ", "هِيَ", "أَنَا"], translation: "__ eats (m.)" },
              { prompt: "____ تَقْرَأُ", answer: "هِيَ", options: ["هُوَ", "هِيَ", "أَنْتِ"], translation: "__ reads (f.)" },
              { prompt: "____ يَلْعَبُونَ", answer: "هُمْ", options: ["نَحْنُ", "هُمْ", "أَنْتُمْ"], translation: "__ play (m. pl.)" },
            ],
          },
        },
      ],
    },

    // -------- Other themes (minimal sample content) --------
    {
      themeSlug: "islamic",
      slug: "five-pillars",
      title: "The Five Pillars",
      icon: "🕌",
      level: "basic",
      order: 1,
      sections: [
        {
          type: "text",
          content: {
            title: "The Five Pillars",
            body: "Islam stands on five beautiful pillars: Shahada, Salah, Zakat, Sawm, and Hajj.",
          },
        },
      ],
    },
    {
      themeSlug: "quran",
      slug: "surah-al-fatiha",
      title: "Surah Al-Fatiha",
      icon: "📖",
      level: "basic",
      order: 1,
      sections: [
        {
          type: "text",
          content: {
            title: "Al-Fatiha",
            body: "Al-Fatiha is the opening of the Quran. We recite it in every prayer.",
          },
        },
      ],
    },
    {
      themeSlug: "others",
      slug: "arabic-songs",
      title: "Arabic Songs",
      icon: "🎵",
      level: "basic",
      order: 1,
      sections: [
        {
          type: "text",
          content: {
            title: "Sing along",
            body: "Learning Arabic through songs is fun and easy!",
          },
        },
      ],
    },
  ];

  const themeIdBySlug = new Map<string, string>();
  for (const slug of themeSeeds.map((t) => t.name)) {
    const t = await prisma.theme.findUnique({ where: { name: slug }, select: { id: true } });
    if (t) themeIdBySlug.set(slug, t.id);
  }

  // Cascading delete wipes both ThemeLesson rows and their LessonSection children.
  await prisma.themeLesson.deleteMany({
    where: { theme: { name: { in: themeSeeds.map((t) => t.name) } } },
  });

  for (const l of lessonSeeds) {
    const themeId = themeIdBySlug.get(l.themeSlug);
    if (!themeId) continue;
    await prisma.themeLesson.create({
      data: {
        slug: l.slug,
        title: l.title,
        description: l.description ?? null,
        icon: l.icon ?? null,
        level: l.level,
        order: l.order,
        isLocked: l.isLocked ?? false,
        themeId,
        sections: l.sections
          ? {
              create: l.sections.map((s, i) => ({
                type: s.type,
                content: s.content,
                order: i + 1,
              })),
            }
          : undefined,
      },
    });
  }
  console.log("  ✓ Theme lessons + sections seeded");

  // ---- Courses -------------------------------------------------------------
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course_arabic_1" },
      update: {},
      create: {
        id: "course_arabic_1",
        name: "Arabic Level 1",
        level: 1,
        program: "Arabic",
        description: "Introduction to the Arabic alphabet and basic vocabulary.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_2" },
      update: {},
      create: {
        id: "course_arabic_2",
        name: "Arabic Level 2",
        level: 2,
        program: "Arabic",
        description: "Reading sentences and expanding vocabulary.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_3" },
      update: {},
      create: {
        id: "course_arabic_3",
        name: "Arabic Level 3",
        level: 3,
        program: "Arabic",
        description: "Short stories and basic grammar.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_4" },
      update: {},
      create: {
        id: "course_arabic_4",
        name: "Arabic Level 4",
        level: 4,
        program: "Arabic",
        description: "Intermediate reading, writing, and conversation.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_1" },
      update: {},
      create: {
        id: "course_quran_1",
        name: "Quran Level 1",
        level: 1,
        program: "Quran",
        description: "Noorani Qaida and basic Tajweed rules.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_2" },
      update: {},
      create: {
        id: "course_quran_2",
        name: "Quran Level 2",
        level: 2,
        program: "Quran",
        description: "Memorisation of short surahs with correct Tajweed.",
      },
    }),
  ]);

  // ---- Admin ---------------------------------------------------------------
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@aqacademy.com" },
    update: {},
    create: {
      email: "admin@aqacademy.com",
      name: "Admin",
      passwordHash: await hash("Admin1234!"),
      role: "admin",
    },
  });
  console.log("  ✓ Admin:", adminUser.email);

  // ---- Teachers ------------------------------------------------------------
  const teacherData = [
    {
      email: "amira@aqacademy.com",
      name: "Prof. Amira",
      initials: "PA",
      colorClass: "bg-primary-100 text-primary-700",
      specialities: ["Arabic"] as const,
    },
    {
      email: "kamal@aqacademy.com",
      name: "Prof. Kamal",
      initials: "PK",
      colorClass: "bg-purple-100 text-purple-700",
      specialities: ["Arabic"] as const,
    },
    {
      email: "yusuf@aqacademy.com",
      name: "Sheikh Yusuf",
      initials: "SY",
      colorClass: "bg-amber-100 text-amber-700",
      specialities: ["Quran"] as const,
    },
    {
      email: "fatima@aqacademy.com",
      name: "Ustadha Fatima",
      initials: "UF",
      colorClass: "bg-rose-100 text-rose-700",
      specialities: ["Arabic", "Quran"] as const,
    },
  ];

  const teachers = await Promise.all(
    teacherData.map(async (td) => {
      const user = await prisma.user.upsert({
        where: { email: td.email },
        update: {},
        create: {
          email: td.email,
          name: td.name,
          passwordHash: await hash("Teacher1234!"),
          role: "teacher",
        },
      });
      const teacher = await prisma.teacher.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          initials: td.initials,
          colorClass: td.colorClass,
          specialities: [...td.specialities],
        },
      });
      console.log("  ✓ Teacher:", td.name);
      return { user, teacher };
    })
  );

  const [amira, kamal, yusuf, fatima] = teachers;

  // ---- Parent 1 + students -------------------------------------------------
  const parent1 = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo Parent",
      passwordHash: await hash("Demo1234"),
      role: "parent",
    },
  });
  console.log("  ✓ Parent 1:", parent1.email);

  const student1 = await prisma.student.upsert({
    where: { id: "stu_001" },
    update: {},
    create: {
      id: "stu_001",
      firstName: "Ahmed",
      lastName: "Benali",
      age: 8,
      arabicLevelReading: "Intermediate",
      arabicLevelWriting: "Beginner",
      arabicLevelSpeaking: "Intermediate",
      notes: "Very motivated — progressing well in reading.",
      parentId: parent1.id,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { id: "stu_002" },
    update: {},
    create: {
      id: "stu_002",
      firstName: "Sara",
      lastName: "Mansouri",
      age: 6,
      arabicLevelReading: "Beginner",
      arabicLevelWriting: "Beginner",
      notes: "",
      parentId: parent1.id,
    },
  });

  // ---- Parent 2 + students -------------------------------------------------
  const parent2 = await prisma.user.upsert({
    where: { email: "parent2@example.com" },
    update: {},
    create: {
      email: "parent2@example.com",
      name: "Karim Benali",
      passwordHash: await hash("Parent1234!"),
      role: "parent",
    },
  });
  console.log("  ✓ Parent 2:", parent2.email);

  const student3 = await prisma.student.upsert({
    where: { id: "stu_003" },
    update: {},
    create: {
      id: "stu_003",
      firstName: "Youssef",
      lastName: "Karim",
      age: 10,
      arabicLevelReading: "Advanced",
      arabicLevelWriting: "Intermediate",
      arabicLevelSpeaking: "Advanced",
      notes: "Ready to move to Quran recitation.",
      parentId: parent2.id,
    },
  });

  // ---- Enrollments ---------------------------------------------------------
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student1.id, courseId: courses[2].id } },
    update: {},
    create: { studentId: student1.id, courseId: courses[2].id },
  });
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student2.id, courseId: courses[0].id } },
    update: {},
    create: { studentId: student2.id, courseId: courses[0].id },
  });
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student3.id, courseId: courses[4].id } },
    update: {},
    create: { studentId: student3.id, courseId: courses[4].id },
  });
  console.log("  ✓ Enrollments created");

  // ---- Homework ------------------------------------------------------------
  const daysFromNow = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  const hw1 = await prisma.homework.upsert({
    where: { id: "hw_001" },
    update: {},
    create: {
      id: "hw_001",
      title: "Arabic Alphabet Writing Practice",
      description:
        "Complete the letter-tracing worksheet. Write each letter 5 times in its initial, medial, and final forms.",
      pdfUrl: "/mock-pdfs/arabic-alphabet-practice.pdf",
      dueDate: daysFromNow(2),
      courseId: courses[2].id,
      teacherId: amira.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_002" },
    update: {},
    create: {
      id: "hw_002",
      title: "Vocabulary List — Animals (Lesson 3)",
      description:
        "Study the 20 animal vocabulary words from Lesson 3. Write a sentence using each word.",
      pdfUrl: "/mock-pdfs/vocabulary-animals-lesson3.pdf",
      dueDate: daysFromNow(-1),
      courseId: courses[2].id,
      teacherId: amira.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_003" },
    update: {},
    create: {
      id: "hw_003",
      title: "Short Story Reading — المطر",
      description:
        'Read the short story "المطر" (The Rain). Answer the 5 comprehension questions on page 2.',
      pdfUrl: "/mock-pdfs/short-story-almattar.pdf",
      dueDate: daysFromNow(5),
      courseId: courses[2].id,
      teacherId: kamal.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_004" },
    update: {},
    create: {
      id: "hw_004",
      title: "Surah Al-Fatiha — Memorisation Sheet",
      description:
        "Memorise Surah Al-Fatiha with correct Tajweed. Record a voice note or video.",
      pdfUrl: "/mock-pdfs/surah-fatiha-memorisation.pdf",
      dueDate: daysFromNow(4),
      courseId: courses[4].id,
      teacherId: yusuf.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_005" },
    update: {},
    create: {
      id: "hw_005",
      title: "Tajweed Rules — Idgham Worksheet",
      description:
        "Complete the Idgham exercises on pages 3–5. Underline every occurrence of Idgham.",
      pdfUrl: "/mock-pdfs/tajweed-idgham.pdf",
      dueDate: daysFromNow(-3),
      courseId: courses[4].id,
      teacherId: yusuf.teacher.id,
    },
  });

  // Pre-create a submission for hw_002 (student1 already submitted)
  await prisma.submission.upsert({
    where: { homeworkId_studentId: { homeworkId: "hw_002", studentId: student1.id } },
    update: {},
    create: {
      homeworkId: "hw_002",
      studentId: student1.id,
      fileName: "ahmed_vocab_animals.pdf",
      fileSize: 1_240_000,
      fileType: "application/pdf",
      comment: "Ahmed worked hard on this!",
      status: "submitted",
    },
  });

  console.log("  ✓ Homework + submissions created");

  // ---- Community Posts -----------------------------------------------------
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000);
  const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

  await prisma.post.upsert({
    where: { id: "post_001" },
    update: {},
    create: {
      id: "post_001",
      contentType: "text",
      text: "Welcome to the AQ Academy community!\n\nThis is your space to stay connected with what's happening in class, see your children's progress, and ask questions.",
      tags: ["Announcement", "Welcome"],
      createdAt: daysAgo(5),
      teacherId: amira.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_002" },
    update: {},
    create: {
      id: "post_002",
      contentType: "video",
      text: "New lesson on Tajweed rules!\n\nIn this video, I cover the rules of Idgham with Ghunnah. Practice with your child for 10 minutes each day.",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["Quran", "Tajweed", "Level 2"],
      createdAt: daysAgo(3),
      teacherId: yusuf.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_003" },
    update: {},
    create: {
      id: "post_003",
      contentType: "image",
      text: "Look at the beautiful Arabic calligraphy our Level 3 students produced this week!\n\nThey practised the letter ع in its four forms. So proud of their progress!",
      mediaUrl: "/mock-images/calligraphy-class.jpg",
      tags: ["Arabic Level 3", "Calligraphy", "Student Work"],
      createdAt: daysAgo(2),
      teacherId: amira.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_004" },
    update: {},
    create: {
      id: "post_004",
      contentType: "pdf",
      text: "Practice sheet for this week — Arabic Vocabulary (Lesson 5)\n\nComplete pages 1 and 2 before Thursday's class.",
      fileName: "vocabulary-lesson-5-practice.pdf",
      fileUrl: "/mock-pdfs/vocabulary-lesson-5-practice.pdf",
      tags: ["Arabic Level 2", "Vocabulary", "Exercise"],
      createdAt: daysAgo(1),
      teacherId: kamal.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_005" },
    update: {},
    create: {
      id: "post_005",
      contentType: "text",
      text: "Weekly tip: The best way to help your child remember new Arabic words is to label objects around the house!\n\nPrint small labels in Arabic and stick them on furniture and everyday objects.",
      tags: ["Tips for Parents", "Arabic", "Vocabulary"],
      createdAt: hoursAgo(6),
      teacherId: fatima.teacher.id,
    },
  });

  // Seed some comments
  await prisma.comment.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "c_001",
        postId: "post_001",
        authorId: parent1.id,
        text: "Thank you Prof. Amira! We're really excited to start.",
        createdAt: daysAgo(5),
      },
      {
        id: "c_002",
        postId: "post_002",
        authorId: parent2.id,
        text: "Jazakallah khayran Sheikh! Sara watched it twice already.",
        createdAt: daysAgo(3),
      },
      {
        id: "c_003",
        postId: "post_003",
        authorId: parent1.id,
        text: "This is amazing work! My daughter is so proud of herself.",
        createdAt: daysAgo(2),
      },
    ],
  });

  console.log("  ✓ Community posts + comments created");

  // ---- Subscription for demo parent ----------------------------------------
  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setDate(renewalDate.getDate() + 12);
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 2);

  const sub = await prisma.subscription.upsert({
    where: { userId: parent1.id },
    update: {},
    create: {
      userId: parent1.id,
      planId: "starter",
      status: "active",
      startDate,
      renewalDate,
    },
  });

  await prisma.invoice.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "INV-2026-001",
        subscriptionId: sub.id,
        userId: parent1.id,
        amount: 129,
        currency: "€",
        plan: "Individual Monthly",
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      },
      {
        id: "INV-2026-002",
        subscriptionId: sub.id,
        userId: parent1.id,
        amount: 129,
        currency: "€",
        plan: "Individual Monthly",
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      },
      {
        id: "INV-2026-003",
        subscriptionId: sub.id,
        userId: parent1.id,
        amount: 129,
        currency: "€",
        plan: "Individual Monthly",
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    ],
  });

  console.log("  ✓ Subscription + invoices created");
  console.log("\n✅ Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  Parent:  demo@example.com / Demo1234");
  console.log("  Teacher: amira@aqacademy.com / Teacher1234!");
  console.log("  Admin:   admin@aqacademy.com / Admin1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
