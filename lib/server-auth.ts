/**
 * SECURITY: Authentication + role helpers for Server Components.
 *
 * Dashboard routes are already protected by `proxy.ts` middleware, but
 * Server Components that need the authenticated user (for role checks or
 * personalization) should call `requireUser()` here. This keeps the
 * session-cookie logic in one place and never leaks the JWT to the client.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_OPTIONS, type SessionPayload } from "./auth";

export type Role = "admin" | "teacher" | "parent" | "student";

/** Read and verify the session cookie. Returns null if missing/invalid. */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_OPTIONS.name)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Require an authenticated user with one of the allowed roles.
 *
 * - Unauthenticated → redirect to /login (defence-in-depth; middleware
 *   should already have handled this).
 * - Authenticated but role not allowed → redirect to /dashboard.
 *
 * Prefer redirects over throwing so the user always lands on a safe page
 * and never sees a stack trace.
 */
export async function requireUser(
  allowedRoles?: readonly Role[]
): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
    redirect("/dashboard");
  }
  return user;
}
