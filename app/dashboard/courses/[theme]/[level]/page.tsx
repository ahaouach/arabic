import Link from "next/link";
import { notFound } from "next/navigation";
import { themeNameSchema } from "@/lib/courses-db";
import { getCourseBySlug } from "@/lib/lessons-db";
import { idParamSchema } from "@/lib/lessons-schema";
import { requireUser, type Role } from "@/lib/server-auth";
import ProgressBar from "@/components/courses/lesson/ProgressBar";

interface PageProps {
  params: Promise<{ theme: string; level: string }>;
}

export const dynamic = "force-dynamic";

const ALLOWED_ROLES: readonly Role[] = ["admin", "teacher", "parent", "student"];

/**
 * Lessons list for a theme + level (e.g. /dashboard/courses/arabic/level-1).
 *
 * SECURITY:
 *  - Auth + role check via `requireUser`.
 *  - Both URL segments validated with Zod before any DB query.
 *  - The `(themeName, slug)` pair must resolve to a single Course; a
 *    mismatched URL like `/courses/quran/level-99` 404s.
 */
export default async function LevelLessonsPage({ params }: PageProps) {
  const user = await requireUser(ALLOWED_ROLES);
  const { theme: rawTheme, level: rawLevel } = await params;

  const themeResult = themeNameSchema.safeParse(rawTheme);
  const levelResult = idParamSchema.safeParse(rawLevel);
  if (!themeResult.success || !levelResult.success) notFound();

  const course = await getCourseBySlug(
    themeResult.data,
    levelResult.data,
    user.sub
  );
  if (!course) notFound();
  if (!course.theme) notFound();

  const completedCount = course.lessons.filter((l) => l.progress?.completed).length;
  const totalLessons = course.lessons.length;
  const overallPct =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href={`/dashboard/courses/${encodeURIComponent(course.theme.slug)}`}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {course.theme.title}
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-1 text-gray-500">{course.description}</p>
        {totalLessons > 0 && (
          <div className="mt-4 max-w-sm">
            <ProgressBar
              value={completedCount}
              max={totalLessons}
              label={`${completedCount} / ${totalLessons} lessons completed`}
            />
            <p className="mt-1 text-xs text-gray-400">Overall: {overallPct}%</p>
          </div>
        )}
      </header>

      {totalLessons === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">No lessons available yet.</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {course.lessons.map((lesson) => {
            const isCompleted = lesson.progress?.completed ?? false;
            const score = lesson.progress?.score ?? 0;
            const maxScore = lesson.progress?.maxScore ?? 0;
            return (
              <li key={lesson.id}>
                <Link
                  href={`/dashboard/courses/${encodeURIComponent(
                    course.theme!.slug
                  )}/${encodeURIComponent(course.slug ?? "")}/${encodeURIComponent(lesson.id)}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={
                      isCompleted
                        ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700"
                        : "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700"
                    }
                    aria-hidden="true"
                  >
                    {isCompleted ? "✓" : lesson.orderIndex}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">{lesson.title}</h2>
                    {lesson.description && (
                      <p className="mt-0.5 text-sm text-gray-500">{lesson.description}</p>
                    )}
                    {lesson.progress && maxScore > 0 && (
                      <p className="mt-1 text-xs text-gray-400">
                        Best score: {score} / {maxScore}
                      </p>
                    )}
                  </div>
                  <span className="text-primary-600 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
