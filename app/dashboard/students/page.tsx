"use client";

import { useState } from "react";
import { useStudents } from "@/lib/useStudents";
import StudentCard from "@/components/StudentCard";
import StudentForm from "@/components/StudentForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Student, StudentFormData } from "@/lib/types";

type Modal =
  | { type: "add" }
  | { type: "edit"; student: Student }
  | { type: "delete"; student: Student }
  | null;

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [modal, setModal] = useState<Modal>(null);

  function handleFormSubmit(data: StudentFormData) {
    if (modal?.type === "add") {
      addStudent(data);
    } else if (modal?.type === "edit") {
      updateStudent(modal.student.id, data);
    }
    setModal(null);
  }

  function handleDeleteConfirm() {
    if (modal?.type === "delete") {
      deleteStudent(modal.student.id);
    }
    setModal(null);
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
            <p className="text-gray-500 mt-1">
              {students.length === 0
                ? "No children added yet."
                : `${students.length} child${students.length > 1 ? "ren" : ""} registered`}
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "add" })}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Child
          </button>
        </div>

        {/* Empty state */}
        {students.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No children yet</h2>
            <p className="text-gray-400 text-sm mb-6">Add your first child to get started.</p>
            <button
              onClick={() => setModal({ type: "add" })}
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Add a Child
            </button>
          </div>
        )}

        {/* Students grid */}
        {students.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={(s) => setModal({ type: "edit", student: s })}
                onDelete={(s) => setModal({ type: "delete", student: s })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <StudentForm
          initialData={modal.type === "edit" ? modal.student : undefined}
          onSubmit={handleFormSubmit}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirmation */}
      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Remove child?"
          message={`This will permanently remove ${modal.student.firstName} ${modal.student.lastName} from your list.`}
          confirmLabel="Remove"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
