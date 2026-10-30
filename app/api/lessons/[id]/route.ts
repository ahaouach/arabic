/**
 * GET /api/lessons/[id] — fetch a single lesson by id.
 *
 * SECURITY:
 *  - Auth required.
 *  - The id path param is validated by `idParamSchema` (alphanumeric +
 *    `_` / `-`, 1–64 chars) before any DB query.
 *  - The returned payload is a sanitized `LessonViewModel` produced by
 *    `lessons-db` (which itself parses the stored JSON through Zod).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";
import { idParamSchema } from "@/lib/lessons-schema";
import { getPublicLessonById } from "@/lib/lessons-db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const parsed = idParamSchema.safeParse(id);
  if (!parsed.success) return badRequest("Invalid lesson id");

  const lesson = await getPublicLessonById(parsed.data);
  if (!lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ lesson });
}
