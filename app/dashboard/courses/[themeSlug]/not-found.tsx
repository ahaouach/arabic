import Link from "next/link";

export default function ThemeNotFound() {
  return (
    <div className="relative min-h-full overflow-hidden p-6 sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[36px] bg-white/80 p-10 text-center shadow-xl ring-1 ring-black/5 backdrop-blur">
        <div className="text-7xl" aria-hidden>
          🗺️
        </div>
        <h1 className="mt-4 text-3xl font-black text-gray-900">Theme not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find this adventure. It may have moved, or it doesn&apos;t exist yet.
        </p>
        <Link
          href="/dashboard/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <span aria-hidden>←</span> Back to themes
        </Link>
      </div>
    </div>
  );
}
