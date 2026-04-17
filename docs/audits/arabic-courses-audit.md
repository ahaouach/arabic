# Arabic Courses Audit — Phase 1 (refreshed)

**Date**: 2026-04-15
**Scope**: All Arabic-theme lessons, shared hooks, Zod schemas, section components, routing.
**Mode**: Read-only. No code changes.

> **Architecture note** — lessons live in the database (`ThemeLesson` + `LessonSection`) and are served via a single dynamic route `app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx`. There is no per-lesson folder under `app/dashboard/courses/arabic/`. Each DB lesson is rendered either by the shared `<LessonAdventure>` orchestrator or, for single-section `numbers_lesson` rows, bypassed to the dedicated `<NumbersLessonPage>`. Section components live in `components/ui/` (with a `components/ui/numbers/` subfolder for the new numbers lesson).

---

## 1. Lesson inventory (37 lessons, all `themeSlug: "arabic"`)

| # | slug | Title (Arabic, vowelized) | English | Order | Sections |
|---|---|---|---|---|---|
| 1 | `numbers` | عَالَمُ الْأَرْقَامِ | Number world | 1 | **`numbers_lesson`** (single section, 5 zones) — NEW STANDARD |
| 2 | `colors` | الأَلْوَانُ | Colors | 2 | interactive_color_world → paint_game |
| 3 | `shapes` | الأَشْكَالُ الْهَنْدَسِيَّةُ | Shapes | 3 | interactive_shapes_world → draw_shapes → color_shapes → quiz |
| 4–31 | `letter-<trans>` × 28 | الْحَرْفُ: «name» | 28 alphabet letters | 4–31 | letter_intro → letter_vowels → letter_coloring → letter_word_match |
| 32 | `family` | العَائِلَةُ | Family | 32 | family_intro → family_tree → family_match |
| 33 | `animals-world` | عَالَمُ الْحَيَوَانَاتِ | Animal World | 33 | animal_world × 4 → animal_world_quiz |
| 34 | `body` | أَعْضَاءُ الْجِسْمِ الْبَشَرِيِّ | Body parts | 34 | body_map |
| 35 | `pronouns-mutakallim` | ضَمَائِرُ الْمُتَكَلِّمِ | 1st-person | 35 | pronoun_cards → pronoun_object → pronoun_sentences → pronoun_quiz |
| 36 | `pronouns-mukhatab` | ضَمَائِرُ الْمُخَاطَبِ | 2nd-person | 36 | same 4-step flow |
| 37 | `pronouns-ghaib` | ضَمَائِرُ الْغَائِبِ | 3rd-person | 37 | same 4-step flow |

**Total**: 37 lessons. 27 section types registered in `lib/lessonSections.ts` (`Section` union).

---

## 2. Harakat violations

All **seeded** Arabic content for Arabic-theme lessons (including the freshly-rebuilt `numbers` lesson) is fully vowelized. Two hardcoded fallbacks in component source code still lack proper harakat:

| File | Line | Text | Should be | Severity |
|---|---|---|---|---|
| [components/ui/LessonAdventure.tsx:91](components/ui/LessonAdventure.tsx) | 91 | `"مرحبا! Let's start a new adventure together!"` | `"مَرْحَبًا! Let's start a new adventure together!"` | 🟡 |
| [components/ui/LessonAdventure.tsx:106](components/ui/LessonAdventure.tsx) | 106 | `"هيا بنا نتعلم"` | `"هَيَّا بِنَا نَتَعَلَّمُ"` | 🟡 |

The rest of the hardcoded feedback vocabulary in components (`أَحْسَنْتَ`, `حَاوِلْ مَرَّةً أُخْرَى`, `اِخْتَرْ لَوْنًا أَوَّلًا`, `جَرِّبْ لَوْنًا آخَرَ`, `أَحْسَنْتَ! لَقَدْ تَعَلَّمْتَ كُلَّ الأَلْوَانِ!`, the new `اِبْدَأِ الْمُغَامَرَةَ`, `هَيَّا بِنَا نَتَعَلَّمُ الْأَرْقَامَ!`) is **correctly vocalized**.

