/**
 * Generate real Arabic audio files via the OpenAI TTS API.
 *
 * Usage:
 *   npm run generate:audio
 *
 * Requirements:
 *   - OPENAI_API_KEY must be set in .env.local (or the shell environment).
 *   - Node 18+ for the global `fetch`.
 *
 * Output:
 *   /public/audio/numbers/intro.mp3
 *   /public/audio/numbers/1.mp3 … 10.mp3
 *   /public/audio/numbers/instructions-listen.mp3
 *   /public/audio/numbers/instructions-tap.mp3
 *   /public/audio/numbers/feedback-correct.mp3
 *   /public/audio/numbers/feedback-retry.mp3
 *
 * Security:
 *   - Runs in Node only — never imported from the client bundle.
 *   - API key is read from process.env, never hard-coded.
 *   - Text inputs are validated with Zod before being sent to OpenAI.
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Env loader — read .env.local manually so this script works without an extra
// dependency and regardless of how the parent process was launched.
// ---------------------------------------------------------------------------

async function loadLocalEnv(): Promise<void> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const raw = await readFile(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

// ---------------------------------------------------------------------------
// Inputs — validated with Zod before hitting the API.
// ---------------------------------------------------------------------------

const TTSRequestSchema = z.object({
  filename: z
    .string()
    .regex(/^[a-z0-9._-]+\.mp3$/, "filename must be lowercase with .mp3 extension"),
  text: z.string().trim().min(1).max(1000),
});

type TTSRequest = z.infer<typeof TTSRequestSchema>;

const OUTPUT_DIR = path.resolve(process.cwd(), "public", "audio", "numbers");

/**
 * OpenAI TTS only exposes a fixed set of voices; they are not language-specific
 * but handle Arabic text reasonably well. "nova" has a brighter, kid-friendly
 * tone; switch to "shimmer" or "alloy" if you prefer a different feel.
 */
const VOICE = "nova";
const MODEL = "tts-1"; // swap to "tts-1-hd" for higher quality at 2× cost
const FORMAT = "mp3";
const SPEED = 0.9; // slightly slower so kids can follow

const REQUESTS: TTSRequest[] = [
  {
    filename: "intro.mp3",
    text: "مرحبا! اليوم سنتعلم الأعداد من واحد إلى عشرة",
  },
  // Fully-vowelled forms so the TTS pronounces the correct case endings.
  { filename: "1.mp3", text: "وَاحِدٌ" },
  { filename: "2.mp3", text: "اِثْنَانِ" },
  { filename: "3.mp3", text: "ثَلَاثَةٌ" },
  { filename: "4.mp3", text: "أَرْبَعَةٌ" },
  { filename: "5.mp3", text: "خَمْسَةٌ" },
  { filename: "6.mp3", text: "سِتَّةٌ" },
  { filename: "7.mp3", text: "سَبْعَةٌ" },
  { filename: "8.mp3", text: "ثَمَانِيَةٌ" },
  { filename: "9.mp3", text: "تِسْعَةٌ" },
  { filename: "10.mp3", text: "عَشَرَةٌ" },
  { filename: "instructions-listen.mp3", text: "اسمع واختر الرقم الصحيح" },
  { filename: "instructions-tap.mp3", text: "اضغط على الرقم الصحيح" },
  { filename: "feedback-correct.mp3", text: "أحسنت!" },
  { filename: "feedback-retry.mp3", text: "حاول مرة أخرى" },
];

// ---------------------------------------------------------------------------
// OpenAI call
// ---------------------------------------------------------------------------

async function synthesise(req: TTSRequest, apiKey: string): Promise<Buffer> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input: req.text,
      response_format: FORMAT,
      speed: SPEED,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      `OpenAI TTS failed (${res.status} ${res.statusText}) for ${req.filename}: ${errorText}`,
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  await loadLocalEnv();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(
      "❌ OPENAI_API_KEY is not set. Add it to .env.local or export it in your shell.",
    );
    process.exit(1);
  }

  // Validate every request up front so we fail fast on typos.
  const validated = REQUESTS.map((r) => TTSRequestSchema.parse(r));

  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`🔊 Generating ${validated.length} audio files into ${OUTPUT_DIR}`);

  const force = process.argv.includes("--force");
  let generated = 0;
  let skipped = 0;

  for (const req of validated) {
    const target = path.join(OUTPUT_DIR, req.filename);
    if (!force && existsSync(target)) {
      skipped++;
      console.log(`  ⏭  ${req.filename} (exists, use --force to overwrite)`);
      continue;
    }
    try {
      const buf = await synthesise(req, apiKey);
      await writeFile(target, buf);
      generated++;
      console.log(`  ✓ ${req.filename}  (${buf.length.toLocaleString()} bytes)`);
    } catch (err) {
      console.error(`  ✗ ${req.filename}:`, err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
  }

  console.log(`\n✅ Done — ${generated} generated, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
