# Arabic Lesson Standard — canonical pattern

> Status: **Phase 2 draft** (awaiting approval). Every future Arabic lesson
> in this repo MUST follow this standard. The new `numbers` lesson is the
> reference implementation.

---

## 1. Architecture — DB-driven, one dynamic route

This codebase does **not** use one folder per lesson under
`app/dashboard/courses/arabic/<slug>/`. That was a common ask in early
prompts, but the actual (and better) shape is:

```
app/
  dashboard/
    courses/
      page.tsx                              ← list of courses
      [themeSlug]/
        page.tsx                            ← list of lessons in a theme
        [lessonSlug]/
          page.tsx                          ← ONE server component for every lesson
          loading.tsx
          not-found.tsx

components/
  ui/                                       ← section-block components
    TextBlock.tsx, QuizBlock.tsx, …         ← single-section blocks
    numbers/                                ← lesson-specific sub-tree
      NumbersLessonPage.tsx
      NumberCard.tsx
      ZoneNavigator.tsx
      …
    letters/, family/, shapes/, …          ← (future: move there on refactor)

lib/
  useAudio.ts                               ← shared audio hook
  lessonSections.ts                         ← master Section union + parseSection
  schemas/
    numbersLesson.schema.ts                 ← per-domain Zod schema
    letters.schema.ts, …                    ← (future)
  types/
    numbersLesson.types.ts                  ← inferred types, public façade
    …
  hooks/
    useLessonProgress.ts                    ← (to be created)
  components/
    arabic/
      ArabicText.tsx                        ← (to be created)
      LessonShell.tsx                       ← (to be created)
      Chip.tsx                              ← (to be created)

prisma/
  schema.prisma                             ← DO NOT MODIFY without approval
  seed.ts                                   ← orchestrator
  seeds/
    numbersLesson.seed.ts                   ← per-lesson content JSON
    lettersLesson.seed.ts, …                ← (future)
```

### Why this shape

- **No per-slug folder means no duplicated chrome** — the breadcrumb,
  session guard, metadata, and Prisma fetch are written exactly once.
- **Content is pure JSON in `LessonSection.content`.** Editing a lesson
  never requires a code change — edit the row via `npm run db:studio`,
  or update the seed and re-run `npm run db:seed`.
- **One `Section` union** (`lib/lessonSections.ts`) acts as a contract
  between seed, Prisma row, server parser, and client renderer.
- **One client orchestrator** (`<LessonAdventure>`) handles every lesson
  except those with a single section of a "full-page" type
  (`numbers_lesson` is the first). Full-page types are rendered by a
  dedicated orchestrator (e.g. `<NumbersLessonPage>`) via a bypass
  branch in `page.tsx`.

---

## 2. Canonical folder structure for a new lesson

When a lesson is **simple** (a list of small interactive sections,
re-using existing block types):

- Add a new row to `prisma/seed.ts` via the existing `lessonSeeds[]`
  array. Use only section types that already exist in
  `lib/lessonSections.ts`.
- **No new code is needed.** `SectionRenderer` already dispatches, and
  `LessonAdventure` already chromes.

When a lesson is **rich** (full-page custom flow, multi-zone navigator,
unique mechanics like `NumberPad`):

1. Create a new folder `components/ui/<domain>/`.
2. Create one `<DomainLesson>Page.tsx` client orchestrator.
3. Create the atoms (Card, Pad, Visual, Overlay, Tracker) inside it.
4. Create the zone components.
5. Add a new section type in `lib/schemas/<domain>Lesson.schema.ts`.
6. Re-export types from `lib/types/<domain>Lesson.types.ts`.
7. Register the type in `lib/lessonSections.ts` (Section union +
   `parseSection` case).
8. Add a bypass branch in `app/.../[lessonSlug]/page.tsx`:
   ```ts
   if (only && only.type === "<domain>_lesson") {
     return <DomainLessonPage content={only.content} ... />;
   }
   ```
9. Add the section content JSON in `prisma/seeds/<domain>Lesson.seed.ts`,
   import it into `prisma/seed.ts`, and plug it into the `lessonSeeds`
   entry with `sections: [{ type: "<domain>_lesson", content: … }]`.
10. Update `components/ui/LessonAdventure.tsx` `ZONE_LABELS` with a
    fallback entry (even if normally bypassed) to satisfy exhaustive
    type checking.

---

## 3. Canonical shared utilities

### `lib/useAudio.ts` ✅ (exists)

Hook contract:

