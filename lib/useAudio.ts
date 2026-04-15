"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface UseAudioOptions {
  defaultMuted?: boolean;
  /** Speech rate for TTS fallback. Defaults to 0.8. */
  rate?: number;
  /** Speech pitch for TTS fallback. Defaults to 1.1. */
  pitch?: number;
  /** BCP-47 language for TTS fallback. Defaults to "ar-SA". */
  lang?: string;
  /** Console.debug logs. Default: dev-only. */
  debug?: boolean;
}

export interface UseAudioReturn {
  playAudio: (audioUrl?: string, fallbackText?: string) => void;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/*  Browser detection                                                         */
/* -------------------------------------------------------------------------- */

const isBrowser = typeof window !== "undefined";

const isChrome =
  isBrowser &&
  /Chrome/.test(navigator.userAgent) &&
  !/Edg\/|OPR\//.test(navigator.userAgent);

/* -------------------------------------------------------------------------- */
/*  Voice loader                                                              */
/*                                                                            */
/*  Chrome's `speechSynthesis.getVoices()` returns [] on first call and       */
/*  populates asynchronously via the `voiceschanged` event. Some Chromium     */
/*  builds *never* fire that event, so we also poll as a safety net and      */
/*  give up after ~2 s.                                                      */
/*                                                                            */
/*  The resulting Promise is cached at the module level so only the first     */
/*  call pays the cost; every subsequent call resolves synchronously from    */
/*  microtask, which keeps us inside the user-gesture token.                 */
/* -------------------------------------------------------------------------- */

let voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

export function ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
  if (voicesReadyPromise) return voicesReadyPromise;

  voicesReadyPromise = new Promise((resolve) => {
    if (!isBrowser || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;

    // Already loaded? Resolve immediately.
    const initial = synth.getVoices();
    if (initial.length > 0) {
      resolve(initial);
      return;
    }

    let settled = false;
    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      synth.removeEventListener?.("voiceschanged", onVoicesChanged);
      clearInterval(pollHandle);
      clearTimeout(giveUp);
      resolve(voices);
    };

    const onVoicesChanged = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) finish(voices);
    };
    synth.addEventListener?.("voiceschanged", onVoicesChanged);

    // Poll fallback — some Chromium builds don't emit voiceschanged at all.
    const pollHandle = setInterval(() => {
      const voices = synth.getVoices();
      if (voices.length > 0) finish(voices);
    }, 100);

    // Give up after 2 s — we'll fall back to the default system voice.
    const giveUp = setTimeout(() => finish(synth.getVoices()), 2000);
  });

  return voicesReadyPromise;
}

/* -------------------------------------------------------------------------- */
/*  Arabic voice selection                                                    */
/*                                                                            */
/*  Priority:                                                                 */
/*    1. Exact "ar-SA"                                                        */
/*    2. Any voice whose lang starts with "ar"                                */
/*    3. Any voice whose lang merely includes "ar" anywhere                   */
/*    4. null → caller speaks with default voice                              */
/* -------------------------------------------------------------------------- */

export function selectBestArabicVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const exact = voices.find((v) => v.lang === "ar-SA");
  if (exact) return exact;
  const starts = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
  if (starts) return starts;
  const includes = voices.find((v) => v.lang.toLowerCase().includes("ar"));
  if (includes) return includes;
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Safe speak()                                                              */
/*                                                                            */
/*  Chrome bugs handled:                                                      */
/*    - speak() called within ~50 ms of cancel() is silently dropped → delay  */
/*    - utterance must be a fresh instance every call                         */
/*    - voices may not be ready yet → await ensureVoicesLoaded()              */
/* -------------------------------------------------------------------------- */

interface SpeakOptions {
  rate: number;
  pitch: number;
  lang: string;
  debug: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

export async function speak(text: string, options: SpeakOptions): Promise<void> {
  if (!isBrowser) return;
  const synth = window.speechSynthesis;
  if (!synth) {
    if (options.debug) console.debug("[useAudio] speechSynthesis unavailable");
    return;
  }
  if (!text) return;

  try {
    synth.cancel();

    // Chrome drops speak() issued immediately after cancel() — small delay.
    if (isChrome) {
      await new Promise((r) => setTimeout(r, 80));
    }

    const voices = await ensureVoicesLoaded();

    if (options.debug) {
      console.debug(
        `[useAudio] voices available: ${voices.length}`,
        voices.map((v) => `${v.name} (${v.lang})`),
      );
    }

    const voice = selectBestArabicVoice(voices);

    if (options.debug) {
      if (voice) {
        console.debug(`[useAudio] selected voice: ${voice.name} (${voice.lang})`);
      } else {
        console.debug(
          `[useAudio] no Arabic voice installed — using system default (lang=${options.lang})`,
        );
      }
    }

    const utter = new SpeechSynthesisUtterance(text);
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = options.lang;
    }
    utter.rate = options.rate;
    utter.pitch = options.pitch;

    utter.onstart = () => options.onStart?.();
    utter.onend = () => options.onEnd?.();
    utter.onerror = (e) => {
      if (options.debug) console.debug("[useAudio] TTS error", e);
      options.onEnd?.();
    };

    synth.speak(utter);
  } catch (err) {
    if (options.debug) console.debug("[useAudio] speak() threw — silent fail", err);
    options.onEnd?.();
  }
}

