import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "aqacademy_session";

function getSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

/**
 * SECURITY: Next.js middleware runs on every request before page/route handlers.
 *
 * Protections:
 *  1. Dashboard route protection — redirects unauthenticated users to /login
 *  2. Security-hardening HTTP headers on all responses
 */
export async function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // ---- 1. Dashboard route protection --------------------------------------
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const secret = getSecret();

    if (!token || !secret) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, secret);
    } catch {
      // Token invalid or expired — clear cookie and redirect
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set({ name: COOKIE_NAME, value: "", maxAge: 0, path: "/" });
      return res;
    }
  }

  const response = NextResponse.next();

  // ---- 2. Content-Security-Policy ----------------------------------------
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-src https://www.youtube.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
