/**
 * SECURITY: Zod schemas for step-based lesson content.
 *
 * A lesson is a JSON array of steps. Each step has a `type` discriminator
 * (intro / visual / exercise / completion). Exercise steps use a nested
 * `exerciseType` field for the exercise variant.
 *
 * These schemas are the trust boundary for two distinct flows:
 *
 *   1. **Reads** — `lessons-db.ts` parses every `steps` JSON column
 *      through `lessonStepsSchema` before exposing it to a renderer.
 *      A tampered or malformed row → caller returns `null` → 404.
 *
 *   2. **Writes** — `POST /api/lessons` parses incoming admin/teacher
 *      submissions through `lessonCreateSchema`. Bad input → 400.
 *
 *   3. **Progress submissions** — `POST /api/progress` parses learner
 *      answer payloads through `progressSubmissionSchema`. The server
 *      then re-grades against the canonical `steps` from the DB so the
 *      client cannot forge a score.
 *
 * No content sourced from the PDF is parsed at runtime — all lesson
 * data is authored internally and stored in the DB.
 */

import { z } from "zod";

// ---- Step variants --------------------------------------------------------

/**
 * Bounded URL string used for any audio asset reference. Stored as a
 * relative path under /public — never an arbitrary external URL.
 */
const audioUrl = z.string().trim().max(300).optional();

export const introStepSchema = z.object({
  type: z.literal("intro"),
  title: z.string().trim().min(1).max(120),
  text: z.string().trim().min(1).max(500),
  audioUrl,
});

export const visualStepSchema = z.object({
  type: z.literal("visual"),
  letter: z.string().trim().min(1).max(8),
  example: z.string().trim().min(1).max(64),
  translation: z.string().trim().min(1).max(64),
  audioUrl,
});

export const completionStepSchema = z.object({
  type: z.literal("completion"),
  message: z.string().trim().min(1).max(200),
});

/**
 * Vocabulary grid step — shows a set of items (emoji + Arabic + label)
 * all at once. Used for `cours` pages that introduce multiple words at
 * a time (numbers, colors, shapes). Each item may carry its own audio.
 */
export const vocabItemSchema = z.object({
  /** Display label in the learner's own language (e.g. "1", "Rouge"). */
  label: z.string().trim().max(64).optional(),
  /** Arabic word (always required — this is what's pronounced). */
  ar: z.string().trim().min(1).max(64),
  /** Emoji rendered above the label. */
  emoji: z.string().trim().max(16).default(""),
  /** Optional French gloss. */
  fr: z.string().trim().max(64).optional(),
  /** Same-origin audio URL for this item's pronunciation. */
  audioUrl,
});

export const vocabStepSchema = z.object({
  type: z.literal("vocab"),
  consigneFr: z.string().trim().max(200).default(""),
  consigneAr: z.string().trim().max(200).default(""),
  /** Optional audio for the spoken consigne itself. */
  audioUrl,
  items: z.array(vocabItemSchema).min(1).max(15),
});

const exerciseId = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid exercise id");

const points = z.number().int().min(1).max(100);

export const multipleChoiceStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("multiple_choice"),
  id: exerciseId,
  question: z.string().trim().min(1).max(200),
  options: z.array(z.string().trim().min(1).max(64)).min(2).max(6),
  correctAnswer: z.string().trim().min(1).max(64),
  points: points.default(10),
});

export const matchStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("match"),
  id: exerciseId,
  question: z.string().trim().min(1).max(200),
  pairs: z
    .array(
      z.object({
        letter: z.string().trim().min(1).max(64),
        word: z.string().trim().min(1).max(64),
      })
    )
    .min(2)
    .max(6),
  points: points.default(15),
});

export const readingStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("reading"),
  id: exerciseId,
  question: z.string().trim().min(1).max(200),
  word: z.string().trim().min(1).max(32),
  options: z.array(z.string().trim().min(1).max(64)).min(2).max(4),
  correctAnswer: z.string().trim().min(1).max(64),
  points: points.default(10),
});

/**
 * Drag-and-drop exercise. Structurally similar to `match` but rendered
 * with a drag/drop interaction. Pairs are stored explicitly so the
 * server can grade authoritatively.
 */
export const dragDropStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("drag_drop"),
  id: exerciseId,
  question: z.string().trim().min(1).max(200),
  pairs: z
    .array(
      z.object({
        item: z.string().trim().min(1).max(64),
        target: z.string().trim().min(1).max(64),
      })
    )
    .min(2)
    .max(6),
  points: points.default(20),
});

/**
 * Writing / typing exercise. The learner types the expected value into
 * an input box; whitespace is trimmed before comparison server-side.
 */
