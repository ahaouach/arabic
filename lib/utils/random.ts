/**
 * Seeded PRNG + helpers used across gamified lessons.
 *
 * - `mulberry32` — fast, good-enough 32-bit integer PRNG. Deterministic
 *   when given a seed, perfect for reproducible tests. Same algorithm as
 *   the inline RNG in `ColorTargetDigitZone`.
 * - `shuffle`, `pickRandom`, `pickOne` — small helpers that accept an
 *   optional seed; without a seed they fall back to `Math.random`.
 * - `generateRoundSeed` — produces a fresh integer seed. Always call
 *   client-side (inside `useEffect` / event handler) to avoid SSR
 *   hydration mismatch.
 */

export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFor(seed?: number): () => number {
  return seed === undefined ? Math.random : mulberry32(seed);
}

/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate the input.
 * Deterministic when `seed` is provided.
 */
export function shuffle<T>(array: readonly T[], seed?: number): T[] {
  const rand = rngFor(seed);
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Pick `n` distinct items from `array`. If `n` exceeds `array.length`
 * the result is clamped to the full shuffled array.
 */
export function pickRandom<T>(array: readonly T[], n: number, seed?: number): T[] {
  if (n <= 0) return [];
  return shuffle(array, seed).slice(0, Math.min(n, array.length));
}

/**
 * Pick a single item. Throws if the array is empty — callers should
 * guard themselves, typing can't express "non-empty array" cleanly.
 */
export function pickOne<T>(array: readonly T[], seed?: number): T {
  if (array.length === 0) throw new Error("pickOne: array is empty");
  const rand = rngFor(seed);
  return array[Math.floor(rand() * array.length)];
}

/**
 * Produce a fresh integer seed. Uses `Math.random` under the hood —
 * always call this inside an event handler or `useEffect`, never during
 * SSR, to keep deterministic hydration.
 */
export function generateRoundSeed(): number {
  return (Math.random() * 0xffffffff) >>> 0;
}

/**
 * Pick a random integer in `[min, max]`, inclusive.
 */
export function randomInt(min: number, max: number, seed?: number): number {
  const rand = rngFor(seed);
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(rand() * (hi - lo + 1)) + lo;
}
