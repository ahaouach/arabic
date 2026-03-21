import type { Metadata } from "next";
import Link from "next/link";
import ProgramCard from "@/components/ProgramCard";

export const metadata: Metadata = {
  title: "Programs — AQ Academy",
  description:
    "Explore our 8-level Arabic program and 2-level Quran program designed for non-Arabic-speaking children aged 5–12.",
};

const ARABIC_LEVELS = [
  {
    level: 1,
    title: "The Alphabet Journey",
    description:
      "Introduction to the Arabic alphabet. Children learn to recognise, pronounce, and trace individual letters in isolation.",
    goals: [
      "Recognise all 28 Arabic letters",
      "Pronounce each letter correctly",
      "Trace and write letters in isolation",
      "Basic letter-sound association",
    ],
  },
  {
    level: 2,
    title: "Letters Come Together",
    description:
      "Letters in their connected forms. Children learn how Arabic letters change shape depending on their position in a word.",
    goals: [
      "Identify initial, medial, and final letter forms",
      "Connect letters to form simple words",
      "Introduction to short vowels (Harakat)",
      "Read and write 2–3 letter words",
    ],
  },
  {
    level: 3,
    title: "Reading Simple Words",
    description:
      "Reading short vowelised words and simple sentences. Focus on accuracy and fluency at the word level.",
    goals: [
      "Read fully vowelised words confidently",
      "Build a vocabulary of 50+ common words",
      "Understand basic word families",
      "Write simple words from dictation",
    ],
  },
  {
    level: 4,
    title: "My First Sentences",
    description:
      "Building simple sentences. Introduction to basic Arabic grammar concepts in a child-friendly way.",
    goals: [
      "Form simple subject-verb sentences",
      "Understand masculine and feminine nouns",
      "Introduction to numbers 1–20 in Arabic",
      "Conversational greetings and responses",
    ],
  },
  {
    level: 5,
    title: "Expanding Vocabulary",
    description:
      "Vocabulary expansion through topics: family, home, colours, food, animals. Begin reading short passages.",
    goals: [
      "Learn 200+ vocabulary words by theme",
      "Read short 3–5 sentence passages",
      "Use adjectives to describe nouns",
      "Ask and answer simple questions",
    ],
  },
  {
    level: 6,
    title: "Grammar Foundations",
    description:
      "Introduction to core Arabic grammar: verb conjugation, plurals, and sentence structure.",
    goals: [
      "Conjugate common verbs (past and present)",
      "Form sound and broken plurals",
      "Understand basic sentence structures",
      "Write short descriptive paragraphs",
    ],
  },
  {
    level: 7,
    title: "Reading & Comprehension",
    description:
      "Reading longer texts without full vowelisation. Comprehension exercises and written responses.",
    goals: [
      "Read lightly vowelised short stories",
      "Answer comprehension questions in Arabic",
      "Introduce common proverbs and expressions",
      "Write multi-sentence responses",
    ],
  },
  {
    level: 8,
    title: "Fluent Communicator",
    description:
      "Approaching conversational fluency. Students can read, write, and hold basic conversations in Modern Standard Arabic.",
    goals: [
      "Hold short conversations on everyday topics",
      "Write structured paragraphs independently",
      "Read un-vowelised texts with assistance",
      "Prepare for formal Arabic studies",
    ],
  },
] as const;

const QURAN_LEVELS = [
  {
    level: "Q1",
    title: "Quran Beginner — Letters & Pronunciation",
    description:
      "A gentle introduction to Quranic Arabic. Children learn Tajweed basics and the specific pronunciation rules needed to recite the Quran correctly.",
    goals: [
      "Distinguish Quranic letter pronunciation from standard Arabic",
      "Learn Madd (elongation) and Sukoon (rest) signs",
      "Recite Al-Fatiha correctly with Tajweed",
      "Memorise short Surahs: Al-Ikhlas, Al-Falaq, An-Nas",
    ],
    badge: "Beginner",
  },
  {
    level: "Q2",
    title: "Quran Intermediate — Reading & Memorisation",
    description:
      "Building Quranic reading fluency. Students apply Tajweed rules to longer passages and begin structured memorisation of Juz Amma.",
    goals: [
      "Apply core Tajweed rules (Idgham, Ikhfa, Qalqalah)",
      "Read from the Mushaf with increasing fluency",
      "Memorise Surahs from Juz Amma",
      "Understand the general meaning of memorised Surahs",
    ],
    badge: "Intermediate",
  },
] as const;

export default function ProgramPage() {
  return (
    <main id="main-content" className="bg-sand-50 min-h-screen">

      {/* Page Header */}
      <section className="bg-primary-700 text-white py-16" aria-labelledby="program-page-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-primary-200 text-sm font-semibold tracking-widest uppercase mb-2">
            Our Curriculum
          </span>
          <h1
            id="program-page-heading"
            className="text-4xl sm:text-5xl font-extrabold mb-4"
          >
            Programs & Levels
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            A clear, progressive curriculum from the alphabet to conversational
            Arabic and Quranic recitation — tailored for children aged 5–12.
          </p>
        </div>
      </section>

      {/* Arabic Program */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
        aria-labelledby="arabic-program-heading"
      >
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-arabic"
            aria-hidden="true"
          >
            ع
          </div>
          <div>
            <h2
              id="arabic-program-heading"
              className="text-2xl sm:text-3xl font-extrabold text-primary-900"
            >
              Arabic Language Program
            </h2>
            <p className="text-gray-600 text-sm mt-0.5">
              8 progressive levels — from the alphabet to conversational fluency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
          {ARABIC_LEVELS.map((lvl) => (
            <div key={lvl.level} role="listitem">
              <ProgramCard
                level={lvl.level}
                title={lvl.title}
                description={lvl.description}
                goals={lvl.goals}
                accentColor="primary"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <hr className="border-sand-200" />
      </div>

      {/* Quran Program */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
        aria-labelledby="quran-program-heading"
      >
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-12 h-12 bg-accent-500 text-white rounded-2xl flex items-center justify-center text-xl font-arabic"
            aria-hidden="true"
          >
            ق
          </div>
          <div>
            <h2
              id="quran-program-heading"
              className="text-2xl sm:text-3xl font-extrabold text-primary-900"
            >
              Quran Program
            </h2>
            <p className="text-gray-600 text-sm mt-0.5">
              2 levels — from pronunciation basics to Juz Amma memorisation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {QURAN_LEVELS.map((lvl) => (
            <ProgramCard
              key={lvl.level}
              level={lvl.level}
              title={lvl.title}
              description={lvl.description}
              goals={lvl.goals}
              accentColor="accent"
              badge={lvl.badge}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600 py-14 text-center" aria-labelledby="program-cta-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2
            id="program-cta-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
          >
            Start at any level — we&apos;ll find the right fit
          </h2>
          <p className="text-primary-200 mb-8">
            Our teachers will assess your child and place them in the most
            suitable level. No pressure, no rush.
          </p>
          <Link
            href="/login#subscribe"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-primary-700 bg-white rounded-xl hover:bg-primary-50 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Enroll Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