export const writingStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("writing"),
  id: exerciseId,
  instruction: z.string().trim().min(1).max(200),
  expected: z.string().trim().min(1).max(64),
  placeholder: z.string().trim().max(64).default(""),
  points: points.default(15),
});

/**
 * Audio listening exercise. `audioUrl` is rendered into an HTML5
 * <audio> element. May be an empty string for placeholder seed data.
 */
export const audioStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("audio"),
  id: exerciseId,
  instruction: z.string().trim().min(1).max(200),
  audioUrl: z.string().trim().max(300).default(""),
  options: z.array(z.string().trim().min(1).max(64)).min(2).max(6),
  correctAnswer: z.string().trim().min(1).max(64),
  points: points.default(15),
});

/**
 * Multi-select exercise — "pick all items that match the rule".
 * Every option carries its own `isTarget` flag. Grading passes only
 * if the selected set equals the target set exactly (no extras).
 */
export const multiSelectOptionSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid option id"),
  label: z.string().trim().max(64).default(""),
  emoji: z.string().trim().max(16).default(""),
  isTarget: z.boolean(),
});

export const multiSelectStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("multi_select"),
  id: exerciseId,
  question: z.string().trim().min(1).max(200),
  options: z.array(multiSelectOptionSchema).min(2).max(12),
  points: points.default(20),
});

/**
 * Coloring exercise — the learner picks a color from a palette and
 * fills empty SVG shapes. Each shape carries an `isTarget` flag; the
 * grader passes when every target shape has exactly the `targetColor`
 * and no distractor shape has been coloured with the `targetColor`.
 *
 * The canonical color names (palette + targetColor) are listed in
 * `COLOR_NAMES` below. The component maps them to hex values.
 */
export const COLOR_NAMES = [
  "rouge",
  "vert",
  "bleu",
  "jaune",
  "noir",
  "blanc",
  "violet",
  "orange",
  "rose",
  "marron",
] as const;

export const colorNameSchema = z.enum(COLOR_NAMES);
export type ColorName = z.infer<typeof colorNameSchema>;

export const SHAPE_KINDS = [
  "square",
  "triangle",
  "circle",
  "rectangle",
  "crescent",
] as const;
export const shapeKindSchema = z.enum(SHAPE_KINDS);
export type ShapeKind = z.infer<typeof shapeKindSchema>;

export const colorizeShapeSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid shape id"),
  kind: shapeKindSchema,
  isTarget: z.boolean(),
});

export const colorizeStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("colorize"),
  id: exerciseId,
  instruction: z.string().trim().min(1).max(200),
  palette: z.array(colorNameSchema).min(2).max(10),
  targetColor: colorNameSchema,
  shapes: z.array(colorizeShapeSchema).min(1).max(8),
  points: points.default(20),
});

/**
 * Drawing / tracing exercise. The learner traces an Arabic letter on
 * an HTML5 canvas. There is no real handwriting recognition — the
 * exercise is "completed" when the learner submits a non-empty drawing,
 * and the server marks it as correct (sentinel value `"completed"`).
 *
 * Future-ready: a real grader could verify stroke count / coverage,
 * or call out to a handwriting-recognition API. For now this rewards
 * the practice itself, which is the pedagogical goal for ages 5–12.
 */
export const drawingStepSchema = z.object({
  type: z.literal("exercise"),
  exerciseType: z.literal("drawing"),
  id: exerciseId,
  instruction: z.string().trim().min(1).max(200),
  letter: z.string().trim().min(1).max(8),
  guide: z.string().trim().max(200).default(""),
  points: points.default(20),
});

/**
 * The exercise step union — useful when grading or filtering for
 * exercise-only steps. NOTE: this is NOT a discriminated union by
 * `type` because all variants share `type === "exercise"`.
 */
export const exerciseStepSchema = z.union([
  multipleChoiceStepSchema,
  matchStepSchema,
  readingStepSchema,
  dragDropStepSchema,
  writingStepSchema,
  audioStepSchema,
  drawingStepSchema,
  multiSelectStepSchema,
  colorizeStepSchema,
]);

/**
 * The full lesson-step union. We use a plain `z.union` (not
 * `discriminatedUnion`) because the discriminator changes shape
 * across variants (`type` for non-exercise, `type + exerciseType`
 * for exercises). Performance impact is negligible at lesson sizes.
 */
export const lessonStepSchema = z.union([
  introStepSchema,
  visualStepSchema,
  vocabStepSchema,
  multipleChoiceStepSchema,
  matchStepSchema,
  readingStepSchema,
  dragDropStepSchema,
  writingStepSchema,
  audioStepSchema,
  drawingStepSchema,
  multiSelectStepSchema,
  colorizeStepSchema,
  completionStepSchema,
]);

export const lessonStepsSchema = z.array(lessonStepSchema).min(1).max(50);

