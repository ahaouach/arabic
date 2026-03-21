"use client";

import { useState, useEffect, useRef } from "react";
import type { Student, StudentFormData, ArabicLevel } from "@/lib/types";

const LEVELS: ArabicLevel[] = ["Beginner", "Intermediate", "Advanced"];

const EMPTY: StudentFormData = {
  firstName: "",
  lastName: "",
  age: 8,
  arabicLevel: { reading: "Beginner", writing: "Beginner", speaking: undefined },
  notes: "",
};

type FormErrors = Partial<Record<keyof StudentFormData | "reading" | "writing", string>>;

function toFormData(student: Student): StudentFormData {
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    age: student.age,
    arabicLevel: { ...student.arabicLevel },
    notes: student.notes,
  };
}

interface StudentFormProps {
  /** Pass a student to pre-fill for editing; omit for add mode */
  initialData?: Student;
  onSubmit: (data: StudentFormData) => void;
  onClose: () => void;
}

export default function StudentForm({ initialData, onSubmit, onClose }: StudentFormProps) {
  const isEdit = Boolean(initialData);
  const [fields, setFields] = useState<StudentFormData>(
    initialData ? toFormData(initialData) : EMPTY
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!fields.firstName.trim()) e.firstName = "First name is required.";
    if (!fields.lastName.trim()) e.lastName = "Last name is required.";
    if (!fields.age || fields.age < 5 || fields.age > 12)
      e.age = "Age must be between 5 and 12.";
    if (!fields.arabicLevel.reading) e.reading = "Reading level is required.";
    if (!fields.arabicLevel.writing) e.writing = "Writing level is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(fields);
  }

  function setField<K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setLevel(key: keyof StudentFormData["arabicLevel"], value: ArabicLevel | "") {
    setFields((prev) => ({
      ...prev,
      arabicLevel: {
        ...prev.arabicLevel,
        [key]: value === "" ? undefined : value,
      },
    }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-form-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 id="student-form-title" className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Child" : "Add a Child"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" error={errors.firstName} required>
              <input
                ref={firstInputRef}
                type="text"
                value={fields.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                placeholder="Ahmed"
                className={inputClass(!!errors.firstName)}
              />
            </Field>
            <Field label="Last Name" error={errors.lastName} required>
              <input
                type="text"
                value={fields.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                placeholder="Benali"
                className={inputClass(!!errors.lastName)}
              />
            </Field>
          </div>

          {/* Age */}
          <Field label="Age" error={errors.age} required hint="Between 5 and 12 years old">
            <input
              type="number"
              min={5}
              max={12}
              value={fields.age}
              onChange={(e) => setField("age", Number(e.target.value))}
              className={inputClass(!!errors.age)}
            />
          </Field>

          {/* Arabic levels */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Arabic Level Assessment</p>
            <div className="space-y-3">
              <Field label="Reading" error={errors.reading} required>
                <LevelSelect
                  value={fields.arabicLevel.reading ?? ""}
                  onChange={(v) => setLevel("reading", v)}
                  hasError={!!errors.reading}
                  required
                />
              </Field>
              <Field label="Writing" error={errors.writing} required>
                <LevelSelect
                  value={fields.arabicLevel.writing ?? ""}
                  onChange={(v) => setLevel("writing", v)}
                  hasError={!!errors.writing}
                  required
                />
              </Field>
              <Field label="Speaking" hint="Optional">
                <LevelSelect
                  value={fields.arabicLevel.speaking ?? ""}
                  onChange={(v) => setLevel("speaking", v)}
                  hasError={false}
                  placeholder="Not assessed"
                />
              </Field>
            </div>
          </div>

          {/* Notes */}
          <Field label="Notes" hint="Optional — visible only to you">
            <textarea
              value={fields.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              placeholder="E.g. very motivated, needs help with..."
              className={`${inputClass(false)} resize-none`}
            />
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
            >
              {isEdit ? "Save Changes" : "Add Child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Shared sub-components -----------------------------------------------

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="font-normal text-gray-400 ml-1 text-xs">({hint})</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function LevelSelect({
  value,
  onChange,
  hasError,
  required,
  placeholder = "— Select level —",
}: {
  value: string;
  onChange: (v: ArabicLevel | "") => void;
  hasError: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ArabicLevel | "")}
      required={required}
      className={`${inputClass(hasError)} appearance-none`}
    >
      <option value="">{placeholder}</option>
      {LEVELS.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
    hasError
      ? "border-red-300 bg-red-50"
      : "border-gray-200 bg-white hover:border-primary-300"
  }`;
}