---

## 3. Component architecture matrix

Columns: **useAudio**, **dsih** (`dangerouslySetInnerHTML`), **`any`/ts-ignore**, **ARIA**, **RTL**, **tap ≥ 64px** (main interactives), **reduced-motion** (`useReducedMotion`).

### 3a. Legacy section components (`components/ui/*.tsx`)

| Component | useAudio | dsih | any | ARIA | RTL | tap | reduced-motion |
|---|---|---|---|---|---|---|---|
| `TextBlock` | n/a | ❌ | ❌ | n/a | ✅ | n/a | n/a |
| `ImageBlock` | n/a | ❌ | ❌ | n/a | ✅ | n/a | n/a |
| `AudioBlock` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `QuizBlock` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `NumbersBlock` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `QuizMatchBlock` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `GameNumbersBlock` | ✅ | ❌ | ❌ | ✅ | ✅ | ⚠️ small badge | ❌ |
| `PaintGame` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `InteractiveColorWorld` | ✅ via useColorAudio | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `ShapesWorld` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `ShapeDrawSection` | ✅ | ❌ | ❌ | ✅ | ✅ | ⚠️ SVG dots 3px | ❌ |
| `ShapeColorSection` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `LetterIntro` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `LetterVowels` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `LetterColoring` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `LetterTracing` | ✅ | ❌ | ❌ | ⚠️ no dot labels | ✅ | ⚠️ SVG dots small | ❌ |
| `LetterWordMatch` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `FamilyIntro` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `FamilyTree` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `FamilyMatchGame` | ✅ | ❌ | ❌ | ✅ | ✅ | ⚠️ small chip | ❌ |
| `HumanBodyMap` | ✅ | ❌ | ❌ | ✅ | ✅ | ⚠️ SVG hit-zones | ❌ |
| `PronounCards` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `PronounObject` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `PronounSentences` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `PronounQuiz` | ✅ | ❌ | ❌ | ✅ | ✅ | ⚠️ small chip | ❌ |
| `AnimalWorldSection` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `AnimalWorldQuiz` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `LessonAdventure` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |

### 3b. New numbers lesson (`components/ui/numbers/*.tsx`) — the gold standard

| Component | useAudio | dsih | any | ARIA | RTL | tap | reduced-motion |
|---|---|---|---|---|---|---|---|
| `NumberCard` | n/a (parent triggers) | ❌ | ❌ | ✅ aria-label+pressed | ✅ | ✅ `min-h-[10rem]` | ✅ |
| `QuantityVisual` | n/a | ❌ | ❌ | ✅ role="img" | n/a | n/a | ✅ |
| `NumberPad` | n/a | ❌ | ❌ | ✅ aria-live+aria-label | ✅ ltr digits | ✅ 72×72 | ✅ |
| `FeedbackOverlay` | n/a | ❌ | ❌ | ✅ role="status" aria-live | ✅ | n/a | ✅ |
| `ScoreTracker` | n/a | ❌ | ❌ | ✅ progressbar+valuenow | ✅ `<bdi dir="ltr">` | n/a | ✅ |
| `DiscoveryZone` | ✅ | ❌ | ❌ | ✅ role=list | ✅ | ✅ | ✅ (via NumberCard) |
| `ListenPickZone` | ✅ | ❌ | ❌ | ✅ radiogroup | ✅ | ✅ min-h-16 | ✅ |
| `CountColorZone` | ✅ | ❌ | ❌ | ✅ group+aria-pressed | ✅ | ✅ h-20 sm:h-24 | ✅ |
| `MatchingZone` | ✅ | ❌ | ❌ | ✅ radiogroup×2 | ✅ | ✅ | ✅ |
| `WriteNumberZone` | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ pad 72×72 | ✅ |
| `NumbersLessonPage` | n/a orchestrator | ❌ | ❌ | ✅ breadcrumb | ✅ | ✅ | ✅ |
| `NumbersBackground` | n/a | ❌ | ❌ | ✅ aria-hidden | n/a | n/a | ✅ |
| `ZoneNavigator` | pass-through | ❌ | ❌ | n/a | n/a | n/a | n/a |

