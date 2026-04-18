# Legacy Arabic Alphabet Cleanup — Discovery Plan

**Status:** Phase 1 complete (read-only discovery). No files edited, no DB records deleted.
**Date:** 2026-04-18
**Scope:** remove 28 legacy per-letter alphabet lessons (`letter-alif` … `letter-yaa`) + all their supporting code/types/schemas/components. Preserve the unified alphabet lesson at `/dashboard/courses/arabic/alphabet`.

---

## 1. Headline findings

| Area | Finding |
| --- | --- |
| Route folders | **None.** Routes are dynamic (`app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx`). No per-letter folders to delete. |
| Dedicated seed files | **None.** Legacy lessons are generated **inline** in `prisma/seed.ts` by `buildLetterLesson()` over an `ALPHABET_LETTERS` array (28 entries). |
| DB records | **28 ThemeLesson rows** (orders 5–32, slugs `letter-*`) + **112 LessonSection rows** (4 per lesson). Confirmed via Prisma read-only query. |
| User progress at risk | **None.** The `ThemeLesson`/`LessonSection` models have **no** relation into `CourseLessonProgress` (that model points at the separate `CourseLesson`). ThemeLesson progress is localStorage-only. |
| Unified alphabet | `ThemeLesson` slug `alphabet` exists at order 4, with 1 `alphabet_lesson` section — intact and must stay. |
| Navigation/hardcoded links | **None found.** `grep` across `app/` and `components/` returned zero hits for `letter-<slug>` URLs. |

---

## 2. Code artifacts — exhaustive inventory

### 2.1 `prisma/seed.ts` (inline legacy generator — the biggest cluster)

| Location | What it is | Classification |
| --- | --- | --- |
| L161–214 | `SectionInput` union variants for `letter_intro`, `letter_vowels`, `letter_coloring`, `letter_tracing`, `letter_word_match` | 🔴 legacy |
| L380–397 | `AlphabetLetter` TS interface | 🔴 legacy |
| L400–509 | `SHAPE` constant — 16 tracing-point shapes (vertical, bowl, camShape, dalShape, raShape, humps, sadShape, taaEmphatic, ainShape, faaShape, kafShape, lamShape, mimShape, haaSoftShape, wawShape) | 🔴 legacy — only referenced inside the letter generator, not exported |
| L511–540 | `ALPHABET_LETTERS` array (28 entries) | 🔴 legacy |
| L543–547 | `LETTER_PALETTE` constant | 🔴 legacy — only referenced by `buildLetterLesson` |
| L549–609 | `buildLetterLesson()` function | 🔴 legacy |
| L611–615 | `letterLessons` `.map()` generation | 🔴 legacy |
| L695 | `...letterLessons` spread inside `lessonSeeds` array | 🔴 legacy |
| L676–693 (comments) | Doc comment referencing "alongside the per-letter lessons below" and "Order 4 is reserved for the unified alphabet lesson below" | 🟡 wording update once legacy block is gone |

### 2.2 `lib/lessonSections.ts`

| Location | What it is | Classification |
| --- | --- | --- |
| L244 (section header comment) | `// ---- Arabic alphabet lesson blocks ----` | 🟡 will be empty once the 5 schemas below are removed — delete block or rename |
| L247–253 | `LetterIntroSectionSchema` + its exported type | 🔴 legacy |
| L256 | `VOWEL_KINDS` const | 🔴 legacy — only used by `VowelFormSchema` |
| L258–262 | `VowelFormSchema` | 🔴 legacy |
| L264–269 | `LetterVowelsSectionSchema` + type | 🔴 legacy |
| L272–277 | `LetterColoringSectionSchema` + type — references `ColorShapePaletteSchema` which is **shared** with `color_shapes` (🟢 keep the shared schema) | 🔴 legacy schema itself |
| L280–290 | `TracingPointSchema` + `LetterTracingSectionSchema` + type | 🔴 legacy (note: `letter_tracing` is defined in code but **no DB rows use it** — DB section types are `letter_intro`, `letter_vowels`, `letter_coloring`, `letter_word_match`) |
| L293–305 | `WordExampleSchema` + `LetterWordMatchSectionSchema` + type | 🔴 legacy |
| L553–562 | 5 union variants in `Section` discriminated type | 🔴 legacy |
| L692–716 | 5 cases in `parseSection()` switch | 🔴 legacy |

### 2.3 `components/ui/` — renderer components

