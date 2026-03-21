import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, forbidden, notFound, badRequest } from "@/lib/api-auth";

const submitSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  fileSize: z.number().int().positive(),
  fileType: z.string().trim().min(1).max(100),
  comment: z.string().trim().max(1000).default(""),
});

type Params = { params: Promise<{ id: string }> };

// POST /api/homework/[id]/submit — submit homework for a student
export async function POST(request: NextRequest, { params }: Params) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const { id: homeworkId } = await params;

  // Verify homework exists
  const homework = await prisma.homework.findUnique({ where: { id: homeworkId } });
  if (!homework) return notFound("Homework not found");

  // Find a student belonging to this parent who is enrolled in this course
  const student = await prisma.student.findFirst({
    where: {
      parentId: session.sub,
      enrollments: { some: { courseId: homework.courseId } },
    },
  });

  if (!student) return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const result = submitSchema.safeParse(body);
  if (!result.success) {
    return badRequest(result.error.issues[0]?.message ?? "Validation failed");
  }

  const { fileName, fileSize, fileType, comment } = result.data;

  // Upsert: update existing submission or create new one
  const submission = await prisma.submission.upsert({
    where: { homeworkId_studentId: { homeworkId, studentId: student.id } },
    update: { fileName, fileSize, fileType, comment, status: "submitted", submittedAt: new Date() },
    create: { homeworkId, studentId: student.id, fileName, fileSize, fileType, comment },
  });

  return NextResponse.json({
    submission: {
      fileName: submission.fileName,
      fileSize: submission.fileSize,
      fileType: submission.fileType,
      comment: submission.comment,
      submittedAt: submission.submittedAt.toISOString().split("T")[0],
    },
  });
}

// DELETE /api/homework/[id]/submit — clear a submission (allow resubmission)
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const { id: homeworkId } = await params;

  const homework = await prisma.homework.findUnique({ where: { id: homeworkId } });
  if (!homework) return notFound("Homework not found");

  const student = await prisma.student.findFirst({
    where: {
      parentId: session.sub,
      enrollments: { some: { courseId: homework.courseId } },
    },
  });

  if (!student) return forbidden();

  await prisma.submission.deleteMany({
    where: { homeworkId, studentId: student.id },
  });

  return NextResponse.json({ success: true });
}
