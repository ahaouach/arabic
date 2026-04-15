import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";
import LessonList, { type LessonItem } from "@/components/ui/LessonList";
import { isLessonLevel } from "@/lib/lessonLevel";

export const dynamic = "force-dynamic";

// URL-safe slug — lowercase alphanumerics + hyphens, 1..64 chars.
const SlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Invalid slug format");

interface ThemeDetail {
  id: string;
  name: string;
  title: string;
  description: string;
}

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/login");
  return session;
}

async function loadTheme(rawSlug: string): Promise<ThemeDetail | null> {
  const parsed = SlugSchema.safeParse(rawSlug);
  if (!parsed.success) return null;

  // `Theme.name` is the URL-safe slug in this schema; `Theme.title` is the display label.
  // Prisma parameterises the query so there's no injection surface.
  const theme = await prisma.theme.findUnique({
    where: { name: parsed.data },
    select: { id: true, name: true, title: true, description: true },
  });
  return theme;
}

async function loadLessons(themeId: string, themeSlug: string): Promise<LessonItem[]> {
  const rows = await prisma.themeLesson.findMany({
    where: { themeId },
    select: {
      id: true,
      title: true,
      slug: true,
      level: true,
      icon: true,
      description: true,
      isLocked: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return rows
    .filter((r) => isLessonLevel(r.level))
    .map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      icon: r.icon,
      description: r.description,
      isLocked: r.isLocked,
      level: r.level as LessonItem["level"],
      themeSlug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ themeSlug: string }>;
}) {
  const { themeSlug } = await params;
  const parsed = SlugSchema.safeParse(themeSlug);
  if (!parsed.success) return { title: "Not found — AQ Academy" };
  const theme = await prisma.theme.findUnique({
    where: { name: parsed.data },
    select: { title: true },
  });
  return {
    title: theme ? `${theme.title} — AQ Academy` : "Not found — AQ Academy",
  };
}

// Theme-specific accent palette. Keeps the palette server-side so the
// markup is fully static and the client bundle stays small.
const THEME_PALETTE: Record<string, { from: string; via: string; to: string; emoji: string }> = {
  arabic: { from: "from-sky-400", via: "via-indigo-500", to: "to-fuchsia-500", emoji: "ا ب ت" },
  islamic: { from: "from-emerald-400", via: "via-teal-500", to: "to-cyan-500", emoji: "☪︎" },
  quran: { from: "from-amber-400", via: "via-orange-500", to: "to-rose-500", emoji: "۞" },
  others: { from: "from-violet-400", via: "via-purple-500", to: "to-pink-500", emoji: "✦" },
};
const DEFAULT_PALETTE = THEME_PALETTE.others;

export default async function ThemePage({
  params,
}: {
  params: Promise<{ themeSlug: string }>;
}) {
  await requireSession();
  const { themeSlug } = await params;

  const theme = await loadTheme(themeSlug);
  if (!theme) notFound();

  const lessons = await loadLessons(theme.id, theme.name);
  const palette = THEME_PALETTE[theme.name] ?? DEFAULT_PALETTE;

  return (
    <div className="relative min-h-full overflow-hidden p-6 sm:p-10">
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-yellow-200/40 blur-3xl"
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/dashboard" className="hover:text-gray-800">
              Dashboard
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/dashboard/courses" className="hover:text-gray-800">
              Courses
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-semibold text-gray-800">
            {theme.title}
          </li>
        </ol>
      </nav>

      {/* Gamified header */}
      <header
        className={`relative mx-auto mt-6 max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br ${palette.from} ${palette.via} ${palette.to} p-8 text-white shadow-2xl shadow-black/20 ring-1 ring-white/30 sm:p-12`}
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <div className="absolute bottom-0 right-10 text-6xl opacity-30" aria-hidden>
          {palette.emoji}
        </div>
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-widest text-white/80">Theme</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight drop-shadow sm:text-5xl">
            {theme.title}
          </h1>
          {theme.description && (
            <p className="mt-3 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
              {theme.description}
            </p>
          )}
        </div>
      </header>

      {/* Lessons */}
      <section className="mx-auto mt-10 max-w-6xl" aria-label={`${theme.title} lessons`}>
        <h2 className="text-xl font-bold text-gray-900">Lessons</h2>
        <p className="mt-1 mb-6 text-sm text-gray-500">
          {lessons.length > 0
            ? "Pick a level and start your adventure!"
            : "Coming soon — your first adventure is being prepared!"}
        </p>

        {lessons.length > 0 ? (
          <LessonList lessons={lessons} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="relative overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-400 text-2xl shadow-inner">
                    🧩
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Lesson {n}
                    </p>
                    <h3 className="text-base font-bold text-gray-800">Locked</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-800 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          >
            <span aria-hidden>←</span> Back to themes
          </Link>
        </div>
      </section>
    </div>
  );
}
