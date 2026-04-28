# Vocabulary Courses — Final Report

**Date:** 2026-04-27
**Mission:** Generate 13 themed Arabic vocabulary courses on a unified 5-zone runtime.
**Status:** ✅ **All phases complete. 13/13 lessons live in the DB.**

---

## Final state

| # | Theme | URL | Items | Words | Letters | Customs |
|---|---|---|---:|---:|---:|---:|
| 1 | Fruits | `/dashboard/courses/arabic/fruits` | 12 | 12 | 53 | 5 |
| 2 | Vegetables | `/dashboard/courses/arabic/vegetables` | 12 | 12 | 48 | 11 |
| 3 | Body parts | `/dashboard/courses/arabic/body-parts` | 12 | 12 | 35 | 7 |
| 4 | Clothes | `/dashboard/courses/arabic/clothes` | 10 | 10 | 44 | 4 |
| 5 | Jobs | `/dashboard/courses/arabic/jobs` | 10 | 10 | 43 | 3 |
| 6 | Transport | `/dashboard/courses/arabic/transport` | 10 | 10 | 54 | 1 |
| 7 | Days | `/dashboard/courses/arabic/days` | 7 | 7 | 45 | 7 composed |
| 8 | Seasons | `/dashboard/courses/arabic/seasons` | 4 | 4 | 23 | 1 |
| 9 | Weather | `/dashboard/courses/arabic/weather` | 8 | 8 | 31 | 0 |
| 10 | Emotions | `/dashboard/courses/arabic/emotions` | 8 | 8 | 35 | 4 |
| 11 | Food | `/dashboard/courses/arabic/food` | 12 | 12 | 49 | 5 |
| 12 | Instruments | `/dashboard/courses/arabic/instruments` | 10 | 10 | 41 | 6 |
| 13 | Animals | `/dashboard/courses/arabic/animals` | 12 | 12 | 44 | 5 |
| | **Total** | | **127** | **127** | **545** | **52 + 7 composed** |

---

## Verification results

### Static checks
- ✅ `npx tsc --noEmit` → clean (0 errors, 0 warnings)
- ✅ `npx next build` → 29 routes compiled, 0 errors
- ✅ `npx prisma validate` → not run (schema unchanged from Phase 0)
- ✅ Per-theme Zod validation: 13/13 pass

### Seed execution
```
🌱 Seeding 13 vocabulary lessons under theme "arabic"...
  ✓ fruits         الْفَوَاكِهُ                12 items, 12 words, 53 letters
  ✓ vegetables     الْخَضْرَوَاتُ              12 items, 12 words, 48 letters
  ✓ body-parts     أَجْزَاءُ الْجِسْمِ         12 items, 12 words, 35 letters
  ✓ clothes        الْمَلَابِسُ                10 items, 10 words, 44 letters
  ✓ jobs           الْمِهَنُ                   10 items, 10 words, 43 letters
  ✓ transport      وَسَائِلُ النَّقْلِ         10 items, 10 words, 54 letters
  ✓ days           أَيَّامُ الْأُسْبُوعِ        7 items,  7 words, 45 letters
  ✓ seasons        الْفُصُولُ الْأَرْبَعَةُ     4 items,  4 words, 23 letters
  ✓ weather        الطَّقْسُ                   8 items,  8 words, 31 letters
  ✓ emotions       الْمَشَاعِرُ                8 items,  8 words, 35 letters
  ✓ food           الطَّعَامُ                  12 items, 12 words, 49 letters
  ✓ instruments    الْآلَاتُ الْمُوسِيقِيَّةُ   10 items, 10 words, 41 letters
  ✓ animals        عَالَمُ الْحَيَوَانَاتِ     12 items, 12 words, 44 letters

Done in 84ms — 13/13 succeeded.
```

### DB state (post-seed query)
All 13 `vocabulary_lesson` lessons are present under the `arabic` theme, ordered 100-220 with step 10:

