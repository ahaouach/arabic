/**
 * SECURITY: Server-side data layer for lessons + lesson progress.
 *
 *  - All Prisma queries are parameterised → SQL-injection-safe.
 *  - The `steps` JSON column is parsed through Zod on every read so
 *    a tampered row can never reach the renderer.
 *  - View-model DTOs strip private fields and only expose what the
 *    client needs.
 *  - Errors are logged server-side; callers get `null` and render a 404.
 */

import { prisma } from "./prisma";
import {
  isExerciseStep,
  lessonStepsSchema,
  type ExerciseStep,
  type LessonStep,
} from "./lessons-schema";

// ---- View-model DTOs -------------------------------------------------------

export interface CourseLessonsViewModel {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  theme: { slug: string; title: string } | null;
  lessons: LessonSummaryViewModel[];
}

export interface LessonSummaryViewModel {
  id: string;
  orderIndex: number;
  title: string;
  description: string;
  progress: {
    score: number;
    maxScore: number;
    completed: boolean;
  } | null;
}

export interface LessonViewModel {
  id: string;
  courseId: string;
  orderIndex: number;
  title: string;
  description: string;
  steps: LessonStep[];
  totalPoints: number;
  exerciseCount: number;
  progress: {
    score: number;
    maxScore: number;
    completed: boolean;
    attempts: number;
  } | null;
}

/** Public lesson summary for `GET /api/lessons` (no answers/grades). */
export interface PublicLessonSummary {
  id: string;
  courseId: string;
  orderIndex: number;
  title: string;
  description: string;
  exerciseCount: number;
  totalPoints: number;
}

// ---- Helpers ---------------------------------------------------------------

function parseSteps(raw: unknown): LessonStep[] | null {
  const result = lessonStepsSchema.safeParse(raw);
  if (!result.success) {
    console.error("[lessons-db] corrupted steps payload:", result.error);
    return null;
  }
  return result.data;
}

function totalsFromSteps(steps: LessonStep[]): { totalPoints: number; exerciseCount: number } {
  let totalPoints = 0;
  let exerciseCount = 0;
  for (const step of steps) {
    if (isExerciseStep(step)) {
      totalPoints += step.points;
      exerciseCount += 1;
    }
  }
  return { totalPoints, exerciseCount };
}

// ---- Queries ---------------------------------------------------------------

function mapCourseRowToViewModel(
  course: {
    id: string;
    title: string;
    name: string;
    description: string;
    slug: string | null;
    theme: { name: string; title: string } | null;
    lessons: {
      id: string;
      orderIndex: number;
      title: string;
      description: string;
      progress: { score: number; maxScore: number; completed: boolean }[];
    }[];
  }
): CourseLessonsViewModel {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title || course.name,
    description: course.description,
    theme: course.theme
      ? { slug: course.theme.name, title: course.theme.title }
      : null,
    lessons: course.lessons.map((l) => ({
      id: l.id,
      orderIndex: l.orderIndex,
      title: l.title,
      description: l.description,
      progress: l.progress[0]
        ? {
            score: l.progress[0].score,
            maxScore: l.progress[0].maxScore,
            completed: l.progress[0].completed,
          }
        : null,
    })),
  };
}

/**
 * Fetch a course's lesson list (lightweight — no `steps`), with the
 * current user's progress joined in. Used by the course detail page.
 */
export async function getCourseWithLessons(
  courseId: string,
  userId: string
): Promise<CourseLessonsViewModel | null> {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        theme: { select: { name: true, title: true } },
        lessons: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            orderIndex: true,
            title: true,
            description: true,
            progress: {
              where: { userId },
              select: { score: true, maxScore: true, completed: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!course) return null;
    return mapCourseRowToViewModel(course);
  } catch (err) {
    console.error("[lessons-db] getCourseWithLessons failed:", err);
    return null;
  }
}

/**
 * Resolve a level (`Course`) by `(themeName, slug)`. The Zod-validated
 * pair is the canonical URL identifier — e.g. `arabic / level-1`.
 */
