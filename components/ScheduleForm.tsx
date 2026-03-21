"use client";

import { useState, useEffect } from "react";
import type {
  Teacher,
  ScheduleChild,
  Program,
  BookingInput,
  TimeSlotInfo,
} from "@/lib/useSchedule";

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({
  step,
  label,
  icon,
}: {
  step: number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {step}
      </span>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <span className="text-gray-400">{icon}</span>
        {label}
      </div>
    </div>
  );
}

// ── 1. Program picker ────────────────────────────────────────────────────────

function ProgramPicker({
  value,
  onChange,
}: {
  value: Program | "";
  onChange: (v: Program) => void;
}) {
  const options: { value: Program; label: string; arabic: string; color: string }[] = [
    { value: "Arabic", label: "Arabic",  arabic: "عربي",   color: "border-primary-300 bg-primary-50 text-primary-700" },
    { value: "Quran",  label: "Quran",   arabic: "قرآن",   color: "border-amber-300 bg-amber-50 text-amber-700"       },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
            value === opt.value
              ? opt.color + " shadow-sm"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="text-xl font-arabic">{opt.arabic}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── 2. Teacher picker ────────────────────────────────────────────────────────

function TeacherSelect({
  teachers,
  selectedProgram,
  value,
  onChange,
}: {
  teachers: Teacher[];
  selectedProgram: Program | "";
  value: string;
  onChange: (id: string) => void;
}) {
  const filtered = selectedProgram
    ? teachers.filter((t) => t.specialities.includes(selectedProgram))
    : teachers;

  return (
    <div className="grid grid-cols-1 gap-2">
      {filtered.map((teacher) => (
        <button
          key={teacher.id}
          type="button"
          onClick={() => onChange(teacher.id)}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all ${
            value === teacher.id
              ? "border-primary-400 bg-primary-50"
              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${teacher.colorClass}`}>
            {teacher.initials}
          </div>
          <div>
            <p className={`text-sm font-semibold ${value === teacher.id ? "text-primary-800" : "text-gray-900"}`}>
              {teacher.name}
            </p>
            <p className="text-xs text-gray-400">{teacher.specialities.join(" · ")}</p>
          </div>
          {value === teacher.id && (
            <svg className="w-5 h-5 text-primary-600 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-3">
          Select a program first to see available teachers.
        </p>
      )}
    </div>
  );
}

// ── 3. Children multi-select ─────────────────────────────────────────────────

function ChildrenMultiSelect({
  children,
  selected,
  onChange,
}: {
  children: ScheduleChild[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  }

  return (
    <div className="space-y-2">
      {children.map((child) => {
        const checked = selected.includes(child.id);
        return (
          <button
            key={child.id}
            type="button"
            onClick={() => toggle(child.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
              checked
                ? "border-primary-400 bg-primary-50"
                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            {/* Checkbox */}
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
              checked ? "bg-primary-600 border-primary-600" : "border-gray-300"
            }`}>
              {checked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </span>
            <div>
              <p className={`text-sm font-semibold ${checked ? "text-primary-800" : "text-gray-900"}`}>
                {child.firstName} {child.lastName}
              </p>
              <p className="text-xs text-gray-400">{child.course}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── 4. Time slot picker ──────────────────────────────────────────────────────

function TimeSlotPicker({
  slots,
  selected,
  onChange,
  disabled,
}: {
  slots: TimeSlotInfo[];
  selected: string;
  onChange: (time: string) => void;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <p className="text-sm text-gray-400 text-center py-3 bg-gray-50 rounded-xl">
        Select a teacher and date to see available slots.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map(({ time, available }) => (
        <button
          key={time}
          type="button"
          disabled={!available}
          onClick={() => available && onChange(time)}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
            selected === time
              ? "bg-primary-600 text-white shadow-sm"
              : available
              ? "bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700"
              : "bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed line-through"
          }`}
          title={!available ? "Slot already taken" : undefined}
        >
          {time}
        </button>
      ))}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

interface FormErrors {
  program?: string;
  teacher?: string;
  children?: string;
  date?: string;
  time?: string;
}

interface ScheduleFormProps {
  teachers: Teacher[];
  children: ScheduleChild[];
  getSlots: (teacherId: string, date: string) => TimeSlotInfo[];
  onSubmit: (input: BookingInput) => void;
}

const EMPTY_FORM = {
  program: "" as Program | "",
  teacherId: "",
  childrenIds: [] as string[],
  date: "",
  time: "",
};

export default function ScheduleForm({
  teachers,
  children,
  getSlots,
  onSubmit,
}: ScheduleFormProps) {
  const [fields, setFields] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const slots =
    fields.teacherId && fields.date
      ? getSlots(fields.teacherId, fields.date)
      : [];

  // Reset time when teacher or date changes
  useEffect(() => {
    setFields((prev) => ({ ...prev, time: "" }));
  }, [fields.teacherId, fields.date]);

  // Reset teacher when program changes
  useEffect(() => {
    setFields((prev) => ({ ...prev, teacherId: "" }));
  }, [fields.program]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!fields.program)             e.program  = "Please select a program.";
    if (!fields.teacherId)           e.teacher  = "Please select a teacher.";
    if (fields.childrenIds.length === 0) e.children = "Please select at least one child.";
    if (!fields.date)                e.date     = "Please pick a date.";
    if (!fields.time)                e.time     = "Please select a time slot.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      teacherId:   fields.teacherId,
      childrenIds: fields.childrenIds,
      program:     fields.program as Program,
      date:        fields.date,
      time:        fields.time,
    });
    setFields(EMPTY_FORM);
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Success banner */}
      {success && (
        <div
          role="status"
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium"
        >
          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Lesson scheduled! You&apos;ll find it in the list on the right.
        </div>
      )}

      {/* Step 1 — Program */}
      <div>
        <SectionLabel step={1} label="Program" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        } />
        <ProgramPicker value={fields.program} onChange={(v) => setFields((p) => ({ ...p, program: v }))} />
        {errors.program && <FieldError>{errors.program}</FieldError>}
      </div>

      {/* Step 2 — Teacher */}
      <div>
        <SectionLabel step={2} label="Teacher" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        } />
        <TeacherSelect
          teachers={teachers}
          selectedProgram={fields.program}
          value={fields.teacherId}
          onChange={(id) => setFields((p) => ({ ...p, teacherId: id }))}
        />
        {errors.teacher && <FieldError>{errors.teacher}</FieldError>}
      </div>

      {/* Step 3 — Children */}
      <div>
        <SectionLabel step={3} label="Children" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        } />
        <ChildrenMultiSelect
          children={children}
          selected={fields.childrenIds}
          onChange={(ids) => setFields((p) => ({ ...p, childrenIds: ids }))}
        />
        {errors.children && <FieldError>{errors.children}</FieldError>}
      </div>

      {/* Step 4 — Date */}
      <div>
        <SectionLabel step={4} label="Date" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        } />
        <input
          type="date"
          min={today}
          value={fields.date}
          onChange={(e) => setFields((p) => ({ ...p, date: e.target.value }))}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors ${
            errors.date ? "border-red-300 bg-red-50" : "border-gray-200 bg-white hover:border-primary-300"
          }`}
        />
        {errors.date && <FieldError>{errors.date}</FieldError>}
      </div>

      {/* Step 5 — Time slot */}
      <div>
        <SectionLabel step={5} label="Time Slot" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        } />
        <TimeSlotPicker
          slots={slots}
          selected={fields.time}
          onChange={(t) => setFields((p) => ({ ...p, time: t }))}
          disabled={!fields.teacherId || !fields.date}
        />
        {errors.time && <FieldError>{errors.time}</FieldError>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Schedule Lesson
      </button>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-500">
      {children}
    </p>
  );
}
