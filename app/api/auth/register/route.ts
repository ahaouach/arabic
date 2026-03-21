/**
 * SECURITY: Registration API route.
 *
 * Protections:
 *  1. Origin validation (CSRF)
 *  2. Rate limiting (shared with login limiter — 5/min per IP)
 *  3. Server-side Zod validation
 *  4. Honeypot check
 *  5. bcrypt password hashing before any storage
 *  6. Duplicate email check
 */

import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { hashPassword, createToken, COOKIE_OPTIONS, validateOrigin } from "@/lib/auth";
import { loginRateLimiter } from "@/lib/rateLimit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // ---- 1. CSRF -----------------------------------------------------------
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ---- 2. Rate limiting --------------------------------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { success: allowed } = loginRateLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // ---- 3. Parse & validate body ------------------------------------------
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = registerSchema.safeParse(rawBody);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const { name, email, password, website } = result.data;

  // ---- 4. Honeypot check -------------------------------------------------
  if (website && website.length > 0) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // ---- 5. Sanitize inputs ------------------------------------------------
  const cleanEmail = sanitizeEmail(email);
  const cleanName = sanitizeText(name);

  // ---- 6. Duplicate email check ------------------------------------------
  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  // ---- 7. Hash password (bcrypt, cost factor 12) -------------------------
  const passwordHash = await hashPassword(password);

  // ---- 8. Persist user ---------------------------------------------------
  const newUser = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: "parent",
    },
  });

  // ---- 9. Issue JWT & set HTTP-only cookie --------------------------------
  const token = await createToken({
    sub: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  });

  const response = NextResponse.json(
    { success: true, name: newUser.name },
    { status: 201 }
  );

  response.cookies.set({
    name: COOKIE_OPTIONS.name,
    value: token,
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: COOKIE_OPTIONS.path,
    maxAge: COOKIE_OPTIONS.maxAge,
  });

  return response;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
