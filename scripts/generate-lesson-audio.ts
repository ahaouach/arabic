/**
 * Walk every lesson in the database, collect every piece of text that
 * has an associated `audioUrl`, and generate the missing audio files
 * via `lib/audio.ts`.
 *
 * Run with:
 *
 *   # load .env.local, then run the script
 *   set -a && source .env.local && set +a && \
 *     npm run audio:generate
 *
 * Or in one shot:
 *
 *   OPENAI_API_KEY=sk-... npm run audio:generate
 *
 * SECURITY:
 *  - Only runs in the Node process (never bundled to the browser).
 *  - Reads `OPENAI_API_KEY` from env. If the key is absent, the
 *    script still walks the data and reports what WOULD be generated,
 *    but makes no network calls.
 *  - Every URL produced is a sha256 hash prefix under /public/audio,
 *    so no user input ever reaches the filesystem verbatim.
 */

import { PrismaClient } from "@prisma/client";
import { lessonStepsSchema, isExerciseStep } from "../lib/lessons-schema";
import { generateAudioBatch } from "../lib/audio";

const prisma = new PrismaClient();

interface PlanEntry {
  text: string;
  role: string;
}

function collectTexts(): Promise<PlanEntry[]> {
  return prisma.courseLesson
    .findMany({ select: { id: true, title: true, steps: true } })
    .then((lessons) => {
      const plan: PlanEntry[] = [];
      for (const lesson of lessons) {
        const parsed = lessonStepsSchema.safeParse(lesson.steps);
        if (!parsed.success) {
          console.warn(`[audio] skipping corrupt lesson ${lesson.id}`);
          continue;
        }
        for (const step of parsed.data) {
          if (step.type === "intro") {
            plan.push({ text: step.title, role: `${lesson.id}:intro-title` });
            plan.push({ text: step.text, role: `${lesson.id}:intro-text` });
          } else if (step.type === "visual") {
            plan.push({ text: step.letter, role: `${lesson.id}:visual-letter` });
            plan.push({ text: step.example, role: `${lesson.id}:visual-example` });
          } else if (isExerciseStep(step)) {
            if (step.exerciseType === "audio") {
              plan.push({
                text: step.correctAnswer,
                role: `${lesson.id}:${step.id}:audio-answer`,
              });
              plan.push({
                text: step.instruction,
                role: `${lesson.id}:${step.id}:audio-instruction`,
              });
            } else if (step.exerciseType === "writing") {
              plan.push({
                text: step.instruction,
                role: `${lesson.id}:${step.id}:writing-instruction`,
              });
              plan.push({
                text: step.expected,
                role: `${lesson.id}:${step.id}:writing-expected`,
              });
            } else if (step.exerciseType === "drawing") {
              plan.push({
                text: step.instruction,
                role: `${lesson.id}:${step.id}:drawing-instruction`,
              });
              plan.push({
                text: step.letter,
                role: `${lesson.id}:${step.id}:drawing-letter`,
              });
            } else if ("question" in step) {
              plan.push({
                text: step.question,
                role: `${lesson.id}:${step.id}:question`,
              });
            }
          }
        }
      }
      return plan;
    });
}

async function main() {
  console.log("🔊 Lesson audio generator");
  console.log("─".repeat(40));

  const plan = await collectTexts();
  const unique = Array.from(new Set(plan.map((p) => p.text))).filter(Boolean);

  console.log(`  lessons walked:  ${plan.length > 0 ? "done" : "none"}`);
  console.log(`  text items:      ${plan.length}`);
  console.log(`  unique strings:  ${unique.length}`);

  if (!process.env.OPENAI_API_KEY) {
    console.log("");
    console.log("⚠️  OPENAI_API_KEY is not set.");
    console.log("   Run again with the key to actually produce audio files.");
    console.log("   (URLs in the DB are already deterministic, so");
    console.log("    generating later will retroactively fill them in.)");
    console.log("");
    console.log("Sample texts that would be generated:");
    unique.slice(0, 10).forEach((t) => console.log(`   • ${t}`));
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log("");
  console.log("Generating missing audio via OpenAI tts-1…");
  const result = await generateAudioBatch(unique);

  console.log("");
  console.log("─".repeat(40));
  console.log(`  unique processed: ${result.unique}`);
  console.log(`  cached (skipped): ${result.cached}`);
  console.log(`  newly generated:  ${result.generated}`);
  console.log(`  failed:           ${result.failed}`);
  console.log("✓ done");

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
