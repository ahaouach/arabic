import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, forbidden, notFound } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/schedule/[id] — cancel a lesson (owner only)
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const { id } = await params;

  // Verify the lesson exists and belongs to this parent (via student participants)
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { participants: { select: { studentId: true } } },
  });

  if (!lesson) return notFound("Lesson not found");

  const studentIds = lesson.participants.map((p) => p.studentId);
  const ownedStudent = await prisma.student.findFirst({
    where: { id: { in: studentIds }, parentId: session.sub },
  });

  if (!ownedStudent) return forbidden();

  const updated = await prisma.lesson.update({
    where: { id },
    data: { status: "cancelled" },
    include: {
      teacher: { include: { user: { select: { name: true } } } },
      participants: { select: { studentId: true } },
    },
  });

  return NextResponse.json({
    lesson: {
      id: updated.id,
      teacher: {
        id: updated.teacher.id,
        name: updated.teacher.user.name,
        specialities: updated.teacher.specialities,
        initials: updated.teacher.initials,
        colorClass: updated.teacher.colorClass,
      },
      childrenIds: updated.participants.map((p) => p.studentId),
      program: updated.program,
      date: updated.date.toISOString().split("T")[0],
      time: updated.time,
      status: updated.status,
      createdAt: updated.createdAt.toISOString().split("T")[0],
    },
  });
}
