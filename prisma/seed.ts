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
import { audioUrlFor } from "../lib/audio";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function hash(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Themes --------------------------------------------------------------
  // URL slug lives in `name`; `title` is the display label.
  const themeArabic = await prisma.theme.upsert({
    where: { name: "arabic" },
    update: {},
    create: {
      name: "arabic",
      title: "Arabic",
      description:
        "Language learning — reading, writing, and speaking Modern Standard Arabic.",
      sortOrder: 1,
    },
  });
  const themeQuran = await prisma.theme.upsert({
    where: { name: "quran" },
    update: {},
    create: {
      name: "quran",
      title: "Quran",
      description: "Recitation (Tajwid) and structured memorization (Hifz) programs.",
      sortOrder: 2,
    },
  });
  const themeIslam = await prisma.theme.upsert({
    where: { name: "islam" },
    update: {},
    create: {
      name: "islam",
      title: "Islam",
      description: "General Islamic knowledge — Aqidah, Fiqh, Seerah, and ethics.",
      sortOrder: 3,
    },
  });
  console.log("  ✓ Themes: arabic, quran, islam");

  // ---- Courses -------------------------------------------------------------
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course_arabic_1" },
      update: {
        title: "Arabic Level 1 — Alphabet & Sounds",
        duration: "8 weeks",
        levelLabel: "Beginner",
        themeId: themeArabic.id,
      },
      create: {
        id: "course_arabic_1",
        name: "Arabic Level 1",
        level: 1,
        program: "Arabic",
        description: "Introduction to the Arabic alphabet and basic vocabulary.",
        title: "Arabic Level 1 — Alphabet & Sounds",
        duration: "8 weeks",
        levelLabel: "Beginner",
        themeId: themeArabic.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_2" },
      update: {
        title: "Arabic Level 2 — Reading Fluency",
        duration: "10 weeks",
        levelLabel: "Beginner",
        themeId: themeArabic.id,
      },
      create: {
        id: "course_arabic_2",
        name: "Arabic Level 2",
        level: 2,
        program: "Arabic",
        description: "Reading sentences and expanding vocabulary.",
        title: "Arabic Level 2 — Reading Fluency",
        duration: "10 weeks",
        levelLabel: "Beginner",
        themeId: themeArabic.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_3" },
      update: {
        title: "Arabic Level 3 — Grammar Foundations",
        duration: "12 weeks",
        levelLabel: "Intermediate",
        themeId: themeArabic.id,
      },
      create: {
        id: "course_arabic_3",
        name: "Arabic Level 3",
        level: 3,
        program: "Arabic",
        description: "Short stories and basic grammar.",
        title: "Arabic Level 3 — Grammar Foundations",
        duration: "12 weeks",
        levelLabel: "Intermediate",
        themeId: themeArabic.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_4" },
      update: {
        title: "Arabic Level 4 — Conversation",
        duration: "10 weeks",
        levelLabel: "Intermediate",
        themeId: themeArabic.id,
      },
      create: {
        id: "course_arabic_4",
        name: "Arabic Level 4",
        level: 4,
        program: "Arabic",
        description: "Intermediate reading, writing, and conversation.",
        title: "Arabic Level 4 — Conversation",
        duration: "10 weeks",
        levelLabel: "Intermediate",
        themeId: themeArabic.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_1" },
      update: {
        title: "Tajwid Basics",
        duration: "8 weeks",
        levelLabel: "Beginner",
        themeId: themeQuran.id,
      },
      create: {
        id: "course_quran_1",
        name: "Quran Level 1",
        level: 1,
        program: "Quran",
        description: "Noorani Qaida and basic Tajweed rules.",
        title: "Tajwid Basics",
        duration: "8 weeks",
        levelLabel: "Beginner",
        themeId: themeQuran.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_2" },
      update: {
        title: "Hifz — Juz Amma",
        duration: "16 weeks",
        levelLabel: "Intermediate",
        themeId: themeQuran.id,
      },
      create: {
        id: "course_quran_2",
        name: "Quran Level 2",
        level: 2,
        program: "Quran",
        description: "Memorisation of short surahs with correct Tajweed.",
        title: "Hifz — Juz Amma",
        duration: "16 weeks",
        levelLabel: "Intermediate",
        themeId: themeQuran.id,
      },
    }),
    // ---- Islam theme courses (catalogue-only; program kept as Arabic
    //      because the existing Program enum has no Islam member — these
    //      rows are not used by Homework/Schedule, only by the themed
    //      catalogue page, so `program` is a legacy placeholder here.)
    prisma.course.upsert({
      where: { id: "course_islam_1" },
      update: {
        title: "Pillars of Islam",
        duration: "6 weeks",
        levelLabel: "Beginner",
        themeId: themeIslam.id,
        description: "An accessible introduction to the five pillars and core beliefs.",
      },
      create: {
        id: "course_islam_1",
        name: "Pillars of Islam",
        level: 1,
        program: "Arabic",
        description: "An accessible introduction to the five pillars and core beliefs.",
        title: "Pillars of Islam",
        duration: "6 weeks",
        levelLabel: "Beginner",
        themeId: themeIslam.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_islam_2" },
      update: {
        title: "Seerah — Life of the Prophet ﷺ",
        duration: "10 weeks",
        levelLabel: "Intermediate",
        themeId: themeIslam.id,
        description: "A chronological study of the Prophet's biography.",
      },
      create: {
        id: "course_islam_2",
        name: "Seerah",
        level: 2,
        program: "Arabic",
        description: "A chronological study of the Prophet's biography.",
        title: "Seerah — Life of the Prophet ﷺ",
        duration: "10 weeks",
        levelLabel: "Intermediate",
        themeId: themeIslam.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_islam_3" },
      update: {
        title: "Fiqh of Worship",
        duration: "10 weeks",
        levelLabel: "Intermediate",
        themeId: themeIslam.id,
        description: "Practical jurisprudence of purification, prayer, and fasting.",
      },
      create: {
        id: "course_islam_3",
        name: "Fiqh of Worship",
        level: 2,
        program: "Arabic",
        description: "Practical jurisprudence of purification, prayer, and fasting.",
        title: "Fiqh of Worship",
        duration: "10 weeks",
        levelLabel: "Intermediate",
        themeId: themeIslam.id,
      },
    }),
  ]);

  // ---- Level slugs (used as URL segments: /courses/<theme>/<slug>) -------
  const courseSlugs: Record<string, string> = {
    course_arabic_1: "level-1",
    course_arabic_2: "level-2",
    course_arabic_3: "level-3",
    course_arabic_4: "level-4",
    course_quran_1: "level-1",
    course_quran_2: "level-2",
    course_islam_1: "level-1",
    course_islam_2: "level-2",
    course_islam_3: "level-3",
  };
  for (const [id, slug] of Object.entries(courseSlugs)) {
    await prisma.course.update({ where: { id }, data: { slug } });
  }
  console.log("  ✓ Level slugs assigned");

  // ---- Arabic Level 1 — interactive lessons (page = lesson) ---------------
  // Each entry mirrors one page of the source primer (Tome 1, ages 3–5).
  // Content is authored internally — the PDF is NEVER fetched at runtime.
  type LessonSeed = {
    id: string;
    orderIndex: number;
    title: string;
    description: string;
    steps: object[];
  };

  // Bilingual consigne shared by the four `cours` pages.
  const consigneFr = "Écoute et répète";
  const consigneAr = "اِسْتَمِعْ وَكَرِّرْ";
  const consigneAudioUrl = audioUrlFor(consigneAr);

  const arabicLevel1Lessons: LessonSeed[] = [
    // ---------- Page 1 — Les Nombres (1 à 5) ----------
    {
      id: "lesson_arabic_1_p1",
      orderIndex: 1,
      title: "Page 1 — Les Nombres (1 à 5)",
      description: "Écoute et répète les nombres de 1 à 5 en arabe.",
      steps: [
        {
          type: "intro",
          title: "Les Nombres (1 à 5)",
          text: `${consigneFr} — ${consigneAr}`,
          audioUrl: consigneAudioUrl,
        },
        {
          type: "vocab",
          consigneFr,
          consigneAr,
          audioUrl: consigneAudioUrl,
          items: [
            { label: "1", ar: "وَاحِد",   emoji: "☝️",  audioUrl: audioUrlFor("وَاحِد") },
            { label: "2", ar: "اِثْنَان",  emoji: "✌️",  audioUrl: audioUrlFor("اِثْنَان") },
            { label: "3", ar: "ثَلَاثَة",  emoji: "🤟",  audioUrl: audioUrlFor("ثَلَاثَة") },
            { label: "4", ar: "أَرْبَعَة", emoji: "🖖",  audioUrl: audioUrlFor("أَرْبَعَة") },
            { label: "5", ar: "خَمْسَة",  emoji: "🖐️",  audioUrl: audioUrlFor("خَمْسَة") },
          ],
        },
        { type: "completion", message: "Super ! Tu connais les nombres de 1 à 5 ! 🎉" },
      ],
    },

    // ---------- Page 2 — Les Nombres (6 à 10) ----------
    {
      id: "lesson_arabic_1_p2",
      orderIndex: 2,
      title: "Page 2 — Les Nombres (6 à 10)",
      description: "Écoute et répète les nombres de 6 à 10 en arabe.",
      steps: [
        {
          type: "intro",
          title: "Les Nombres (6 à 10)",
          text: `${consigneFr} — ${consigneAr}`,
          audioUrl: consigneAudioUrl,
        },
        {
          type: "vocab",
          consigneFr,
          consigneAr,
          audioUrl: consigneAudioUrl,
          items: [
            { label: "6",  ar: "سِتَّة",     emoji: "🖐️☝️", audioUrl: audioUrlFor("سِتَّة") },
            { label: "7",  ar: "سَبْعَة",    emoji: "🖐️✌️", audioUrl: audioUrlFor("سَبْعَة") },
            { label: "8",  ar: "ثَمَانِيَة", emoji: "🖐️🤟", audioUrl: audioUrlFor("ثَمَانِيَة") },
            { label: "9",  ar: "تِسْعَة",    emoji: "🖐️🖖", audioUrl: audioUrlFor("تِسْعَة") },
            { label: "10", ar: "عَشَرَة",    emoji: "🖐️🖐️", audioUrl: audioUrlFor("عَشَرَة") },
          ],
        },
        { type: "completion", message: "Bravo ! Tu comptes jusqu'à 10 ! 🎉" },
      ],
    },

    // ---------- Page 3 — Les Couleurs ----------
    {
      id: "lesson_arabic_1_p3",
      orderIndex: 3,
      title: "Page 3 — Les Couleurs",
      description: "Écoute et répète les couleurs en arabe.",
      steps: [
        {
          type: "intro",
          title: "Les Couleurs",
          text: `${consigneFr} — ${consigneAr}`,
          audioUrl: consigneAudioUrl,
        },
        {
          type: "vocab",
          consigneFr,
          consigneAr,
          audioUrl: consigneAudioUrl,
          items: [
            { fr: "Rouge",  ar: "أَحْمَر",      emoji: "🟥", audioUrl: audioUrlFor("أَحْمَر") },
            { fr: "Jaune",  ar: "أَصْفَر",      emoji: "🟨", audioUrl: audioUrlFor("أَصْفَر") },
            { fr: "Bleu",   ar: "أَزْرَق",      emoji: "🟦", audioUrl: audioUrlFor("أَزْرَق") },
            { fr: "Vert",   ar: "أَخْضَر",      emoji: "🟩", audioUrl: audioUrlFor("أَخْضَر") },
            { fr: "Rose",   ar: "وَرْدِيّ",      emoji: "🌸", audioUrl: audioUrlFor("وَرْدِيّ") },
            { fr: "Violet", ar: "بَنَفْسَجِيّ",  emoji: "🟣", audioUrl: audioUrlFor("بَنَفْسَجِيّ") },
            { fr: "Orange", ar: "بُرْتُقَالِيّ",  emoji: "🟧", audioUrl: audioUrlFor("بُرْتُقَالِيّ") },
            { fr: "Marron", ar: "بُنِّيّ",       emoji: "🟫", audioUrl: audioUrlFor("بُنِّيّ") },
            { fr: "Noir",   ar: "أَسْوَد",      emoji: "⬛", audioUrl: audioUrlFor("أَسْوَد") },
            { fr: "Blanc",  ar: "أَبْيَض",      emoji: "⬜", audioUrl: audioUrlFor("أَبْيَض") },
          ],
        },
        { type: "completion", message: "Bravo ! Tu connais 10 couleurs ! 🌈" },
      ],
    },

    // ---------- Page 4 — Les Formes ----------
    {
      id: "lesson_arabic_1_p4",
      orderIndex: 4,
      title: "Page 4 — Les Formes",
      description: "Écoute et répète les formes géométriques en arabe.",
      steps: [
        {
          type: "intro",
          title: "Les Formes",
          text: `${consigneFr} — ${consigneAr}`,
          audioUrl: consigneAudioUrl,
        },
        {
          type: "vocab",
          consigneFr,
          consigneAr,
          audioUrl: consigneAudioUrl,
          items: [
            { fr: "Triangle",  ar: "مُثَلَّث",   emoji: "🔺", audioUrl: audioUrlFor("مُثَلَّث") },
            { fr: "Carré",     ar: "مُرَبَّع",   emoji: "⬛", audioUrl: audioUrlFor("مُرَبَّع") },
            { fr: "Cercle",    ar: "دَائِرَة",  emoji: "🔴", audioUrl: audioUrlFor("دَائِرَة") },
            { fr: "Rectangle", ar: "مُسْتَطِيل", emoji: "▭",  audioUrl: audioUrlFor("مُسْتَطِيل") },
          ],
        },
        { type: "completion", message: "Super ! Tu connais les 4 formes ! ⭐" },
      ],
    },

    // ---------- Page 5 — Matching (relie chaque carré à son jumeau) ----------
    // PDF: 4 pairs shown on page 5 → vert, noir, rouge, bleu
    {
      id: "lesson_arabic_1_p5",
      orderIndex: 5,
      title: "Page 5 — Relie les carrés de même couleur",
      description:
        "Relie chaque carré avec celui qui a la même couleur — et nomme-la !",
      steps: [
        {
          type: "intro",
          title: "Relie les couleurs",
          text:
            "Je relie chaque carré avec celui qui a la même couleur et je la nomme. أربطُ كُلَّ مُرَبَّعٍ بالْمُرَبَّعِ الَّذِي لَهُ نَفْسُ اللَّوْنِ وَأُسَمِّيهِ",
          audioUrl: audioUrlFor(
            "أربطُ كُلَّ مُرَبَّعٍ بالْمُرَبَّعِ الَّذِي لَهُ نَفْسُ اللَّوْنِ وَأُسَمِّيهِ"
          ),
        },
        {
          type: "exercise",
          exerciseType: "match",
          id: "p5_match",
          question:
            "Relie chaque carré à celui de la même couleur — أَرْبِطْ كُلَّ مُرَبَّعٍ بِالْمُرَبَّعِ الَّذِي لَهُ نَفْسُ اللَّوْنِ",
          // Four colours exactly as shown on PDF page 5.
          pairs: [
            { letter: "🟩", word: "🟩" }, // vert
            { letter: "⬛", word: "⬛" }, // noir
            { letter: "🟥", word: "🟥" }, // rouge
            { letter: "🟦", word: "🟦" }, // bleu
          ],
          points: 25,
        },
        { type: "completion", message: "Toutes les couleurs sont reliées ! 🌈" },
      ],
    },

    // ---------- Page 6 — Tracing (repasser sur des carrés) ----------
    {
      id: "lesson_arabic_1_p6",
      orderIndex: 6,
      title: "Page 6 — Trace les carrés",
      description: "Repasse sur les pointillés pour tracer des carrés.",
      steps: [
        {
          type: "intro",
          title: "Trace les carrés",
          text: "Je relie en repassant sur les pointillés pour dessiner des carrés. أربط لأرسُمَ مُرَبَّعَاتٍ كَبِيرَة",
          audioUrl: audioUrlFor("أربط لأرسُمَ مُرَبَّعَاتٍ كَبِيرَة"),
        },
        {
          type: "exercise",
          exerciseType: "drawing",
          id: "p6_trace",
          instruction:
            "Repasse sur le carré avec ton doigt — أَرْبِطْ لِأَرْسُمَ مُرَبَّعَاتٍ كَبِيرَة",
          letter: "⬛",
          guide: "Suis le contour estompé du carré.",
          points: 25,
        },
        { type: "completion", message: "Superbe carré ! ✍️" },
      ],
    },

    // ---------- Page 7 — Selection cible (entoure les voitures rouges) ----------
    // PDF page 7 shows 6 cars — 3 red and 3 non-red.
    {
      id: "lesson_arabic_1_p7",
      orderIndex: 7,
      title: "Page 7 — Trouve les voitures rouges",
      description:
        "Sélectionne toutes les voitures rouges — et seulement celles-là.",
      steps: [
        {
          type: "intro",
          title: "Les voitures rouges",
          text:
            "J'entoure les voitures rouges. أَضَعُ السَّيَّارَاتِ الْحَمْرَاءَ فِي دَائِرَة",
          audioUrl: audioUrlFor("أَضَعُ السَّيَّارَاتِ الْحَمْرَاءَ فِي دَائِرَة"),
        },
        {
          type: "exercise",
          exerciseType: "multi_select",
          id: "p7_cars",
          question:
            "Clique sur toutes les voitures rouges — أَضَعُ السَّيَّارَاتِ الْحَمْرَاءَ فِي دَائِرَة",
          // 6 cars — 3 red (target) + 3 non-red distractors, matching PDF.
          options: [
            { id: "car_r1", label: "rouge", emoji: "🚗",  isTarget: true  },
            { id: "car_r2", label: "rouge", emoji: "🏎️",  isTarget: true  },
            { id: "car_b",  label: "bleue", emoji: "🚙",  isTarget: false },
            { id: "car_y",  label: "jaune", emoji: "🚕",  isTarget: false },
            { id: "car_r3", label: "rouge", emoji: "🚘",  isTarget: true  },
            { id: "car_w",  label: "blanche", emoji: "🚐", isTarget: false },
          ],
          points: 30,
        },
        { type: "completion", message: "Bravo, 3 voitures rouges trouvées ! 🏎️" },
      ],
    },

    // ---------- Page 8 — Coloriage : vraie palette + formes à remplir ----
    // PDF page 8: 3 sub-instructions, each "Je colorie le carré en [X]".
    // The learner picks a color from the palette and taps the square(s)
    // among 4 outline shapes. Distractors mirror the PDF: crescent,
    // triangle, circle, etc.
    {
      id: "lesson_arabic_1_p8",
      orderIndex: 8,
      title: "Page 8 — Colorie les carrés",
      description:
        "Choisis une couleur dans la palette et colorie LE carré. Attention aux intrus !",
      steps: [
        {
          type: "intro",
          title: "Colorie les carrés",
          text:
            "Choisis une couleur dans la palette, puis clique sur LE carré pour le colorier. Fais bien attention à la couleur demandée !",
        },
        // Step 1 — Je colorie le carré en ROUGE
        {
          type: "exercise",
          exerciseType: "colorize",
          id: "p8_red",
          instruction:
            "Je colorie le carré en rouge — أُلَوِّنُ الْمُرَبَّعَ بِالْأَحْمَرِ",
          palette: ["rouge", "vert", "bleu", "jaune", "noir"],
          targetColor: "rouge",
          shapes: [
            { id: "s1a", kind: "crescent", isTarget: false },
            { id: "s1b", kind: "triangle", isTarget: false },
            { id: "s1c", kind: "circle",   isTarget: false },
            { id: "s1d", kind: "square",   isTarget: true  },
          ],
          points: 20,
        },
        // Step 2 — Je colorie les carrés en VERT (2 squares)
        {
          type: "exercise",
          exerciseType: "colorize",
          id: "p8_green",
          instruction:
            "Je colorie les carrés en vert — أُلَوِّنُ الْمُرَبَّعَ بِالْأَخْضَرِ",
          palette: ["vert", "rouge", "bleu", "jaune", "noir"],
          targetColor: "vert",
          shapes: [
            { id: "s2a", kind: "triangle", isTarget: false },
            { id: "s2b", kind: "square",   isTarget: true  },
            { id: "s2c", kind: "square",   isTarget: true  },
            { id: "s2d", kind: "circle",   isTarget: false },
          ],
          points: 25,
        },
        // Step 3 — Je colorie le carré en BLEU
        {
          type: "exercise",
          exerciseType: "colorize",
          id: "p8_blue",
          instruction:
            "Je colorie le carré en bleu — أُلَوِّنُ الْمُرَبَّعَ بِالْأَزْرَقِ",
          palette: ["bleu", "rouge", "vert", "jaune", "noir"],
          targetColor: "bleu",
          shapes: [
            { id: "s3a", kind: "circle",   isTarget: false },
            { id: "s3b", kind: "crescent", isTarget: false },
            { id: "s3c", kind: "square",   isTarget: true  },
            { id: "s3d", kind: "triangle", isTarget: false },
          ],
          points: 20,
        },
        { type: "completion", message: "Bravo, 3 carrés coloriés — 🟥 🟩 🟦 ! 🎨" },
      ],
    },

    // ---------- Page 9 — Colle des autocollants dans chaque carré ----------
    // PDF page 9: mixed grid of shapes (triangles, circles, squares).
    // The learner places a sticker "inside every square" — so the
    // interactive task is: pick every square and ignore the rest.
    {
      id: "lesson_arabic_1_p9",
      orderIndex: 9,
      title: "Page 9 — Colle un autocollant sur chaque carré",
      description:
        "Parmi toutes les formes, clique sur chaque carré pour y coller un autocollant ⭐.",
      steps: [
        {
          type: "intro",
          title: "Les autocollants",
          text:
            "Je colle des autocollants dans chaque carré. أَلْصِقُ مُلْصَقَاتٍ دَاخِلَ كُلِّ مُرَبَّعٍ",
          audioUrl: audioUrlFor("أَلْصِقُ مُلْصَقَاتٍ دَاخِلَ كُلِّ مُرَبَّعٍ"),
        },
        {
          type: "exercise",
          exerciseType: "multi_select",
          id: "p9_stickers",
          question:
            "Clique sur tous les carrés pour y coller un autocollant — أَلْصِقُ مُلْصَقَاتٍ دَاخِلَ كُلِّ مُرَبَّعٍ",
          // 12 shapes: 6 squares (targets) + 3 triangles + 3 circles.
          options: [
            { id: "sh1",  emoji: "🟧", isTarget: true  }, // carré orange
            { id: "sh2",  emoji: "🔺", isTarget: false }, // triangle
            { id: "sh3",  emoji: "🟦", isTarget: true  }, // carré bleu
            { id: "sh4",  emoji: "⭕", isTarget: false }, // cercle
            { id: "sh5",  emoji: "🟨", isTarget: true  }, // carré jaune
            { id: "sh6",  emoji: "🔺", isTarget: false }, // triangle
            { id: "sh7",  emoji: "🟩", isTarget: true  }, // carré vert
            { id: "sh8",  emoji: "⭕", isTarget: false }, // cercle
            { id: "sh9",  emoji: "🟥", isTarget: true  }, // carré rouge
            { id: "sh10", emoji: "🔺", isTarget: false }, // triangle
            { id: "sh11", emoji: "🟪", isTarget: true  }, // carré violet
            { id: "sh12", emoji: "⭕", isTarget: false }, // cercle
          ],
          points: 40,
        },
        {
          type: "completion",
          message: "Tous les carrés ont leur autocollant ! 🌟 Leçon terminée !",
        },
      ],
    },
  ];

  // Replace the whole Arabic Level 1 set atomically: delete any old
  // rows (from earlier 5-lesson seeds) then create the 9 new ones.
  // CASCADE on CourseLessonProgress ensures stale progress is cleared.
  await prisma.courseLesson.deleteMany({
    where: { courseId: "course_arabic_1" },
  });
  for (const lesson of arabicLevel1Lessons) {
    await prisma.courseLesson.create({
      data: {
        id: lesson.id,
        courseId: "course_arabic_1",
        orderIndex: lesson.orderIndex,
        title: lesson.title,
        description: lesson.description,
        steps: lesson.steps,
      },
    });
  }
  console.log(`  ✓ Arabic Level 1: ${arabicLevel1Lessons.length} lessons seeded`);

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