```ts
function useAudio(options?: {
  defaultMuted?: boolean;
  rate?: number;        // default 0.8
  pitch?: number;       // default 1.1
  lang?: string;        // default "ar-SA"
  debug?: boolean;
  debounceMs?: number;  // default 400
}): {
  playAudio: (audioUrl?: string, fallbackText?: string) => void;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (m: boolean) => void;
};
```

Rules:

- **Always call through `playAudio`**, never `new Audio()` or
  `speechSynthesis.speak()` directly in section code.
- `audioUrl` must be an **internal path** (`/audio/…/*.mp3`) or omitted.
  External URLs are silently rejected.
- Any `playAudio()` inside a rapid-fire loop (e.g. hover across a grid)
  is automatically rate-limited by the 400 ms debounce.
- SSR safe (all `window` access is guarded).
- On Chrome, the hook inserts an 80 ms delay after `cancel()` to work
  around a known "speak-after-cancel drops silently" bug.
- First `playAudio` warms up voices via a module-level cached promise.
- MP3 failure path (network / autoplay) falls back to TTS within the
  same user-gesture tick so Chrome still honours the call.

### `lib/hooks/useLessonProgress.ts` ⚠️ (to be created)

Contract:

```ts
function useLessonProgress(totalZones: number): {
  phase: { kind: "intro" } | { kind: "zone"; index: number } | { kind: "complete" };
  stars: number;
  confettiKey: number;
  zoneResults: Record<number, { correct: number; total: number } | null>;
  totals: { correct: number; total: number };
  start(): void;
  completeZone(index: number, result?: { correct: number; total: number }): void;
  advanceZone(index: number): void;
};
```

- Centralizes what `LessonAdventure.tsx` and `NumbersLessonPage.tsx`
  currently implement twice.