export async function getCourseBySlug(
  themeName: string,
  slug: string,
  userId: string
): Promise<CourseLessonsViewModel | null> {
  try {
    const course = await prisma.course.findFirst({
      where: { slug, theme: { name: themeName } },
      include: {
        theme: { select: { name: true, title: true } },
        lessons: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            orderIndex: true,
            title: true,
            description: true,
            progress: {
              where: { userId },
              select: { score: true, maxScore: true, completed: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!course) return null;
    return mapCourseRowToViewModel(course);
  } catch (err) {
    console.error("[lessons-db] getCourseBySlug failed:", err);
    return null;
  }
}

/**
 * List all levels (Courses) for a theme. Used by `GET /api/levels`
 * and the levels-list page. The caller must have already validated
 * `themeName` with `themeNameSchema`.
 */
export async function listLevelsByTheme(
  themeName: string
): Promise<Array<{
  id: string;
  slug: string | null;
  title: string;
  description: string;
  level: number;
  lessonCount: number;
}>> {
  try {
    const courses = await prisma.course.findMany({
      where: { theme: { name: themeName }, slug: { not: null } },
      orderBy: { level: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        name: true,
        description: true,
        level: true,
        _count: { select: { lessons: true } },
      },
    });

    return courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title || c.name,
      description: c.description,
      level: c.level,
      lessonCount: c._count.lessons,
    }));
  } catch (err) {
    console.error("[lessons-db] listLevelsByTheme failed:", err);
    return [];
  }
}

/**
 * Fetch a single lesson with its full steps array + the current user's
 * progress. Returns `null` if the lesson doesn't exist OR if its JSON
 * payload fails Zod validation.
 *
 * The `courseId` argument is required and acts as a relationship guard:
 * a lesson is only returned if it actually belongs to the given course.
 */
export async function getLessonForUser(
  lessonId: string,
  courseId: string,
  userId: string
): Promise<LessonViewModel | null> {
  try {
    const lesson = await prisma.courseLesson.findFirst({
      where: { id: lessonId, courseId },
      include: {
        progress: {
          where: { userId },
          take: 1,
        },
      },
    });

    if (!lesson) return null;

    const steps = parseSteps(lesson.steps);
    if (!steps) return null;

    const { totalPoints, exerciseCount } = totalsFromSteps(steps);
    const current = lesson.progress[0] ?? null;

    return {
      id: lesson.id,
      courseId: lesson.courseId,
      orderIndex: lesson.orderIndex,
      title: lesson.title,
      description: lesson.description,
      steps,
      totalPoints,
      exerciseCount,
      progress: current
        ? {
            score: current.score,
            maxScore: current.maxScore,
            completed: current.completed,
            attempts: current.attempts,
          }
        : null,
    };
  } catch (err) {
    console.error("[lessons-db] getLessonForUser failed:", err);
    return null;
  }
}

/**
 * Resolve a lesson by `(themeName, levelSlug, lessonId)`. Validates the
 * full hierarchical path in a single query so a forged URL like
 * `/courses/quran/level-1/<arabic-lesson-id>` correctly 404s.
 */
export async function getLessonByPath(params: {
  themeName: string;
  levelSlug: string;
  lessonId: string;
  userId: string;
}): Promise<LessonViewModel | null> {
  const { themeName, levelSlug, lessonId, userId } = params;
  try {
    const lesson = await prisma.courseLesson.findFirst({
      where: {
        id: lessonId,
        course: {
          slug: levelSlug,
          theme: { name: themeName },
        },
      },
      include: {
        progress: { where: { userId }, take: 1 },
      },
    });
    if (!lesson) return null;

    const steps = parseSteps(lesson.steps);
    if (!steps) return null;

    const { totalPoints, exerciseCount } = totalsFromSteps(steps);
    const current = lesson.progress[0] ?? null;

    return {
      id: lesson.id,
      courseId: lesson.courseId,
      orderIndex: lesson.orderIndex,
      title: lesson.title,
      description: lesson.description,
      steps,
      totalPoints,
      exerciseCount,
      progress: current
        ? {
            score: current.score,
            maxScore: current.maxScore,
            completed: current.completed,
            attempts: current.attempts,
          }
        : null,
    };
  } catch (err) {
    console.error("[lessons-db] getLessonByPath failed:", err);
    return null;
  }
}

/**
 * Server-side load of a lesson's gradable exercises only. Used by
 * `/api/progress` to grade submitted answers — keeps the exercise
 * lookup tightly scoped (no rendering view-model overhead).
 */
export async function getLessonExercisesForGrading(
  lessonId: string
): Promise<{ id: string; exercises: ExerciseStep[] } | null> {
  try {
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      select: { id: true, steps: true },
    });
    if (!lesson) return null;

    const steps = parseSteps(lesson.steps);
    if (!steps) return null;

    return { id: lesson.id, exercises: steps.filter(isExerciseStep) };
  } catch (err) {
    console.error("[lessons-db] getLessonExercisesForGrading failed:", err);
    return null;
  }
}

