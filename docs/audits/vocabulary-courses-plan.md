# Vocabulary Courses — Phase 0 Audit

**Date:** 2026-04-27
**Scope:** Plan 13 themed Arabic vocabulary courses (fruits, vegetables, body-parts, clothes, jobs, transport, days, seasons, weather, emotions, food, instruments, animals) on a single shared `vocabulary_lesson` runtime.
**Mode:** Read-only. No code changes performed.

---

## A. Existing Arabic Courses

The `arabic` theme currently seeds **10 lessons**. Slugs and section types as found in [prisma/seed.ts](../../prisma/seed.ts):

| Lesson slug              | Title (Arabic)               | Section type(s)                                               | # Sections | Visual style                                     | On 5-zone standard? |
|--------------------------|------------------------------|---------------------------------------------------------------|-----------:|--------------------------------------------------|---------------------|
| `numbers`                | عَالَمُ الْأَرْقَامِ              | `numbers_lesson`                                              | 1          | Inline SVG digits + emoji counters               | 🟢 5 zones          |
| `colors`                 | عَالَمُ الْأَلْوَانِ               | `colors_lesson`                                               | 1          | Inline SVG shapes + colour swatches              | 🟢 5 zones          |
| `shapes`                 | عَالَمُ الْأَشْكَالِ              | `shapes_lesson`                                               | 1          | Inline SVG shapes + drawing canvas               | 🟢 5 zones          |
| `alphabet`               | الْأَبْجَدِيَّةُ                  | `alphabet_lesson`                                             | 1          | Letter glyphs + emoji vocabulary                 | 🟢 5 zones × 28 letters |
| `family`                 | الْعَائِلَةُ                      | `family_lesson`                                               | 1          | Lucide icons in pastel circles + per-member cfg | 🟡 6 zones (extra Matching) |
| `animals-world`          | عَالَمُ الْحَيَوَانَاتِ           | `animal_world` × 4 + `animal_world_quiz` × 1                  | 5          | Emoji animals in scenes                          | 🔴 not zoned (multi-section) |
| `body`                   | أَعْضَاءُ الْجِسْمِ              | `body_map`                                                    | 1          | Single SVG body diagram with hotspots            | 🔴 single-section, not zoned |
| `pronouns-mutakallim`    | ضَمَائِرُ الْمُتَكَلِّمِ         | `pronoun_cards`/`pronoun_object`/`pronoun_sentences`/`pronoun_quiz` | 4    | Cards + sentence builder                         | 🔴 multi-section    |
| `pronouns-mukhatab`      | ضَمَائِرُ الْمُخَاطَبِ            | (same as mutakallim)                                          | 4          | (same)                                           | 🔴 multi-section    |
| `pronouns-ghaib`         | ضَمَائِرُ الْغَائِبِ              | (same as mutakallim)                                          | 4          | (same)                                           | 🔴 multi-section    |

### Slug-collision check for the 13 targets

URL pattern is `/dashboard/courses/arabic/<slug>`. Mapping the brief's `arabic-<x>` IDs to actual DB lesson slugs:

| # | Brief ID                | DB slug (proposed) | Status |
|---|-------------------------|--------------------|--------|
| 1 | `arabic-animals`        | `animals`          | 🟢 free (existing course is `animals-world`, distinct) |
| 2 | `arabic-fruits`         | `fruits`           | 🟢 free |
| 3 | `arabic-vegetables`     | `vegetables`       | 🟢 free |
| 4 | `arabic-body-parts`     | `body-parts`       | 🟡 thematically adjacent to existing `body` (different scope: 12 named parts vs. 7-hotspot map). Recommend keeping both — they teach different things |
| 5 | `arabic-clothes`        | `clothes`          | 🟢 free |
| 6 | `arabic-jobs`           | `jobs`             | 🟢 free |
| 7 | `arabic-transport`      | `transport`        | 🟢 free |
| 8 | `arabic-days`           | `days`             | 🟢 free |
| 9 | `arabic-seasons`        | `seasons`          | 🟢 free |
| 10 | `arabic-weather`       | `weather`          | 🟢 free |
| 11 | `arabic-emotions`      | `emotions`         | 🟢 free |
| 12 | `arabic-food`          | `food`             | 🟢 free |
| 13 | `arabic-instruments`   | `instruments`      | 🟢 free |