export type IntroStep = z.infer<typeof introStepSchema>;
export type VisualStep = z.infer<typeof visualStepSchema>;
export type VocabItem = z.infer<typeof vocabItemSchema>;
export type VocabStep = z.infer<typeof vocabStepSchema>;
export type CompletionStep = z.infer<typeof completionStepSchema>;
export type MultiSelectStep = z.infer<typeof multiSelectStepSchema>;
export type MultipleChoiceStep = z.infer<typeof multipleChoiceStepSchema>;
export type MatchStep = z.infer<typeof matchStepSchema>;
export type ReadingStep = z.infer<typeof readingStepSchema>;
export type DragDropStep = z.infer<typeof dragDropStepSchema>;
export type WritingStep = z.infer<typeof writingStepSchema>;
export type AudioStep = z.infer<typeof audioStepSchema>;
export type DrawingStep = z.infer<typeof drawingStepSchema>;
export type ColorizeShape = z.infer<typeof colorizeShapeSchema>;
export type ColorizeStep = z.infer<typeof colorizeStepSchema>;
export type ExerciseStep = z.infer<typeof exerciseStepSchema>;
export type LessonStep = z.infer<typeof lessonStepSchema>;

export function isExerciseStep(step: LessonStep): step is ExerciseStep {
  return step.type === "exercise";
}

// ---- Lesson create payload (POST /api/lessons) ----------------------------

export const lessonCreateSchema = z.object({
  courseId: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid course id"),
  orderIndex: z.number().int().min(1).max(1000),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
  steps: lessonStepsSchema,
});

export type LessonCreateInput = z.infer<typeof lessonCreateSchema>;

// ---- Progress submission (POST /api/progress) -----------------------------

/**
 * An answer value is one of:
 *  - string    → chosen option (multiple_choice / reading / audio)
 *                or typed text (writing) or sentinel "completed" (drawing)
 *  - string[]  → selected option ids for multi_select
 *  - record    → { [left]: right } mapping for match / drag_drop
 */
export const answerValueSchema = z.union([
  z.string().max(200),
  z.array(z.string().max(64)).max(20),
  z.record(z.string().max(64), z.string().max(64)),
]);

export const answerSchema = z.object({
  exerciseId,
  value: answerValueSchema,
});

export const progressSubmissionSchema = z.object({
  lessonId: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid lesson id"),
  // Vocab-only lessons (intro + vocab + completion) have NO exercises,
  // so the learner reaches the end with an empty answers map. Accept
  // it — the server still validates and marks the lesson completed.
  answers: z.array(answerSchema).min(0).max(20),
});

export type AnswerValue = z.infer<typeof answerValueSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type ProgressSubmission = z.infer<typeof progressSubmissionSchema>;

// ---- URL-param validation -------------------------------------------------

export const idParamSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/, "Invalid id format");

// ---- Server-side grading --------------------------------------------------

/**
 * Grade a single answer against its exercise step.
 *
 * MUST be called on the server: the `correctAnswer` / `pairs` fields
 * MUST come from the canonical DB row (loaded via `lessons-db`), never
 * from the client. The client can only ever submit answer VALUES.
 */
export function gradeExerciseStep(step: ExerciseStep, value: AnswerValue): boolean {
  switch (step.exerciseType) {
    case "multiple_choice":
    case "reading":
    case "audio":
      return typeof value === "string" && value === step.correctAnswer;

    case "writing":
      // Trim both sides to forgive incidental whitespace; otherwise
      // the comparison is exact (Arabic glyphs include diacritics).
      return (
        typeof value === "string" &&
        value.trim() === step.expected.trim()
      );

    case "match": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
      }
      return step.pairs.every((p) => value[p.letter] === p.word);
    }

    case "drag_drop": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
      }
      return step.pairs.every((p) => value[p.item] === p.target);
    }

    case "drawing":
      // Drawing steps are always rewarded if the learner submits.
      // The client sends the sentinel "completed" after a non-empty
      // drawing — anything else fails grading.
      return value === "completed";

    case "multi_select": {
      if (!Array.isArray(value)) return false;
      const selected = new Set(value);
      const targets = step.options
        .filter((o) => o.isTarget)
        .map((o) => o.id);
      if (selected.size !== targets.length) return false;
      for (const t of targets) {
        if (!selected.has(t)) return false;
      }
      return true;
    }

    case "colorize": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
      }
      // Every target shape must carry exactly the target color,
      // AND no distractor shape may carry the target color. This
      // rejects "colour everything in red" shortcuts.
      for (const shape of step.shapes) {
        const fill = value[shape.id];
        if (shape.isTarget) {
          if (fill !== step.targetColor) return false;
        } else {
          if (fill === step.targetColor) return false;
        }
      }
      return true;
    }
  }
}