/**
 * List lessons by theme (for `GET /api/lessons?theme=arabic`). Returns
 * a flat list of summaries — no `steps`, no answers — ordered by
 * course then page number. The caller is expected to have already
 * validated `themeName` with Zod.
 */
export async function listLessonsByTheme(
  themeName: string
): Promise<PublicLessonSummary[]> {
  try {
    const lessons = await prisma.courseLesson.findMany({
      where: { course: { theme: { name: themeName } } },
      orderBy: [{ courseId: "asc" }, { orderIndex: "asc" }],
      select: {
        id: true,
        courseId: true,
        orderIndex: true,
        title: true,
        description: true,
        steps: true,
      },
    });

    return lessons
      .map((l) => {
        const steps = parseSteps(l.steps);
        if (!steps) return null;
        const { totalPoints, exerciseCount } = totalsFromSteps(steps);
        return {
          id: l.id,
          courseId: l.courseId,
          orderIndex: l.orderIndex,
          title: l.title,
          description: l.description,
          totalPoints,
          exerciseCount,
        };
      })
      .filter((x): x is PublicLessonSummary => x !== null);
  } catch (err) {
    console.error("[lessons-db] listLessonsByTheme failed:", err);
    return [];
  }
}

/**
 * Public lesson detail (used by `GET /api/lessons/[id]`). Includes the
 * full `steps` so the client can render — but `correctAnswer` / `pairs`
 * are still present in exercise steps for instant local feedback. The
 * authoritative score always comes from `/api/progress` re-grading.
 */
export async function getPublicLessonById(
  lessonId: string
): Promise<LessonViewModel | null> {
  try {
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) return null;

    const steps = parseSteps(lesson.steps);
    if (!steps) return null;

    const { totalPoints, exerciseCount } = totalsFromSteps(steps);
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      orderIndex: lesson.orderIndex,
      title: lesson.title,
      description: lesson.description,
      steps,
      totalPoints,
      exerciseCount,
      progress: null,
    };
  } catch (err) {
    console.error("[lessons-db] getPublicLessonById failed:", err);
    return null;
  }
}

// ---- Mutations -------------------------------------------------------------

/**
 * Create a lesson. Caller MUST have validated input via
 * `lessonCreateSchema` and authorized the user (admin/teacher only).
 * Returns the row id, or null on failure.
 */
export async function createLesson(input: {
  courseId: string;
  orderIndex: number;
  title: string;
  description: string;
  steps: LessonStep[];
}): Promise<{ id: string } | null> {
  try {
    const row = await prisma.courseLesson.create({
      data: {
        courseId: input.courseId,
        orderIndex: input.orderIndex,
        title: input.title,
        description: input.description,
        // Prisma JSON fields accept any serialisable value.
        steps: input.steps as unknown as object,
      },
      select: { id: true },
    });
    return row;
  } catch (err) {
    console.error("[lessons-db] createLesson failed:", err);
    return null;
  }
}

/**
 * Upsert the learner's progress for a lesson.
 *
 * - `score` always moves forward (max of old and new) so accidental
 *   re-plays can't erase prior progress.
 * - `completed` is sticky: once true, it stays true.
 */
export async function upsertLessonProgress(params: {
  userId: string;
  lessonId: string;
  score: number;
  maxScore: number;
  completed: boolean;
}): Promise<{
  score: number;
  maxScore: number;
  completed: boolean;
  attempts: number;
}> {
  const { userId, lessonId, score, maxScore, completed } = params;

  const existing = await prisma.courseLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  const nextScore = Math.max(existing?.score ?? 0, score);
  const nextCompleted = (existing?.completed ?? false) || completed;
  const attempts = (existing?.attempts ?? 0) + 1;

  const row = await prisma.courseLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      score: nextScore,
      maxScore,
      completed: nextCompleted,
      attempts,
      completedAt: nextCompleted ? (existing?.completedAt ?? new Date()) : null,
    },
    create: {
      userId,
      lessonId,
      score: nextScore,
      maxScore,
      completed: nextCompleted,
      attempts: 1,
      completedAt: nextCompleted ? new Date() : null,
    },
  });

  return {
    score: row.score,
    maxScore: row.maxScore,
    completed: row.completed,
    attempts: row.attempts,
  };
}
