// Browser-side helpers for playing lesson audio.
//
// Strategy: if a real MP3 asset is available, play it; otherwise fall
// back to the browser's Web Speech API so lessons still produce sound.
// We pick the fallback using a HEAD request (reliable 404 detection —
// `audio.play()` timing is unreliable for error handling).

// Fully-vowelled Arabic number words — harakat included so the browser TTS
// pronounces the case endings (tanween) correctly for children learning as
// non-native speakers.
export const ARABIC_NUMBER_WORDS: Record<string, string> = {
  "1": "وَاحِدٌ",
  "2": "اِثْنَانِ",
  "3": "ثَلَاثَةٌ",
  "4": "أَرْبَعَةٌ",
  "5": "خَمْسَةٌ",
  "6": "سِتَّةٌ",
  "7": "سَبْعَةٌ",
  "8": "ثَمَانِيَةٌ",
  "9": "تِسْعَةٌ",
  "10": "عَشَرَةٌ",
};

export const ARABIC_NUMBER_ROMAN: Record<string, string> = {
  "1": "wahidun",
  "2": "ithnani",
  "3": "thalathatun",
  "4": "arbaatun",
  "5": "khamsatun",
  "6": "sittatun",
  "7": "sabatun",
  "8": "thamaniyatun",
  "9": "tisatun",
  "10": "asharatun",
};

function pickArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const synth = window.speechSynthesis;
  if (!synth) return null;
  const voices = synth.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith("ar")) ?? null;
}

/**
 * Speak an Arabic word. If the OS has no Arabic voice installed,
 * speak the transliteration in English so something is still audible.
 */
export function speakArabic(arabic: string, roman?: string): void {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  synth.cancel();
  const arabicVoice = pickArabicVoice();
  const utter = new SpeechSynthesisUtterance(arabicVoice ? arabic : roman ?? arabic);
  utter.lang = arabicVoice?.lang ?? "en-US";
  if (arabicVoice) utter.voice = arabicVoice;
  utter.rate = 0.85;
  utter.pitch = 1;
  synth.speak(utter);
}

/**
 * Play the given audio URL, or fall back to TTS if the file is missing.
 *
 * IMPORTANT: call this synchronously inside a user-gesture handler (e.g. a
 * button `onClick`). We attempt the MP3 first; if `play()` rejects (missing
 * file, autoplay block) we synchronously invoke the speech synthesis
 * fallback — which is still within the original user-gesture tick because
 * `audio.play()` rejects synchronously enough for browsers to honour it.
 */
export function playAudioOrSpeak(
  audioUrl: string | undefined,
  arabic: string,
  roman?: string,
): void {
  if (!audioUrl) {
    speakArabic(arabic, roman);
    return;
  }
  const audio = new Audio(audioUrl);
  audio.play().catch(() => {
    speakArabic(arabic, roman);
  });
}

// Voices list is populated asynchronously in some browsers.
// Trigger an early fetch so the first user click doesn't hit an empty list.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}
