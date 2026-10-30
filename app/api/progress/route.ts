/**
 * POST /api/progress — save a learner's lesson attempt.
 *
 * SECURITY:
 *  1. **Auth** — session cookie required; unauthenticated → 401.
 *  2. **CSRF** — state-changing; Origin header must match app URL.
 *  3. **Input validation (Zod)** — body parsed against
 *     `progressSubmissionSchema`. Bad shape → 400.
 *  4. **Server-side grading** — exercise steps loaded from the DB by
 *     id, then re-graded against the canonical `correctAnswer` /
 *     `pairs`. The client cannot forge a score: it can only send
 *     answer values, which are checked here.
 *  5. **Score integrity** — `upsertLessonProgress` only ever advances
 *     `score` (max of old/new) and keeps `completed` sticky.
 *  6. **No DB leakage** — errors are logged and surfaced as generic 500.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";
import { validateOrigin } from "@/lib/auth";
import {
  progressSubmissionSchema,
  gradeExerciseStep,
} from "@/lib/lessons-schema";
import {
  getLessonExercisesForGrading,
  upsertLessonProgress,
} from "@/lib/lessons-db";

export async function POST(request: NextRequest) {
  // 1. CSRF
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  // 2. Auth
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  // 3. Input validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const parsed = progressSubmissionSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid submission");

  const { lessonId, answers } = parsed.data;

  // 4. Load canonical lesson exercises for server-side grading
  const lesson = await getLessonExercisesForGrading(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // 5. Grade each answer against the DB exercise
  const exerciseById = new Map(lesson.exercises.map((ex) => [ex.id, ex]));
  const maxScore = lesson.exercises.reduce((s, ex) => s + ex.points, 0);

  let score = 0;
  let correctCount = 0;
  for (const ans of answers) {
    const ex = exerciseById.get(ans.exerciseId);
    if (!ex) continue; // ignore unknown ids
    if (gradeExerciseStep(ex, ans.value)) {
      score += ex.points;
      correctCount += 1;
    }
  }

  // Completion:
  //  - Vocab-only lessons (0 exercises) auto-complete on submit.
  //  - Exercise lessons need every exercise answered correctly.
  // Partial attempts still persist their best score so progress feels
  // rewarding even when not 100%.
  const completed =
    lesson.exercises.length === 0 ||
    (correctCount === lesson.exercises.length &&
      answers.length >= lesson.exercises.length);

  try {
    const result = await upsertLessonProgress({
      userId: session.sub,
      lessonId,
      score,
      maxScore,
      completed,
    });

    return NextResponse.json({
      score: result.score,
      maxScore: result.maxScore,
      completed: result.completed,
      attempts: result.attempts,
      correctThisAttempt: correctCount,
      totalExercises: lesson.exercises.length,
    });
  } catch (err) {
    console.error("[api/progress] upsert failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
