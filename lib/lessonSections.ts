import { z } from "zod";

// Internal-path URL — must be a relative asset under the app root.
// Rejects external origins and protocol-relative URLs to eliminate
// XSS / tracking-pixel attack surface in user-editable lesson content.
const InternalPath = z
  .string()
  .min(1)
  .max(500)
  .regex(/^\/[A-Za-z0-9._\-/]+$/, "url must be an internal path starting with /");

export const TextSectionSchema = z.object({
  title: z.string().trim().max(200).optional(),
  body: z.string().trim().min(1).max(5000),
});

export const ImageSectionSchema = z
  .object({
    url: InternalPath.optional(),
    alt: z.string().trim().max(200).optional(),
    caption: z.string().trim().max(500).optional(),
    letter: z.string().trim().max(10).optional(),
  })
  .refine((v) => !!v.url || !!v.letter, {
    message: "ImageSection must have either a url or a letter",
  });

export const AudioSectionSchema = z.object({
  title: z.string().trim().max(200).optional(),
  audioUrl: InternalPath,
  autoPlay: z.boolean().optional(),
  caption: z.string().trim().max(500).optional(),
});

export const QuizSectionSchema = z
  .object({
    question: z.string().trim().min(1).max(500),
    options: z.array(z.string().trim().min(1).max(200)).min(2).max(8),
    answer: z.string().trim().min(1).max(200),
  })
  .refine((v) => v.options.includes(v.answer), {
    message: "answer must be one of the options",
  });

// ---- Numbers-learning blocks ------------------------------------------------
//
// `arabic_full` stores the fully-vowelled Arabic word (harakat included) so
// non-native children can learn correct pronunciation. `arabic_simple` is
// the Arabic numeral glyph (١..١٠). `audioText` is what the TTS engine
// reads when the MP3 fallback kicks in — always use the vowelled form so
// the speech synthesiser emits the right case endings (tanween, etc.).

const NumberItemSchema = z.object({
  number: z.number().int().min(0).max(10_000).optional(),
  arabic_simple: z.string().trim().min(1).max(16),
  arabic_full: z.string().trim().min(1).max(200),
  latin: z.string().trim().min(1).max(10),
  transliteration: z.string().trim().min(1).max(100),
  audioText: z.string().trim().min(1).max(200).optional(),
  image: InternalPath.optional(),
  audio: InternalPath.optional(),
});

export const NumbersSectionSchema = z.object({
  numbers: z.array(NumberItemSchema).min(1).max(50),
});

export const QuizMatchSectionSchema = z.object({
  question: z.string().trim().min(1).max(500),
  pairs: z
    .array(
      z.object({
        audio: InternalPath,
        answer: z.string().trim().min(1).max(100),
      }),
    )
    .min(1)
    .max(20),
});

const GameQuestionSchema = z
  .object({
    audio: InternalPath,
    options: z.array(z.string().trim().min(1).max(100)).min(2).max(8),
    answer: z.string().trim().min(1).max(100),
  })
  .refine((v) => v.options.includes(v.answer), {
    message: "answer must be one of the options",
  });

export const GameNumbersSectionSchema = z.object({
  instructions: z.string().trim().min(1).max(500),
  questions: z.array(GameQuestionSchema).min(1).max(50),
});

// ---- Paint game -------------------------------------------------------------
//
// The `kind` enum selects a built-in inline SVG shape rendered by the
// `ObjectCard` component. Using a closed enum (rather than an arbitrary
// `/svg` path) means the client never loads untrusted SVG markup — so no
// XSS surface via user-editable content.

export const PAINTABLE_OBJECT_KINDS = ["apple", "car", "house", "sun", "fish", "star"] as const;
export type PaintableObjectKind = (typeof PAINTABLE_OBJECT_KINDS)[number];

const ColorItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  hex: z
    .string()
    .trim()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "hex must be #RGB / #RRGGBB / #RRGGBBAA"),
  audioText: z.string().trim().min(1).max(200).optional(),
});

const PaintObjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  kind: z.enum(PAINTABLE_OBJECT_KINDS),
  correctColor: z.string().trim().min(1).max(100),
});

export const PaintGameSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    instructions: z.string().trim().min(1).max(500).optional(),
    objects: z.array(PaintObjectSchema).min(1).max(20),
    colors: z.array(ColorItemSchema).min(2).max(20),
  })
  .refine(
    (v) => {
      const names = new Set(v.colors.map((c) => c.name));
      return v.objects.every((o) => names.has(o.correctColor));
    },
    { message: "every object.correctColor must match a defined color.name" },
  );

// ---- Interactive color world -----------------------------------------------

const InteractiveColorItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  hex: z
    .string()
    .trim()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "hex must be #RGB / #RRGGBB / #RRGGBBAA"),
  audioText: z.string().trim().min(1).max(200).optional(),
  transliteration: z.string().trim().min(1).max(100).optional(),
  // Kept as a short string (1–8 chars) so only emojis / short glyphs pass —
  // any longer payload is rejected before it can reach the renderer.
  example: z.string().trim().min(1).max(8).optional(),
});

export const InteractiveColorWorldSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  colors: z.array(InteractiveColorItemSchema).min(1).max(20),
});

// ---- Interactive shapes world ----------------------------------------------

const ShapeItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  // Short glyph / emoji — length-capped so only visual tokens pass, never
  // a markup payload that could reach the renderer.
  emoji: z.string().trim().min(1).max(8),
  audioText: z.string().trim().min(1).max(200).optional(),
  transliteration: z.string().trim().min(1).max(100).optional(),
});

export const InteractiveShapesWorldSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  shapes: z.array(ShapeItemSchema).min(1).max(20),
});

// ---- Draw shapes (connect the dots) ----------------------------------------

const DrawDotSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

const DrawShapeChallengeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  audioText: z.string().trim().min(1).max(200).optional(),
  dots: z.array(DrawDotSchema).min(3).max(12),
});

export const DrawShapesSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  challenges: z.array(DrawShapeChallengeSchema).min(1).max(10),
});

// ---- Color shapes -----------------------------------------------------------

export const COLOR_SHAPE_KINDS = ["circle", "square", "triangle", "rectangle"] as const;
export type ColorShapeKind = (typeof COLOR_SHAPE_KINDS)[number];

const ColorShapePaletteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  hex: z
    .string()
    .trim()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/),
  audioText: z.string().trim().min(1).max(200).optional(),
});

const ColorShapeObjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  kind: z.enum(COLOR_SHAPE_KINDS),
  correctColor: z.string().trim().min(1).max(100),
});

export const ColorShapesSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    instructions: z.string().trim().min(1).max(500).optional(),
    colors: z.array(ColorShapePaletteSchema).min(2).max(10),
    objects: z.array(ColorShapeObjectSchema).min(1).max(10),
  })
  .refine(
    (v) => {
      const names = new Set(v.colors.map((c) => c.name));
      return v.objects.every((o) => names.has(o.correctColor));
    },
    { message: "every object.correctColor must match a defined color.name" },
  );

// ---- Arabic alphabet lesson blocks -----------------------------------------

// letter_intro — big letter + name + audio
export const LetterIntroSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  letter: z.string().trim().min(1).max(10),
  name: z.string().trim().min(1).max(100),
  audioText: z.string().trim().min(1).max(200).optional(),
  transliteration: z.string().trim().min(1).max(100).optional(),
});

// letter_vowels — letter with harakat forms
const VOWEL_KINDS = ["fatha", "kasra", "damma", "sukun"] as const;

const VowelFormSchema = z.object({
  form: z.string().trim().min(1).max(10),
  vowel: z.enum(VOWEL_KINDS),
  audioText: z.string().trim().min(1).max(200).optional(),
});

