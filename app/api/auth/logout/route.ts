import { NextRequest, NextResponse } from "next/server";
import { validateOrigin, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_OPTIONS.name,
    value: "",
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: COOKIE_OPTIONS.path,
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
