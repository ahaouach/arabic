/**
 * SECURITY: Server-side Text-to-Speech generator.
 *
 *  - NEVER import this module from client code. It uses `fs` / `crypto`
 *    / `process.env` and will break a client bundle (Next.js will refuse
 *    to build if a client file imports it).
 *  - The OpenAI API key is read exclusively from `process.env.OPENAI_API_KEY`
 *    and is never returned to the caller. If the key is missing, every
 *    generation call logs a warning and returns `null` — lesson flow is
 *    never broken.
 *  - Input text is validated (length, control characters) before being
 *    passed to the TTS API.
 *  - Output filenames are hex-encoded sha256 slices — no user input
 *    ever becomes a filesystem path, so path traversal is impossible.
 *
 * Provider: OpenAI `tts-1` (HTTPS, returns MP3). Swap the provider in
 * `callProvider` below to use Google, Polly, or a local model.
 */

import { createHash } from "crypto";
import { promises as fs, existsSync } from "fs";
import path from "path";

// ---- Paths -----------------------------------------------------------------

/** Absolute filesystem directory where generated audio is stored. */
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

/** URL prefix under which the audio files are served by Next.js. */
const AUDIO_URL_PREFIX = "/audio";

// ---- Validation ------------------------------------------------------------

const MAX_TEXT_LENGTH = 500;

// Reject control characters, angle brackets, and backticks. Arabic
// diacritics and punctuation pass through fine.
const INVALID_CHARS = /[\u0000-\u001F<>`]/;

function sanitiseText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_TEXT_LENGTH) return null;
  if (INVALID_CHARS.test(trimmed)) return null;
  return trimmed;
}

// ---- Hashing / URLs --------------------------------------------------------

function hashText(text: string): string {
  // 16 hex chars = 64 bits of collision resistance — safe at this scale
  // and keeps URLs compact.
  return createHash("sha256").update(text, "utf8").digest("hex").slice(0, 16);
}

/**
 * Deterministic URL for a given text. Identical text always hashes to
 * the same URL, so seed data can reference this without ever touching
 * the network. Callers should still call `generateAudio()` at build or
 * admin time to actually produce the file.
 */
export function audioUrlFor(text: string): string {
  const clean = sanitiseText(text);
  if (!clean) return "";
  return `${AUDIO_URL_PREFIX}/${hashText(clean)}.mp3`;
}

// ---- Provider --------------------------------------------------------------

interface ProviderOptions {
  voice?: string;
  model?: string;
}

async function callProvider(
  text: string,
  options: ProviderOptions
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn(
      "[audio] OPENAI_API_KEY not set — TTS generation disabled"
    );
    return null;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model ?? "tts-1",
        voice: options.voice ?? "alloy",
        input: text,
        response_format: "mp3",
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(
        `[audio] OpenAI TTS failed (${res.status}):`,
        errBody.slice(0, 200)
      );
      return null;
    }

    return await res.arrayBuffer();
  } catch (err) {
    console.error("[audio] provider call threw:", err);
    return null;
  }
}

// ---- Generation ------------------------------------------------------------

export interface GenerateOptions extends ProviderOptions {
  /** Force regeneration even if the file already exists. */
  force?: boolean;
}

export interface GenerateResult {
  url: string;
  cached: boolean;
  generated: boolean;
}

/**
 * Generate (or reuse) the audio file for `text`.
 *
 *  - Returns `null` if the text is invalid.
 *  - Returns `{ cached: true }` if the file already exists.
 *  - Returns `{ generated: true }` if a fresh file was written.
 *  - Returns `{ cached: false, generated: false }` if the provider
 *    failed (no key, network error, etc.) — the URL is still returned
 *    so lesson data can reference it consistently.
 */
export async function generateAudio(
  text: string,
  options: GenerateOptions = {}
): Promise<GenerateResult | null> {
  const clean = sanitiseText(text);
  if (!clean) {
    console.error("[audio] invalid text — skipping");
    return null;
  }

  const hash = hashText(clean);
  const url = `${AUDIO_URL_PREFIX}/${hash}.mp3`;
  const absPath = path.join(AUDIO_DIR, `${hash}.mp3`);

  if (!options.force && existsSync(absPath)) {
    return { url, cached: true, generated: false };
  }

  const audio = await callProvider(clean, options);
  if (!audio) {
    return { url, cached: false, generated: false };
  }

  try {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
    await fs.writeFile(absPath, Buffer.from(audio));
    return { url, cached: false, generated: true };
  } catch (err) {
    console.error("[audio] write failed:", err);
    return { url, cached: false, generated: false };
  }
}

/**
 * Batch helper — generate audio for many texts, de-duplicated.
 * Used by the `generate-lesson-audio.ts` CLI and by seeders.
 */
export async function generateAudioBatch(
  texts: string[],
  options: GenerateOptions = {}
): Promise<{
  total: number;
  unique: number;
  cached: number;
  generated: number;
  failed: number;
}> {
  const unique = Array.from(new Set(texts.map((t) => t.trim()).filter(Boolean)));
  let cached = 0;
  let generated = 0;
  let failed = 0;

  for (const text of unique) {
    const result = await generateAudio(text, options);
    if (!result) {
      failed += 1;
      continue;
    }
    if (result.cached) cached += 1;
    else if (result.generated) generated += 1;
    else failed += 1;
  }

  return { total: texts.length, unique: unique.length, cached, generated, failed };
}
