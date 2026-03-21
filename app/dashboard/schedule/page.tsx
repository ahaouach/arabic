"use client";

import { useState } from "react";
import { useSchedule } from "@/lib/useSchedule";
import ScheduleForm from "@/components/ScheduleForm";
import LessonCard from "@/components/LessonCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { LessonStatus } from "@/lib/useSchedule";

const FILTER_TABS: { label: string; value: LessonStatus | "all" }[] = [
  { label: "All",       value: "all"       },
  { label: "Upcoming",  value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function SchedulePage() {
  const { lessons, teachers, children, bookLesson, cancelLesson, getSlots } = useSchedule();
  const [filter, setFilter] = useState<LessonStatus | "all">("all");
  const [cancelId, setCancelId] = useState<string | null>(null);

  const filtered = lessons
    .filter((l) => filter === "all" || l.status === filter)
    .sort((a, b) => {
      // Scheduled first, then by date ascending; completed/cancelled at bottom
      const order: Record<LessonStatus, number> = { scheduled: 0, completed: 1, cancelled: 2 };
      const statusDiff = order[a.status] - order[b.status];
      if (statusDiff !== 0) return statusDiff;
      return a.date.localeCompare(b.date);
    });

  const scheduledCount = lessons.filter((l) => l.status === "scheduled").length;
  const lessonToCancel = cancelId ? lessons.find((l) => l.id === cancelId) : null;

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900">Schedule</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {scheduledCount > 0
                ? `${scheduledCount} upcoming lesson${scheduledCount > 1 ? "s" : ""}`
                : "No upcoming lessons — book one below."}
            </p>
          </div>
        </div>

        {/* Split layout */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-0">

            {/* ── Left: booking form ──────────────────────────────────── */}
            <div className="lg:w-96 xl:w-[420px] shrink-0 lg:border-r border-gray-100 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Book a Lesson</h2>
                <ScheduleForm
                  teachers={teachers}
                  children={children}
                  getSlots={getSlots}
                  onSubmit={bookLesson}
                />
              </div>
            </div>

            {/* ── Right: lessons list ──────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto border-t lg:border-t-0 border-gray-100 bg-gray-50/50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="text-base font-bold text-gray-900">Scheduled Lessons</h2>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                    {FILTER_TABS.map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setFilter(tab.value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          filter === tab.value
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.label}
                        {tab.value === "scheduled" && scheduledCount > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-primary-600 text-white text-xs rounded-full leading-none">
                            {scheduledCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lesson cards */}
                {filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">No lessons found.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filtered.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        children={children}
                        onCancel={(id) => setCancelId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      {lessonToCancel && (
        <ConfirmDialog
          title="Cancel this lesson?"
          message={`${lessonToCancel.program} lesson on ${new Date(lessonToCancel.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} at ${lessonToCancel.time} will be cancelled.`}
          confirmLabel="Cancel Lesson"
          onConfirm={() => { cancelLesson(cancelId!); setCancelId(null); }}
          onCancel={() => setCancelId(null)}
        />
      )}
    </>
  );
}