**Observations**:
- The new `components/ui/numbers/` tree achieves **100% on every check** — it is the reference implementation the rest of the codebase should adopt.
- Legacy components are uniformly missing explicit `useReducedMotion()` gating — relying solely on Framer Motion's system-level respect, which does not cover looping animations.

---

## 4. Shared utilities

| Utility | Path | Status | Notes |
|---|---|---|---|
| `useAudio` hook | [lib/useAudio.ts](lib/useAudio.ts) | 🟢 Excellent | **Debounce 400 ms added.** Chrome cancel→speak 80 ms delay, voice warm-up, polling fallback, URL guard, SSR guards, cleanup, mute, debug logs. |
| `useColorAudio` | [lib/useColorAudio.ts](lib/useColorAudio.ts) | 🟢 Thin wrapper | Only used by `InteractiveColorWorld`. |
| `speak.ts` | [lib/speak.ts](lib/speak.ts) | 🟡 **Mostly dead** | `ARABIC_NUMBER_WORDS` + `ARABIC_NUMBER_ROMAN` still used by `QuizMatchBlock` / `GameNumbersBlock`. `speakArabic`, `playAudioOrSpeak`, `pickArabicVoice`, `isChrome` — **unused**. |
| `lessonSections.ts` | [lib/lessonSections.ts](lib/lessonSections.ts) | 🟢 Excellent (but growing) | 27 types, all parsed. ~870 lines — split candidate. |
| `lessonLevel.ts` | [lib/lessonLevel.ts](lib/lessonLevel.ts) | 🟢 | Minimal enum guard. |
| `lib/schemas/` | New folder | 🟢 | Contains `numbersLesson.schema.ts` (modern pattern). |
| `lib/types/` | New folder | 🟢 | Contains `numbersLesson.types.ts` (re-export). |

### Missing shared utilities (vs. the target standard)

| Suggested | Purpose | Currently |
|---|---|---|
| `lib/hooks/useLessonProgress.ts` | Centralize stars/zone progression | Inlined inside `LessonAdventure.tsx` and `NumbersLessonPage.tsx` |
| `lib/components/arabic/ArabicText.tsx` | RTL-safe wrapper with font stack | Inline `style={{ fontFamily: "Amiri, …" }}` repeated ~25× |
| `lib/components/arabic/LessonShell.tsx` | Header + progress + back + breadcrumb | Duplicated inside both orchestrators |
| `lib/hooks/useReducedMotion` adapter | Drop-in replacement with shared defaults | Framer's own used only in new numbers/* and 2 legacy components |
| `lib/schemas/` split per domain | `letters.schema.ts`, `colors.schema.ts`, `animals.schema.ts`… | All 27 schemas in one file |

---

## 5. Routing & auth

**File**: [app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx](app/dashboard/courses/[themeSlug]/[lessonSlug]/page.tsx)

| Check | Status | Notes |
|---|---|---|
| Server Component | 🟢 | async default export |
| `force-dynamic` | 🟢 | |
| Zod param validation | 🟢 | `SlugSchema` regex `^[a-z0-9-]+$` |
| Prisma safe query | 🟢 | findFirst parameterised |
| Session re-verified | 🟢 | `requireSession()` |
| `notFound()` on miss | 🟢 | |
| Level enum validated | 🟢 | |
| Section validation | 🟢 | `parseSection` filters corrupt rows |
| `generateMetadata` | 🟢 | |
| `numbers_lesson` bypass | 🟢 | Single-section detection routes to `NumbersLessonPage` |
| README header | 🟢 | Documents seed + live-edit workflow |

---

## 6. Top 10 recurring issues

