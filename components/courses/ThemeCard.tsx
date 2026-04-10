import Link from "next/link";
import type { ThemeViewModel } from "@/lib/courses-db";

interface ThemeCardProps {
  theme: ThemeViewModel;
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  return (
    <Link
      href={`/dashboard/courses/${encodeURIComponent(theme.slug)}`}
      className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <div className={`h-28 bg-gradient-to-br ${theme.accent} flex items-center justify-center`}>
        <span className="text-5xl text-white drop-shadow-sm" aria-hidden="true">
          {theme.icon}
        </span>
      </div>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900">{theme.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{theme.description}</p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
          View Courses
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