| File | Used where | Classification |
| --- | --- | --- |
| `LetterIntro.tsx` | only `SectionRenderer.tsx` | 🔴 legacy — delete |
| `LetterVowels.tsx` | only `SectionRenderer.tsx` | 🔴 legacy — delete |
| `LetterColoring.tsx` | only `SectionRenderer.tsx` | 🔴 legacy — delete |
| `LetterTracing.tsx` | only `SectionRenderer.tsx` | 🔴 legacy — delete (never wired to real data anyway) |
| `LetterWordMatch.tsx` | only `SectionRenderer.tsx` | 🔴 legacy — delete |

Verified exclusivity by: `grep "from.*(LetterIntro\|LetterVowels\|LetterColoring\|LetterTracing\|LetterWordMatch)"` → only `SectionRenderer.tsx` imports them.

### 2.4 `components/ui/SectionRenderer.tsx`

5 imports (L13–17) + 5 switch cases (L56–65) → 🔴 remove both.

### 2.5 `components/ui/LessonAdventure.tsx`

5 fallback-label entries (L44–48) for `letter_intro` / `letter_vowels` / `letter_coloring` / `letter_tracing` / `letter_word_match` → 🔴 remove.

### 2.6 Docs (informational — separate treatment)

| File | Classification |
| --- | --- |
| `docs/audits/arabic-courses-audit.md` | 🟡 historic audit, references the 28 legacy lessons in its matrix. **Leave as-is** (it's a dated snapshot) OR add a note at the top — will decide in Phase 3. |
| `docs/standards/arabic-lesson-standard.md` | 🟢 keep — doesn't reference legacy slugs, only discusses routing philosophy. |
| `docs/cleanup/*` (this report) | 🟢 new artifact. |

### 2.7 Types / helpers shared with still-live lessons — **KEEP**

| Item | Why keep |
| --- | --- |
| `ColorShapePaletteSchema` in `lib/lessonSections.ts` | shared by `color_shapes` (live) |
| `TracingPointSchema` equivalents in shapes lesson | **not** shared — shapes lesson has its own schema (`DrawShapeSection`), so legacy `TracingPointSchema` can be removed safely |
| `lib/hooks/useAudio`, `lib/hooks/useLetterProgress`, `lib/types/alphabetLesson.types.ts`, `prisma/seeds/alphabet/**`, `prisma/seeds/alphabetLesson.seed.ts` | all power the **unified** lesson — 🟢 keep |
| `components/ui/alphabet/**` | powers the unified lesson — 🟢 keep |

---

## 3. Database artifacts — exhaustive inventory

Obtained via read-only Prisma query. **No deletions performed.**

### 3.1 ThemeLesson rows to delete (28)

| order | slug | title | id |
| --- | --- | --- | --- |
| 5 | `letter-alif` | الْحَرْفُ: أَلِفٌ | cmo3nbwjc000hguq1l7gwtqvj |
| 6 | `letter-baa` | الْحَرْفُ: بَاءٌ | cmo3nbwje000nguq1jsckce66 |
| 7 | `letter-taa` | الْحَرْفُ: تَاءٌ | cmo3nbwjf000tguq19mowtl3e |
| 8 | `letter-thaa` | الْحَرْفُ: ثَاءٌ | cmo3nbwjh000zguq1f63fpgcv |
| 9 | `letter-jim` | الْحَرْفُ: جِيمٌ | cmo3nbwji0015guq1xvd0tpbl |
| 10 | `letter-haa` | الْحَرْفُ: حَاءٌ | cmo3nbwjj001bguq16a6urvcn |
| 11 | `letter-khaa` | الْحَرْفُ: خَاءٌ | cmo3nbwjk001hguq1rrercolo |
| 12 | `letter-dal` | الْحَرْفُ: دَالٌ | cmo3nbwjm001nguq1sut6ow13 |
| 13 | `letter-dhal` | الْحَرْفُ: ذَالٌ | cmo3nbwjn001tguq1pojjjnkd |
| 14 | `letter-ra` | الْحَرْفُ: رَاءٌ | cmo3nbwjo001zguq185seycro |
| 15 | `letter-zay` | الْحَرْفُ: زَايٌ | cmo3nbwjq0025guq1b4hk2rqx |
| 16 | `letter-sin` | الْحَرْفُ: سِينٌ | cmo3nbwjr002bguq1euvugmhn |
| 17 | `letter-shin` | الْحَرْفُ: شِينٌ | cmo3nbwjs002hguq1jwafsjcn |
| 18 | `letter-sad` | الْحَرْفُ: صَادٌ | cmo3nbwju002nguq17obe0222 |
| 19 | `letter-dad` | الْحَرْفُ: ضَادٌ | cmo3nbwjv002tguq1m6kv3p0z |
| 20 | `letter-taa-emphatic` | الْحَرْفُ: طَاءٌ | cmo3nbwjw002zguq12xppjt1c |
| 21 | `letter-zaa` | الْحَرْفُ: ظَاءٌ | cmo3nbwjx0035guq10f37nk9x |
| 22 | `letter-ain` | الْحَرْفُ: عَيْنٌ | cmo3nbwjy003bguq1igkggyg8 |
| 23 | `letter-ghain` | الْحَرْفُ: غَيْنٌ | cmo3nbwk0003hguq1aout2xf6 |
| 24 | `letter-faa` | الْحَرْفُ: فَاءٌ | cmo3nbwk1003nguq1cssecief |
| 25 | `letter-qaf` | الْحَرْفُ: قَافٌ | cmo3nbwk2003tguq19tlkgfnd |
| 26 | `letter-kaf` | الْحَرْفُ: كَافٌ | cmo3nbwk3003zguq139aoomnx |
| 27 | `letter-lam` | الْحَرْفُ: لَامٌ | cmo3nbwk50045guq1uqeuifhx |
| 28 | `letter-mim` | الْحَرْفُ: مِيمٌ | cmo3nbwk6004bguq1hcjtx7lw |
| 29 | `letter-nun` | الْحَرْفُ: نُونٌ | cmo3nbwk7004hguq1256rgskv |
| 30 | `letter-haa-soft` | الْحَرْفُ: هَاءٌ | cmo3nbwk8004nguq1suof2i63 |
| 31 | `letter-waw` | الْحَرْفُ: وَاوٌ | cmo3nbwk9004tguq1oxtej7sn |
| 32 | `letter-yaa` | الْحَرْفُ: يَاءٌ | cmo3nbwka004zguq1l2a5uag0 |

### 3.2 LessonSection rows to delete (cascading)

- **112 rows** total (28 lessons × 4 sections).
- Section type counts: `letter_intro: 28`, `letter_vowels: 28`, `letter_coloring: 28`, `letter_word_match: 28`.
- Note: `letter_tracing` type is defined in code but has **zero rows** in DB — still removed from code for hygiene.
- Cascade handled automatically by `LessonSection.lessonId` → `ThemeLesson.id` with `onDelete: Cascade`, **but** the deletion script will explicitly delete sections first anyway (belt-and-braces, inside a transaction).

### 3.3 Related user-data checks — ZERO RISK

- `ThemeLesson` has **no** incoming foreign keys from any progress/score/bookmark model.
- `CourseLessonProgress` → `CourseLesson` (different model, unrelated to ThemeLesson).
- No other models reference `ThemeLesson` or `LessonSection`.
- Therefore, deletion cannot cascade into any user-generated data. Confirmed by reading `prisma/schema.prisma` in full.

### 3.4 Unified alphabet lesson — PRESERVE

- `ThemeLesson` slug `alphabet`, order 4, id `cmo3nbwiy000eguq1phyawou5`, 1 `alphabet_lesson` section. **Must not be touched.**

---

## 4. Ambiguity / risk section

| Concern | Assessment |
| --- | --- |
| Shared `ColorShapePaletteSchema` | Used by live `color_shapes` lesson — **keep** the palette schema; only the wrapper `LetterColoringSectionSchema` (which happens to *consume* it) goes away. |
| External bookmarks to `/dashboard/courses/arabic/letter-<slug>` | No external system known to link these. Still recommended: add Next.js 301 redirects from `letter-*` slugs to `alphabet?letter=<key>`. See §6. |
| `letter_tracing` section type | Defined in code but 0 DB rows. Still removed from schema/renderer/adventure for hygiene. |
| Order gap 5–32 after deletion | Orders are not contiguous by design (Prisma `order` is a sort key, not a sequence). Leaving the gap is fine — the user-facing catalog (`[themeSlug]/page.tsx`) sorts on `order ASC` and simply shows family at order 33, etc. No reindexing needed. |
| Loss of source data if we need to rollback | Phase 2 produces a JSON export of every row + a file-copy of every deletable TS block **before** any mutation. |
| `docs/audits/arabic-courses-audit.md` references | Historic audit — leave as dated snapshot. Optionally prepend a note in Phase 5. |

Nothing qualifies as **blocking** — proceed to Phase 2 once approved.

---

## 5. Proposed deletion list (dry-run)

### Files to delete (5)

- `components/ui/LetterIntro.tsx`
- `components/ui/LetterVowels.tsx`
- `components/ui/LetterColoring.tsx`
- `components/ui/LetterTracing.tsx`
- `components/ui/LetterWordMatch.tsx`

### Folders to delete

- None.

### DB records to delete

- 28 `ThemeLesson` rows listed in §3.1.
- 112 `LessonSection` rows cascading from them (§3.2).
- All deletions inside a Prisma `$transaction` with rollback on any error.

### Files to edit (4)

- `prisma/seed.ts` — remove SectionInput union variants for 5 legacy types (L161–214), `AlphabetLetter` interface (L380–397), `SHAPE` constant (L400–509), `ALPHABET_LETTERS` (L511–540), `LETTER_PALETTE` (L543–547), `buildLetterLesson()` (L549–609), `letterLessons` generation (L611–615), `...letterLessons` spread (L695), and tidy the "alongside the per-letter lessons below" wording in the alphabet lesson's doc comment.
- `lib/lessonSections.ts` — remove `LetterIntroSection{,Schema}`, `LetterVowelsSection{,Schema}`, `LetterColoringSection{,Schema}`, `LetterTracingSection{,Schema}`, `LetterWordMatchSection{,Schema}`, helpers (`VOWEL_KINDS`, `VowelFormSchema`, `TracingPointSchema`, `WordExampleSchema`), 5 union variants, and 5 `parseSection` cases. Leave `ColorShapePaletteSchema` intact (still used by `color_shapes`).
- `components/ui/SectionRenderer.tsx` — remove 5 imports + 5 switch cases.
- `components/ui/LessonAdventure.tsx` — remove 5 fallback-label entries.

### Optional (Phase 3D)

- `next.config.ts` — add 28 permanent 301 redirects from `/dashboard/courses/arabic/letter-<trans>` → `/dashboard/courses/arabic/alphabet?letter=<key>`.
  - Mapping table (legacy slug → unified key):
    - `letter-alif` → `alif`, `letter-baa` → `baa`, `letter-taa` → `taa`, `letter-thaa` → `thaa`, `letter-jim` → `jeem`, `letter-haa` → `hhaa`, `letter-khaa` → `khaa`, `letter-dal` → `daal`, `letter-dhal` → `dhaal`, `letter-ra` → `raa`, `letter-zay` → `zay`, `letter-sin` → `seen`, `letter-shin` → `sheen`, `letter-sad` → `saad`, `letter-dad` → `dhaad`, `letter-taa-emphatic` → `ttaa`, `letter-zaa` → `thhaa`, `letter-ain` → `ayn`, `letter-ghain` → `ghayn`, `letter-faa` → `faa`, `letter-qaf` → `qaaf`, `letter-kaf` → `kaaf`, `letter-lam` → `laam`, `letter-mim` → `meem`, `letter-nun` → `noon`, `letter-haa-soft` → `haa`, `letter-waw` → `waaw`, `letter-yaa` → `yaa`.
  - **Recommended** so any in-flight user or external bookmark lands on the right letter in the new unified lesson.

---

## 6. Expected final state after all 5 phases

- `/dashboard/courses/arabic/alphabet` remains the sole Arabic-alphabet entry point.
- Arabic theme page shows 10 lessons (numbers, colors, shapes, alphabet, family, animals-world, body, pronouns-mutakallim, pronouns-mukhatab, pronouns-ghaib) at orders 1–4 + 33–38. No gap visible to users; sort order preserved.
- No `letter_*` section type in code or DB.
- Legacy `/dashboard/courses/arabic/letter-*` URLs 301-redirect to `/dashboard/courses/arabic/alphabet?letter=<key>` (if Phase 3D applied).
- Zero user-data impact.
- `npx tsc --noEmit`, `npm run lint`, `npx next build`, `npx prisma validate` all clean.

---

## 7. Summary

**Safe to proceed.** No route folders to purge, no per-letter seed files to purge, no shared utilities at risk, zero user-data cascade risk. All deletions can be cleanly scoped to:
- **5 component files** (exclusive to legacy).
- **~250 lines** across `prisma/seed.ts`, `lib/lessonSections.ts`, `components/ui/SectionRenderer.tsx`, `components/ui/LessonAdventure.tsx`.
- **140 DB rows** (28 lessons + 112 sections) inside a rollback-safe transaction.

Awaiting your 👍 to start **Phase 2 — Backup**.
