/**
 * SECURITY: User profile API.
 *
 * GET   /api/user/profile — return own profile (passwordHash never sent)
 * PATCH /api/user/profile — update firstName, lastName, phone, language
 *                           (session-scoped, Zod-validated, CSRF-protected)
 *
 * Language change also sets the aq_lang cookie so the UI reflects the
 * new language immediately without requiring a re-login.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";
import { validateOrigin } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validation";

// ---- GET /api/user/profile -----------------------------------------------

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      language: true,
    },
  });

  if (!user) return unauthorized();

  // If firstName/lastName not yet set, derive from composite name field
  const firstName = user.firstName ?? user.name.split(" ")[0] ?? "";
  const lastName  = user.lastName  ?? user.name.split(" ").slice(1).join(" ") ?? "";

  return NextResponse.json({
    user: {
      firstName,
      lastName,
      email: user.email,
      phone: user.phone ?? "",
      language: user.language ?? "fr",
    },
  });
}

// ---- PATCH /api/user/profile ---------------------------------------------

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

  const result = updateProfileSchema.safeParse(rawBody);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Invalid input";
    return badRequest(firstError);
  }

  const { firstName, lastName, phone, language } = result.data;
  const fullName = `${firstName} ${lastName}`.trim();

  // ---- Update DB (scoped to session user — cannot touch other users) -------
  const user = await prisma.user.update({
    where: { id: session.sub },
    data: {
      name: fullName,
      firstName,
      lastName,
      phone,
      language,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      language: true,
    },
  });

  const response = NextResponse.json({ user });

  // ---- Sync aq_lang cookie so UI language updates immediately --------------
  response.cookies.set({
    name: "aq_lang",
    value: language,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}
