import { notFound } from "next/navigation";
import { themeNameSchema } from "@/lib/courses-db";
import { getLessonByPath } from "@/lib/lessons-db";
import { idParamSchema } from "@/lib/lessons-schema";
import { requireUser, type Role } from "@/lib/server-auth";
import LessonPlayer from "@/components/courses/lesson/LessonPlayer";

interface PageProps {
  params: Promise<{ theme: string; level: string; lessonId: string }>;
}

export const dynamic = "force-dynamic";

const ALLOWED_ROLES: readonly Role[] = ["admin", "teacher", "parent", "student"];

/**
 * Interactive lesson page — renders the client-side LessonPlayer.
 *
 * SECURITY (layered):
 *  1. Auth + role check via `requireUser`.
 *  2. Zod validation on every URL segment (theme, level slug, lessonId).
 *  3. `getLessonByPath` joins on the full hierarchy in a single query so
 *     a forged URL like `/courses/quran/level-1/<arabic-lesson>` 404s.
 *  4. Stored `steps` JSON parsed through Zod; corrupted payload → 404.
 *  5. Only a sanitized `LessonViewModel` reaches the client.
 */
export default async function LessonPage({ params }: PageProps) {
  const user = await requireUser(ALLOWED_ROLES);
  const { theme: rawTheme, level: rawLevel, lessonId: rawLessonId } = await params;

  const themeResult = themeNameSchema.safeParse(rawTheme);
  const levelResult = idParamSchema.safeParse(rawLevel);
  const lessonIdResult = idParamSchema.safeParse(rawLessonId);
  if (!themeResult.success || !levelResult.success || !lessonIdResult.success) {
    notFound();
  }

  const lesson = await getLessonByPath({
    themeName: themeResult.data,
    levelSlug: levelResult.data,
    lessonId: lessonIdResult.data,
    userId: user.sub,
  });
  if (!lesson) notFound();

  const backHref = `/dashboard/courses/${encodeURIComponent(
    themeResult.data
  )}/${encodeURIComponent(levelResult.data)}`;

  return (
    <div className="p-6">
      <LessonPlayer lesson={lesson} backHref={backHref} />
    </div>
  );
}
