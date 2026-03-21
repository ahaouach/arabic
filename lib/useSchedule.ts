"use client";

import { useState, useEffect, useCallback } from "react";

// ---- Types -----------------------------------------------------------------

export type Program = "Arabic" | "Quran";
export type LessonStatus = "scheduled" | "completed" | "cancelled";

export interface Teacher {
  id: string;
  name: string;
  specialities: Program[];
  initials: string;
  colorClass: string;
}

export interface ScheduleChild {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
}

export interface Lesson {
  id: string;
  teacher: Teacher;
  childrenIds: string[];
  program: Program;
  date: string;
  time: string;
  status: LessonStatus;
  createdAt: string;
}

export interface BookingInput {
  teacherId: string;
  childrenIds: string[];
  program: Program;
  date: string;
  time: string;
}

export interface TimeSlotInfo {
  time: string;
  available: boolean;
}

export const ALL_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export function getAvailableSlots(
  teacherId: string,
  date: string,
  lessons: Lesson[]
): TimeSlotInfo[] {
  const taken = new Set(
    lessons
      .filter(
        (l) =>
          l.teacher.id === teacherId &&
          l.date === date &&
          l.status !== "cancelled"
      )
      .map((l) => l.time)
  );
  return ALL_TIME_SLOTS.map((t) => ({ time: t, available: !taken.has(t) }));
}

// ---- Hook ------------------------------------------------------------------

export interface UseScheduleReturn {
  lessons: Lesson[];
  teachers: Teacher[];
  children: ScheduleChild[];
  loading: boolean;
  bookLesson: (input: BookingInput) => Promise<void>;
  cancelLesson: (id: string) => Promise<void>;
  getSlots: (teacherId: string, date: string) => TimeSlotInfo[];
}

export function useSchedule(): UseScheduleReturn {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [children, setChildren] = useState<ScheduleChild[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(() => {
    setLoading(true);
    fetch("/api/schedule", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { lessons: [], teachers: [], children: [] }))
      .then((data) => {
        setLessons(data.lessons ?? []);
        setTeachers(data.teachers ?? []);
        setChildren(data.children ?? []);
      })
      .catch(() => {
        setLessons([]);
        setTeachers([]);
        setChildren([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  async function bookLesson(input: BookingInput): Promise<void> {
    const res = await fetch("/api/schedule", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const { lesson } = await res.json();
      setLessons((prev) => [lesson, ...prev]);
    }
  }

  async function cancelLesson(id: string): Promise<void> {
    const res = await fetch(`/api/schedule/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) {
      const { lesson } = await res.json();
      setLessons((prev) => prev.map((l) => (l.id === id ? lesson : l)));
    }
  }

  function getSlots(teacherId: string, date: string): TimeSlotInfo[] {
    return getAvailableSlots(teacherId, date, lessons);
  }

  return { lessons, teachers, children, loading, bookLesson, cancelLesson, getSlots };
}
