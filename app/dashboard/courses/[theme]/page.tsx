import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllThemes,
  getThemeWithCourses,
  themeNameSchema,
} from "@/lib/courses-db";
import { requireUser, type Role } from "@/lib/server-auth";
import CoursesList from "@/components/courses/CoursesList";

interface PageProps {
  params: Promise<{ theme: string }>;
}

export const dynamic = "force-dynamic";

const ALLOWED_ROLES: readonly Role[] = ["admin", "teacher", "parent", "student"];

export async function generateMetadata({ params }: PageProps) {
  const { theme } = await params;
  const parsed = themeNameSchema.safeParse(theme);
  if (!parsed.success) return { title: "Not found — AQ Academy" };

  const data = await getThemeWithCourses(parsed.data);
  if (!data) return { title: "Not found — AQ Academy" };

  return {
    title: `${data.title} Courses — AQ Academy`,
    description: data.description,
  };
}

/**
 * Dynamic theme page — authenticated users only.
 *
 * SECURITY measures (layered):
 *  1. **Auth** — enforced upstream by `proxy.ts`; re-checked here via
 *     `requireUser` with a role allowlist.
 *  2. **Input validation (Zod)** — the raw `params.theme` is validated
 *     against `themeNameSchema` (2–32 lowercase letters). Any other
 *     input → `notFound()`. This blocks path traversal, null bytes,
 *     unicode spoofing, and other URL-manipulation attempts.
 *  3. **Existence check** — even a well-formed slug must correspond to
 *     a real DB row; missing → `notFound()`.
 *  4. **SQL-injection-safe** — Prisma uses parameterised queries and
 *     the slug is only ever passed as a bound parameter to
 *     `findUnique({ where: { name } })`.
 *  5. **XSS-safe rendering** — every field is rendered as a JSX child
 *     so React auto-escapes it. No `dangerouslySetInnerHTML`.
 *  6. **No DB leakage on errors** — `getThemeWithCourses` swallows
 *     Prisma errors, logs them server-side, and returns `null`. The
 *     user sees a plain 404, never a stack trace or SQL fragment.
 */
export default async function ThemeCoursesPage({ params }: PageProps) {
  await requireUser(ALLOWED_ROLES);

  const { theme: rawTheme } = await params;

  // 1. Zod validation — never trust the URL param.
  const parsed = themeNameSchema.safeParse(rawTheme);
  if (!parsed.success) notFound();

  // 2. Existence check — the slug must map to a real row.
  const theme = await getThemeWithCourses(parsed.data);
  if (!theme) notFound();

  // Theme list for the highlighted nav bar (cheap — 3 rows).
  const allThemes = await getAllThemes();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <svg
          className="mr-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Themes
      </Link>

      <header className="mt-4 mb-6">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${theme.accent} text-2xl text-white`}
            aria-hidden="true"
          >
            {theme.icon}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">{theme.title} Courses</h1>
        </div>
        <p className="mt-2 text-gray-500">{theme.description}</p>
      </header>

      {allThemes.length > 1 && (
        <nav aria-label="Theme navigation" className="mb-6 flex flex-wrap gap-2">
          {allThemes.map((t) => {
            const isCurrent = t.slug === theme.slug;
            return (
              <Link
                key={t.slug}
                href={`/dashboard/courses/${encodeURIComponent(t.slug)}`}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "rounded-full bg-primary-600 px-4 py-1.5 text-sm font-medium text-white"
                    : "rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                }
              >
                {t.title}
              </Link>
            );
          })}
        </nav>
      )}

      <CoursesList courses={theme.courses} />
    </div>
  );
}
