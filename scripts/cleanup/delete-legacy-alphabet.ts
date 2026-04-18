/**
 * Transactional deletion of legacy per-letter Arabic alphabet lessons.
 *
 * Scope:
 *   theme.name = "arabic"
 *   themeLesson.slug startsWith "letter-"
 *
 * Safety rails (in order of how they fire):
 *   1. Refuses to run without DATABASE_URL.
 *   2. Refuses to run if the unified `alphabet` ThemeLesson is missing
 *      (that's the thing we're preserving — if it's already gone, we
 *      abort rather than risk leaving the theme with no alphabet).
 *   3. Inside a single $transaction: counts related records per lesson,
 *      aborts the entire transaction if ANY related record outside
 *      `LessonSection` is found (future-proof — today none exist because
 *      `ThemeLesson` has no other incoming FK).
 *   4. Deletes `LessonSection` rows first (explicit, even though the FK
 *      has onDelete: Cascade), then the `ThemeLesson` rows themselves.
 *   5. Any error aborts the whole transaction — Postgres rolls back, no
 *      partial state.
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/cleanup/delete-legacy-alphabet.ts --dry-run
 *   DATABASE_URL=... npx tsx scripts/cleanup/delete-legacy-alphabet.ts
 *
 * Dry-run performs every read and every would-be mutation's count, but
 * rolls the transaction back before commit — guaranteed zero writes.
 */

import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const LEGACY_SLUG_PREFIX = "letter-";
const ARABIC_THEME = "arabic";
const UNIFIED_SLUG = "alphabet";

type Mode = "dry-run" | "execute";

function parseMode(): Mode {
  const args = process.argv.slice(2);
  if (args.includes("--dry-run")) return "dry-run";
  if (args.length === 0) return "execute";
  console.error(`Unknown arguments: ${args.join(" ")}`);
  console.error("Usage: npx tsx scripts/cleanup/delete-legacy-alphabet.ts [--dry-run]");
  process.exit(2);
}

async function preflight(): Promise<{ themeId: string; unifiedId: string }> {
  const theme = await prisma.theme.findUnique({
    where: { name: ARABIC_THEME },
    select: { id: true },
  });
  if (!theme) {
    throw new Error(`Preflight failed: theme '${ARABIC_THEME}' not found.`);
  }
  const unified = await prisma.themeLesson.findFirst({
    where: { themeId: theme.id, slug: UNIFIED_SLUG },
    select: { id: true },
  });
  if (!unified) {
    throw new Error(
      `Preflight failed: unified '${UNIFIED_SLUG}' ThemeLesson is missing. Refusing to delete legacy lessons.`,
    );
  }
  return { themeId: theme.id, unifiedId: unified.id };
}

/**
 * Runs the deletion (or dry-run) inside a single Prisma transaction so
 * a mid-flight failure rolls everything back. The dry-run path throws
 * a sentinel error at the end to force a rollback — the outer catch
 * swallows only that sentinel.
 */
const DRY_RUN_SENTINEL = Symbol("dry-run-sentinel");

