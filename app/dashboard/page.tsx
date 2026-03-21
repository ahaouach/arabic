import { cookies } from "next/headers";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";

const STATS = [
  {
    label: "Total Students",
    value: "24",
    change: "+3 this month",
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Courses",
    value: "6",
    change: "2 starting soon",
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Upcoming Lessons",
    value: "3",
    change: "Next: today 17h00",
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Hours This Week",
    value: "12",
    change: "Goal: 15h",
    positive: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-purple-50 text-purple-600",
  },
];

const typeStyles = {
  success: "bg-green-100 text-green-600",
  info: "bg-blue-100 text-blue-600",
  warning: "bg-amber-100 text-amber-600",
};

const RECENT_ACTIVITY: { text: string; time: string; type: keyof typeof typeStyles }[] = [
  { text: "Ahmed completed Level 2 Arabic", time: "2h ago", type: "success" },
  { text: "New registration: Sara M.", time: "4h ago", type: "info" },
  { text: "Homework submitted by Level 3 group", time: "Yesterday", type: "success" },
  { text: "Youssef missed scheduled lesson", time: "Yesterday", type: "warning" },
  { text: "New message from parent (Karim B.)", time: "2 days ago", type: "info" },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;
  const user = token ? await verifyToken(token) : null;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName} 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your academy today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-xs mt-1 font-medium ${stat.positive ? "text-green-600" : "text-amber-600"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <ul role="list">
          {RECENT_ACTIVITY.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${typeStyles[item.type].split(" ")[0]}`} />
              <span className="flex-1 text-sm text-gray-700">{item.text}</span>
              <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
