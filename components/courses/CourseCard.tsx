import type { CourseViewModel } from "@/lib/courses-db";

interface CourseCardProps {
  course: CourseViewModel;
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const DEFAULT_LEVEL_COLOR = "bg-gray-100 text-gray-700";

/**
 * SECURITY: All fields are rendered as plain text children of JSX elements.
 * React auto-escapes these, preventing stored-XSS even though the values
 * come from the database. Never introduce `dangerouslySetInnerHTML` here.
 */
export default function CourseCard({ course }: CourseCardProps) {
  const badgeClass = LEVEL_COLORS[course.level] ?? DEFAULT_LEVEL_COLOR;

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{course.title}</h3>
        {course.level && (
          <span
            className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {course.level}
          </span>
        )}
      </div>
      {course.description && (
        <p className="mb-4 text-sm text-gray-600">{course.description}</p>
      )}
      {course.duration && (
        <div className="flex items-center text-xs text-gray-500">
          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{course.duration}</span>
        </div>
      )}
    </article>
  );
}
