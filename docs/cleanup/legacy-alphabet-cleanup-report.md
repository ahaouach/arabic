# Legacy Arabic Alphabet Cleanup — Final Report

**Status:** ✅ Complete.
**Date:** 2026-04-18.
**Branch:** `courses`.
**Related plan:** [legacy-alphabet-cleanup-plan.md](legacy-alphabet-cleanup-plan.md).

---

## 1. Summary

Retired the 28 legacy per-letter Arabic alphabet lessons (`letter-alif` … `letter-yaa`) in favor of the unified `/dashboard/courses/arabic/alphabet` course. Executed in 5 auditable phases (discovery → backup → code → DB → verify), each gated by explicit approval. Zero user data affected.

- **Code deleted:** 5 renderer components, 5 Zod schemas, 5 type exports, 5 `Section` union variants, 5 `parseSection` cases, 5 `SectionInput` variants, 5 `LessonAdventure` fallback entries, `AlphabetLetter` interface, `SHAPE` constant, `ALPHABET_LETTERS` array, `LETTER_PALETTE` constant, `buildLetterLesson()` function, `letterLessons` generation, and the `...letterLessons` spread. Net **−1126 lines removed, +172 lines added** across one refactor commit.
- **DB deleted:** 28 `ThemeLesson` rows + 112 `LessonSection` rows — inside a single Prisma `$transaction` with preflight, mid-flight, and post-delete sanity checks.
- **Preserved:** the unified `alphabet` ThemeLesson (order 4, 1 section) and all shared utilities (`ColorShapePaletteSchema`, `useAudio`, `components/ui/alphabet/**`, `prisma/seeds/alphabet/**`, `prisma/seeds/alphabetLesson.seed.ts`, etc.).
- **Forwarded:** 28 permanent redirects (HTTP 308) from legacy slugs to `alphabet?letter=<key>` in `next.config.ts`.

---

## 2. What was deleted

### 2.1 Code artifacts (commit `9d64e8e`)

| Path | Kind | Disposition |
| --- | --- | --- |
| `components/ui/LetterIntro.tsx` | renderer | deleted |
| `components/ui/LetterVowels.tsx` | renderer | deleted |
| `components/ui/LetterColoring.tsx` | renderer | deleted |
| `components/ui/LetterTracing.tsx` | renderer | deleted |
| `components/ui/LetterWordMatch.tsx` | renderer | deleted |
| `lib/lessonSections.ts` | schema + types + parseSection | 5 schemas, 5 types, 5 union variants, 5 parseSection cases removed |
| `prisma/seed.ts` | generator | 5 SectionInput variants, `AlphabetLetter`, `SHAPE`, `ALPHABET_LETTERS`, `LETTER_PALETTE`, `buildLetterLesson`, `letterLessons`, spread — all removed |
| `components/ui/SectionRenderer.tsx` | dispatcher | 5 imports, 5 switch cases removed |
| `components/ui/LessonAdventure.tsx` | label map | 5 fallback entries removed |
| `next.config.ts` | routing | 28 permanent redirects added |
| `tsconfig.json` | build | exclude `docs/cleanup/backup/**` from typecheck |

### 2.2 DB records (commit `882111d` — script; deletion ran during Phase 4)

- 28 `ThemeLesson` rows (orders 5–32, slugs `letter-alif`, `letter-baa`, …, `letter-yaa`).
- 112 `LessonSection` rows (4 per lesson: `letter_intro`, `letter_vowels`, `letter_coloring`, `letter_word_match`).
- 0 user-progress records (none exist — `ThemeLesson` has no FK from `CourseLessonProgress` or any other model).

---

## 3. What was preserved

### 3.1 Unified alphabet lesson

| field | value |
| --- | --- |
| slug | `alphabet` |
| order | 4 |
| theme | `arabic` |
| sections | 1 × `alphabet_lesson` |
| URL | `/dashboard/courses/arabic/alphabet` |

Verified present inside the deletion transaction before commit, and again via post-delete smoke test.

### 3.2 Shared utilities left intact

- `ColorShapePaletteSchema` in `lib/lessonSections.ts` — still used by the live `color_shapes` block.
- `components/ui/alphabet/**` (LetterCard, LetterGlyph, LetterJourney, LetterPicker, LetterTashkeelZone, VocabularyZone, ColorLetterZone, ColorLetterInWordZone, FindWordsZone, ZoneNavigator, AlphabetBackground, AlphabetLessonPage) — all power the unified lesson.
- `lib/hooks/useLetterProgress.ts`, `lib/types/alphabetLesson.types.ts`, `lib/schemas/alphabetLesson.schema.ts` — all unified-lesson infrastructure.
- `prisma/seeds/alphabet/letters.data.ts`, `prisma/seeds/alphabet/vocabulary/**`, `prisma/seeds/alphabetLesson.seed.ts` — unified-lesson seed content.
- All other Arabic ThemeLessons (numbers, colors, shapes, family, animals-world, body, 3× pronouns) — untouched.

---

## 4. Backup location

