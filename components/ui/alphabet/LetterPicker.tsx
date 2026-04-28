"use client";

import { useMemo, useState } from "react";
import LetterCard from "./LetterCard";
import { useLetterProgress } from "@/lib/hooks/useLetterProgress";
import type { ArabicLetter } from "@/lib/types/alphabetLesson.types";

export interface LetterPickerProps {
  letters: ArabicLetter[];
  totalZones: number;
  onPickLetter: (key: string) => void;
}

type Filter = "all" | "completed" | "incomplete";

const FILTERS: { id: Filter; labelAr: string }[] = [
  { id: "all", labelAr: "الْكُلُّ" },
  { id: "completed", labelAr: "مُكْتَمِلَةٌ" },
  { id: "incomplete", labelAr: "غَيْرُ مُكْتَمِلَةٍ" },
];

/**
 * Entry grid for the unified alphabet course. 28 letters in alphabetical
 * order, each with a live progress ring sourced from the `useLetterProgress`
 * hook (localStorage-backed).
 *
 * The component is presentational — URL / navigation handling lives in
 * `AlphabetLessonPage`.
 */
export default function LetterPicker({
  letters,
  totalZones,
  onPickLetter,
}: LetterPickerProps) {
  const { completedZones, isLetterComplete, totals, hydrated } =
    useLetterProgress();
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = useMemo(
    () => [...letters].sort((a, b) => a.orderIndex - b.orderIndex),
    [letters],
  );

  const visible = useMemo(() => {
    if (!hydrated || filter === "all") return sorted;
    return sorted.filter((l) => {
      const done = isLetterComplete(l.key, totalZones);
      return filter === "completed" ? done : !done;
    });
  }, [sorted, filter, hydrated, isLetterComplete, totalZones]);

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-8"
      aria-labelledby="alphabet-picker-title"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="alphabet-picker-title"
            className="text-2xl font-black text-gray-900 sm:text-3xl"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            اِخْتَرْ حَرْفًا لِتَبْدَأَ رِحْلَتَكَ
          </h2>
          <p
            className="mt-1 text-sm text-gray-600"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {totals.zonesCompleted > 0
              ? `أَكْمَلْتَ ${totals.zonesCompleted} مَنَاطِق فِي ${totals.lettersStarted} حَرْفًا`
              : "اِبْدَأْ بِأَيِّ حَرْفٍ تُرِيدُ"}
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Filter letters"
          className="flex items-center gap-1 rounded-full bg-gray-100 p-1 shadow-inner"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-9 rounded-full px-3 py-1 text-xs font-black transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
                filter === f.id
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {f.labelAr}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div
          className="rounded-3xl bg-gray-50 p-8 text-center text-sm text-gray-600 shadow-inner"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          لَا تُوجَدُ حُرُوفٌ فِي هَذِهِ الْقَائِمَةِ.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((letter, i) => {
            const done = completedZones(letter.key).size;
            return (
              <LetterCard
                key={letter.key}
                letter={letter}
                completed={done}
                totalZones={totalZones}
                index={i}
                size="md"
                onClick={() => onPickLetter(letter.key)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