- Idempotent on double-calls (a zone can't double-award a star).
- Triggers `confettiKey++` on every completeZone + on last advance.

### `lib/components/arabic/ArabicText.tsx` ⚠️ (to be created)

```tsx
<ArabicText as="h2" size="xl" className="…">تَعَرَّفْ عَلَى الْحَرْفِ</ArabicText>
```

- Applies `lang="ar"`, `dir="rtl"`, and the `Amiri → Noto Naskh Arabic
  → Scheherazade New → serif` font stack in one place.
- `as` prop: `"span" | "p" | "h1" | "h2" | "h3" | "div"`.
- `size` prop: `"sm" | "md" | "lg" | "xl" | "2xl"` mapped to harakat-safe
  `leading-loose` / `leading-relaxed` values.
- Replaces the ~25 inline `style={{ fontFamily: "…" }}` occurrences.

### `lib/components/arabic/LessonShell.tsx` ⚠️ (to be created)

Common wrapper that renders:

- Breadcrumb (`Courses > ThemeTitle > LessonTitle`) with `dir="auto"`
- Optional hero card (icon + title + description + Start button)
- Slot for zone content
- Optional completion screen slot
- Sticky `ScoreTracker` at the top

Both `LessonAdventure` and `NumbersLessonPage` will internally render
through `LessonShell`.

### `lib/components/arabic/Chip.tsx` ⚠️ (to be created)

```tsx
<Chip size="sm | md" tone="neutral | info | warning">…</Chip>
```

- Min-height enforced (`sm` → `min-h-10` = 40 px, `md` → `min-h-12`).
- Replaces the ad-hoc `text-xs px-3 py-1` patterns that shrink badges
  below 44 px.

### Schema split (future)

`lib/lessonSections.ts` stays as the aggregator (Section union +
parseSection). Each domain moves its schemas to
`lib/schemas/<domain>.schema.ts`. `lessonSections.ts` re-imports and
re-exports them.

---

## 4. Canonical component contracts

### Section block (single-section type, rendered inline by SectionRenderer)

```ts
interface SectionBlockProps<Content> {
  section: Content;       // already Zod-validated by parseSection
}
```

A block component MUST:

- Be a client component (`"use client"`) if it has any interactivity.
- Accept only `{ section }` — no stray props that leak DB shape.
- Use `useAudio` for any sound.
- Wrap the top-level element in `<section aria-labelledby="…">` when
  there's a title.
- Use `<ArabicText>` for every Arabic string.
- Emit `aria-live="polite"` on any counter/status that updates.

### Zone (subcomponent of a full-page lesson)

```ts
interface ZoneProps<ZoneData> {
  numbers: NumberItem[];   // or letters, colors, animals — the domain table
  zone: ZoneData;          // the typed sub-section config
  onComplete?: (result?: { correct: number; total: number }) => void;
  onAdvance?: () => void;
}
```

Rules:

- **Two optional callbacks, no more.** Orchestrator wires them.
- `onComplete` fires **once** per round-set — idempotent.
- `onAdvance` always exposed; child should never be stuck on a zone.
- Zone stays mounted on `onComplete` so confetti / final message show.

### Card (atom)

```ts
interface CardProps<Item> {
  item: Item;
  size?: "sm" | "md" | "lg";
  index?: number;
  onClick?: () => void;
  onHover?: () => void;
  selected?: boolean;
  status?: "correct" | "wrong" | null;
  disabled?: boolean;
}
```

Minimum tap target: `min-h-16 min-w-16` (64 × 64 px). Pad-style cards
(`NumberPad`) go to 72 × 72 px.

### Quiz / Match round

```ts
interface RoundConfig {
  prompt: string;
  audioText?: string;
  answer: string | number;
  options: Array<string | number | { name: string; emoji: string }>;
}
```

Invariants:

- Zod schema MUST include a refinement `answer ∈ options`.
- Options rendered in a `role="radiogroup"` with `role="radio"` children.

---

## 5. Canonical styling tokens

The repo uses Tailwind CSS. Additional tokens live in
`tailwind.config.ts` theme extension — no CSS-in-JS, no PostCSS globals
beyond what Tailwind already configures.

### Typography

| Context | Font stack |
|---|---|
| Arabic text | `"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif` |
| Western digits | `"Nunito", system-ui, sans-serif` |
| Body / UI | Tailwind default (`system-ui` via `font-sans`) |

Used by `<ArabicText>` and `<NumberCard>`. Never inline the stack again.

### Sizes

| Arabic text size | Tailwind class | Use case |
|---|---|---|
| 3xl / leading-loose | `text-3xl leading-loose` | card name |
| 4xl / leading-relaxed | `text-4xl leading-relaxed` | zone title |
| 6xl / leading-none | `text-6xl leading-none` | hero letter |

Harakat need vertical room — **always** pair large Arabic with
`leading-loose` or `leading-relaxed`.

### Colour themes per lesson

Each domain provides its own pastel palette via the section JSON
(`colorTheme` per number / `hex` per colour / `world` enum for animals).
Palettes are validated by Zod hex regex.

### Motion

| Usage | Transition |
|---|---|
| Entrance (opacity + translate, 2 keyframes) | `type: "spring", stiffness: 200, damping: 22` |
| Multi-keyframe shake / celebrate | `duration: 0.4-0.5, ease: "easeInOut"` — never spring |
| Infinite loop (float, sparkle) | `duration: 3-14s, repeat: Infinity, ease: "easeInOut"` |

**Framer Motion rule**: spring transitions support **only 2 keyframes**.
If `animate` has more than 2 values, use tween (`duration` / `ease`).

### Reduced motion

Every looping `motion.*` call MUST check `useReducedMotion()`:

```tsx
const prefersReducedMotion = useReducedMotion();
<motion.div
  animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 3, repeat: Infinity }}
/>
```

Framer's automatic system-level handling is **not enough** — looping
animations still run under `prefers-reduced-motion: reduce`.

### Shadows / rings

- Cards: `rounded-3xl` / `rounded-[32px]` / `rounded-[40px]`
- Shadows: `shadow-lg` idle, `shadow-2xl` on hover, `shadow-inner` for
  wells / carved surfaces
- Ring: `ring-1 ring-black/5` idle, `ring-4 ring-gray-900` selected,
  `ring-4 ring-emerald-500` correct, `ring-4 ring-rose-500` wrong.

### Focus indicator

Every interactive element: `focus:outline-none
focus-visible:ring-4 focus-visible:ring-sky-300/70`.

---

## 6. Canonical accessibility rules (non-negotiable)

Each interactive component MUST:

1. **Tap target ≥ 64 × 64 px** (`min-h-16 min-w-16`). NumberPad ≥ 72 ×
   72 px.
2. **Keyboard accessible** — every action reachable via `Tab` +
   `Enter`/`Space`. No mouse-only interactions.
3. **`focus-visible:ring-4`** on every button/link/input.
4. **Arabic strings wrapped in `<ArabicText>`** (or `lang="ar"` +
   `dir="rtl"` + Amiri stack).
5. **Western digits wrapped in `dir="ltr"` or `<bdi dir="ltr">`**
   when inside an RTL parent.
6. **ARIA labels** on anything without visible text (icons only, SVG
   hotspots).
7. **`role` attributes** on non-native interactives (`role="radio"` on
   option cards, `role="status"` on feedback, `role="progressbar"` on
   bars).
8. **`aria-live="polite"`** on counters, score, typed-answer
   accumulators.
9. **Visible audio affordance**: any hover-to-play affordance must also
   render a 🔊 icon so deaf/HoH kids know the element speaks.
10. **Colour + icon pairing** — `correct` = emerald + ✓, `wrong` =
    rose + ✕. Never colour alone.
11. **`prefers-reduced-motion`** respected on every looping animation.
12. **Mobile-first**, minimum viewport width 360 px — no horizontal
    scroll at that width.
13. **No `dangerouslySetInnerHTML`**. Ever. React escapes are the only
    supported renderer.
14. **No `any`, no `@ts-ignore`.** Strict TypeScript.

---

## 7. Canonical Prisma seed pattern

### Location

- One file per lesson under `prisma/seeds/<lesson>.seed.ts`.
- Exports the content JSON object(s) **only** — no Prisma logic.
- Type-safe via the matching `lib/types/*.types.ts` façade.

### Orchestration in `prisma/seed.ts`

- Import content from `./seeds/<lesson>.seed.ts`.
- Reference it in the existing `lessonSeeds[]` entry via a single
  section:
  ```ts
  sections: [{ type: "<domain>_lesson", content: lessonContent }]
  ```
- The outer loop does `deleteMany` on the theme's existing lessons /
  sections then re-creates them. This is the **idempotency guarantee** —
  re-running the seed always lands in the same state.

### Content invariants

- Every Arabic string fully vowelized. No exceptions, no English-in-
  parens inside Arabic titles.
- Every emoji field ≤ 8 chars (Zod-enforced).
- Every colour value hex (regex-enforced).
- Every internal URL starts with `/` (regex-enforced).
- Every `answer` referenced in options/items must also appear in the
  domain table (`numbers[]`, `colors[]`, …) — Zod top-level refinement.

### Upsert fallback for `Theme`

The Theme row is upserted in the seed so re-running doesn't duplicate
themes. Lessons below are wiped and recreated — acceptable because
user-facing state (progress, bookmarks) is not yet tied to lesson IDs.

If/when user progress becomes persistent, switch lessons to
`upsert({ where: { themeId_slug }, ... })` and do `update` instead of
`delete + create` for sections.

---

## 8. Quality gates (before merging any lesson)

- [ ] `npx tsc --noEmit` is clean.
- [ ] `npx prisma validate` is clean.
- [ ] `npx prisma db seed` runs at least twice without error (idempotent).
- [ ] All Arabic strings in the seed pass the harakat regex test
      (`/[\u064B-\u065F]/`).
- [ ] New section types registered in all four places
      (schema → Section union → parseSection → SectionRenderer or page
      bypass).
- [ ] If applicable, a ZONE_LABELS entry in `LessonAdventure` for
      exhaustiveness.
- [ ] Keyboard-only traversal demo works.
- [ ] `@media (prefers-reduced-motion: reduce)` removes every loop.
- [ ] Chrome / Safari / Firefox tested at 360 px, 768 px, 1280 px.

---

## 9. Known gaps this standard will address in Phase 3

1. Create `ArabicText`, `LessonShell`, `Chip` shared components.
2. Create `useLessonProgress` hook.
3. Fix the 2 hardcoded harakat violations in
   `components/ui/LessonAdventure.tsx`.
4. Delete dead functions from `lib/speak.ts` (keep the two exported
   Maps still in use).
5. Add `useReducedMotion` gating to legacy section components.
6. Normalize tap target sizes via `Chip`.
7. Widen SVG hit zones in tracing / connect-the-dots games.
8. Split `lib/lessonSections.ts` into per-domain `lib/schemas/*.ts`
   files (aggregator stays).

Refactors happen lesson-by-lesson, non-breaking, one commit each.

---

## 10. Template for a future lesson prompt

When someone asks Claude to build a new Arabic lesson, the prompt
should say:

> Follow `docs/standards/arabic-lesson-standard.md`.
> Lesson name: `<slug>`.
> Theme: `<theme slug>` (usually `arabic`).
> Sections: `<list of section types or "new full-page type">`.
> Content: `<Arabic vocabulary, fully vowelized>`.
> Any custom mechanics (games, visuals): `<describe>`.

That's enough context for Claude to generate the correct schema,
components, seed file, and register every entry point — without
drifting from the standard.