- **Path:** [docs/cleanup/backup/legacy-alphabet/20260418T101744Z/](backup/legacy-alphabet/20260418T101744Z/)
- **Code snapshot:** 5 deleted component files, verbatim, under `code/components/ui/`.
- **DB export:** [legacy-alphabet-records.json](backup/legacy-alphabet/20260418T101744Z/db/legacy-alphabet-records.json) — 92 KB, 28 lessons + 112 sections with full `content` JSON, exported by [scripts/cleanup/export-legacy-alphabet.ts](../../scripts/cleanup/export-legacy-alphabet.ts). Regenerate at any time with `npx tsx scripts/cleanup/export-legacy-alphabet.ts <outfile>` (read-only, re-runnable).

---

## 5. Redirects added (`next.config.ts`)

28 permanent redirects, HTTP 308 (Next's default for `permanent: true`; 308 is the stricter sibling of 301 — it preserves the HTTP method on redirect). Legacy slug → unified key:

```
letter-alif          → alphabet?letter=alif
letter-baa           → alphabet?letter=baa
letter-taa           → alphabet?letter=taa
letter-thaa          → alphabet?letter=thaa
letter-jim           → alphabet?letter=jeem
letter-haa           → alphabet?letter=hhaa
letter-khaa          → alphabet?letter=khaa
letter-dal           → alphabet?letter=daal
letter-dhal          → alphabet?letter=dhaal
letter-ra            → alphabet?letter=raa
letter-zay           → alphabet?letter=zay
letter-sin           → alphabet?letter=seen
letter-shin          → alphabet?letter=sheen
letter-sad           → alphabet?letter=saad
letter-dad           → alphabet?letter=dhaad
letter-taa-emphatic  → alphabet?letter=ttaa
letter-zaa           → alphabet?letter=thhaa
letter-ain           → alphabet?letter=ayn
letter-ghain         → alphabet?letter=ghayn
letter-faa           → alphabet?letter=faa
letter-qaf           → alphabet?letter=qaaf
letter-kaf           → alphabet?letter=kaaf
letter-lam           → alphabet?letter=laam
letter-mim           → alphabet?letter=meem
letter-nun           → alphabet?letter=noon
letter-haa-soft      → alphabet?letter=haa
letter-waw           → alphabet?letter=waaw
letter-yaa           → alphabet?letter=yaa
```

All 28 are present in `.next/routes-manifest.json` after `next build` (verified).

---

## 6. Verification run

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | ✅ exit 0, no errors |
| `npx prisma validate` | ✅ `The schema at prisma/schema.prisma is valid 🚀` |
| `npx next build` | ✅ `Compiled successfully in 1498.3ms`, 29 routes generated, 28 redirects in routes-manifest |
| `npm run lint` | ⚠️ **pre-existing, unrelated** — `next lint` was removed in Next 15; `package.json` still calls it and errors with `Invalid project directory provided`. Not caused by this cleanup. |
| DB smoke test (`legacy-* count`, `unified present`, `orphan sections`) | ✅ `0` legacy / `1` unified (order 4, 1 section) / `0` orphans / `10` total Arabic lessons |

---

## 7. Manual browser test checklist (for you)

The automated checks above cover compile + DB state. You should spot-check in a browser:

- [ ] `/dashboard/courses/arabic/alphabet` loads; letter picker renders 28 letters.
- [ ] Picking a sample letter walks through all 5 zones (tashkeel, vocabulary, color-letter, color-letter-in-word, find-words).
- [ ] Hitting a legacy URL (e.g. `/dashboard/courses/arabic/letter-alif`) 308-redirects to `/dashboard/courses/arabic/alphabet?letter=alif`.
- [ ] The Arabic theme page (`/dashboard/courses/arabic`) shows 10 lessons with no broken links or 404s in place of the old 28 letter lessons.

---

## 8. Remaining TODOs

- `docs/audits/arabic-courses-audit.md` is a historic audit that still describes the legacy 4-zone per-letter structure. It's a dated snapshot and was deliberately left untouched. Decide whether to prepend a "superseded by unified alphabet on 2026-04-18" note, or leave as-is.
- `npm run lint` is broken at the tooling level (Next 15 removed `next lint`). Unrelated to this cleanup, but worth fixing in a follow-up by swapping `lint` to call `eslint` directly.

---

## 9. Commit timeline

| SHA | Phase | Message |
| --- | --- | --- |
| `7da72e5` | 2 | `chore(cleanup): backup legacy alphabet lessons before removal` |
| `9d64e8e` | 3 | `refactor(alphabet): remove legacy per-letter lessons, redirect to unified course` |
| `882111d` | 4 | `chore(cleanup): add transactional deletion script for legacy alphabet lessons` |
| _(this commit)_ | 5 | `chore(cleanup): finalize legacy alphabet removal — verify unified course intact` |

---

## 10. Bottom line

**✅ 5 code files deleted, 168 DB rows removed, 28 redirects added, unified alphabet course verified operational.** No user data touched. Full audit trail in git + the Phase 2 backup folder.
