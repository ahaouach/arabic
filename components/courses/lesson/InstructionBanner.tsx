"use client";

import AudioPlayer from "./AudioPlayer";

interface InstructionBannerProps {
  /** French version — used for autoplay so a non-Arabic-speaking child
   *  can hear and understand the instruction even if they can't read. */
  fr: string;
  /** Arabic version — displayed prominently as the "real" consigne. */
  ar?: string;
  /** Optional pre-generated Arabic MP3 URL (from `audioUrlFor`). */
  audioUrlAr?: string;
  /** Disable French autoplay (rare — use for instructions shown mid-flow). */
  disableAutoPlay?: boolean;
}

/**
 * The instruction area above every exercise and course page.
 *
 * Layout:
 *   - Arabic consigne (large, RTL, bold) — the authoritative text
 *   - French translation (smaller, under) — for comprehension
 *   - Two speaker buttons: French 🔊 (autoplays once) + Arabic 🔊 (manual)
 *
 * The French autoplay uses the browser's Web Speech API with
 * `lang="fr-FR"`. Browsers gate autoplay behind a user gesture, but
 * the learner has already clicked to open / navigate to the lesson,
 * so the gesture is usually fresh. If the browser blocks autoplay,
 * the fallback is simply that the child can tap the button.
 */
export default function InstructionBanner({
  fr,
  ar,
  audioUrlAr,
  disableAutoPlay = false,
}: InstructionBannerProps) {
  return (
    <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
      {ar && (
        <p
          className="mb-2 text-center text-2xl font-bold text-emerald-900 leading-relaxed"
          dir="rtl"
          lang="ar"
        >
          {ar}
        </p>
      )}

      <p className="mb-3 text-center text-sm font-medium text-gray-600">
        {fr}
      </p>

      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center">
          <AudioPlayer
            src=""
            text={fr}
            lang="fr-FR"
            size="sm"
            autoPlay={!disableAutoPlay}
            label="Écouter la consigne en français"
          />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            FR
          </span>
        </div>
        {ar && (
          <div className="flex flex-col items-center">
            <AudioPlayer
              src={audioUrlAr ?? ""}
              text={ar}
              lang="ar-SA"
              size="sm"
              label="Écouter la consigne en arabe"
            />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              AR
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Helpers --------------------------------------------------------------

/**
 * Split a bilingual string of the form `"French — Arabic"` (with any
 * dash character) into its two halves, detecting which side holds
 * Arabic glyphs (U+0600–U+06FF).
 *
 * If the string isn't clearly bilingual, returns `{ fr: text }` so
 * callers can still render it as a mono-lingual instruction.
 */
export function parseBilingual(text: string): { fr: string; ar?: string } {
  const parts = text.split(/\s*[—–\-]\s*/);
  if (parts.length >= 2) {
    const hasArabic = /[\u0600-\u06FF]/;
    // Find the first Arabic-containing chunk and the first non-Arabic chunk.
    const arPart = parts.find((p) => hasArabic.test(p));
    const frPart = parts.find((p) => !hasArabic.test(p));
    if (arPart && frPart) {
      return { fr: frPart.trim(), ar: arPart.trim() };
    }
  }
  return { fr: text.trim() };
}
