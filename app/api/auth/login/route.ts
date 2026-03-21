/**
 * SECURITY: Login API route.
 *
 * Protections:
 *  1. Origin validation (CSRF)
 *  2. Rate limiting: 5 attempts per minute per IP (brute-force protection)
 *  3. Server-side Zod validation
 *  4. Honeypot check
 *  5. bcrypt password comparison (constant-time)
 *  6. Generic error messages (user enumeration prevention)
 *  7. JWT issued and stored in HTTP-only, Secure, SameSite=Strict cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { verifyPassword, createToken, COOKIE_OPTIONS, validateOrigin } from "@/lib/auth";
import { loginRateLimiter } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // ---- 1. CSRF: Origin validation ----------------------------------------
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ---- 2. Rate limiting --------------------------------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { success: allowed, resetAt } = loginRateLimiter.check(ip);
  if (!allowed) {
    const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSecs) },
      }
    );
  }

  // ---- 3. Parse & validate body ------------------------------------------
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = loginSchema.safeParse(rawBody);
  if (!result.success) {
    // SECURITY: Generic error — do not reveal which field failed
    return NextResponse.json({ error: "Invalid email or password." }, { status: 422 });
  }

  const { email, password, website } = result.data;

  // ---- 4. Honeypot check -------------------------------------------------
  if (website && website.length > 0) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // ---- 5. Look up user ---------------------------------------------------
  const user = await prisma.user.findUnique({ where: { email } });

  // SECURITY: Always run bcrypt even if user not found, to prevent timing attacks
  const dummyHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0oSUGqhZhW";
  const passwordToCheck = user?.passwordHash ?? dummyHash;

  const passwordValid = await verifyPassword(password, passwordToCheck);

  if (!user || !passwordValid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // ---- 6. Issue JWT -------------------------------------------------------
  const token = await createToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // ---- 7. Set HTTP-only cookie -------------------------------------------
  const response = NextResponse.json(
    { success: true, name: user.name },
    { status: 200 }
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