**No hard collisions.** The closest is `body-parts` adjacent to `body` — they can coexist (the existing `body_map` is a single hotspot diagram; the new vocabulary course is a 5-zone vocab drill).

### `arabic-animals` decision

The existing `animals-world` course is **NOT on the 5-zone standard** — it's a 5-section adventure (Farm/Jungle/Sky/Ocean/Quiz) using emoji visuals and the generic `LessonAdventure` orchestrator.

**Recommendation:** treat `arabic-animals` as a **brand-new course at slug `animals`** running on the new `vocabulary_lesson` runtime. Leave `animals-world` untouched for now — flag it as a future cleanup candidate (it's a different pedagogical model, not a refactor target). This avoids destructive changes and gives users two complementary experiences.

---

## B. Routing Pattern

**100% dynamic routing.** No static folders under `app/dashboard/courses/arabic/` (the directory does not exist). Everything resolves through:

```
app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx   (239 lines)
```

The dispatch in [page.tsx:177-226](../../app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx#L177-L226) special-cases single-section lessons of types:

- `numbers_lesson` → `<NumbersLessonPage>`
- `colors_lesson` → `<ColorsLessonPage>`
- `shapes_lesson` → `<ShapesLessonPage>`
- `alphabet_lesson` → `<AlphabetLessonPage>`
- `family_lesson` → `<FamilyLessonPage>`

Anything else (or multi-section lessons) falls through to `<LessonAdventure>`.

**To wire up the new courses:** add one new branch — `vocabulary_lesson` → `<VocabularyLessonPage>`. The brief's optional `arabic/fruits/page.tsx` static-route shape is **not how this codebase works** — recommend dropping it and following the established dynamic pattern. The 13 routes will simply be 13 DB rows under the `arabic` theme; the dynamic route handles them automatically.

> **Phase 1 deviation from brief:** the brief proposes `app/dashboard/courses/arabic/_shared/` and 13 thin `page.tsx` files. Since static routes don't exist in this project, the shared runtime should live under `components/ui/vocabulary/` (mirroring `components/ui/family/`) and the 13 routes are auto-served by the existing dynamic route once `vocabulary_lesson` is added to the dispatch. **Will confirm before Phase 1.**

---

## C. Shared Library State

### `lib/lessonSections.ts` (738 lines)

The Section discriminated union [lessonSections.ts:466-538](../../lib/lessonSections.ts#L466-L538) lists 27 section types. Relevant single-section orchestrator types (line numbers):

```ts
| { ...; type: "numbers_lesson";  content: NumbersLessonSection }   // L512
| { ...; type: "colors_lesson";   content: ColorsLessonSection }    // L518
| { ...; type: "shapes_lesson";   content: ShapesLessonSection }    // L524
| { ...; type: "alphabet_lesson"; content: AlphabetLessonSection }  // L530
| { ...; type: "family_lesson";   content: FamilyLessonSection }    // L536
```

`parseSection(row)` switch ([lessonSections.ts:552-737](../../lib/lessonSections.ts#L552-L737)) calls each type's Zod schema with `safeParse` and returns null on failure (defense-in-depth). **No `vocabulary_lesson` case exists** — Phase 1 must add one.

### Hooks

| File                                      | Purpose |
|-------------------------------------------|---------|
| [lib/useAudio.ts](../../lib/useAudio.ts)               | Generic Arabic-speech hook. MP3-first, SpeechSynthesis fallback (`ar-SA`, `rate 0.8`, `pitch 1.1`), 400ms debounce, mute toggle. **Already SSR-safe.** Note: lives at `lib/useAudio.ts`, **not** `lib/hooks/useAudio.ts`. |
| [lib/useColorAudio.ts](../../lib/useColorAudio.ts)     | Specialised audio for colour names (built on top of `useAudio`). |
| [lib/speak.ts](../../lib/speak.ts)                     | Lower-level speech wrapper. |
| [lib/hooks/useLessonProgress.ts](../../lib/hooks/useLessonProgress.ts) | The orchestrator state machine: `intro → zone[0..N-1] → complete`, stars accumulator, confetti key, replay reset. **Reusable verbatim** for the vocabulary runtime. |
| [lib/hooks/useLetterProgress.ts](../../lib/hooks/useLetterProgress.ts) | Per-letter localStorage progress (alphabet-specific). |
| [lib/hooks/useDrawing.ts](../../lib/hooks/useDrawing.ts) | Canvas drawing state for shape tracing. Not needed for vocabulary courses. |

**Gap:** none of the 5 zone-specific hooks the brief requests (e.g. `useZoneProgress`) exist as a separate module — but `useLessonProgress` already does the job. Phase 1 should reuse it, not create a new one.

### Utilities

[lib/utils/random.ts](../../lib/utils/random.ts) (82 lines) exports:

- `mulberry32(seed)` — seeded PRNG
- `shuffle(array, seed)` — Fisher-Yates
- `pickRandom(array, n, seed)` — n distinct items
- `pickOne(array, seed)` — single pick
- `randomInt(min, max, seed)` — bounded int
- `generateRoundSeed()` — fresh integer seed

**Complete and reusable. No additions needed for Phase 1.**

### Schemas

[lib/schemas/](../../lib/schemas/) holds 5 lesson schemas — `alphabetLesson.schema.ts`, `colorsLesson.schema.ts`, `familyLesson.schema.ts`, `numbersLesson.schema.ts`, `shapesLesson.schema.ts`. Each defines a discriminated union on `kind` for its zones plus a top-level `.refine()` for cross-field invariants.

The **`familyLesson.schema.ts`** is the closest template for a new generic vocabulary schema — it already has the patterns we need (whitelisted icon-key regex, pre-split letter words, multi-zone configurable lesson).

**No `vocabularyLesson.schema.ts` exists.** Phase 1 creates it.

### Types

[lib/types/](../../lib/types/) mirrors `lib/schemas/` 1-to-1 — type-only re-exports. No `vocabularyLesson.types.ts` exists.

### SVG / icon registries

[lib/svg/family/](../../lib/svg/family/) is the only subdirectory:
- `index.tsx` — whitelist `FAMILY_SVG_REGISTRY` (11 PascalCase keys → component) + `resolveFamilySvg(key)` resolver
- `FamilyIcon.tsx` — single Lucide-icon wrapper component (circular pastel BG + dynamic stroke colour)

**This is the exact pattern Phase 1 needs to replicate** for each of the 13 themes — but generalised: one shared `<VocabularyIcon theme={t} iconKey={k} />` plus 13 per-theme `MEMBER_CONFIGS`-style maps.

### Server-side fetch

**No `lib/server/lessons.ts` exists.** The dispatch page queries Prisma inline ([page.tsx:90-112](../../app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx#L90-L112)). Phase 1 doesn't need to add a server helper — just the new dispatch branch.

---

## D. Database / Seed State

### Prisma models ([prisma/schema.prisma](../../prisma/schema.prisma))

```prisma
model Theme {
  id     String  @id @default(cuid())
  name   String  @unique          // ← themeSlug
  title  String
  ...
  themeLessons ThemeLesson[]
}

model ThemeLesson {
  id       String  @id @default(cuid())
  slug     String                  // ← lessonSlug
  title    String
  level    LessonLevel
  order    Int     @default(0)
  themeId  String
  sections LessonSection[]
  @@unique([themeId, slug])
}

model LessonSection {
  id       String   @id @default(cuid())
  type     String                   // ← "vocabulary_lesson"
  content  Json                     // ← VocabularyLessonContent
  order    Int      @default(0)
  lessonId String
}
```

**No schema migration needed** — `LessonSection.type` is already a free-form string and `content` is `Json`. Phase 1 adds a new type discriminator value (`"vocabulary_lesson"`) on the application side only.

### Seed registry

[prisma/seeds/](../../prisma/seeds/):
- `alphabetLesson.seed.ts`, `colorsLesson.seed.ts`, `familyLesson.seed.ts`, `numbersLesson.seed.ts`, `shapesLesson.seed.ts`
- `alphabet/` subdirectory (per-letter data)

**No `vocabulary/` directory.** Phase 3 creates it with 13 theme data files.

[prisma/seed.ts](../../prisma/seed.ts) imports each `*LessonContent` and registers it in a flat `LessonSeed[]` per theme. Adding 13 new lessons is mechanical: import the content, append to the array. Pattern is upsert-by-`(themeId, slug)` — idempotent.

---

## E. Icon Libraries

[package.json](../../package.json) currently installs only:

```json
"lucide-react": "^1.8.0"
```

No Phosphor, no Tabler, no react-icons. Family icons use Lucide's `UserRound` and `Baby`.

### Library recommendation

The brief prefers **Phosphor**. Adding `@phosphor-icons/react` (~3MB import-tree, but tree-shaken on build) is straightforward.

**Trade-off to surface before Phase 1:**

| Option | Pros | Cons |
|---|---|---|
| **Stick with Lucide only** | Already installed, smaller bundle, family course already uses it, consistent visual style | Lucide lacks specific glyphs for some items (eggplant, oud, hijab). Some items will need creative substitutes (e.g. `Eggplant` doesn't exist → `Carrot` rotated? meaningless.) |
| **Add Phosphor as primary** | Much richer catalogue, has `Carrot`/`Onion`/`Eggplant`/`HouseLine`, multiple weights (regular/bold/duotone) | New dependency, new mental model, two libraries in the codebase |
| **Phosphor primary + Lucide fallback** *(brief's spec)* | Best coverage; family course untouched; per-theme registry can pick either | More complex resolver; bundle includes both |

**My recommendation:** **Phosphor primary, Lucide fallback** — matches the brief and gives the best per-item icon fidelity. The per-theme registry (Phase 1) is the central choke-point so two libs aren't a maintenance burden. Will confirm before installing.

---

## F. Dashboard Navigation / Discovery

### Course catalog

[app/dashboard/courses/page.tsx](../../app/dashboard/courses/page.tsx) (76 lines) renders `<GameCard>`s for every theme returned by `prisma.theme.findMany()` — **fully DB-driven**. Each card links to `/dashboard/courses/<themeSlug>`.

### Theme index

There is **no** `app/dashboard/courses/[themeSlug]/page.tsx`. Clicking a theme card hits a 404, OR (more likely) the user reaches lessons via a different path I haven't found. Worth verifying in Phase 5 — the 13 new lessons need to be discoverable.

### Existing lesson catalog component

[components/ui/LessonAdventure.tsx](../../components/ui/LessonAdventure.tsx) holds a `LESSON_FALLBACK_ICONS` map (referenced by name only — used to label sections in the multi-section view). Phase 1 may need to add `vocabulary_lesson: { label: "Vocabulary Course", icon: "📚" }` for parity, even though vocabulary lessons render via their own orchestrator and don't go through `LessonAdventure`.

---

## G. Design Tokens / Shared Atoms

The codebase has **two parallel atom suites** — one under `numbers/`, one under `family/shared/`. They overlap heavily.

### From `components/ui/family/shared/` (recommended template — newest, cleanest)

| File | Purpose | Reusable for vocabulary? |
|------|---------|---|
| `FamilyMemberCard.tsx` | 5-state card (idle / selected / correct / wrong / locked) + outlined + fillColor | 🟢 generalise to `VocabularyCard` (rename `FamilyMember` → `VocabItem`) |
| `FamilyMemberRenderer.tsx` | Whitelist dispatcher with placeholder fallback | 🟢 generalise to `VocabularyIcon` accepting `theme` + `iconKey` |
| `FeedbackOverlay.tsx` | Transient correct/wrong/hint toast (`AnimatePresence`) | 🟢 lift verbatim to shared |
| `InstructionBanner.tsx` | RTL banner with optional colour chip + replay | 🟢 lift verbatim |
| `ReplayButton.tsx` | Standard atom | 🟢 lift verbatim |
| `ScoreTracker.tsx` | Sticky progress + zone label + stars | 🟢 lift verbatim |

### From `components/ui/numbers/`

| File | Purpose | Reusable? |
|------|---------|---|
| `NumberPad.tsx` (152 lines) | +/- counter input | ⚠️ **wrong shape**. The vocabulary `CountZone` needs Western digit keypad (0-9, ⌫, ✕, تَحَقَّقْ submit) — same as the keypad inlined inside [CountFamilyZone.tsx](../../components/ui/family/zones/CountFamilyZone.tsx). Phase 1 should lift the family-zone one as the canonical `NumberPad`. |
| `DigitGrid.tsx`, `NumberCard.tsx`, `QuantityVisual.tsx` | Numbers-specific | not relevant |
| `FeedbackOverlay.tsx`, `ScoreTracker.tsx`, `ZoneNavigator.tsx` | Older duplicates of family ones | skip — use family versions |

### From `components/ui/family/zones/` (the 6 zone exemplars)

| Zone file | Maps to vocab zone | Reuse strategy |
|-----------|-------------------|----------------|
| `DiscoveryZone.tsx`         | `vocab_discovery`     | Generalise: replace `members` with `items`, `category` filter optional |
| `ListenPickZone.tsx`        | `vocab_listen_pick`   | Generalise: same shape, just generic items + category-distractor preference |
| `MatchingZone.tsx`          | (skipped per brief)   | Family has matching; vocabulary brief drops it. Keep family code as-is |
| `CountFamilyZone.tsx`       | `vocab_count`         | Generalise: rename `members` → `items`, lift inline `NumberPad` to shared |
| `ColorMemberZone.tsx`       | `vocab_color_item`    | Generalise: `Member` → `Item` |
| `ColorLettersZone.tsx`      | `vocab_color_letters` | Generalise: already uses pre-split words; just decouple from `FamilyMember` type |

**Net effect for Phase 1:** the family lesson is the prototype. The vocabulary runtime is essentially a generalisation of family/zones with the vocabulary type system — and **5 zones instead of 6** (drop Matching).

### Confetti

[components/ui/Confetti.tsx](../../components/ui/Confetti.tsx) (60 lines) — generic, used by all orchestrators on completion. No changes needed.

---

## H. Anything Else Surprising

1. **The "5-zone pattern" isn't actually universal.** Numbers/colors/shapes/alphabet have 5 zones; family has 6 (extra Matching); animals/body/pronouns have multi-section structures. The brief's claim of an "established 5-zone standard" is **only ~partially true** — it's the standard for newer courses, but not all of them. The vocabulary runtime will *codify* this 5-zone standard for the first time. Worth flagging because it influences naming: this isn't really a "shared" runtime extracted from existing code — it's a **new generalisation** of the family pattern, applied across 13 themes.

2. **`prefers-reduced-motion` is partially implemented.** Family zones honor `useReducedMotion()` from Framer Motion. Numbers/alphabet zones are inconsistent. Phase 1 should bake it into all 5 generic zones from the start.

3. **No central icon-theme registry yet.** `lib/svg/family/index.tsx` is the only existing example. Phase 1 design must decide whether each theme owns its own registry file (`lib/icons/themes/<theme>.ts`) or whether everything lives in one big map. Recommend **per-theme files** — easier to grep, easier to author, smaller change-blast-radius when adding a new theme.

4. **Pre-split harakat is non-trivial; previous lessons handcrafted it.** Authoring 13 themes × ~10 words means ~130 pre-split entries. Each entry is shaped like:
   ```ts
   { base: "أ", harakat: "َ", display: "أَ", name: "أَلِفٌ", isTarget: false }
   ```
   Phase 3's "max 2 themes per response" rule is **load-bearing** — vowelization quality drops sharply when batched. Need to honor it strictly.

5. **No drag-and-drop infrastructure.** Brief mentions `allowDragAndDrop: false` for matching — there's nothing to enable here even if we wanted to. Tap-to-pair is the only pattern in use.

6. **`npm run lint` is broken** (pre-existing; documented as a Next 15+ tooling issue). `npm run build` and `npx tsc --noEmit` are clean. Phase 6 verification should run those two, not `lint`, until a separate cleanup mission addresses it.

7. **`docs/audits/arabic-courses-audit.md` already exists** from a prior audit run — different file, different scope, not in the way of the new `vocabulary-courses-plan.md`.

---

## Proposed Execution Plan

### Phase 1 — Shared foundations (build once)

1. **Type/schema** — `lib/types/vocabularyLesson.types.ts` + `lib/schemas/vocabularyLesson.schema.ts` (single Zod with `discriminatedUnion` over 5 zone kinds + cross-field `.refine()` for unique keys / pool sizing).
2. **Icon library** — install `@phosphor-icons/react`. Build `lib/icons/themes/index.ts` with theme→registry resolver + 13 placeholder theme files (icon mappings filled in Phase 2).
3. **Generic icon component** — `components/ui/vocabulary/VocabularyIcon.tsx` mirroring `FamilyIcon.tsx`: circular pastel BG + dynamic-stroke icon + outlined/fillColor states.
4. **Generic atoms** — lift family/shared atoms (`Card`, `FeedbackOverlay`, `InstructionBanner`, `ReplayButton`, `ScoreTracker`) into `components/ui/vocabulary/shared/`. Add canonical `NumberPad` (Western digits) + `LetterGlyph` (lifted from alphabet).
5. **Generic zones** — `DiscoveryZone`, `ListenPickZone`, `CountZone`, `ColorItemZone`, `ColorLettersZone` under `components/ui/vocabulary/zones/` — direct generalisations of family equivalents.
6. **Orchestrator** — `VocabularyLessonPage` + `ZoneNavigator` + `ThemedBackground` (configurable per theme: hearts for family, fruit for fruits, …).
7. **Dispatch wiring** — add `vocabulary_lesson` case to [lessonSections.ts](../../lib/lessonSections.ts) `parseSection()` switch + add branch to [page.tsx:177-226](../../app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx#L177-L226).
8. **Seed helper** — `prisma/seeds/_shared/seedVocabularyLesson.ts` — idempotent upsert for any vocabulary lesson.

### Phase 2 — Icon mapping (13 stops)

For each theme, present a table `(item key → Phosphor icon | Lucide fallback | manual SVG)` plus pastel BG hex + idle animation. Stop for approval. Order:

1. Fruits → 2. Vegetables → 3. Body parts → 4. Clothes → 5. Jobs → 6. Transport → 7. Days (no item icons — calendar/numbers vibe) → 8. Seasons → 9. Weather → 10. Emotions → 11. Food → 12. Instruments → 13. Animals.

### Phase 3 — Content authoring (max 2 themes per batch)

7 stops total:
- Batch 1: Fruits + Vegetables
- Batch 2: Body parts + Clothes
- Batch 3: Jobs + Transport
- Batch 4: Days + Seasons
- Batch 5: Weather + Emotions
- Batch 6: Food + Instruments
- Batch 7: Animals

### Phase 4 — Seed orchestration

`prisma/seeds/seedAllVocabularyLessons.ts` — imports 13 data files, calls `seedVocabularyLesson(...)` for each, appends to existing `LessonSeed[]` in `prisma/seed.ts`. Idempotent. Stop for approval before running.

### Phase 5 — Routes & wiring

No new `page.tsx` files needed (dynamic route handles all 13). Confirm theme-index page exists or add one. Update `LESSON_FALLBACK_ICONS` in [LessonAdventure.tsx](../../components/ui/LessonAdventure.tsx) for parity. Stop for approval.

### Phase 6 — Verification

`npx tsc --noEmit` + `npx next build` + `npx prisma validate` + `npx tsx prisma/seeds/seedAllVocabularyLessons.ts` (test DB) + smoke-test 2-3 routes in browser. Final report at `docs/audits/vocabulary-courses-final.md`.

---

## Open Questions (need decisions before Phase 1)

1. **Icon library:** confirm Phosphor primary + Lucide fallback (preferred) vs. Lucide-only.
2. **`arabic-animals` strategy:** new course at slug `animals` (recommended) vs. refactor existing `animals-world`.
3. **Static-route deviation:** confirm we drop the brief's `app/dashboard/courses/arabic/<slug>/page.tsx` shape and use the existing dynamic route. (Strongly recommended — matches established convention.)
4. **Atom location:** confirm `components/ui/vocabulary/shared/` (mirroring `components/ui/family/shared/`) vs. brief's proposed `app/dashboard/courses/arabic/_shared/`.
5. **Days-of-week peculiarity:** Days don't really fit the icon model (no good "Saturday" icon). Proposal: render as **labelled numbered cards** (1-7 with Arabic day name underneath) — same 5-zone structure, but the "icon" is just a Phosphor `Calendar` glyph + the day's ordinal. Confirm before Phase 2.
6. **Body-parts adjacency:** confirm we keep both `body` (existing 7-hotspot map) and `body-parts` (new 12-item vocab drill) coexisting.
7. **Whether to renormalise the family lesson** to drop Matching and conform to the new 5-zone runtime (post-Phase 6 cleanup, not blocking).

---

## Status

✅ **Phase 0 complete.** Read-only audit produced. No code modified.
⏸️ **Awaiting approval** to proceed to Phase 1 (shared foundations) — including the open-question decisions above.
