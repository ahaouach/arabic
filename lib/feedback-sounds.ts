/**
 * Tiny generated sound effects via the Web Audio API.
 *
 * Why generated: avoids shipping audio files, avoids licensing concerns,
 * and keeps the bundle small. The browser synthesises a sine wave with
 * a short attack/release envelope.
 *
 * SECURITY: This module is purely client-side. It does not load remote
 * resources, does not run on the server (every entry point checks for
 * `window`), and silently no-ops if the AudioContext is unavailable
 * (e.g. during SSR or when audio is blocked).
 */

let ctxRef: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctxRef) return ctxRef;
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctxRef = new Ctor();
    return ctxRef;
  } catch {
    return null;
  }
}

function beep(freq: number, duration: number, volume = 0.08) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* ignore */
  }
}

/** Cheerful two-note chirp for a correct answer. */
export function playSuccess() {
  beep(880, 0.12);
  setTimeout(() => beep(1320, 0.16), 110);
}

/** Soft low buzz for a wrong answer. */
export function playError() {
  beep(196, 0.22, 0.07);
}

/** Triumphant arpeggio for lesson completion. */
export function playCelebration() {
  const notes = [523, 659, 784, 1046]; // C5, E5, G5, C6
  notes.forEach((f, i) => setTimeout(() => beep(f, 0.18, 0.09), i * 110));
}
