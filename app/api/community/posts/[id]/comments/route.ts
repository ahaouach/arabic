import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, notFound, badRequest } from "@/lib/api-auth";
import { commentRateLimiter } from "@/lib/rateLimit";

const commentSchema = z.object({
  text: z.string().trim().min(1, "Comment cannot be empty").max(2000),
});

type Params = { params: Promise<{ id: string }> };

// POST /api/community/posts/[id]/comments — add a comment to a post
export async function POST(request: NextRequest, { params }: Params) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  // Rate limiting per user
  const { success } = commentRateLimiter.check(session.sub);
  if (!success) {
    return NextResponse.json(
      { error: "Too many comments. Please slow down." },
      { status: 429 }
    );
  }

  const { id: postId } = await params;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return notFound("Post not found");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const result = commentSchema.safeParse(body);
  if (!result.success) {
    return badRequest(result.error.issues[0]?.message ?? "Validation failed");
  }

  const comment = await prisma.comment.create({
    data: {
      text: result.data.text,
      postId,
      authorId: session.sub,
    },
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });

  return NextResponse.json({
    comment: {
      id: comment.id,
      author: {
        id: comment.author.id,
        name: comment.author.name,
        role: comment.author.role as "parent" | "student" | "teacher",
      },
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    },
  }, { status: 201 });
}
