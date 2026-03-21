import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";

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

/** Shape a DB student into the Student type used by the frontend */
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

// GET /api/students — return all students for the authenticated parent
export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const students = await prisma.student.findMany({
    where: { parentId: session.sub },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ students: students.map(formatStudent) });
}

// POST /api/students — create a new student for the authenticated parent
export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

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

  const student = await prisma.student.create({
    data: {
      firstName,
      lastName,
      age,
      arabicLevelReading: arabicLevel.reading,
      arabicLevelWriting: arabicLevel.writing,
      arabicLevelSpeaking: arabicLevel.speaking ?? null,
      notes,
      parentId: session.sub,
    },
  });

  return NextResponse.json({ student: formatStudent(student) }, { status: 201 });
}
