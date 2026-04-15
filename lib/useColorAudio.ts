"use client";

import { useCallback } from "react";
import { useAudio, type UseAudioReturn } from "./useAudio";

export interface ColorAudioInput {
  name: string;
  audioText?: string;
}

export interface UseColorAudioReturn extends UseAudioReturn {
  /**
   * Play the pronunciation for a color. Uses the explicit `audioText`
   * when set, otherwise falls back to the `name` field.
   */
  playColor: (color: ColorAudioInput) => void;
}

/**
 * Thin wrapper around `useAudio` that exposes a color-shaped API.
 * Keeps the colors lesson from having to know about the generic
 * `playAudio(url, fallback)` shape.
 */
export function useColorAudio(): UseColorAudioReturn {
  const audio = useAudio();

  const playColor = useCallback(
    (color: ColorAudioInput) => {
      if (!color || typeof color.name !== "string") return;
      const text = color.audioText?.trim() || color.name.trim();
      if (!text) return;
      // No MP3 path is shipped for individual colors yet — pass `undefined`
      // so the hook goes straight to the TTS path.
      audio.playAudio(undefined, text);
    },
    [audio],
  );

  return { ...audio, playColor };
}
