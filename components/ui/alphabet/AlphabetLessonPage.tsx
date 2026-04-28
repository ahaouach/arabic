"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AlphabetBackground from "./AlphabetBackground";
import LetterJourney from "./LetterJourney";
import LetterPicker from "./LetterPicker";
import LessonShell from "@/lib/components/arabic/LessonShell";
import type { AlphabetLessonSection } from "@/lib/types/alphabetLesson.types";

export interface AlphabetLessonPageProps {
  content: AlphabetLessonSection;
  theme: { name: string; title: string };
  lessonTitle: string;
  nextLesson: { slug: string; title: string } | null;
}

/**
 * Orchestrator for the unified alphabet course.
 *
 * URL param `?letter=<key>` selects which letter's journey is rendered.
 * We keep the active letter in both state (for instant client switches)
 * and the URL (so the selection is shareable / back-button friendly).
 * Unknown letter params fall back to the picker.
 */
export default function AlphabetLessonPage({
  content,
  theme,
  lessonTitle,
  nextLesson,
}: AlphabetLessonPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlLetter = searchParams.get("letter");

  const [selectedKey, setSelectedKey] = useState<string | null>(urlLetter);

  // Keep state in sync with URL (back/forward navigation).
  useEffect(() => {
    setSelectedKey(urlLetter);
  }, [urlLetter]);

  const totalZones = content.zones.length;

  const letterByKey = useMemo(
    () => new Map(content.letters.map((l) => [l.key, l])),
    [content.letters],
  );

  const currentLetter = selectedKey ? letterByKey.get(selectedKey) : null;

  // Unknown `?letter=` — redirect to picker by clearing the param.
  useEffect(() => {
    if (selectedKey && !currentLetter) {
      router.replace(`/dashboard/courses/${encodeURIComponent(theme.name)}/alphabet`);
    }
  }, [selectedKey, currentLetter, router, theme.name]);

  const nextLetter = useMemo(() => {
    if (!currentLetter) return null;
    const sorted = [...content.letters].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const idx = sorted.findIndex((l) => l.key === currentLetter.key);
    return idx >= 0 && idx + 1 < sorted.length ? sorted[idx + 1] : null;
  }, [currentLetter, content.letters]);

  const pickLetter = (key: string) => {
    setSelectedKey(key);
    router.push(
      `/dashboard/courses/${encodeURIComponent(theme.name)}/alphabet?letter=${encodeURIComponent(key)}`,
      { scroll: false },
    );
  };

  const backToPicker = () => {
    setSelectedKey(null);
    router.push(`/dashboard/courses/${encodeURIComponent(theme.name)}/alphabet`, {
      scroll: false,
    });
  };

  return (
    <LessonShell
      theme={theme}
      lessonTitle={lessonTitle}
      background={<AlphabetBackground />}
    >
      {currentLetter ? (
        <LetterJourney
          key={currentLetter.key}
          letter={currentLetter}
          allLetters={content.letters}
          vocabulary={content.vocabulary}
          zones={content.zones}
          nextLetter={nextLetter}
          onBack={backToPicker}
          onSelectLetter={pickLetter}
        />
      ) : (
        <LetterPicker
          letters={content.letters}
          totalZones={totalZones}
          onPickLetter={pickLetter}
        />
      )}

      {/* Subtle footer link to the next theme lesson when available. */}
      {nextLesson && !currentLetter && (
        <div className="mt-6 text-center">
          <a
            href={`/dashboard/courses/${encodeURIComponent(theme.name)}/${encodeURIComponent(nextLesson.slug)}`}
            className="inline-flex min-h-10 items-center gap-1 rounded-full bg-white/80 px-4 py-1.5 text-xs font-black text-gray-700 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
          >
            Next lesson: {nextLesson.title} <span aria-hidden>→</span>
          </a>
        </div>
      )}
    </LessonShell>
  );
}
