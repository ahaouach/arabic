/**
 * POST /api/audio/generate — on-demand TTS generation (admin/teacher).
 *
 * SECURITY:
 *  1. **Auth** — session cookie required.
 *  2. **Role** — admin or teacher only. Learners cannot trigger
 *     provider calls (would be an uncontrolled cost vector).
 *  3. **CSRF** — state-changing; Origin header must match app URL.
 *  4. **Input validation** — Zod: trim, min 1, max 500, reject
 *     control characters / angle brackets / backticks.
 *  5. **No key leakage** — the provider key is read from
 *     `process.env.OPENAI_API_KEY` inside `lib/audio.ts` and NEVER
 *     included in the response. Clients only see the resulting URL.
 *  6. **Safe filenames** — `lib/audio.ts` hashes the text to a hex
 *     string before touching the filesystem, so user input can never
 *     influence a path.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, unauthorized, forbidden, badRequest } from "@/lib/api-auth";
import { validateOrigin } from "@/lib/auth";
import { generateAudio } from "@/lib/audio";

const WRITE_ROLES = new Set(["admin", "teacher"]);

const bodySchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Text is required")
    .max(500, "Text too long")
    .regex(/^[^\u0000-\u001F<>`]+$/, "Invalid characters"),
  voice: z.string().trim().max(32).optional(),
});

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

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid text");

  const result = await generateAudio(parsed.data.text, {
    voice: parsed.data.voice,
  });

  if (!result) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  return NextResponse.json({
    url: result.url,
    cached: result.cached,
    generated: result.generated,
    // NOTE: never include the text input or any provider detail here.
  });
}
