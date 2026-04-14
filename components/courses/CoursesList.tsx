import Link from "next/link";
import type { CourseViewModel } from "@/lib/courses-db";
import CourseCard from "./CourseCard";

interface CoursesListProps {
  /**
   * Each entry must carry both the cuid `id` (for the React key) and the
   * URL `slug` (e.g. `level-1`). Courses without a slug are skipped from
   * the linked grid since they cannot resolve to a valid URL.
   */
  courses: (CourseViewModel & { slug?: string | null })[];
  themeSlug: string;
}

export default function CoursesList({ courses, themeSlug }: CoursesListProps) {
  const linkable = courses.filter((c) => !!c.slug);

  if (linkable.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No levels available for this theme yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {linkable.map((course) => (
        <Link
          key={course.id}
          href={`/dashboard/courses/${encodeURIComponent(themeSlug)}/${encodeURIComponent(course.slug as string)}`}
          className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <CourseCard course={course} />
        </Link>
      ))}
    </div>
  );
}
