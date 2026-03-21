/**
 * SECURITY: Authentication helpers.
 *
 * - Passwords are hashed with bcrypt (cost factor 12).
 * - Sessions are issued as signed JWTs using the HS256 algorithm.
 * - The JWT_SECRET is read exclusively from environment variables;
 *   it is never shipped to the browser.
 * - Tokens are stored in HTTP-only, Secure, SameSite=Strict cookies so
 *   they are inaccessible to JavaScript (XSS-resistant).
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// ---- Configuration -------------------------------------------------------

const BCRYPT_ROUNDS = 12; // Recommended minimum; increase = slower but more secure
const JWT_EXPIRES_IN = "7d"; // Token lifetime
const COOKIE_NAME = "aqacademy_session";

/** Derive a Uint8Array secret for jose from the environment variable */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a 64-char random hex string in .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

// ---- Password utilities --------------------------------------------------

/**
 * Hash a plain-text password using bcrypt.
 * NEVER store or log the plain-text password.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored hash.
 * Uses bcrypt's constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

// ---- JWT utilities -------------------------------------------------------

export interface SessionPayload {
  sub: string;   // user ID
  email: string;
  name: string;
  role: string;  // admin | teacher | parent | student
  iat?: number;
  exp?: number;
}

/** Create a signed JWT for the given user payload */
export async function createToken(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

/** Verify and decode a JWT — returns null if invalid or expired */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    // Token is invalid, expired, or tampered with
    return null;
  }
}

// ---- Cookie helpers ------------------------------------------------------

export const COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  httpOnly: true,                    // Not accessible via document.cookie (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict" as const,       // Prevents CSRF token-theft via cross-site requests
  path: "/",
  maxAge: 60 * 60 * 24 * 7,         // 7 days in seconds
};

// ---- Origin validation (CSRF) --------------------------------------------

/**
 * SECURITY: Validates that the request Origin matches the expected app URL.
 * State-changing API routes call this to block cross-origin requests (CSRF).
 */
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!origin) return false; // Reject requests with no Origin header
  try {
    const originUrl = new URL(origin);
    const appUrlObj = new URL(appUrl);
    return originUrl.origin === appUrlObj.origin;
  } catch {
    return false;
  }
}

