/**
 * Seed content for the unified alphabet lesson used by
 * /dashboard/courses/arabic/alphabet.
 *
 * Bundles all 28 Arabic letters + the 224-word vocabulary corpus + 5
 * zone definitions into a single `AlphabetLessonSection` object.
 *
 * To edit without a code change: open Prisma Studio
 * (`npm run db:studio`) and edit the LessonSection.content JSON. Or
 * update the per-letter files under `./alphabet/vocabulary/*.vocab.ts`
 * and re-run `npm run db:seed`.
 */

import type { AlphabetLessonSection } from "@/lib/types/alphabetLesson.types";
import { ARABIC_LETTERS } from "./alphabet/letters.data";
import { ALPHABET_VOCAB } from "./alphabet/vocabulary";

export const alphabetLessonContent: AlphabetLessonSection = {
  title: "الْأَبْجَدِيَّةُ الْعَرَبِيَّةُ",
  letters: ARABIC_LETTERS,
  vocabulary: ALPHABET_VOCAB,
  zones: [
    {
      kind: "letter_tashkeel",
      title: "الْحَرْفُ مَعَ الْحَرَكَاتِ",
      description: "اِضْغَطْ عَلَى كُلِّ حَرَكَةٍ لِتَسْمَعَ الْحَرْفَ",
      states: [
        "fatha",
        "kasra",
        "damma",
        "sukun",
        "fathatan",
        "kasratan",
        "dammatan",
      ],
    },
    {
      kind: "vocabulary",
      title: "مُفْرَدَاتٌ تَحْتَوِي عَلَى الْحَرْفِ",
      description: "اِكْتَشِفْ كَلِمَاتٍ تَبْدَأُ أَوْ تَحْتَوِي عَلَى الْحَرْفِ",
      minWords: 5,
      maxWords: 6,
    },
    {
      kind: "color_letter",
      title: "لَوِّنِ الْحَرْفَ",
      description: "لَوِّنْ كُلَّ حَرْفٍ مَطْلُوبٍ فِي الشَّبَكَةِ",
      gridCols: 5,
      gridRows: 6,
      targetCountMin: 5,
      targetCountMax: 7,
      mixForms: false,
      targetColor: "random",
    },
    {
      kind: "color_letter_in_word",
      title: "لَوِّنِ الْحَرْفَ فِي الْكَلِمَةِ",
      description: "اِضْغَطْ عَلَى الْحَرْفِ الْمَطْلُوبِ دَاخِلَ الْكَلِمَةِ",
      rounds: 3,
    },
    {
      kind: "find_words",
      title: "اِبْحَثْ عَنْ كَلِمَاتٍ",
      description: "اِخْتَرْ كُلَّ الْكَلِمَاتِ الَّتِي تَحْتَوِي عَلَى الْحَرْفِ",
      rounds: 3,
      totalCards: 8,
      minValid: 3,
      maxValid: 5,
    },
  ],
};