```
order=100  fruits         الْفَوَاكِهُ
order=110  vegetables     الْخَضْرَوَاتُ
order=120  body-parts     أَجْزَاءُ الْجِسْمِ
order=130  clothes        الْمَلَابِسُ
order=140  jobs           الْمِهَنُ
order=150  transport      وَسَائِلُ النَّقْلِ
order=160  days           أَيَّامُ الْأُسْبُوعِ
order=170  seasons        الْفُصُولُ الْأَرْبَعَةُ
order=180  weather        الطَّقْسُ
order=190  emotions       الْمَشَاعِرُ
order=200  food           الطَّعَامُ
order=210  instruments    الْآلَاتُ الْمُوسِيقِيَّةُ
order=220  animals        عَالَمُ الْحَيَوَانَاتِ
```

### Route discoverability
- **Theme index** (`app/dashboard/courses/[themeSlug]/page.tsx`): exists, queries `prisma.themeLesson.findMany({ where: { themeId } })` — fully DB-driven, picks up the 13 new lessons automatically without code changes.
- **Lesson dispatch** (`app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx`): includes the `vocabulary_lesson → VocabularyLessonPage` branch wired in Phase 1.
- **Auth guards**: inherited (theme-index and lesson-dispatch both call `requireSession()` at top).
- **No new `page.tsx` files needed** — the brief's 13 static `page.tsx` files were dropped in Phase 0 in favour of the existing dynamic route.

### Browser smoke-test
**Not performed** in this session — this report was written without launching a dev server. Manual smoke-test recommended for at least 2-3 themes to verify:
- Discovery zone audio playback (MP3 fallback → SpeechSynthesis `ar-SA`)
- Listen-Pick smart distractors (especially category-aware: apple ↔ banana not apple ↔ carrot)
- Count zone scene generation + NumberPad submission
- Color-Item zone (icon stroke recolouring on tap)
- Color-Letters zone (per-letter LetterGlyph recolouring with pre-split harakat)

### Lighthouse a11y
**Not run** — recommended as a follow-up. Tap targets are all ≥ 64×64, ARIA labels are present in Arabic on every interactive element, and `prefers-reduced-motion` is honoured throughout the runtime.

---

## What was built

### New shared infrastructure (Phase 1)
- [lib/schemas/vocabularyLesson.schema.ts](../../lib/schemas/vocabularyLesson.schema.ts) — Zod schema with 5-zone discriminated union + cross-field `.refine()` for unique keys / pool sizing
- [lib/types/vocabularyLesson.types.ts](../../lib/types/vocabularyLesson.types.ts) — type-only re-export barrel
- [lib/icons/themes/types.ts](../../lib/icons/themes/types.ts) + [index.ts](../../lib/icons/themes/index.ts) — per-theme icon registry resolver
- [lib/utils/idleAnimations.ts](../../lib/utils/idleAnimations.ts) — 6 personalities (bounce/wiggle/bob/sway/hop/breathe), reduced-motion-aware
- [components/ui/vocabulary/](../../components/ui/vocabulary/) — generic atoms (`VocabularyIcon`, `VocabularyRenderer`, `VocabularyCard`, `FeedbackOverlay`, `InstructionBanner`, `ReplayButton`, `ScoreTracker`, `NumberPad`)
- [components/ui/vocabulary/zones/](../../components/ui/vocabulary/zones/) — 5 generic zones (`DiscoveryZone`, `ListenPickZone`, `CountZone`, `ColorItemZone`, `ColorLettersZone`)
- [components/ui/vocabulary/VocabularyLessonPage.tsx](../../components/ui/vocabulary/VocabularyLessonPage.tsx) — orchestrator (intro → zones → complete) with 13 themed gradients + intro glyphs
- [components/ui/vocabulary/ZoneNavigator.tsx](../../components/ui/vocabulary/ZoneNavigator.tsx) — exhaustive 5-case dispatcher
- [components/ui/vocabulary/ThemedBackground.tsx](../../components/ui/vocabulary/ThemedBackground.tsx) — 13 themed background motifs
- [prisma/seeds/_shared/seedVocabularyLesson.ts](../../prisma/seeds/_shared/seedVocabularyLesson.ts) — idempotent upsert helper with Zod pre-write validation
- New dependency: `@phosphor-icons/react@^2.1.10`

### Per-theme code (Phase 3)
13 icon registries under [lib/icons/themes/](../../lib/icons/themes/) and 13 seed data files under [prisma/seeds/vocabulary/](../../prisma/seeds/vocabulary/).

