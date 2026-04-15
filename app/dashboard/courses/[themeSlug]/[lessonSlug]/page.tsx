import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";
import LessonAdventure from "@/components/ui/LessonAdventure";
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
