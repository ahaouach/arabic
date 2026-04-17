import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Number item (one entry per digit 1-10)                                    */
/* -------------------------------------------------------------------------- */

const HexColorSchema = z
  .string()
  .trim()
  .regex(
    /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/,
    "hex must be #RGB / #RRGGBB / #RRGGBBAA",
  );

const InternalPathSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^\/[A-Za-z0-9._\-/]+$/, "audioUrl must be a relative path starting with /");

export const NumberItemSchema = z.object({
  /** Canonical integer value, 1..10. */
  value: z.number().int().min(1).max(10),
  /** Western-Arabic digit for display (MUST be "1".."10", not ١..١٠). */
  display: z
    .string()
    .trim()
    .regex(/^(?:[1-9]|10)$/, "display must be a western digit 1..10"),
  /** Eastern-Arabic digit, shown only as cultural footnote. */
  displayEastern: z.string().trim().min(1).max(4),
  /** Fully vowelized Arabic name, e.g. "وَاحِدٌ". */
  nameAr: z.string().trim().min(1).max(100),
  /** Romanised pronunciation fallback, e.g. "wahidun". */
  transliteration: z.string().trim().min(1).max(100),
  /** Text fed to the TTS fallback — always use the vowelized form. */
  audioText: z.string().trim().min(1).max(200).optional(),
  /** Optional MP3 path. Must be an internal path under /public. */
  audioUrl: InternalPathSchema.optional(),
  /** Per-number pastel identity, kept consistent across every zone. */
  colorTheme: z.object({
    bg: HexColorSchema,
    ring: HexColorSchema,
    text: HexColorSchema.optional(),
  }),
});

export type NumberItem = z.infer<typeof NumberItemSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone configs — one entry per zone kind                                    */
/* -------------------------------------------------------------------------- */

const TitleFields = {
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
};

/** Zone 1 — Discovery: show every number, play audio on hover/click. */
export const DiscoveryZoneSchema = z.object({
  kind: z.literal("discovery"),
  ...TitleFields,
});
export type DiscoveryZone = z.infer<typeof DiscoveryZoneSchema>;

/** Zone 2 — Listen & Pick: hear the number, pick the right western digit. */
export const ListenPickZoneSchema = z.object({
  kind: z.literal("listen_pick"),
  ...TitleFields,
  rounds: z
    .array(
      z
        .object({
          answer: z.number().int().min(1).max(10),
          options: z
            .array(z.number().int().min(1).max(10))
            .min(2)
            .max(6),
        })
        .refine((v) => v.options.includes(v.answer), {
          message: "answer must be in options",
        }),
    )
    .min(1)
    .max(20),
});
export type ListenPickZone = z.infer<typeof ListenPickZoneSchema>;

/** Zone 3 — Count & Color: tap exactly N objects out of M total. */
export const CountColorZoneSchema = z.object({
  kind: z.literal("count_color"),
  ...TitleFields,
  rounds: z
    .array(
      z
        .object({
          /** How many objects the child must tap. */
          target: z.number().int().min(1).max(10),
          /** Emoji used for the tappable objects. */
          objectEmoji: z.string().trim().min(1).max(8),
          /** Total objects rendered on the board. */
          totalObjects: z.number().int().min(2).max(20),
        })
        .refine((v) => v.target <= v.totalObjects, {
          message: "target cannot exceed totalObjects",
        }),
    )
    .min(1)
    .max(10),
});
export type CountColorZone = z.infer<typeof CountColorZoneSchema>;

/** Zone 4 — Matching: pair each digit with its visual quantity. */
export const MatchingZoneSchema = z.object({
  kind: z.literal("matching"),
  ...TitleFields,
  pairs: z
    .array(
      z.object({
        value: z.number().int().min(1).max(10),
        /** Emoji used to render the quantity visual for this pair. */
        emoji: z.string().trim().min(1).max(8),
      }),
    )
    .min(2)
    .max(10),
});
export type MatchingZone = z.infer<typeof MatchingZoneSchema>;

/** Zone 6 — Color the Target Digit: tap every occurrence of a target digit
 *  in a grid of distractors. Reusable for "color all the 5s in blue", etc. */
const NamedColorSchema = z.enum([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
]);

