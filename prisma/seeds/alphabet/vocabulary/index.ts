/**
 * Barrel export — aggregates the 28 per-letter vocabulary pools into a
 * single `ALPHABET_VOCAB` array consumed by the seed orchestrator.
 *
 * Each pool is kept in its own file so the 224-word corpus stays
 * reviewable / editable per-letter. Keys are letter-prefixed so they
 * remain unique when concatenated here.
 */

import type { VocabularyWord } from "@/lib/types/alphabetLesson.types";

import { ALIF_VOCAB } from "./alif.vocab";
import { BAA_VOCAB } from "./baa.vocab";
import { TAA_VOCAB } from "./taa.vocab";
import { THAA_VOCAB } from "./thaa.vocab";
import { JEEM_VOCAB } from "./jeem.vocab";
import { HHAA_VOCAB } from "./hhaa.vocab";
import { KHAA_VOCAB } from "./khaa.vocab";
import { DAAL_VOCAB } from "./daal.vocab";
import { DHAAL_VOCAB } from "./dhaal.vocab";
import { RAA_VOCAB } from "./raa.vocab";
import { ZAY_VOCAB } from "./zay.vocab";
import { SEEN_VOCAB } from "./seen.vocab";
import { SHEEN_VOCAB } from "./sheen.vocab";
import { SAAD_VOCAB } from "./saad.vocab";
import { DHAAD_VOCAB } from "./dhaad.vocab";
import { TTAA_VOCAB } from "./ttaa.vocab";
import { THHAA_VOCAB } from "./thhaa.vocab";
import { AYN_VOCAB } from "./ayn.vocab";
import { GHAYN_VOCAB } from "./ghayn.vocab";
import { FAA_VOCAB } from "./faa.vocab";
import { QAAF_VOCAB } from "./qaaf.vocab";
import { KAAF_VOCAB } from "./kaaf.vocab";
import { LAAM_VOCAB } from "./laam.vocab";
import { MEEM_VOCAB } from "./meem.vocab";
import { NOON_VOCAB } from "./noon.vocab";
import { HAA_VOCAB } from "./haa.vocab";
import { WAAW_VOCAB } from "./waaw.vocab";
import { YAA_VOCAB } from "./yaa.vocab";

export const ALPHABET_VOCAB: VocabularyWord[] = [
  ...ALIF_VOCAB,
  ...BAA_VOCAB,
  ...TAA_VOCAB,
  ...THAA_VOCAB,
  ...JEEM_VOCAB,
  ...HHAA_VOCAB,
  ...KHAA_VOCAB,
  ...DAAL_VOCAB,
  ...DHAAL_VOCAB,
  ...RAA_VOCAB,
  ...ZAY_VOCAB,
  ...SEEN_VOCAB,
  ...SHEEN_VOCAB,
  ...SAAD_VOCAB,
  ...DHAAD_VOCAB,
  ...TTAA_VOCAB,
  ...THHAA_VOCAB,
  ...AYN_VOCAB,
  ...GHAYN_VOCAB,
  ...FAA_VOCAB,
  ...QAAF_VOCAB,
  ...KAAF_VOCAB,
  ...LAAM_VOCAB,
  ...MEEM_VOCAB,
  ...NOON_VOCAB,
  ...HAA_VOCAB,
  ...WAAW_VOCAB,
  ...YAA_VOCAB,
];
