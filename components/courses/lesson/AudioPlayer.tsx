"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  /** Same-origin audio URL. May be empty — the button falls back to TTS. */
  src: string;
  /**
   * Fallback text. If `src` is empty OR the audio file fails to load,
   * the player uses the browser's Web Speech API (`speechSynthesis`)
   * to speak this text. Works offline, no API key, no file generation.
   */
  text?: string;
  /** BCP-47 language tag for the TTS voice (e.g. "ar", "ar-SA", "fr-FR"). */
  lang?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  /** Best-effort autoplay. May be blocked by browser autoplay policy. */
  autoPlay?: boolean;
}

const SIZE_CLASS: Record<NonNullable<AudioPlayerProps["size"]>, string> = {
  sm: "h-10 w-10 text-xl",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-3xl",
};

/**
 * Plays an MP3 if one is available, otherwise falls back to the
 * browser's built-in speech synthesizer. This means every AudioPlayer
 * produces sound on any modern browser with zero setup — while still
 * using high-quality pre-generated MP3s when they're available.
 *
 * SECURITY: `src` and `text` both come from Zod-validated lesson data.
 * Text is passed to `speechSynthesis` as a plain string (never eval'd
 * or inserted as HTML). No remote fetches beyond the optional MP3.
 */
export default function AudioPlayer({
  src,
  text,
  lang = "ar-SA",
  label = "Play audio",
  size = "md",
  autoPlay = false,
}: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Reset to idle when the audio element ends or errors.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnded = () => setPlaying(false);
    const onError = () => setPlaying(false);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [src]);

  // Speak the text via Web Speech API and update playing state.
  function speakWithTTS() {
    if (!text || typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    try {
      synth.cancel(); // stop any in-flight utterance
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = 0.85; // slightly slower — helps children
      utter.pitch = 1;
      utter.onend = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);

      // Try to pick a matching voice. Some browsers load voices
      // asynchronously, in which case `getVoices()` may be empty on
      // the first call — fall through to the default voice.
      const voices = synth.getVoices();
      const match =
        voices.find((v) => v.lang === lang) ??
        voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
      if (match) utter.voice = match;

      synth.speak(utter);
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  // Stop both MP3 and TTS playback.
  function stopAll() {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }

  // Best-effort autoplay — browser autoplay policy will block this
  // until the user has interacted with the page.
  useEffect(() => {
    if (!autoPlay) return;
    toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, src]);

  function toggle() {
    if (playing) {
      stopAll();
      return;
    }

    // 1. Try the MP3 file first (higher quality, offline-ready).
    if (src && ref.current) {
      ref.current.currentTime = 0;
      ref.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // File missing / can't decode → fall back to TTS.
          speakWithTTS();
        });
      return;
    }

    // 2. No MP3 available — go straight to Web Speech API.
    speakWithTTS();
  }

  return (
    <span className="relative inline-flex">
      {src && <audio ref={ref} src={src} preload="auto" />}

      {playing && (
        <span
          className="absolute inset-0 rounded-full bg-primary-400/30 animate-ping"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={toggle}
        className={[
          "relative inline-flex items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-4 focus:ring-primary-300",
          playing
            ? "bg-gradient-to-br from-rose-500 to-rose-700"
            : "bg-gradient-to-br from-primary-500 to-primary-700",
          SIZE_CLASS[size],
        ].join(" ")}
        aria-label={playing ? "Pause audio" : label}
        aria-pressed={playing}
        disabled={!src && !text}
      >
        <span className={playing ? "animate-pulse" : ""}>
          {playing ? "⏸" : "🔊"}
        </span>
      </button>
    </span>
  );
}
