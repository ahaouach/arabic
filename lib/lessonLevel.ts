export type LessonLevel = "basic" | "intermediate" | "advanced";

export const LESSON_LEVELS: readonly LessonLevel[] = [
  "basic",
  "intermediate",
  "advanced",
] as const;

export function isLessonLevel(value: unknown): value is LessonLevel {
  return typeof value === "string" && (LESSON_LEVELS as readonly string[]).includes(value);
}
