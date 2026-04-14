import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const parsed = QuerySchema.safeParse({
    name: request.nextUrl.searchParams.get("name") ?? undefined,
  });
  if (!parsed.success) return badRequest("Invalid query parameters");

  const themes = await prisma.theme.findMany({
    where: parsed.data.name ? { name: parsed.data.name } : undefined,
    select: { id: true, name: true, title: true, description: true, sortOrder: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ themes });
}
