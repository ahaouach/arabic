/**
 * Dynamic lesson route — loads any ThemeLesson + its LessonSections from
 * Postgres, validates each section's JSON against its Zod schema, then
 * renders the appropriate orchestrator.
 *
 * Special case: lessons containing exactly one section of type
 * `numbers_lesson` are rendered via the dedicated `<NumbersLessonPage>`,
 * which bundles its own chrome (breadcrumbs, hero, 5-zone navigator,
 * completion screen). Every other lesson uses the shared
 * `<LessonAdventure>` orchestrator.
 *
 * ## Running the seed
 *
 * The lesson content lives in `prisma/seed.ts`. To (re)populate the DB:
 *
 *     npm run db:push         # sync schema if models changed
 *     npm run db:seed         # upsert all themes / lessons / sections
 *
 * The seed is idempotent — safe to re-run as many times as needed.
 *
 * ## Tweaking a lesson without a code change
 *
 * Every piece of lesson content — titles, instructions, zone configs,
 * round data, colour themes, Arabic audio text — comes from the
 * `LessonSection.content` JSON column. You can:
 *
 *   1. edit the object in `prisma/seed.ts` and run `npm run db:seed`, or
 *   2. update a row directly in Postgres (Prisma Studio works great:
 *      `npm run db:studio`).
 *
 * The client picks up changes on the next request. Zod schemas under
 * `lib/schemas/` guard against malformed edits — anything invalid is
 * silently dropped from the render.
 */

import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";
import LessonAdventure from "@/components/ui/LessonAdventure";
import NumbersLessonPage from "@/components/ui/numbers/NumbersLessonPage";
import ColorsLessonPage from "@/components/ui/colors/ColorsLessonPage";
import ShapesLessonPage from "@/components/ui/shapes/ShapesLessonPage";
import AlphabetLessonPage from "@/components/ui/alphabet/AlphabetLessonPage";
import FamilyLessonPage from "@/components/ui/family/FamilyLessonPage";
import VocabularyLessonPage from "@/components/ui/vocabulary/VocabularyLessonPage";
import { isLessonLevel, type LessonLevel } from "@/lib/lessonLevel";
import { parseSection, type Section } from "@/lib/lessonSections";

export const dynamic = "force-dynamic";

const SlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Invalid slug format");

const ParamsSchema = z.object({
  themeSlug: SlugSchema,
  lessonSlug: SlugSchema,
});

interface LessonDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  level: LessonLevel;
  isLocked: boolean;
  sections: Section[];
  theme: { name: string; title: string };
  nextLesson: { slug: string; title: string } | null;
}

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/login");
  return session;
}

async function loadLesson(themeSlug: string, lessonSlug: string): Promise<LessonDetail | null> {
  const parsed = ParamsSchema.safeParse({ themeSlug, lessonSlug });
  if (!parsed.success) return null;

  // Prisma parameterises the query — no injection surface.
  const lesson = await prisma.themeLesson.findFirst({
    where: {
      slug: parsed.data.lessonSlug,
      theme: { name: parsed.data.themeSlug },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      icon: true,
      level: true,
      isLocked: true,
      order: true,
      createdAt: true,
      themeId: true,
      theme: { select: { name: true, title: true } },
      sections: {
        select: { id: true, type: true, content: true, order: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!lesson || !isLessonLevel(lesson.level)) return null;

  // Defense-in-depth: validate every section's JSON shape before it
  // reaches the client. Corrupt rows are silently dropped.
  const sections: Section[] = lesson.sections
    .map((s) => parseSection({ id: s.id, order: s.order, type: s.type, content: s.content }))
    .filter((s): s is Section => s !== null);

  // Find the next lesson in the same theme.
  const next = await prisma.themeLesson.findFirst({
    where: {
      themeId: lesson.themeId,
      OR: [
        { order: { gt: lesson.order } },
        { order: lesson.order, createdAt: { gt: lesson.createdAt } },
      ],
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { slug: true, title: true },
  });

  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description,
    icon: lesson.icon,
    level: lesson.level,
    isLocked: lesson.isLocked,
    sections,
    theme: lesson.theme,
    nextLesson: next,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ themeSlug: string; lessonSlug: string }>;
}) {
  const { themeSlug, lessonSlug } = await params;
  const lesson = await loadLesson(themeSlug, lessonSlug);
  return {
    title: lesson ? `${lesson.title} — ${lesson.theme.title} — AQ Academy` : "Not found — AQ Academy",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ themeSlug: string; lessonSlug: string }>;
}) {
  await requireSession();
  const { themeSlug, lessonSlug } = await params;

  const lesson = await loadLesson(themeSlug, lessonSlug);
  if (!lesson) notFound();

  // Special case: a single `numbers_lesson` section renders via its
  // dedicated orchestrator (its own breadcrumbs, hero, zone navigator,
  // completion screen) to avoid the double-chrome that LessonAdventure
  // would produce.
  const only = lesson.sections.length === 1 ? lesson.sections[0] : null;
  if (only && only.type === "numbers_lesson") {
    return (
      <NumbersLessonPage
        content={only.content}
        theme={lesson.theme}
        lessonTitle={lesson.title}
        nextLesson={lesson.nextLesson}
      />
    );
  }
  if (only && only.type === "colors_lesson") {
    return (
      <ColorsLessonPage
        content={only.content}
        theme={lesson.theme}
        lessonTitle={lesson.title}
        nextLesson={lesson.nextLesson}
      />
    );
  }
  if (only && only.type === "shapes_lesson") {
    return (
      <ShapesLessonPage
        content={only.content}
        theme={lesson.theme}
        lessonTitle={lesson.title}
        nextLesson={lesson.nextLesson}
      />
    );
  }
  if (only && only.type === "alphabet_lesson") {
    return (
      <AlphabetLessonPage
        content={only.content}
        theme={lesson.theme}
        lessonTitle={lesson.title}
        nextLesson={lesson.nextLesson}
      />
    );
  }
  if (only && only.type === "family_lesson") {
    return (
      <FamilyLessonPage
        content={only.content}
        theme={lesson.theme}
        lessonTitle={lesson.title}
        nextLesson={lesson.nextLesson}
      />
    );
  }
  if (only && only.type === "vocabulary_lesson") {
    return (
      <VocabularyLessonPage
        content={only.content}
        theme={lesson.theme}
        lessonTitle={lesson.title}
        nextLesson={lesson.nextLesson}
      />
    );
  }

  return (
    <LessonAdventure
      title={lesson.title}
      description={lesson.description}
      icon={lesson.icon}
      level={lesson.level}
      sections={lesson.sections}
      theme={lesson.theme}
      nextLesson={lesson.nextLesson}
    />
  );
}
