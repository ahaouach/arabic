/**
 * Idempotent helper for seeding a single `vocabulary_lesson` lesson.
 *
 * Phase 4 will compose this across the 13 themes. Each call:
 *   1. Validates the content against `VocabularyLessonSectionSchema`
 *      (mirrors the runtime defense-in-depth, catches bad seed data
 *      before it lands in the DB).
 *   2. Upserts the `ThemeLesson` row by `(themeId, slug)`.
 *   3. Replaces all `LessonSection`s under that lesson with a single
 *      `vocabulary_lesson` row holding the validated content.
 *
 * Re-running is safe — the section delete+insert keeps the lesson on
 * the latest authored content without accumulating stale rows.
 */

import type { LessonLevel, PrismaClient } from "@prisma/client";
import {
  VocabularyLessonSectionSchema,
  type VocabularyLessonSection,
} from "@/lib/schemas/vocabularyLesson.schema";

export interface SeedVocabularyLessonArgs {
  prisma: PrismaClient;
  /** Slug of the parent Theme (e.g. "arabic"). Must already exist. */
  themeSlug: string;
  /** Lesson slug within the theme (e.g. "fruits"). */
  slug: string;
  /** Lesson title (vowelised Arabic). */
  title: string;
  /** Optional short description for the catalogue / breadcrumb. */
  description?: string;
  /** Optional emoji / character used as a fallback list icon. */
  icon?: string;
  /** Lesson level — defaults to BASIC. */
  level?: LessonLevel;
  /** Sort order within the theme. */
  order?: number;
  /** Whether the lesson is locked (gated by progression). */
  isLocked?: boolean;
  /** The full vocabulary content; validated before write. */
  content: VocabularyLessonSection;
}

export async function seedVocabularyLesson(
  args: SeedVocabularyLessonArgs,
): Promise<void> {
  const {
    prisma,
    themeSlug,
    slug,
    title,
    description,
    icon,
    level = "basic",
    order = 0,
    isLocked = false,
    content,
  } = args;

  // Defense-in-depth: validate the seed content with the runtime schema.
  // A bad payload would fail validation at render time too — failing
  // here means the seed run aborts cleanly instead of silently writing
  // garbage that the renderer drops.
  const parsed = VocabularyLessonSectionSchema.safeParse(content);
  if (!parsed.success) {
    throw new Error(
      `seedVocabularyLesson(${themeSlug}/${slug}): content failed validation:\n` +
        JSON.stringify(parsed.error.flatten(), null, 2),
    );
  }

  const theme = await prisma.theme.findUnique({ where: { name: themeSlug } });
  if (!theme) {
    throw new Error(
      `seedVocabularyLesson: theme "${themeSlug}" does not exist — seed it first.`,
    );
  }

  const lesson = await prisma.themeLesson.upsert({
    where: { themeId_slug: { themeId: theme.id, slug } },
    create: {
      themeId: theme.id,
      slug,
      title,
      description,
      icon,
      level,
      order,
      isLocked,
    },
    update: {
      title,
      description,
      icon,
      level,
      order,
      isLocked,
    },
  });

  // Replace all sections — vocabulary lessons are single-section, so
  // wiping + re-creating keeps content fresh and never duplicates.
  await prisma.lessonSection.deleteMany({ where: { lessonId: lesson.id } });
  await prisma.lessonSection.create({
    data: {
      lessonId: lesson.id,
      type: "vocabulary_lesson",
      order: 0,
      content: parsed.data,
    },
  });
}