/* -------------------------------------------------------------------------- */
/*  URL guard                                                                 */
/* -------------------------------------------------------------------------- */

function isValidSource(url: string | undefined): url is string {
  if (typeof url !== "string" || url.length === 0 || url.length > 1024) return false;
  return url.startsWith("/") || url.startsWith("https://");
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export function useAudio(options: UseAudioOptions = {}): UseAudioReturn {
  const {
    defaultMuted = false,
    rate = 0.8,
    pitch = 1.1,
    lang = "ar-SA",
    debug = process.env.NODE_ENV !== "production",
  } = options;

  const [isPlaying, setPlaying] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isMuted, setMutedState] = useState(defaultMuted);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(defaultMuted);
  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  const cleanupCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onplaying = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      try {
        audioRef.current.pause();
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
    if (isBrowser && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    cleanupCurrent();
    setPlaying(false);
    setLoading(false);
  }, [cleanupCurrent]);

  const runSpeak = useCallback(
    (text: string) => {
      setLoading(true);
      void speak(text, {
        rate,
        pitch,
        lang,
        debug,
        onStart: () => {
          setLoading(false);
          setPlaying(true);
        },
        onEnd: () => {
          setLoading(false);
          setPlaying(false);
        },
      });
    },
    [rate, pitch, lang, debug],
  );

  const playAudio = useCallback(
    (audioUrl?: string, fallbackText?: string) => {
      if (mutedRef.current) {
        if (debug) console.debug("[useAudio] muted — skipping");
        return;
      }

      cleanupCurrent();

      const safeUrl = isValidSource(audioUrl) ? audioUrl : undefined;

      if (!safeUrl) {
        if (fallbackText) {
          if (debug) console.debug(`[useAudio] no URL → TTS fallback: "${fallbackText}"`);
          runSpeak(fallbackText);
        }
        return;
      }

      setLoading(true);

      let audio: HTMLAudioElement;
      try {
        audio = new Audio(safeUrl);
      } catch (err) {
        if (debug) console.debug("[useAudio] new Audio() threw", err);
        if (fallbackText) runSpeak(fallbackText);
        else setLoading(false);
        return;
      }
      audioRef.current = audio;

      audio.onplaying = () => {
        setLoading(false);
        setPlaying(true);
      };
      audio.onended = () => {
        setPlaying(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        if (debug) console.debug(`[useAudio] <audio> error on ${safeUrl} → TTS fallback`);
        audioRef.current = null;
        if (fallbackText) runSpeak(fallbackText);
        else setLoading(false);
      };

      audio.play().catch((err) => {
        if (debug) console.debug(`[useAudio] play() rejected for ${safeUrl} → TTS fallback`, err);
        audioRef.current = null;
        if (fallbackText) runSpeak(fallbackText);
        else setLoading(false);
      });
    },
    [cleanupCurrent, debug, runSpeak],
  );

  const setMuted = useCallback(
    (muted: boolean) => {
      setMutedState(muted);
      if (muted) cleanupCurrent();
    },
    [cleanupCurrent],
  );

  const toggleMute = useCallback(() => {
    setMuted(!mutedRef.current);
  }, [setMuted]);

  /* Lifecycle: warm up voices as soon as the hook mounts so the first
     click doesn't pay the ensureVoicesLoaded cost. */
  useEffect(() => {
    void ensureVoicesLoaded().then((voices) => {
      if (!debug) return;
      console.debug(
        `[useAudio] voices warmed up: ${voices.length}`,
        voices.map((v) => `${v.name} (${v.lang})`),
      );
    });
  }, [debug]);

  useEffect(() => {
    return () => {
      cleanupCurrent();
    };
  }, [cleanupCurrent]);

  return { playAudio, stop, isPlaying, isLoading, isMuted, toggleMute, setMuted };
}
