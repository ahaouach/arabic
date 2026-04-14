/**
 * GET /api/levels?theme=arabic — list all levels (courses) within a theme.
 *
 * SECURITY:
 *  - Auth required.
 *  - The `theme` query param is validated by `themeNameSchema` (strict
 *    lowercase-letter allowlist) before any DB query.
 *  - Returns flat sanitized records (no internal Prisma rows).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";
import { themeNameSchema } from "@/lib/courses-db";
import { listLevelsByTheme } from "@/lib/lessons-db";

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const url = new URL(request.url);
  const themeRaw = url.searchParams.get("theme");
  if (!themeRaw) return badRequest("Missing 'theme' query parameter");

  const themeResult = themeNameSchema.safeParse(themeRaw);
  if (!themeResult.success) return badRequest("Invalid theme");

  const levels = await listLevelsByTheme(themeResult.data);
  return NextResponse.json({ levels });
}
