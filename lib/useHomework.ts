"use client";

import { useState, useEffect, useCallback } from "react";

export type HomeworkStatus = "pending" | "submitted" | "reviewed";

export interface Submission {
  fileName: string;
  fileSize: number;
  fileType: string;
  comment: string;
  submittedAt: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  course: string;
  pdfUrl: string;
  dueDate: string;
  status: HomeworkStatus;
  submission?: Submission;
}

export interface SubmissionInput {
  file: File;
  comment: string;
}

export interface UseHomeworkReturn {
  homeworks: Homework[];
  loading: boolean;
  submitHomework: (id: string, input: SubmissionInput) => Promise<void>;
  resubmitHomework: (id: string) => Promise<void>;
}

export function useHomework(): UseHomeworkReturn {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomework = useCallback(() => {
    setLoading(true);
    fetch("/api/homework", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { homeworks: [] }))
      .then((data) => setHomeworks(data.homeworks ?? []))
      .catch(() => setHomeworks([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  async function submitHomework(id: string, input: SubmissionInput): Promise<void> {
    const res = await fetch(`/api/homework/${id}/submit`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: input.file.name,
        fileSize: input.file.size,
        fileType: input.file.type,
        comment: input.comment,
      }),
    });

    if (res.ok) {
      const { submission } = await res.json();
      setHomeworks((prev) =>
        prev.map((h) =>
          h.id === id ? { ...h, status: "submitted" as const, submission } : h
        )
      );
    }
  }

  async function resubmitHomework(id: string): Promise<void> {
    const res = await fetch(`/api/homework/${id}/submit`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (res.ok) {
      setHomeworks((prev) =>
        prev.map((h) =>
          h.id === id ? { ...h, status: "pending" as const, submission: undefined } : h
        )
      );
    }
  }

  return { homeworks, loading, submitHomework, resubmitHomework };
}
