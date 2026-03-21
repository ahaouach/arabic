const COURSES = [
  { title: "Arabic Level 1", students: 6, schedule: "Mon & Wed 17h00", status: "Active" },
  { title: "Arabic Level 2", students: 4, schedule: "Tue & Thu 16h00", status: "Active" },
  { title: "Arabic Level 3", students: 5, schedule: "Mon & Wed 18h00", status: "Active" },
  { title: "Arabic Level 5", students: 3, schedule: "Fri 15h00", status: "Active" },
  { title: "Quran Level 1", students: 4, schedule: "Sat 10h00", status: "Active" },
  { title: "Quran Level 2", students: 2, schedule: "Sat 11h30", status: "Starting soon" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "Starting soon": "bg-amber-100 text-amber-700",
};

export default function CoursesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 mt-1">All active and upcoming courses.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + New Course
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {COURSES.map((c) => (
          <div key={c.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-semibold text-gray-900">{c.title}</h2>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                {c.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-medium text-gray-700">{c.students}</span> students enrolled
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Schedule:</span> {c.schedule}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
