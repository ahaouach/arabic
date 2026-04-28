/**
 * Idempotent orchestrator that seeds all 13 vocabulary lessons under
 * the `arabic` theme.
 *
 * Run:
 *   npx tsx --env-file=.env.local prisma/seeds/seedAllVocabularyLessons.ts
 *
 * The `--env-file` flag loads `DATABASE_URL` from .env.local. Without
 * it, Prisma rejects the connection at startup (Prisma's own CLI auto-
 * loads .env files; tsx run directly does not).
 *
 * Re-running is safe — the underlying `seedVocabularyLesson` helper:
 *   - upserts the `ThemeLesson` row by `(themeId, slug)`
 *   - deletes existing `LessonSection`s and writes a fresh
 *     `vocabulary_lesson` row with the latest validated content JSON
 *
 * Each lesson is validated against `VocabularyLessonSectionSchema`
 * before write; any malformed content aborts the run with a clear
 * error message rather than writing garbage.
 *
 * Order numbers (100..220, step 10) intentionally cluster the
 * vocabulary lessons after the existing handful (numbers/colors/
 * shapes/alphabet at 1-4, family/animals-world/body/pronouns at
 * 33-38). The gaps leave room for re-ordering without renumbering
 * the other themes.
 */

import { PrismaClient } from "@prisma/client";
import { seedVocabularyLesson } from "./_shared/seedVocabularyLesson";
import { fruitsLessonContent } from "./vocabulary/fruits.data";
import { vegetablesLessonContent } from "./vocabulary/vegetables.data";
import { bodyPartsLessonContent } from "./vocabulary/body-parts.data";
import { clothesLessonContent } from "./vocabulary/clothes.data";
import { jobsLessonContent } from "./vocabulary/jobs.data";
import { transportLessonContent } from "./vocabulary/transport.data";
import { daysLessonContent } from "./vocabulary/days.data";
import { seasonsLessonContent } from "./vocabulary/seasons.data";
import { weatherLessonContent } from "./vocabulary/weather.data";
import { emotionsLessonContent } from "./vocabulary/emotions.data";
import { foodLessonContent } from "./vocabulary/food.data";
import { instrumentsLessonContent } from "./vocabulary/instruments.data";
import { animalsLessonContent } from "./vocabulary/animals.data";
import type { VocabularyLessonSection } from "@/lib/types/vocabularyLesson.types";

interface VocabularyLessonSeed {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  content: VocabularyLessonSection;
}

const ARABIC_THEME = "arabic";

const SEEDS: VocabularyLessonSeed[] = [
  {
    slug: "fruits",
    title: "الْفَوَاكِهُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْفَوَاكِهِ بِالْعَرَبِيَّةِ",
    icon: "🍎",
    order: 100,
    content: fruitsLessonContent,
  },
  {
    slug: "vegetables",
    title: "الْخَضْرَوَاتُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْخَضْرَوَاتِ بِالْعَرَبِيَّةِ",
    icon: "🥕",
    order: 110,
    content: vegetablesLessonContent,
  },
  {
    slug: "body-parts",
    title: "أَجْزَاءُ الْجِسْمِ",
    description: "تَعَلَّمْ أَجْزَاءَ الْجِسْمِ بِالْعَرَبِيَّةِ",
    icon: "🧒",
    order: 120,
    content: bodyPartsLessonContent,
  },
  {
    slug: "clothes",
    title: "الْمَلَابِسُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْمَلَابِسِ بِالْعَرَبِيَّةِ",
    icon: "👕",
    order: 130,
    content: clothesLessonContent,
  },
  {
    slug: "jobs",
    title: "الْمِهَنُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْمِهَنِ بِالْعَرَبِيَّةِ",
    icon: "🧑‍💼",
    order: 140,
    content: jobsLessonContent,
  },
  {
    slug: "transport",
    title: "وَسَائِلُ النَّقْلِ",
    description: "تَعَلَّمْ أَسْمَاءَ وَسَائِلِ النَّقْلِ بِالْعَرَبِيَّةِ",
    icon: "🚗",
    order: 150,
    content: transportLessonContent,
  },
  {
    slug: "days",
    title: "أَيَّامُ الْأُسْبُوعِ",
    description: "تَعَلَّمْ أَيَّامَ الْأُسْبُوعِ بِالْعَرَبِيَّةِ",
    icon: "📅",
    order: 160,
    content: daysLessonContent,
  },
  {
    slug: "seasons",
    title: "الْفُصُولُ الْأَرْبَعَةُ",
    description: "تَعَلَّمْ فُصُولَ السَّنَةِ بِالْعَرَبِيَّةِ",
    icon: "🍂",
    order: 170,
    content: seasonsLessonContent,
  },
  {
    slug: "weather",
    title: "الطَّقْسُ",
    description: "تَعَلَّمْ أَسْمَاءَ حَالَاتِ الطَّقْسِ بِالْعَرَبِيَّةِ",
    icon: "☀️",
    order: 180,
    content: weatherLessonContent,
  },
  {
    slug: "emotions",
    title: "الْمَشَاعِرُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْمَشَاعِرِ بِالْعَرَبِيَّةِ",
    icon: "😊",
    order: 190,
    content: emotionsLessonContent,
  },
  {
    slug: "food",
    title: "الطَّعَامُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْأَطْعِمَةِ بِالْعَرَبِيَّةِ",
    icon: "🍞",
    order: 200,
    content: foodLessonContent,
  },
  {
    slug: "instruments",
    title: "الْآلَاتُ الْمُوسِيقِيَّةُ",
    description: "تَعَلَّمْ أَسْمَاءَ الْآلَاتِ الْمُوسِيقِيَّةِ بِالْعَرَبِيَّةِ",
    icon: "🎵",
    order: 210,
    content: instrumentsLessonContent,
  },
  {
    slug: "animals",
    title: "عَالَمُ الْحَيَوَانَاتِ",
    description: "تَعَلَّمْ أَسْمَاءَ الْحَيَوَانَاتِ بِالْعَرَبِيَّةِ",
    icon: "🐾",
    order: 220,
    content: animalsLessonContent,
  },
];

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  const startedAt = Date.now();
  let succeeded = 0;
  const failed: Array<{ slug: string; error: string }> = [];

  console.log(`\n🌱 Seeding ${SEEDS.length} vocabulary lessons under theme "${ARABIC_THEME}"...\n`);

  try {
    for (const seed of SEEDS) {
      const itemCount = seed.content.items.length;
      const wordCount = seed.content.words.length;
      const letterCount = seed.content.words.reduce(
        (sum, w) => sum + w.letters.length,
        0,
      );

      try {
        await seedVocabularyLesson({
          prisma,
          themeSlug: ARABIC_THEME,
          slug: seed.slug,
          title: seed.title,
          description: seed.description,
          icon: seed.icon,
          order: seed.order,
          content: seed.content,
        });

        succeeded += 1;
        console.log(
          `  ✓ ${seed.slug.padEnd(14)} ${seed.title.padEnd(28)} ` +
            `${itemCount} items, ${wordCount} words, ${letterCount} letters`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        failed.push({ slug: seed.slug, error: message });
        console.error(`  ✗ ${seed.slug.padEnd(14)} FAILED: ${message}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  const elapsedMs = Date.now() - startedAt;
  console.log(
    `\nDone in ${elapsedMs}ms — ${succeeded}/${SEEDS.length} succeeded.`,
  );

  if (failed.length > 0) {
    console.error(`\n${failed.length} lesson(s) failed:`);
    for (const f of failed) console.error(`  - ${f.slug}: ${f.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n💥 Unhandled error:", err);
  process.exit(1);
});
