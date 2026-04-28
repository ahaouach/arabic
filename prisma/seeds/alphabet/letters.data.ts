/**
 * Metadata for all 28 Arabic letters, in alphabetical (abjad) order.
 *
 * Each entry carries:
 *   - `key`:  URL-safe slug — also the `?letter=<key>` param.
 *   - `char`: isolated base codepoint (no harakat, no tatweel).
 *   - `nameAr`: fully-vowelized Arabic name (e.g. "بَاءٌ").
 *   - `transliteration`: scholarly Latin form.
 *   - `forms`: the four positional renderings; `ـ` (tatweel) is the
 *     visual connector showing where adjacent letters join.
 *   - `audioText`: the vowelized name again — fed to SpeechSynthesis so
 *     the TTS engine reads the case ending (tanwin ḍamma on the name).
 *
 * Keys for "look-alike" letters are disambiguated rather than collated:
 *   ح → `hhaa`   (emphatic h)            ≠ ه → `haa`
 *   ط → `ttaa`   (emphatic t)            ≠ ت → `taa`
 *   ظ → `thhaa`  (emphatic th)           ≠ ظ → not `zaa`
 *   ذ → `dhaal`  ≠ د → `daal`
 *   ص → `saad`   ≠ س → `seen`
 *   ض → `dhaad`  ≠ ظ → `thhaa`
 */

import type { ArabicLetter } from "@/lib/types/alphabetLesson.types";

export const ARABIC_LETTERS: ArabicLetter[] = [
  {
    key: "alif",
    char: "ا",
    nameAr: "أَلِفٌ",
    transliteration: "alif",
    orderIndex: 1,
    forms: { isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" },
    audioText: "أَلِفٌ",
  },
  {
    key: "baa",
    char: "ب",
    nameAr: "بَاءٌ",
    transliteration: "bāʾ",
    orderIndex: 2,
    forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
    audioText: "بَاءٌ",
  },
  {
    key: "taa",
    char: "ت",
    nameAr: "تَاءٌ",
    transliteration: "tāʾ",
    orderIndex: 3,
    forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" },
    audioText: "تَاءٌ",
  },
  {
    key: "thaa",
    char: "ث",
    nameAr: "ثَاءٌ",
    transliteration: "thāʾ",
    orderIndex: 4,
    forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" },
    audioText: "ثَاءٌ",
  },
  {
    key: "jeem",
    char: "ج",
    nameAr: "جِيمٌ",
    transliteration: "jīm",
    orderIndex: 5,
    forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
    audioText: "جِيمٌ",
  },
  {
    key: "hhaa",
    char: "ح",
    nameAr: "حَاءٌ",
    transliteration: "ḥāʾ",
    orderIndex: 6,
    forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" },
    audioText: "حَاءٌ",
  },
  {
    key: "khaa",
    char: "خ",
    nameAr: "خَاءٌ",
    transliteration: "khāʾ",
    orderIndex: 7,
    forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" },
    audioText: "خَاءٌ",
  },
  {
    key: "daal",
    char: "د",
    nameAr: "دَالٌ",
    transliteration: "dāl",
    orderIndex: 8,
    forms: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" },
    audioText: "دَالٌ",
  },
  {
    key: "dhaal",
    char: "ذ",
    nameAr: "ذَالٌ",
    transliteration: "dhāl",
    orderIndex: 9,
    forms: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" },
    audioText: "ذَالٌ",
  },
  {
    key: "raa",
    char: "ر",
    nameAr: "رَاءٌ",
    transliteration: "rāʾ",
    orderIndex: 10,
    forms: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" },
    audioText: "رَاءٌ",
  },
  {
    key: "zay",
    char: "ز",
    nameAr: "زَايٌ",
    transliteration: "zāy",
    orderIndex: 11,
    forms: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" },
    audioText: "زَايٌ",
  },
  {
    key: "seen",
    char: "س",
    nameAr: "سِينٌ",
    transliteration: "sīn",
    orderIndex: 12,
    forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
    audioText: "سِينٌ",
  },
  {
    key: "sheen",
    char: "ش",
    nameAr: "شِينٌ",
    transliteration: "shīn",
    orderIndex: 13,
    forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" },
    audioText: "شِينٌ",
  },
  {
    key: "saad",
    char: "ص",
    nameAr: "صَادٌ",
    transliteration: "ṣād",
    orderIndex: 14,
    forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" },
    audioText: "صَادٌ",
  },
  {
    key: "dhaad",
    char: "ض",
    nameAr: "ضَادٌ",
    transliteration: "ḍād",
    orderIndex: 15,
    forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" },
    audioText: "ضَادٌ",
  },
  {
    key: "ttaa",
    char: "ط",
    nameAr: "طَاءٌ",
    transliteration: "ṭāʾ",
    orderIndex: 16,
    forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" },
    audioText: "طَاءٌ",
  },
  {
    key: "thhaa",
    char: "ظ",
    nameAr: "ظَاءٌ",
    transliteration: "ẓāʾ",
    orderIndex: 17,
    forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" },
    audioText: "ظَاءٌ",
  },
  {
    key: "ayn",
    char: "ع",
    nameAr: "عَيْنٌ",
    transliteration: "ʿayn",
    orderIndex: 18,
    forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
    audioText: "عَيْنٌ",
  },
  {
    key: "ghayn",
    char: "غ",
    nameAr: "غَيْنٌ",
    transliteration: "ghayn",
    orderIndex: 19,
    forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" },
    audioText: "غَيْنٌ",
  },
  {
    key: "faa",
    char: "ف",
    nameAr: "فَاءٌ",
    transliteration: "fāʾ",
    orderIndex: 20,
    forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" },
    audioText: "فَاءٌ",
  },
  {
    key: "qaaf",
    char: "ق",
    nameAr: "قَافٌ",
    transliteration: "qāf",
    orderIndex: 21,
    forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" },
    audioText: "قَافٌ",
  },
  {
    key: "kaaf",
    char: "ك",
    nameAr: "كَافٌ",
    transliteration: "kāf",
    orderIndex: 22,
    forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
    audioText: "كَافٌ",
  },
  {
    key: "laam",
    char: "ل",
    nameAr: "لَامٌ",
    transliteration: "lām",
    orderIndex: 23,
    forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" },
    audioText: "لَامٌ",
  },
  {
    key: "meem",
    char: "م",
    nameAr: "مِيمٌ",
    transliteration: "mīm",
    orderIndex: 24,
    forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
    audioText: "مِيمٌ",
  },
  {
    key: "noon",
    char: "ن",
    nameAr: "نُونٌ",
    transliteration: "nūn",
    orderIndex: 25,
    forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" },
    audioText: "نُونٌ",
  },
  {
    key: "haa",
    char: "ه",
    nameAr: "هَاءٌ",
    transliteration: "hāʾ",
    orderIndex: 26,
    forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
    audioText: "هَاءٌ",
  },
  {
    key: "waaw",
    char: "و",
    nameAr: "وَاوٌ",
    transliteration: "wāw",
    orderIndex: 27,
    forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" },
    audioText: "وَاوٌ",
  },
  {
    key: "yaa",
    char: "ي",
    nameAr: "يَاءٌ",
    transliteration: "yāʾ",
    orderIndex: 28,
    forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
    audioText: "يَاءٌ",
  },
];

/** Quick lookup by key. Use in zone renderers and seed validation. */
export const LETTER_BY_KEY: Record<string, ArabicLetter> = Object.fromEntries(
  ARABIC_LETTERS.map((l) => [l.key, l]),
);
