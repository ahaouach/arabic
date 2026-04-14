/**
 * Prisma seed script.
 *
 * Run with:  npx prisma db seed
 *
 * Creates:
 *  - 1 admin user
 *  - 4 teacher users (with Teacher profiles)
 *  - 2 parent users (each with 2 students enrolled in courses)
 *  - 4 Arabic courses + 2 Quran courses
 *  - 5 homework assignments
 *  - 5 community posts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function hash(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Themes --------------------------------------------------------------
  // `name` is the URL-safe slug; `title` is the display label.
  const themeSeeds = [
    { name: "arabic", title: "Arabic", description: "Letters, words & stories", sortOrder: 1 },
    { name: "islamic", title: "Islamic", description: "Values, stories & duas", sortOrder: 2 },
    { name: "quran", title: "Quran", description: "Memorize with Tajweed", sortOrder: 3 },
    { name: "others", title: "Others", description: "Games, crafts & more", sortOrder: 4 },
  ];
  for (const t of themeSeeds) {
    await prisma.theme.upsert({
      where: { name: t.name },
      update: { title: t.title, description: t.description, sortOrder: t.sortOrder },
      create: t,
    });
  }
  console.log("  ✓ Themes seeded");

  // ---- Courses -------------------------------------------------------------
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course_arabic_1" },
      update: {},
      create: {
        id: "course_arabic_1",
        name: "Arabic Level 1",
        level: 1,
        program: "Arabic",
        description: "Introduction to the Arabic alphabet and basic vocabulary.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_2" },
      update: {},
      create: {
        id: "course_arabic_2",
        name: "Arabic Level 2",
        level: 2,
        program: "Arabic",
        description: "Reading sentences and expanding vocabulary.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_3" },
      update: {},
      create: {
        id: "course_arabic_3",
        name: "Arabic Level 3",
        level: 3,
        program: "Arabic",
        description: "Short stories and basic grammar.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_arabic_4" },
      update: {},
      create: {
        id: "course_arabic_4",
        name: "Arabic Level 4",
        level: 4,
        program: "Arabic",
        description: "Intermediate reading, writing, and conversation.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_1" },
      update: {},
      create: {
        id: "course_quran_1",
        name: "Quran Level 1",
        level: 1,
        program: "Quran",
        description: "Noorani Qaida and basic Tajweed rules.",
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_2" },
      update: {},
      create: {
        id: "course_quran_2",
        name: "Quran Level 2",
        level: 2,
        program: "Quran",
        description: "Memorisation of short surahs with correct Tajweed.",
      },
    }),
  ]);

  // ---- Admin ---------------------------------------------------------------
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@aqacademy.com" },
    update: {},
    create: {
      email: "admin@aqacademy.com",
      name: "Admin",
      passwordHash: await hash("Admin1234!"),
      role: "admin",
    },
  });
  console.log("  ✓ Admin:", adminUser.email);

  // ---- Teachers ------------------------------------------------------------
  const teacherData = [
    {
      email: "amira@aqacademy.com",
      name: "Prof. Amira",
      initials: "PA",
      colorClass: "bg-primary-100 text-primary-700",
      specialities: ["Arabic"] as const,
    },
    {
      email: "kamal@aqacademy.com",
      name: "Prof. Kamal",
      initials: "PK",
      colorClass: "bg-purple-100 text-purple-700",
      specialities: ["Arabic"] as const,
    },
    {
      email: "yusuf@aqacademy.com",
      name: "Sheikh Yusuf",
      initials: "SY",
      colorClass: "bg-amber-100 text-amber-700",
      specialities: ["Quran"] as const,
    },
    {
      email: "fatima@aqacademy.com",
      name: "Ustadha Fatima",
      initials: "UF",
      colorClass: "bg-rose-100 text-rose-700",
      specialities: ["Arabic", "Quran"] as const,
    },
  ];

  const teachers = await Promise.all(
    teacherData.map(async (td) => {
      const user = await prisma.user.upsert({
        where: { email: td.email },
        update: {},
        create: {
          email: td.email,
          name: td.name,
          passwordHash: await hash("Teacher1234!"),
          role: "teacher",
        },
      });
      const teacher = await prisma.teacher.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          initials: td.initials,
          colorClass: td.colorClass,
          specialities: [...td.specialities],
        },
      });
      console.log("  ✓ Teacher:", td.name);
      return { user, teacher };
    })
  );

  const [amira, kamal, yusuf, fatima] = teachers;

  // ---- Parent 1 + students -------------------------------------------------
  const parent1 = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo Parent",
      passwordHash: await hash("Demo1234"),
      role: "parent",
    },
  });
  console.log("  ✓ Parent 1:", parent1.email);

  const student1 = await prisma.student.upsert({
    where: { id: "stu_001" },
    update: {},
    create: {
      id: "stu_001",
      firstName: "Ahmed",
      lastName: "Benali",
      age: 8,
      arabicLevelReading: "Intermediate",
      arabicLevelWriting: "Beginner",
      arabicLevelSpeaking: "Intermediate",
      notes: "Very motivated — progressing well in reading.",
      parentId: parent1.id,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { id: "stu_002" },
    update: {},
    create: {
      id: "stu_002",
      firstName: "Sara",
      lastName: "Mansouri",
      age: 6,
      arabicLevelReading: "Beginner",
      arabicLevelWriting: "Beginner",
      notes: "",
      parentId: parent1.id,
    },
  });

  // ---- Parent 2 + students -------------------------------------------------
  const parent2 = await prisma.user.upsert({
    where: { email: "parent2@example.com" },
    update: {},
    create: {
      email: "parent2@example.com",
      name: "Karim Benali",
      passwordHash: await hash("Parent1234!"),
      role: "parent",
    },
  });
  console.log("  ✓ Parent 2:", parent2.email);

  const student3 = await prisma.student.upsert({
    where: { id: "stu_003" },
    update: {},
    create: {
      id: "stu_003",
      firstName: "Youssef",
      lastName: "Karim",
      age: 10,
      arabicLevelReading: "Advanced",
      arabicLevelWriting: "Intermediate",
      arabicLevelSpeaking: "Advanced",
      notes: "Ready to move to Quran recitation.",
      parentId: parent2.id,
    },
  });

  // ---- Enrollments ---------------------------------------------------------
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student1.id, courseId: courses[2].id } },
    update: {},
    create: { studentId: student1.id, courseId: courses[2].id },
  });
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student2.id, courseId: courses[0].id } },
    update: {},
    create: { studentId: student2.id, courseId: courses[0].id },
  });
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student3.id, courseId: courses[4].id } },
    update: {},
    create: { studentId: student3.id, courseId: courses[4].id },
  });
  console.log("  ✓ Enrollments created");

  // ---- Homework ------------------------------------------------------------
  const daysFromNow = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  const hw1 = await prisma.homework.upsert({
    where: { id: "hw_001" },
    update: {},
    create: {
      id: "hw_001",
      title: "Arabic Alphabet Writing Practice",
      description:
        "Complete the letter-tracing worksheet. Write each letter 5 times in its initial, medial, and final forms.",
      pdfUrl: "/mock-pdfs/arabic-alphabet-practice.pdf",
      dueDate: daysFromNow(2),
      courseId: courses[2].id,
      teacherId: amira.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_002" },
    update: {},
    create: {
      id: "hw_002",
      title: "Vocabulary List — Animals (Lesson 3)",
      description:
        "Study the 20 animal vocabulary words from Lesson 3. Write a sentence using each word.",
      pdfUrl: "/mock-pdfs/vocabulary-animals-lesson3.pdf",
      dueDate: daysFromNow(-1),
      courseId: courses[2].id,
      teacherId: amira.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_003" },
    update: {},
    create: {
      id: "hw_003",
      title: "Short Story Reading — المطر",
      description:
        'Read the short story "المطر" (The Rain). Answer the 5 comprehension questions on page 2.',
      pdfUrl: "/mock-pdfs/short-story-almattar.pdf",
      dueDate: daysFromNow(5),
      courseId: courses[2].id,
      teacherId: kamal.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_004" },
    update: {},
    create: {
      id: "hw_004",
      title: "Surah Al-Fatiha — Memorisation Sheet",
      description:
        "Memorise Surah Al-Fatiha with correct Tajweed. Record a voice note or video.",
      pdfUrl: "/mock-pdfs/surah-fatiha-memorisation.pdf",
      dueDate: daysFromNow(4),
      courseId: courses[4].id,
      teacherId: yusuf.teacher.id,
    },
  });

  await prisma.homework.upsert({
    where: { id: "hw_005" },
    update: {},
    create: {
      id: "hw_005",
      title: "Tajweed Rules — Idgham Worksheet",
      description:
        "Complete the Idgham exercises on pages 3–5. Underline every occurrence of Idgham.",
      pdfUrl: "/mock-pdfs/tajweed-idgham.pdf",
      dueDate: daysFromNow(-3),
      courseId: courses[4].id,
      teacherId: yusuf.teacher.id,
    },
  });

  // Pre-create a submission for hw_002 (student1 already submitted)
  await prisma.submission.upsert({
    where: { homeworkId_studentId: { homeworkId: "hw_002", studentId: student1.id } },
    update: {},
    create: {
      homeworkId: "hw_002",
      studentId: student1.id,
      fileName: "ahmed_vocab_animals.pdf",
      fileSize: 1_240_000,
      fileType: "application/pdf",
      comment: "Ahmed worked hard on this!",
      status: "submitted",
    },
  });

  console.log("  ✓ Homework + submissions created");

  // ---- Community Posts -----------------------------------------------------
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000);
  const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

  await prisma.post.upsert({
    where: { id: "post_001" },
    update: {},
    create: {
      id: "post_001",
      contentType: "text",
      text: "Welcome to the AQ Academy community!\n\nThis is your space to stay connected with what's happening in class, see your children's progress, and ask questions.",
      tags: ["Announcement", "Welcome"],
      createdAt: daysAgo(5),
      teacherId: amira.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_002" },
    update: {},
    create: {
      id: "post_002",
      contentType: "video",
      text: "New lesson on Tajweed rules!\n\nIn this video, I cover the rules of Idgham with Ghunnah. Practice with your child for 10 minutes each day.",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["Quran", "Tajweed", "Level 2"],
      createdAt: daysAgo(3),
      teacherId: yusuf.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_003" },
    update: {},
    create: {
      id: "post_003",
      contentType: "image",
      text: "Look at the beautiful Arabic calligraphy our Level 3 students produced this week!\n\nThey practised the letter ع in its four forms. So proud of their progress!",
      mediaUrl: "/mock-images/calligraphy-class.jpg",
      tags: ["Arabic Level 3", "Calligraphy", "Student Work"],
      createdAt: daysAgo(2),
      teacherId: amira.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_004" },
    update: {},
    create: {
      id: "post_004",
      contentType: "pdf",
      text: "Practice sheet for this week — Arabic Vocabulary (Lesson 5)\n\nComplete pages 1 and 2 before Thursday's class.",
      fileName: "vocabulary-lesson-5-practice.pdf",
      fileUrl: "/mock-pdfs/vocabulary-lesson-5-practice.pdf",
      tags: ["Arabic Level 2", "Vocabulary", "Exercise"],
      createdAt: daysAgo(1),
      teacherId: kamal.teacher.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post_005" },
    update: {},
    create: {
      id: "post_005",
      contentType: "text",
      text: "Weekly tip: The best way to help your child remember new Arabic words is to label objects around the house!\n\nPrint small labels in Arabic and stick them on furniture and everyday objects.",
      tags: ["Tips for Parents", "Arabic", "Vocabulary"],
      createdAt: hoursAgo(6),
      teacherId: fatima.teacher.id,
    },
  });

  // Seed some comments
  await prisma.comment.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "c_001",
        postId: "post_001",
        authorId: parent1.id,
        text: "Thank you Prof. Amira! We're really excited to start.",
        createdAt: daysAgo(5),
      },
      {
        id: "c_002",
        postId: "post_002",
        authorId: parent2.id,
        text: "Jazakallah khayran Sheikh! Sara watched it twice already.",
        createdAt: daysAgo(3),
      },
      {
        id: "c_003",
        postId: "post_003",
        authorId: parent1.id,
        text: "This is amazing work! My daughter is so proud of herself.",
        createdAt: daysAgo(2),
      },
    ],
  });

  console.log("  ✓ Community posts + comments created");

  // ---- Subscription for demo parent ----------------------------------------
  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setDate(renewalDate.getDate() + 12);
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 2);

  const sub = await prisma.subscription.upsert({
    where: { userId: parent1.id },
    update: {},
    create: {
      userId: parent1.id,
      planId: "starter",
      status: "active",
      startDate,
      renewalDate,
    },
  });

  await prisma.invoice.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "INV-2026-001",
        subscriptionId: sub.id,
        userId: parent1.id,
        amount: 129,
        currency: "€",
        plan: "Individual Monthly",
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      },
      {
        id: "INV-2026-002",
        subscriptionId: sub.id,
        userId: parent1.id,
        amount: 129,
        currency: "€",
        plan: "Individual Monthly",
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      },
      {
        id: "INV-2026-003",
        subscriptionId: sub.id,
        userId: parent1.id,
        amount: 129,
        currency: "€",
        plan: "Individual Monthly",
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    ],
  });

  console.log("  ✓ Subscription + invoices created");
  console.log("\n✅ Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  Parent:  demo@example.com / Demo1234");
  console.log("  Teacher: amira@aqacademy.com / Teacher1234!");
  console.log("  Admin:   admin@aqacademy.com / Admin1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
