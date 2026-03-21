import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, forbidden, notFound, badRequest } from "@/lib/api-auth";

const studentSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  age: z.number().int().min(4).max(18),
  arabicLevel: z.object({
    reading: z.enum(["Beginner", "Intermediate", "Advanced"]),
    writing: z.enum(["Beginner", "Intermediate", "Advanced"]),
    speaking: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  }),
  notes: z.string().trim().max(1000).default(""),
});

function formatStudent(s: {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  arabicLevelReading: string;
  arabicLevelWriting: string;
  arabicLevelSpeaking: string | null;
  notes: string;
  createdAt: Date;
}) {
  return {
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    age: s.age,
    arabicLevel: {
      reading: s.arabicLevelReading,
      writing: s.arabicLevelWriting,
      ...(s.arabicLevelSpeaking ? { speaking: s.arabicLevelSpeaking } : {}),
    },
    notes: s.notes,
    createdAt: s.createdAt.toISOString().split("T")[0],
  };
}

type Params = { params: Promise<{ id: string }> };

// PATCH /api/students/[id] — update a student (owner only)
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const { id } = await params;

  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return notFound("Student not found");
  if (student.parentId !== session.sub) return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const result = studentSchema.safeParse(body);
  if (!result.success) {
    return badRequest(result.error.issues[0]?.message ?? "Validation failed");
  }

  const { firstName, lastName, age, arabicLevel, notes } = result.data;

  const updated = await prisma.student.update({
    where: { id },
    data: {
      firstName,
      lastName,
      age,
      arabicLevelReading: arabicLevel.reading,
      arabicLevelWriting: arabicLevel.writing,
      arabicLevelSpeaking: arabicLevel.speaking ?? null,
      notes,
    },
  });

  return NextResponse.json({ student: formatStudent(updated) });
}

// DELETE /api/students/[id] — delete a student (owner only)
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const { id } = await params;

  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return notFound("Student not found");
  if (student.parentId !== session.sub) return forbidden();

  await prisma.student.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