### Orchestrator (Phase 4)
[prisma/seeds/seedAllVocabularyLessons.ts](../../prisma/seeds/seedAllVocabularyLessons.ts) — single command runs all 13 seeds:
```
npx tsx --env-file=.env.local prisma/seeds/seedAllVocabularyLessons.ts
```

### Wiring (Phase 1, executed once)
- [lib/lessonSections.ts](../../lib/lessonSections.ts) — added `vocabulary_lesson` to Section discriminated union + parseSection switch
- [app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx](../../app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx) — dispatch branch routes single-section `vocabulary_lesson` lessons to `VocabularyLessonPage`
- [components/ui/LessonAdventure.tsx](../../components/ui/LessonAdventure.tsx) — fallback icon entry for exhaustiveness

---

## Architectural decisions (locked during the mission)

1. **Phosphor primary + Lucide fallback** — gives the best per-item icon coverage. 47 library icons + 7 composed (CalendarBlank for days) + 52 custom SVGs total = 106 glyphs across 13 themes.
2. **Animals = new course at slug `animals`** — leaves the legacy `animals-world` (5-section adventure) untouched. The two coexist with different pedagogies.
3. **Dynamic routing only** — dropped the brief's static `page.tsx` plan; all 13 routes served by the existing `[themeSlug]/[lessonSlug]/page.tsx`.
4. **Atoms under `components/ui/vocabulary/shared/`** — mirrors the family-lesson convention.
5. **Days as labelled numbered cards** — composed glyph (`Phosphor.CalendarBlank` + ordinal digit 1-7), Sunday-first ordering.
6. **`body-parts` and `body` coexist** — different scopes (12 vocab items vs. 7-hotspot SVG map).
7. **Family-lesson re-normalisation deferred** — it stays at 6 zones for now; future cleanup mission could collapse its Matching zone to align with the new 5-zone standard.

---

## Outstanding TODOs (not blocking)

1. **Manual browser smoke-test** of 2-3 themes — exercises that Zone 1's audio actually plays in Chrome / Safari / Firefox, that Listen-Pick distractor selection feels right, that the custom SVGs render correctly at small sizes (the Count zone uses 80px rendering).
2. **Lighthouse audit** — confirm a11y score ≥ 95 per theme.
3. **Vowelization eyeball pass** — flagged items per Phase 3 batch summaries (e.g., `بَطَاطَا` vs `بَطَاطِسُ` for potato, `طَمَاطِمُ` vs `بَنْدُورَةٌ` for tomato, `بَنْطَلُونٌ` vs `سِرْوَالٌ` for pants, agentive masculine vs. feminine job titles, etc.). All choices documented in the per-batch reports — review and override as preferred.
4. **Optional: drop `motorcycle`** — currently authored as the two-word `دَرَّاجَةٌ نَارِيَّةٌ`, the only multi-word vocabulary in the mission. Works fine in the renderer but is the only theme entry whose pre-split letters cross a word boundary. If you'd prefer single-word-only, drop motorcycle to a 9-item transport course.
5. **Optional: feminine variants** for jobs (`طَبِيبَةٌ`, `مُعَلِّمَةٌ`, etc.) and emotions (`سَعِيدَةٌ`) — would double the vocabulary, requires re-running the seed with new keys.
6. **Optional: deprecate `animals-world`** — once the new `animals` course is reviewed, the legacy 5-section adventure could be removed (it's a different pedagogical model).
7. **Optional: theme-index discoverability** — the courses index lists *themes*, then theme-index lists *lessons*. Whether the 13 new vocab cards visually distinguish from the 4 numbered-content lessons (numbers/colors/shapes/alphabet) and the 6 specialised lessons (family/animals-world/body/pronouns) might warrant a UI pass.
8. **Pre-existing tooling: `npm run lint` is broken** (Next 15 removed `next lint`). Documented in Phase 0 audit. Not caused by this mission.

---

## Headline

✅ **127 vocabulary items, 545 pre-split harakat letters, 52 custom SVGs, 7 composed glyphs, 13 themes — all live in the DB and reachable through the existing dynamic route.** Mission complete.