| # | Issue | Frequency | Severity | Fix type |
|---|---|---|---|---|
| 1 | No explicit `useReducedMotion` in legacy section components | ~25 files | 🟡 | Wrap looping `motion.*` props |
| 2 | Font stack duplicated inline | ~25 files | 🟡 | Extract `<ArabicText>` |
| 3 | Badge/chip tap targets ~32 px | ~8 files | 🟡 | Standard `<Chip>` component with `min-h-10` |
| 4 | 2 hardcoded Arabic strings missing harakat in `LessonAdventure.tsx` | 1 file | 🟡 | Replace with vocalized forms |
| 5 | Dead code in `speak.ts` (4 functions unused) | 1 file | 🟢 | Delete functions; keep constants |
| 6 | Small SVG tap zones on dot-connect / hotspot games | 4 files | 🟡 | Widen invisible hitbox around each dot |
| 7 | `LetterTracing` dots have no aria-label | 1 file | 🟡 | Add per-dot label |
| 8 | All Zod schemas in one 870-line file | 1 file | 🟢 | Split by domain under `lib/schemas/` |
| 9 | Two independent progress/orchestrator implementations (`LessonAdventure`, `NumbersLessonPage`) | 2 files | 🟢 | Extract `useLessonProgress` hook + `<LessonShell>` |
| 10 | `LessonAdventure` intro phase auto-play via `playAudio(undefined, ...)` after a click — ok but two arabic strings aren't vocalized | 1 file | 🟡 | Fix strings (overlap with #4) |

---

## 7. Severity scores per lesson

| Lesson | Severity | Why |
|---|---|---|
| `numbers` | 🟢 **Reference** | New 5-zone architecture, explicit reduced-motion, full ARIA, 64 px tap targets, idempotent seed, colour-blind-safe feedback, `numbers_lesson` type |
| `colors` | 🟢 | Full harakat, paint game + color world. Could gain reduced-motion gating. |
| `shapes` | 🟡 | Small SVG dot sizes in draw section; same reduced-motion gap |
| 28 × `letter-*` | 🟢 | Data-driven via `ALPHABET_LETTERS` loop; uniform 4-zone flow |
| `family` | 🟢 | 3 zones, ARIA correct |
| `animals-world` | 🟡 | Badges `text-xs px-3 py-1` in quiz; otherwise strong |
| `body` | 🟡 | SVG hotspots small for touch |
| `pronouns-mutakallim` / `-mukhatab` / `-ghaib` | 🟢 | Clean 4-zone flow; same reduced-motion gap |

**Zero 🔴 critical issues.** The dominant refactor work is **consistency**: lift all legacy components to the quality bar already achieved by `components/ui/numbers/`.

---

## 8. Global summary

| Lesson | DB-driven | Zod | Audio FB | Harakat | ARIA | RTL | Score | Reduced-motion |
|---|---|---|---|---|---|---|---|---|
| numbers (new) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| colors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| shapes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| letter-* × 28 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| family | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| animals-world | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| body | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| pronouns × 3 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## Overall assessment

**Codebase health: 🟢 Strong** — strong architecture, DB-driven, Zod-validated, Arabic content excellent, and a new reference implementation (`numbers`) demonstrates the full accessibility + gamification pattern.

**Phase 3 refactor scope** = aligning legacy lessons to the numbers standard. No structural rewrites needed.

Primary work items:
1. Create `lib/components/arabic/ArabicText.tsx` + `LessonShell.tsx` + `Chip.tsx`
2. Extract `lib/hooks/useLessonProgress.ts`
3. Fix the 2 hardcoded harakat violations in `LessonAdventure.tsx`
4. Delete dead functions from `speak.ts`
5. Split `lib/lessonSections.ts` into `lib/schemas/*.schema.ts`
6. Add explicit `useReducedMotion` gating to legacy sections
7. Standardize badge sizes
8. Widen SVG tap-zones in tracing-style games

No breaking changes. No DB migrations. No seed re-runs required.
