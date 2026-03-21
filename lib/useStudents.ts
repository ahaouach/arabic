"use client";

import { useState, useEffect, useCallback } from "react";
import type { Student, StudentFormData } from "./types";

export interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  addStudent: (data: StudentFormData) => Promise<void>;
  updateStudent: (id: string, data: StudentFormData) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

export function useStudents(): UseStudentsReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(() => {
    setLoading(true);
    fetch("/api/students", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { students: [] }))
      .then((data) => setStudents(data.students ?? []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  async function addStudent(data: StudentFormData): Promise<void> {
    const res = await fetch("/api/students", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { student } = await res.json();
      setStudents((prev) => [...prev, student]);
    }
  }

  async function updateStudent(id: string, data: StudentFormData): Promise<void> {
    const res = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { student } = await res.json();
      setStudents((prev) => prev.map((s) => (s.id === id ? student : s)));
    }
  }

  async function deleteStudent(id: string): Promise<void> {
    const res = await fetch(`/api/students/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (res.ok) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return { students, loading, addStudent, updateStudent, deleteStudent };
}
