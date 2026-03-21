import type { Homework, HomeworkStatus } from "@/lib/useHomework";

const STATUS_CONFIG: Record<
  HomeworkStatus | "overdue",
  { label: string; classes: string; dot: string }
> = {
  pending:   { label: "To Submit",  classes: "bg-amber-50 text-amber-700 border border-amber-200",   dot: "bg-amber-400" },
  submitted: { label: "Submitted",  classes: "bg-blue-50 text-blue-700 border border-blue-200",      dot: "bg-blue-400" },
  reviewed:  { label: "Reviewed",   classes: "bg-green-50 text-green-700 border border-green-200",   dot: "bg-green-400" },
  overdue:   { label: "Overdue",    classes: "bg-red-50 text-red-700 border border-red-200",         dot: "bg-red-400" },
};

function getEffectiveStatus(hw: Homework): HomeworkStatus | "overdue" {
  if (hw.status === "pending" && new Date(hw.dueDate) < new Date()) return "overdue";
  return hw.status;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string): string {
  const diff = Math.ceil(
    (new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
      86_400_000
  );
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""} overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `${diff} days left`;
}

interface HomeworkCardProps {
  homework: Homework;
  selected: boolean;
  onClick: () => void;
}

export default function HomeworkCard({ homework, selected, onClick }: HomeworkCardProps) {
  const effectiveStatus = getEffectiveStatus(homework);
  const cfg = STATUS_CONFIG[effectiveStatus];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${
        selected
          ? "bg-primary-50 border-primary-300 shadow-sm"
          : "bg-white border-gray-100 hover:border-primary-200 hover:shadow-sm"
      }`}
    >
      {/* Course tag */}
      <p className="text-xs font-medium text-primary-600 mb-1">{homework.course}</p>

      {/* Title */}
      <p className={`text-sm font-semibold leading-snug mb-2 ${selected ? "text-primary-900" : "text-gray-900"}`}>
        {homework.title}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.classes}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>

        {/* Due date */}
        <span className={`text-xs ${effectiveStatus === "overdue" ? "text-red-500 font-medium" : "text-gray-400"}`}>
          {effectiveStatus === "reviewed"
            ? `Due ${formatDate(homework.dueDate)}`
            : daysUntil(homework.dueDate)}
        </span>
      </div>
    </button>
  );
}
