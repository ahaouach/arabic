"use client";

import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import LessonCard from "./LessonCard";
import { LESSON_LEVELS, type LessonLevel } from "@/lib/lessonLevel";

export interface LessonItem {
  id: string;
  title: string;
  slug: string;
  themeSlug: string;
  level: LessonLevel;
  icon?: string | null;
  description?: string | null;
  isLocked?: boolean;
}

interface LessonListProps {
  lessons: LessonItem[];
}

type Filter = "all" | LessonLevel;

const FILTERS: { value: Filter; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "✨" },
  { value: "basic", label: "Basic", icon: "🌱" },
  { value: "intermediate", label: "Intermediate", icon: "🚀" },
  { value: "advanced", label: "Advanced", icon: "🔥" },
];

export default function LessonList({ lessons }: LessonListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return lessons;
    return lessons.filter((l) => l.level === filter);
  }, [lessons, filter]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: lessons.length,
      basic: 0,
      intermediate: 0,
      advanced: 0,
    };
    for (const l of lessons) {
      if (LESSON_LEVELS.includes(l.level)) base[l.level]++;
    }
    return base;
  }, [lessons]);

  return (
    <div>
      {/* Filter tabs */}
      <div role="tablist" aria-label="Filter lessons by level" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                active
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 ring-1 ring-black/5 hover:bg-yellow-50"
              }`}
            >
              <span aria-hidden>{f.icon}</span>
              {f.label}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                  active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              slug={lesson.slug}
              themeSlug={lesson.themeSlug}
              level={lesson.level}
              icon={lesson.icon ?? null}
              description={lesson.description ?? null}
              isLocked={lesson.isLocked ?? false}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-sm text-gray-500">
          No lessons at this level yet — check back soon!
        </div>
      )}
    </div>
  );
}
