import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_OPTIONS } from "./auth";
import type { SessionPayload } from "./auth";

/** Extract and verify the session from the request cookie. Returns null if missing/invalid. */
export async function getSessionUser(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_OPTIONS.name)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function notFound(message = "Not found"): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}