export const LetterVowelsSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  letter: z.string().trim().min(1).max(10),
  forms: z.array(VowelFormSchema).min(1).max(6),
});

// letter_coloring — big letter outline + color palette
export const LetterColoringSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  letter: z.string().trim().min(1).max(10),
  colors: z.array(ColorShapePaletteSchema).min(2).max(10),
});

// letter_tracing — connect-the-dots guide to draw the letter
const TracingPointSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

export const LetterTracingSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  letter: z.string().trim().min(1).max(10),
  points: z.array(TracingPointSchema).min(2).max(30),
});

// letter_word_match — vocabulary using the letter
const WordExampleSchema = z.object({
  word: z.string().trim().min(1).max(100),
  letter: z.string().trim().min(1).max(10),
  meaning: z.string().trim().min(1).max(100).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
  audioText: z.string().trim().min(1).max(200).optional(),
});

export const LetterWordMatchSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  words: z.array(WordExampleSchema).min(1).max(20),
});

// ---- Family lesson blocks ---------------------------------------------------

const FamilyMemberSchema = z.object({
  name: z.string().trim().min(1).max(100),
  emoji: z.string().trim().min(1).max(8),
  audioText: z.string().trim().min(1).max(200).optional(),
  meaning: z.string().trim().min(1).max(100).optional(),
});

export const FamilyIntroSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  members: z.array(FamilyMemberSchema).min(1).max(20),
});

const FamilyTreeNodeSchema = z.object({
  id: z.string().trim().min(1).max(50).regex(/^[a-z0-9_-]+$/),
  name: z.string().trim().min(1).max(100),
  emoji: z.string().trim().min(1).max(8),
  audioText: z.string().trim().min(1).max(200).optional(),
  level: z.number().int().min(0).max(5),
  // Optional list of parent node ids — used to draw connecting lines.
  parents: z.array(z.string().max(50)).max(4).optional(),
});

export const FamilyTreeSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    instructions: z.string().trim().min(1).max(500).optional(),
    nodes: z.array(FamilyTreeNodeSchema).min(1).max(20),
  })
  .refine(
    (v) => {
      const ids = new Set(v.nodes.map((n) => n.id));
      return v.nodes.every((n) => (n.parents ?? []).every((p) => ids.has(p)));
    },
    { message: "every parent id must reference an existing node" },
  );

const FamilyMatchOptionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  emoji: z.string().trim().min(1).max(8),
});

const FamilyMatchRoundSchema = z
  .object({
    prompt: z.string().trim().min(1).max(200),
    audioText: z.string().trim().min(1).max(200).optional(),
    answer: z.string().trim().min(1).max(100),
    options: z.array(FamilyMatchOptionSchema).min(2).max(6),
  })
  .refine((v) => v.options.some((o) => o.name === v.answer), {
    message: "answer must match one of the option names",
  });

export const FamilyMatchSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  rounds: z.array(FamilyMatchRoundSchema).min(1).max(20),
});

// ---- Human body map --------------------------------------------------------
// The `key` is a closed enum mapping to an inline SVG shape in the renderer,
// so the client never loads arbitrary SVG from the database.

export const BODY_PART_KEYS = [
  "head",
  "eye",
  "ear",
  "nose",
  "mouth",
  "hand",
  "foot",
] as const;
export type BodyPartKey = (typeof BODY_PART_KEYS)[number];

const BodyPartSchema = z.object({
  key: z.enum(BODY_PART_KEYS),
  name: z.string().trim().min(1).max(100),
  audioText: z.string().trim().min(1).max(200).optional(),
  meaning: z.string().trim().min(1).max(100).optional(),
});

export const BodyMapSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  parts: z.array(BodyPartSchema).min(1).max(20),
});

// ---- Pronoun lesson blocks -------------------------------------------------

