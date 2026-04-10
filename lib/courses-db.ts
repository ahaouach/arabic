/**
 * SECURITY: Server-side data layer for the themed course catalogue.
 *
 *  - All queries use Prisma parameterised queries → SQL-injection-safe.
 *  - URL/theme params are validated with Zod *before* reaching the DB,
 *    rejecting anything that isn't a short lowercase alphabetic slug.
 *  - This module is only imported from Server Components / route
 *    handlers — Prisma itself will refuse to run in a browser bundle.
 *  - Errors are logged server-side and swallowed at the boundary so no
 *    stack trace, SQL, or schema detail can reach the browser.
 *  - Prisma model shapes are mapped to safe `ViewModel` DTOs; we never
 *    return full Prisma rows to the UI so accidental over-fetching of
 *    sensitive columns (e.g. future price/internal notes) is avoided.
 */

import { z } from "zod";
import { prisma } from "./prisma";

// ---- Validation ------------------------------------------------------------

/**
 * Zod schema for a theme slug coming from a URL param.
 * Rules: 2–32 chars, lowercase letters only. This is a strict allowlist
 * — nothing else can reach the Prisma query.
 */
export const themeNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(32)
  .regex(/^[a-z]+$/, "Theme slug must contain only lowercase letters");

export type ThemeName = z.infer<typeof themeNameSchema>;

// ---- Presentation layer ----------------------------------------------------

/**
 * Static UI presentation metadata, keyed by theme slug. These are not
 * stored in the DB because they are pure visual concerns (gradient,
 * icon glyph) that shouldn't be editable by end users.
 */
interface ThemePresentation {
  accent: string;
  icon: string;
}

const PRESENTATION: Record<string, ThemePresentation> = {
  arabic: { accent: "from-emerald-500 to-teal-600", icon: "ا" },
  quran: { accent: "from-amber-500 to-orange-600", icon: "۞" },
  islam: { accent: "from-sky-500 to-indigo-600", icon: "☪" },
};

const DEFAULT_PRESENTATION: ThemePresentation = {
  accent: "from-gray-400 to-gray-600",
  icon: "•",
};

function presentationFor(name: string): ThemePresentation {
  return PRESENTATION[name] ?? DEFAULT_PRESENTATION;
}

// ---- View-model DTOs -------------------------------------------------------

export interface ThemeViewModel {
  slug: string;
  title: string;
  description: string;
  accent: string;
  icon: string;
}

export interface CourseViewModel {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
}

export interface ThemeWithCoursesViewModel extends ThemeViewModel {
  courses: CourseViewModel[];
}

// ---- Queries ---------------------------------------------------------------

/**
 * Fetch all themes ordered for display. Returns an empty array on any
 * DB error so the UI can render a safe empty state instead of crashing.
 */
export async function getAllThemes(): Promise<ThemeViewModel[]> {
  try {
    const rows = await prisma.theme.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    return rows.map((t) => ({
      slug: t.name,
      title: t.title,
      description: t.description,
      ...presentationFor(t.name),
    }));
  } catch (err) {
    console.error("[courses-db] getAllThemes failed:", err);
    return [];
  }
}

/**
 * Fetch a theme + its courses by slug. The caller MUST pass a value that
 * has already been validated by `themeNameSchema`. Returns `null` when
 * the theme doesn't exist, so the page can call `notFound()`.
 */
export async function getThemeWithCourses(
  slug: ThemeName
): Promise<ThemeWithCoursesViewModel | null> {
  try {
    const theme = await prisma.theme.findUnique({
      where: { name: slug },
      include: {
        courses: {
          orderBy: [{ levelLabel: "asc" }, { title: "asc" }],
        },
      },
    });

    if (!theme) return null;

    return {
      slug: theme.name,
      title: theme.title,
      description: theme.description,
      ...presentationFor(theme.name),
      courses: theme.courses.map((c) => ({
        id: c.id,
        title: c.title || c.name,
        description: c.description,
        level: c.levelLabel,
        duration: c.duration,
      })),
    };
  } catch (err) {
    console.error("[courses-db] getThemeWithCourses failed:", err);
    return null;
  }
}
