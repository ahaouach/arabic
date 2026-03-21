import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/api-auth";

// GET /api/community/posts — return all posts with comments (authenticated)
export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      teacher: {
        include: { user: { select: { name: true } } },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });

  const formatted = posts.map((post) => ({
    id: post.id,
    teacher: {
      id: post.teacher.id,
      name: post.teacher.user.name,
      initials: post.teacher.initials,
      colorClass: post.teacher.colorClass,
    },
    contentType: post.contentType,
    text: post.text,
    mediaUrl: post.mediaUrl ?? undefined,
    fileName: post.fileName ?? undefined,
    fileUrl: post.fileUrl ?? undefined,
    tags: post.tags,
    createdAt: post.createdAt.toISOString(),
    comments: post.comments.map((c) => ({
      id: c.id,
      author: {
        id: c.author.id,
        name: c.author.name,
        role: c.author.role as "parent" | "student" | "teacher",
      },
      text: c.text,
      createdAt: c.createdAt.toISOString(),
    })),
  }));

  return NextResponse.json({ posts: formatted });
}
