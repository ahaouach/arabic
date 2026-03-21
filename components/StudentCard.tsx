import type { Student, ArabicLevel } from "@/lib/types";

const LEVEL_STYLES: Record<ArabicLevel, string> = {
  Beginner: "bg-blue-100 text-blue-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-green-100 text-green-700",
};

const AVATAR_PALETTES = [
  "bg-primary-100 text-primary-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
];

function avatarColor(name: string): string {
  return AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];
}

function LevelBadge({ label, level }: { label: string; level?: ArabicLevel }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="text-gray-400 font-normal">{label}:</span>
      <span className={`px-1.5 py-0.5 rounded font-medium ${LEVEL_STYLES[level]}`}>
        {level}
      </span>
    </span>
  );
}

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export default function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const { firstName, lastName, age, arabicLevel, notes } = student;
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(firstName)}`}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">{fullName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Age {age}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(student)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              aria-label={`Edit ${fullName}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(student)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label={`Remove ${fullName}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Level badges */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          <LevelBadge label="Reading" level={arabicLevel.reading} />
          <LevelBadge label="Writing" level={arabicLevel.writing} />
          <LevelBadge label="Speaking" level={arabicLevel.speaking} />
        </div>

        {/* Notes */}
        {notes && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">&ldquo;{notes}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
