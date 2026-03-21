import type { Lesson, LessonStatus, ScheduleChild } from "@/lib/useSchedule";

const STATUS_CONFIG: Record<LessonStatus, { label: string; classes: string; dot: string }> = {
  scheduled:  { label: "Scheduled",  classes: "bg-blue-50 text-blue-700 border border-blue-200",    dot: "bg-blue-400"  },
  completed:  { label: "Completed",  classes: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-400" },
  cancelled:  { label: "Cancelled",  classes: "bg-gray-100 text-gray-400 border border-gray-200",   dot: "bg-gray-300"  },
};

const PROGRAM_CONFIG = {
  Arabic: { label: "Arabic", classes: "bg-primary-50 text-primary-700" },
  Quran:  { label: "Quran",  classes: "bg-amber-50 text-amber-700"    },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

interface LessonCardProps {
  lesson: Lesson;
  children: ScheduleChild[];
  onCancel?: (id: string) => void;
}

export default function LessonCard({ lesson, children, onCancel }: LessonCardProps) {
  const cfg = STATUS_CONFIG[lesson.status];
  const programCfg = PROGRAM_CONFIG[lesson.program];
  const isPast = lesson.status !== "scheduled";

  const childNames = lesson.childrenIds
    .map((id) => {
      const c = children.find((ch) => ch.id === id);
      return c ? `${c.firstName} ${c.lastName}` : "Unknown";
    })
    .join(", ");

  return (
    <div className={`bg-white rounded-xl border p-4 transition-all ${isPast ? "border-gray-100 opacity-70" : "border-gray-200 shadow-sm hover:shadow-md"}`}>
      {/* Top row: program badge + status badge + cancel */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${programCfg.classes}`}>
            {programCfg.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
        {lesson.status === "scheduled" && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(lesson.id)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0 px-2 py-0.5 rounded hover:bg-red-50"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Date & time */}
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-semibold text-gray-900">
          {formatDate(lesson.date)} · {lesson.time}
        </span>
      </div>

      {/* Teacher */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${lesson.teacher.colorClass}`}>
          {lesson.teacher.initials[0]}
        </div>
        <span className="text-sm text-gray-600">{lesson.teacher.name}</span>
      </div>

      {/* Children */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-sm text-gray-600 truncate">{childNames}</span>
      </div>
    </div>
  );
}
