import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/api-auth";

// GET /api/homework — return homework for all of the parent's students
export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  // Find all students belonging to this parent
  const students = await prisma.student.findMany({
    where: { parentId: session.sub },
    select: { id: true },
  });

  if (students.length === 0) {
    return NextResponse.json({ homeworks: [] });
  }

  const studentIds = students.map((s) => s.id);

  // Find all enrollments for these students
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: { in: studentIds } },
    select: { courseId: true, studentId: true },
  });

  const courseIds = [...new Set(enrollments.map((e) => e.courseId))];

  if (courseIds.length === 0) {
    return NextResponse.json({ homeworks: [] });
  }

  // Find all homework for those courses
  const homeworks = await prisma.homework.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { name: true } },
      submissions: {
        where: { studentId: { in: studentIds } },
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { dueDate: "asc" },
  });

  const formatted = homeworks.map((hw) => {
    const submission = hw.submissions[0];
    const status: "pending" | "submitted" | "reviewed" = submission
      ? submission.status === "reviewed"
        ? "reviewed"
        : "submitted"
      : "pending";

    return {
      id: hw.id,
      title: hw.title,
      description: hw.description,
      course: hw.course.name,
      pdfUrl: hw.pdfUrl,
      dueDate: hw.dueDate.toISOString().split("T")[0],
      status,
      submission: submission
        ? {
            fileName: submission.fileName,
            fileSize: submission.fileSize,
            fileType: submission.fileType,
            comment: submission.comment,
            submittedAt: submission.submittedAt.toISOString().split("T")[0],
          }
        : undefined,
    };
  });

  return NextResponse.json({ homeworks: formatted });
}
