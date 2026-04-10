import type { CourseViewModel } from "@/lib/courses-db";
import CourseCard from "./CourseCard";

interface CoursesListProps {
  courses: CourseViewModel[];
}

export default function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No courses available for this theme yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
