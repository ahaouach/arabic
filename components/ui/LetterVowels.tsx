"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/lib/useAudio";
import type { LetterVowelsSection } from "@/lib/lessonSections";

const VOWEL_LABELS: Record<string, string> = {
  fatha: "fatha",
  kasra: "kasra",
  damma: "damma",
  sukun: "sukun",
};

const VOWEL_COLORS: Record<string, string> = {
  fatha: "from-amber-300 to-orange-400",
  kasra: "from-sky-300 to-indigo-400",
  damma: "from-fuchsia-300 to-pink-400",
  sukun: "from-emerald-300 to-teal-400",
};

export default function LetterVowels({ section }: { section: LetterVowelsSection }) {
  const { playAudio } = useAudio();

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="mb-5">
        {section.title && (
          <h3
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {section.title}
          </h3>
        )}
        {section.instructions && (
          <p
            className="mt-1 text-sm font-medium text-gray-600"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {section.instructions}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {section.forms.map((f) => (
          <motion.button
            key={`${f.form}-${f.vowel}`}
            type="button"
            onClick={() => playAudio(undefined, f.audioText ?? f.form)}
            onMouseEnter={() => playAudio(undefined, f.audioText ?? f.form)}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label={`Play ${f.form}`}
            className={`group flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br ${
              VOWEL_COLORS[f.vowel] ?? "from-gray-200 to-gray-300"
            } p-6 shadow-lg ring-1 ring-white/40 transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70`}
          >
            <div
              className="rounded-3xl bg-white px-6 py-4 text-7xl font-black text-gray-900 shadow-inner"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif', lineHeight: 1.2 }}
            >
              {f.form}
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-white drop-shadow">
              {VOWEL_LABELS[f.vowel] ?? f.vowel}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