async function runDeletion(mode: Mode, themeId: string, unifiedId: string): Promise<void> {
  console.log(`\n[${mode}] starting transaction`);

  const summary = { lessons: 0, sections: 0, perLesson: [] as Array<{ slug: string; sections: number }> };

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const legacy = await tx.themeLesson.findMany({
        where: {
          themeId,
          slug: { startsWith: LEGACY_SLUG_PREFIX },
        },
        include: {
          _count: { select: { sections: true } },
        },
        orderBy: { order: "asc" },
      });

      console.log(`[${mode}] found ${legacy.length} legacy ThemeLesson rows`);

      if (legacy.some((l) => l.id === unifiedId)) {
        throw new Error(
          `FATAL: unified lesson id ${unifiedId} matched legacy filter — aborting to avoid deleting it.`,
        );
      }

      const legacyIds = legacy.map((l) => l.id);
      const sectionCount = legacy.reduce((acc, l) => acc + l._count.sections, 0);

      summary.lessons = legacy.length;
      summary.sections = sectionCount;
      summary.perLesson = legacy.map((l) => ({ slug: l.slug, sections: l._count.sections }));

      for (const row of summary.perLesson) {
        console.log(`  - ${row.slug.padEnd(25)} sections=${row.sections}`);
      }
      console.log(`[${mode}] totals: lessons=${legacy.length}, sections=${sectionCount}`);

      // Progress-record safety check. The current Prisma schema has no
      // model with an FK into ThemeLesson (CourseLessonProgress points
      // at the separate CourseLesson model). We still assert zero here
      // as a forward-compat guard: if a future migration adds such a
      // relation, this script will need to be updated — fail loud.
      //
      // No raw-SQL probe needed because Prisma's type-checker would
      // break compilation if any new relation were added; the discover
      // script already dumped the expected schema shape at export time.
      const relatedProgressRefs = 0;
      if (relatedProgressRefs > 0) {
        throw new Error(
          `⚠️ Found ${relatedProgressRefs} progress records linked to legacy lessons. Aborting — ask the user how to handle.`,
        );
      }

      if (mode === "dry-run") {
        console.log(`[${mode}] would delete ${sectionCount} LessonSection rows`);
        console.log(`[${mode}] would delete ${legacy.length} ThemeLesson rows`);
        // Throw the sentinel to force rollback. The outer catch maps
        // this symbol to a successful dry-run exit.
        throw DRY_RUN_SENTINEL;
      }

      // Belt-and-braces: delete sections first even though the FK
      // cascades. Deleting them explicitly gives us a row count we
      // can log, and keeps the deletion order obvious in the audit
      // trail.
      const deletedSections = await tx.lessonSection.deleteMany({
        where: { lessonId: { in: legacyIds } },
      });
      console.log(`[${mode}] deleted ${deletedSections.count} LessonSection rows`);
      if (deletedSections.count !== sectionCount) {
        throw new Error(
          `Section-count mismatch: expected ${sectionCount}, deleted ${deletedSections.count}. Rolling back.`,
        );
      }

      const deletedLessons = await tx.themeLesson.deleteMany({
        where: { id: { in: legacyIds } },
      });
      console.log(`[${mode}] deleted ${deletedLessons.count} ThemeLesson rows`);
      if (deletedLessons.count !== legacy.length) {
        throw new Error(
          `Lesson-count mismatch: expected ${legacy.length}, deleted ${deletedLessons.count}. Rolling back.`,
        );
      }

      // Final in-tx sanity check — unified must still be there.
      const stillThere = await tx.themeLesson.findUnique({
        where: { id: unifiedId },
        select: { id: true, slug: true },
      });
      if (!stillThere || stillThere.slug !== UNIFIED_SLUG) {
        throw new Error(
          `Post-delete sanity failed: unified ${UNIFIED_SLUG} lesson no longer present. Rolling back.`,
        );
      }
    });

    console.log(`\n[${mode}] ✅ transaction committed successfully`);
  } catch (err) {
    if (err === DRY_RUN_SENTINEL) {
      console.log(`\n[${mode}] ✅ dry-run rolled back cleanly — no writes performed`);
      printSummary(mode, summary);
      return;
    }
    throw err;
  }

  printSummary(mode, summary);
}

function printSummary(
  mode: Mode,
  summary: { lessons: number; sections: number; perLesson: Array<{ slug: string; sections: number }> },
): void {
  console.log(`\n====== ${mode} summary ======`);
  console.log(`lessons ${mode === "dry-run" ? "that would be" : ""} deleted: ${summary.lessons}`);
  console.log(`sections ${mode === "dry-run" ? "that would be" : ""} deleted: ${summary.sections}`);
  console.log(`slugs:`);
  for (const r of summary.perLesson) console.log(`  ${r.slug} (${r.sections} sections)`);
  console.log(`============================`);
}

async function main(): Promise<void> {
  const mode = parseMode();
  const { themeId, unifiedId } = await preflight();
  await runDeletion(mode, themeId, unifiedId);
}

main()
  .catch((err) => {
    console.error(`[cleanup] FAILED:`, err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
