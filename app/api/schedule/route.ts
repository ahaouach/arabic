import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";

const bookingSchema = z.object({
  teacherId: z.string().min(1),
  childrenIds: z.array(z.string().min(1)).min(1),
  program: z.enum(["Arabic", "Quran"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

function formatLesson(lesson: {
  id: string;
  program: string;
  date: Date;
  time: string;
  status: string;
  createdAt: Date;
  teacher: {
    id: string;
    initials: string;
    colorClass: string;
    user: { name: string };
    specialities: string[];
  };
  participants: { studentId: string }[];
}) {
  return {
    id: lesson.id,
    teacher: {
      id: lesson.teacher.id,
      name: lesson.teacher.user.name,
      specialities: lesson.teacher.specialities,
      initials: lesson.teacher.initials,
      colorClass: lesson.teacher.colorClass,
    },
    childrenIds: lesson.participants.map((p) => p.studentId),
    program: lesson.program,
    date: lesson.date.toISOString().split("T")[0],
    time: lesson.time,
    status: lesson.status,
    createdAt: lesson.createdAt.toISOString().split("T")[0],
  };
}

// GET /api/schedule — return lessons, teachers, and children for the parent
export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  // Find all students for this parent
  const students = await prisma.student.findMany({
    where: { parentId: session.sub },
    include: {
      enrollments: { include: { course: { select: { name: true } } } },
    },
  });

  const studentIds = students.map((s) => s.id);

  // Find lessons where any of the parent's students participate
  const lessons = await prisma.lesson.findMany({
    where: {
      participants: { some: { studentId: { in: studentIds } } },
    },
    include: {
      teacher: {
        include: { user: { select: { name: true } } },
      },
      participants: { select: { studentId: true } },
    },
    orderBy: { date: "desc" },
  });

  // Find all teachers
  const teachers = await prisma.teacher.findMany({
    include: { user: { select: { name: true } } },
  });

  const formattedTeachers = teachers.map((t) => ({
    id: t.id,
    name: t.user.name,
    specialities: t.specialities,
    initials: t.initials,
    colorClass: t.colorClass,
  }));

  // Format children with their course name (from first enrollment)
  const children = students.map((s) => ({
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    course: s.enrollments[0]?.course.name ?? "No course",
  }));

  return NextResponse.json({
    lessons: lessons.map(formatLesson),
    teachers: formattedTeachers,
    children,
  });
}

// POST /api/schedule — book a new lesson
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

  const result = bookingSchema.safeParse(body);
  if (!result.success) {
    return badRequest(result.error.issues[0]?.message ?? "Validation failed");
  }

  const { teacherId, childrenIds, program, date, time } = result.data;

  // Verify the teacher exists
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { user: { select: { name: true } } },
  });

  if (!teacher) return badRequest("Teacher not found");

  // Verify all children belong to this parent
  const ownedStudentIds = (
    await prisma.student.findMany({
      where: { parentId: session.sub, id: { in: childrenIds } },
      select: { id: true },
    })
  ).map((s) => s.id);

  if (ownedStudentIds.length !== childrenIds.length) {
    return badRequest("Invalid student selection");
  }

  const lesson = await prisma.lesson.create({
    data: {
      program: program as "Arabic" | "Quran",
      date: new Date(date),
      time,
      teacherId,
      participants: {
        create: childrenIds.map((studentId) => ({ studentId })),
      },
    },
    include: {
      teacher: { include: { user: { select: { name: true } } } },
      participants: { select: { studentId: true } },
    },
  });

  return NextResponse.json({ lesson: formatLesson(lesson) }, { status: 201 });
}
