/**
 * SECURITY: Password change API.
 *
 * PATCH /api/user/password
 *
 * Protections:
 *  1. CSRF: Origin validation
 *  2. Authentication: valid session required
 *  3. Current password verified with bcrypt before any change
 *  4. New password validated (strength rules via Zod)
 *  5. New password hashed with bcrypt (cost 12) before storage
 *  6. passwordHash never returned in any response
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";
import { validateOrigin, verifyPassword, hashPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation";

export async function PATCH(request: NextRequest) {
  // ---- CSRF ----------------------------------------------------------------
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  // ---- Parse & validate ----------------------------------------------------
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const result = changePasswordSchema.safeParse(rawBody);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Invalid input";
    return badRequest(firstError);
  }

  const { currentPassword, newPassword } = result.data;

  // ---- Fetch current hash (never exposed outside this function) ------------
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { passwordHash: true },
  });

  if (!user) return unauthorized();

  // ---- Verify current password (constant-time bcrypt compare) --------------
  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { error: "Incorrect current password." },
      { status: 400 }
    );
  }

  // ---- Hash new password and update ----------------------------------------
  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: session.sub },
    data: { passwordHash },
  });

  return NextResponse.json({ message: "Password updated successfully." });
}
