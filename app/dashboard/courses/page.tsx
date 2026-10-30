import { getAllThemes } from "@/lib/courses-db";
import { requireUser, type Role } from "@/lib/server-auth";
import ThemeCard from "@/components/courses/ThemeCard";

export const metadata = {
  title: "Courses — AQ Academy",
  description: "Browse courses by theme: Arabic, Quran, and Islam.",
};

// Catalogue content depends on DB state — opt out of static caching.
export const dynamic = "force-dynamic";

const ALLOWED_ROLES: readonly Role[] = ["admin", "teacher", "parent", "student"];

/**
 * Courses overview — authenticated users only.
 *
 * SECURITY:
 *  - `proxy.ts` middleware enforces authentication on `/dashboard/**`.
 *  - `requireUser` is a defence-in-depth check that also enforces role
 *    membership (parent/student/teacher/admin can browse the catalogue).
 *  - Theme data is fetched via Prisma (parameterised queries — no SQL
 *    injection) inside a Server Component, so no DB credentials or
 *    query shape is ever shipped to the client.
 *  - Prisma rows are mapped to `ThemeViewModel` DTOs; only safe fields
 *    reach the UI.
 */
export default async function CoursesPage() {
  await requireUser(ALLOWED_ROLES);
  const themes = await getAllThemes();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="mt-1 text-gray-500">
          Choose a theme to explore all related courses.
        </p>
      </header>

      {themes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            No course themes available yet. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
