/**
 * /api/lessons
 *   GET  ?theme=arabic   → list lessons in a theme (any authed user)
 *   POST                 → create a lesson (admin/teacher only)
 *
 * SECURITY:
 *  - Auth required on both verbs.
 *  - GET: `theme` query param validated by `themeNameSchema` before any
 *    DB touch (strict allowlist of lowercase letters).
 *  - POST: CSRF (Origin check), role check (admin/teacher), Zod
 *    validation of the entire body via `lessonCreateSchema`.
 *  - Errors are surfaced as generic 500 — no Prisma details leaked.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorized, forbidden, badRequest } from "@/lib/api-auth";
import { validateOrigin } from "@/lib/auth";
import { themeNameSchema } from "@/lib/courses-db";
import { lessonCreateSchema } from "@/lib/lessons-schema";
import { listLessonsByTheme, createLesson } from "@/lib/lessons-db";

const WRITE_ROLES = new Set(["admin", "teacher"]);

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const url = new URL(request.url);
  const themeRaw = url.searchParams.get("theme");
  if (!themeRaw) return badRequest("Missing 'theme' query parameter");

  const themeResult = themeNameSchema.safeParse(themeRaw);
  if (!themeResult.success) return badRequest("Invalid theme");

  const lessons = await listLessonsByTheme(themeResult.data);
  return NextResponse.json({ lessons });
}

export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();
  if (!WRITE_ROLES.has(session.role)) return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const parsed = lessonCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lesson", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await createLesson(parsed.data);
  if (!created) {
    return NextResponse.json({ error: "Could not create lesson" }, { status: 500 });
  }

  return NextResponse.json({ id: created.id }, { status: 201 });
}
