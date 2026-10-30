/**
 * GET /api/themes — list all course themes (Arabic, Quran, Islamic).
 *
 * SECURITY:
 *  - Auth required.
 *  - No user input → no validation needed beyond auth.
 *  - Returns sanitized view-models from `getAllThemes` (which already
 *    strips internal fields and merges static UI presentation data).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorized } from "@/lib/api-auth";
import { getAllThemes } from "@/lib/courses-db";

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const themes = await getAllThemes();
  return NextResponse.json({ themes });
}
