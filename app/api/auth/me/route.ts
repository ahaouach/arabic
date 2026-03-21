import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_OPTIONS.name)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  });
}
