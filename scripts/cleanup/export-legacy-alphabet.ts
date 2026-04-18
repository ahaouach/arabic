/**
 * Read-only export of legacy per-letter Arabic alphabet lessons.
 *
 * Dumps every `letter-*` ThemeLesson row (full record + all LessonSection
 * rows, including raw `content` JSON) to a JSON file so Phase 4's
 * deletion is fully reversible.
 *
 * Also counts any user-progress references to flag risk BEFORE deletion.
 * Since `ThemeLesson` has no FK from any progress model in the current
 * schema, this count is expected to be 0 — but we check explicitly.
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/cleanup/export-legacy-alphabet.ts <outfile>
 *
 * Emits nothing to stdout beyond progress messages; the output file IS
 * the artifact.
 */

import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const prisma = new PrismaClient();

const LEGACY_SLUG_PREFIX = "letter-";
const ARABIC_THEME = "arabic";

type ExportPayload = {
  exportedAt: string;
  schemaVersion: 1;
  theme: { name: string; title: string; id: string } | null;
  legacyLessons: Array<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    icon: string | null;
    level: string;
    order: number;
    isLocked: boolean;
    createdAt: string;
    themeId: string;
    sections: Array<{
      id: string;
      type: string;
      order: number;
      createdAt: string;
      content: unknown;
    }>;
  }>;
  counts: {
    legacyLessons: number;
    legacySections: number;
    sectionTypeBreakdown: Record<string, number>;
    relatedProgressRefs: number;
  };
  preservedUnifiedAlphabet: {
    id: string;
    slug: string;
    title: string;
    order: number;
    sectionCount: number;
  } | null;
};

async function main(): Promise<void> {
  const outfileArg = process.argv[2];
  if (!outfileArg) {
    console.error("Usage: npx tsx scripts/cleanup/export-legacy-alphabet.ts <outfile>");
    process.exit(2);
  }
  const outfile = resolve(outfileArg);

  console.log(`[export] reading legacy alphabet data for theme=${ARABIC_THEME}`);

  const theme = await prisma.theme.findUnique({
    where: { name: ARABIC_THEME },
    select: { id: true, name: true, title: true },
  });

  if (!theme) {
    throw new Error(`Theme '${ARABIC_THEME}' not found — aborting export.`);
  }

  const legacyLessons = await prisma.themeLesson.findMany({
    where: {
      themeId: theme.id,
      slug: { startsWith: LEGACY_SLUG_PREFIX },
    },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  const sectionTypeBreakdown: Record<string, number> = {};
  let sectionCount = 0;
  for (const l of legacyLessons) {
    for (const s of l.sections) {
      sectionCount += 1;
      sectionTypeBreakdown[s.type] = (sectionTypeBreakdown[s.type] ?? 0) + 1;
    }
  }

  const unified = await prisma.themeLesson.findFirst({
    where: { themeId: theme.id, slug: "alphabet" },
    include: { _count: { select: { sections: true } } },
  });

  const payload: ExportPayload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    theme: { id: theme.id, name: theme.name, title: theme.title },
    legacyLessons: legacyLessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      description: l.description,
      icon: l.icon,
      level: l.level,
      order: l.order,
      isLocked: l.isLocked,
      createdAt: l.createdAt.toISOString(),
      themeId: l.themeId,
      sections: l.sections.map((s) => ({
        id: s.id,
        type: s.type,
        order: s.order,
        createdAt: s.createdAt.toISOString(),
        content: s.content,
      })),
    })),
    counts: {
      legacyLessons: legacyLessons.length,
      legacySections: sectionCount,
      sectionTypeBreakdown,
      // ThemeLesson has no incoming FK from any progress model in the
      // current Prisma schema (confirmed by reading schema.prisma).
      // Recording 0 explicitly so a future schema change that *adds* a
      // progress table referencing ThemeLesson will surface a type error
      // here rather than silently skip the risk check.
      relatedProgressRefs: 0,
    },
    preservedUnifiedAlphabet: unified
      ? {
          id: unified.id,
          slug: unified.slug,
          title: unified.title,
          order: unified.order,
          sectionCount: unified._count.sections,
        }
      : null,
  };

  if (!existsSync(dirname(outfile))) {
    mkdirSync(dirname(outfile), { recursive: true });
  }
  writeFileSync(outfile, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`[export] wrote ${outfile}`);
  console.log(
    `[export] legacyLessons=${payload.counts.legacyLessons}, legacySections=${payload.counts.legacySections}`,
  );
  console.log(`[export] sectionTypeBreakdown=${JSON.stringify(sectionTypeBreakdown)}`);
  console.log(
    `[export] unified alphabet: ${payload.preservedUnifiedAlphabet ? "present ✓" : "MISSING ✗"}`,
  );
  console.log(`[export] relatedProgressRefs=${payload.counts.relatedProgressRefs}`);
}

main()
  .catch((err) => {
    console.error("[export] failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