const PronounCardSchema = z.object({
  pronoun: z.string().trim().min(1).max(50),
  audioText: z.string().trim().min(1).max(200).optional(),
  meaning: z.string().trim().min(1).max(100).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
});

export const PronounCardsSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  pronouns: z.array(PronounCardSchema).min(1).max(10),
});

const PronounTransformSchema = z.object({
  subject: z.string().trim().min(1).max(50),
  object: z.string().trim().min(1).max(50),
  subjectAudio: z.string().trim().min(1).max(200).optional(),
  objectAudio: z.string().trim().min(1).max(200).optional(),
  meaning: z.string().trim().min(1).max(100).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
});

export const PronounObjectSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  pairs: z.array(PronounTransformSchema).min(1).max(10),
});

const PronounSentenceSchema = z.object({
  sentence: z.string().trim().min(1).max(300),
  pronoun: z.string().trim().min(1).max(50),
  translation: z.string().trim().min(1).max(200).optional(),
  audioText: z.string().trim().min(1).max(300).optional(),
  emoji: z.string().trim().min(1).max(8).optional(),
});

export const PronounSentencesSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  sentences: z.array(PronounSentenceSchema).min(1).max(20),
});

const PronounQuizItemSchema = z
  .object({
    prompt: z.string().trim().min(1).max(300),
    answer: z.string().trim().min(1).max(50),
    options: z.array(z.string().trim().min(1).max(50)).min(2).max(6),
    translation: z.string().trim().min(1).max(200).optional(),
  })
  .refine((v) => v.options.includes(v.answer), {
    message: "answer must be in options",
  });

export const PronounQuizSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  questions: z.array(PronounQuizItemSchema).min(1).max(20),
});

// ---- Animal world lesson ---------------------------------------------------
// `world` is a closed enum mapping to a themed background gradient in the
// renderer — no arbitrary CSS reaches the client.

export const ANIMAL_WORLDS = ["farm", "jungle", "sky", "ocean"] as const;
export type AnimalWorld = (typeof ANIMAL_WORLDS)[number];

const AnimalItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  emoji: z.string().trim().min(1).max(8),
  audioText: z.string().trim().min(1).max(200).optional(),
  meaning: z.string().trim().min(1).max(100).optional(),
});

export const AnimalWorldSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  world: z.enum(ANIMAL_WORLDS),
  animals: z.array(AnimalItemSchema).min(1).max(20),
});

const AnimalQuizOptionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  emoji: z.string().trim().min(1).max(8),
});

const AnimalQuizRoundSchema = z
  .object({
    prompt: z.string().trim().min(1).max(200),
    audioText: z.string().trim().min(1).max(200).optional(),
    answer: z.string().trim().min(1).max(100),
    options: z.array(AnimalQuizOptionSchema).min(2).max(6),
  })
  .refine((v) => v.options.some((o) => o.name === v.answer), {
    message: "answer must match one of the option names",
  });

export const AnimalWorldQuizSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  instructions: z.string().trim().min(1).max(500).optional(),
  rounds: z.array(AnimalQuizRoundSchema).min(1).max(20),
});

// ---- Types ------------------------------------------------------------------