// Raw ZodObject (no refinements) — required because z.discriminatedUnion
// only accepts ZodObject, not ZodEffects. Per-field refinements are applied
// in the top-level `NumbersLessonSectionSchema.refine` below.
export const ColorTargetDigitZoneSchema = z.object({
  kind: z.literal("color_target_digit"),
  ...TitleFields,
  /** Digit the child must tap. Configurable so the zone is reusable. */
  targetDigit: z.number().int().min(0).max(9),
  /** Named colour OR hex. Hex regex blocks any other CSS injection. */
  targetColor: z.union([NamedColorSchema, HexColorSchema]),
  gridCols: z.number().int().min(2).max(10),
  gridRows: z.number().int().min(2).max(10),
  targetCount: z.number().int().min(1).max(20),
  /** Digits used to fill non-target cells. Must not contain targetDigit. */
  distractorDigits: z.array(z.number().int().min(0).max(9)).min(1).max(10),
  /** Optional seed for deterministic grids in tests. */
  shuffleSeed: z.number().int().optional(),
});
export type ColorTargetDigitZone = z.infer<typeof ColorTargetDigitZoneSchema>;

/** Zone 5 — Write the Number: show N objects, child types the digit. */
export const WriteNumberZoneSchema = z.object({
  kind: z.literal("write_number"),
  ...TitleFields,
  rounds: z
    .array(
      z.object({
        /** Correct answer as a western digit. */
        answer: z.number().int().min(1).max(10),
        /** Emoji rendered `answer` times on the canvas. */
        visualEmoji: z.string().trim().min(1).max(8),
        /** Optional extra instruction text for this round. */
        prompt: z.string().trim().min(1).max(200).optional(),
      }),
    )
    .min(1)
    .max(10),
});
export type WriteNumberZone = z.infer<typeof WriteNumberZoneSchema>;

/* -------------------------------------------------------------------------- */
/*  Zone union + top-level lesson                                             */
/* -------------------------------------------------------------------------- */

export const NumbersLessonZoneSchema = z.discriminatedUnion("kind", [
  DiscoveryZoneSchema,
  ListenPickZoneSchema,
  CountColorZoneSchema,
  MatchingZoneSchema,
  WriteNumberZoneSchema,
  ColorTargetDigitZoneSchema,
]);
export type NumbersLessonZone = z.infer<typeof NumbersLessonZoneSchema>;

/**
 * Top-level `content` JSON for a `numbers_lesson` section.
 * One LessonSection row carries all five zones — the `<NumbersLessonPage>`
 * client orchestrator walks them and exposes one zone at a time via
 * `<ZoneNavigator>`.
 */
export const NumbersLessonSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    numbers: z.array(NumberItemSchema).min(1).max(20),
    zones: z.array(NumbersLessonZoneSchema).min(1).max(10),
  })
  .refine(
    (v) => {
      // Every numeric answer/value referenced by a zone must exist in numbers[].
      const known = new Set(v.numbers.map((n) => n.value));
      for (const z of v.zones) {
        if (z.kind === "listen_pick") {
          for (const r of z.rounds) {
            if (!known.has(r.answer)) return false;
            if (!r.options.every((o) => known.has(o))) return false;
          }
        } else if (z.kind === "matching") {
          if (!z.pairs.every((p) => known.has(p.value))) return false;
        } else if (z.kind === "write_number") {
          if (!z.rounds.every((r) => known.has(r.answer))) return false;
        } else if (z.kind === "count_color") {
          if (!z.rounds.every((r) => known.has(r.target))) return false;
        } else if (z.kind === "color_target_digit") {
          // Distractors must not include the target digit (otherwise the
          // child can't win — every cell would be correct).
          if (z.distractorDigits.includes(z.targetDigit)) return false;
          // Enough cells in the grid for the requested target count.
          if (z.targetCount > z.gridCols * z.gridRows) return false;
          // If the target digit appears in the shared `numbers[]` catalogue
          // (e.g. 1..10), it must be a known entry — otherwise the zone
          // can't look up the Arabic name for audio feedback.
          if (!known.has(z.targetDigit)) return false;
        }
      }
      return true;
    },
    { message: "every zone reference must be in numbers[]" },
  );

export type NumbersLessonSection = z.infer<typeof NumbersLessonSectionSchema>;
