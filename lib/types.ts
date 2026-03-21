/**
 * Shared data types.
 *
 * These are intentionally kept separate from UI code so they can be reused
 * by future API routes and database schema definitions without modification.
 */

export type ArabicLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ArabicLevels {
  reading: ArabicLevel;
  writing: ArabicLevel;
  /** Optional — not all programs include oral assessment */
  speaking?: ArabicLevel;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  /** Age must be between 5 and 12 */
  age: number;
  arabicLevel: ArabicLevels;
  notes: string;
  /** ISO date string — set by the server / hook on creation */
  createdAt: string;
}

/**
 * Fields submitted via the form.
 * Excludes server-generated fields (id, createdAt).
 */
export type StudentFormData = Omit<Student, "id" | "createdAt">;
