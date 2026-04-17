/**
 * Arabic number vocabulary — used as TTS fallback strings by the
 * `quiz_match` and `game_numbers` legacy block components.
 *
 * Every entry is fully vowelized (harakat included) so the browser TTS
 * emits the correct case endings (tanween) for children learning as
 * non-native speakers.
 *
 * Historical note: this file used to house `speakArabic`,
 * `playAudioOrSpeak`, `pickArabicVoice`, and an `isChrome` flag. Those
 * helpers were superseded by `lib/useAudio.ts` and removed in the
 * shared-utilities refactor.
 */

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