export type TextSection = z.infer<typeof TextSectionSchema>;
export type ImageSection = z.infer<typeof ImageSectionSchema>;
export type AudioSection = z.infer<typeof AudioSectionSchema>;
export type QuizSection = z.infer<typeof QuizSectionSchema>;
export type NumbersSection = z.infer<typeof NumbersSectionSchema>;
export type QuizMatchSection = z.infer<typeof QuizMatchSectionSchema>;
export type GameNumbersSection = z.infer<typeof GameNumbersSectionSchema>;
export type PaintGameSection = z.infer<typeof PaintGameSectionSchema>;
export type InteractiveColorWorldSection = z.infer<typeof InteractiveColorWorldSectionSchema>;
export type InteractiveShapesWorldSection = z.infer<typeof InteractiveShapesWorldSectionSchema>;
export type DrawShapesSection = z.infer<typeof DrawShapesSectionSchema>;
export type ColorShapesSection = z.infer<typeof ColorShapesSectionSchema>;
export type LetterIntroSection = z.infer<typeof LetterIntroSectionSchema>;
export type LetterVowelsSection = z.infer<typeof LetterVowelsSectionSchema>;
export type LetterColoringSection = z.infer<typeof LetterColoringSectionSchema>;
export type LetterTracingSection = z.infer<typeof LetterTracingSectionSchema>;
export type LetterWordMatchSection = z.infer<typeof LetterWordMatchSectionSchema>;
export type FamilyIntroSection = z.infer<typeof FamilyIntroSectionSchema>;
export type FamilyTreeSection = z.infer<typeof FamilyTreeSectionSchema>;
export type FamilyMatchSection = z.infer<typeof FamilyMatchSectionSchema>;
export type BodyMapSection = z.infer<typeof BodyMapSectionSchema>;
export type PronounCardsSection = z.infer<typeof PronounCardsSectionSchema>;
export type PronounObjectSection = z.infer<typeof PronounObjectSectionSchema>;
export type PronounSentencesSection = z.infer<typeof PronounSentencesSectionSchema>;
export type PronounQuizSection = z.infer<typeof PronounQuizSectionSchema>;
export type AnimalWorldSection = z.infer<typeof AnimalWorldSectionSchema>;
export type AnimalWorldQuizSection = z.infer<typeof AnimalWorldQuizSectionSchema>;

export type Section =
  | { id: string; order: number; type: "text"; content: TextSection }
  | { id: string; order: number; type: "image"; content: ImageSection }
  | { id: string; order: number; type: "audio"; content: AudioSection }
  | { id: string; order: number; type: "quiz"; content: QuizSection }
  | { id: string; order: number; type: "numbers"; content: NumbersSection }
  | { id: string; order: number; type: "quiz_match"; content: QuizMatchSection }
  | { id: string; order: number; type: "game_numbers"; content: GameNumbersSection }
  | { id: string; order: number; type: "paint_game"; content: PaintGameSection }
  | {
      id: string;
      order: number;
      type: "interactive_color_world";
      content: InteractiveColorWorldSection;
    }
  | {
      id: string;
      order: number;
      type: "interactive_shapes_world";
      content: InteractiveShapesWorldSection;
    }
  | { id: string; order: number; type: "draw_shapes"; content: DrawShapesSection }
  | { id: string; order: number; type: "color_shapes"; content: ColorShapesSection }
  | { id: string; order: number; type: "letter_intro"; content: LetterIntroSection }
  | { id: string; order: number; type: "letter_vowels"; content: LetterVowelsSection }
  | { id: string; order: number; type: "letter_coloring"; content: LetterColoringSection }
  | { id: string; order: number; type: "letter_tracing"; content: LetterTracingSection }
  | {
      id: string;
      order: number;
      type: "letter_word_match";
      content: LetterWordMatchSection;
    }
  | { id: string; order: number; type: "family_intro"; content: FamilyIntroSection }
  | { id: string; order: number; type: "family_tree"; content: FamilyTreeSection }
  | { id: string; order: number; type: "family_match"; content: FamilyMatchSection }
  | { id: string; order: number; type: "body_map"; content: BodyMapSection }
  | { id: string; order: number; type: "pronoun_cards"; content: PronounCardsSection }
  | { id: string; order: number; type: "pronoun_object"; content: PronounObjectSection }
  | {
      id: string;
      order: number;
      type: "pronoun_sentences";
      content: PronounSentencesSection;
    }
  | { id: string; order: number; type: "pronoun_quiz"; content: PronounQuizSection }
  | { id: string; order: number; type: "animal_world"; content: AnimalWorldSection }
  | {
      id: string;
      order: number;
      type: "animal_world_quiz";
      content: AnimalWorldQuizSection;
    };

export interface RawSectionRow {
  id: string;
  order: number;
  type: string;
  content: unknown;
}

/**
 * Parse a DB row into a validated Section. Returns null on any failure —
 * callers should filter these out so a corrupt JSON payload never reaches
 * the renderer.
 */
export function parseSection(row: RawSectionRow): Section | null {
  switch (row.type) {
    case "text": {
      const parsed = TextSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "text", content: parsed.data };
    }
    case "image": {
      const parsed = ImageSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "image", content: parsed.data };
    }
    case "audio": {
      const parsed = AudioSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "audio", content: parsed.data };
    }
    case "quiz": {
      const parsed = QuizSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "quiz", content: parsed.data };
    }
    case "numbers": {
      const parsed = NumbersSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "numbers", content: parsed.data };
    }
    case "quiz_match": {
      const parsed = QuizMatchSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "quiz_match", content: parsed.data };
    }
    case "game_numbers": {
      const parsed = GameNumbersSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "game_numbers", content: parsed.data };
    }
    case "paint_game": {
      const parsed = PaintGameSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "paint_game", content: parsed.data };
    }
    case "interactive_color_world": {
      const parsed = InteractiveColorWorldSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return {
        id: row.id,
        order: row.order,
        type: "interactive_color_world",
        content: parsed.data,
      };
    }
    case "interactive_shapes_world": {
      const parsed = InteractiveShapesWorldSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return {
        id: row.id,
        order: row.order,
        type: "interactive_shapes_world",
        content: parsed.data,
      };
    }
    case "draw_shapes": {
      const parsed = DrawShapesSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "draw_shapes", content: parsed.data };
    }
    case "color_shapes": {
      const parsed = ColorShapesSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "color_shapes", content: parsed.data };
    }
    case "letter_intro": {
      const parsed = LetterIntroSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "letter_intro", content: parsed.data };
    }
    case "letter_vowels": {
      const parsed = LetterVowelsSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "letter_vowels", content: parsed.data };
    }
    case "letter_coloring": {
      const parsed = LetterColoringSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "letter_coloring", content: parsed.data };
    }
    case "letter_tracing": {
      const parsed = LetterTracingSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "letter_tracing", content: parsed.data };
    }
    case "letter_word_match": {
      const parsed = LetterWordMatchSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "letter_word_match", content: parsed.data };
    }
    case "family_intro": {
      const parsed = FamilyIntroSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "family_intro", content: parsed.data };
    }
    case "family_tree": {
      const parsed = FamilyTreeSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "family_tree", content: parsed.data };
    }
    case "family_match": {
      const parsed = FamilyMatchSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "family_match", content: parsed.data };
    }
    case "body_map": {
      const parsed = BodyMapSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "body_map", content: parsed.data };
    }
    case "pronoun_cards": {
      const parsed = PronounCardsSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "pronoun_cards", content: parsed.data };
    }
    case "pronoun_object": {
      const parsed = PronounObjectSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "pronoun_object", content: parsed.data };
    }
    case "pronoun_sentences": {
      const parsed = PronounSentencesSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return {
        id: row.id,
        order: row.order,
        type: "pronoun_sentences",
        content: parsed.data,
      };
    }
    case "pronoun_quiz": {
      const parsed = PronounQuizSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "pronoun_quiz", content: parsed.data };
    }
    case "animal_world": {
      const parsed = AnimalWorldSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return { id: row.id, order: row.order, type: "animal_world", content: parsed.data };
    }
    case "animal_world_quiz": {
      const parsed = AnimalWorldQuizSectionSchema.safeParse(row.content);
      if (!parsed.success) return null;
      return {
        id: row.id,
        order: row.order,
        type: "animal_world_quiz",
        content: parsed.data,
      };
    }
    default:
      return null;
  }
}
