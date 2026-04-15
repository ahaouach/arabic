export default function Loading() {
  return (
    <div className="relative min-h-full overflow-hidden p-6 sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50"
      />

      <div className="mx-auto max-w-6xl">
        <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200" />

        <div className="mt-6 h-48 w-full animate-pulse rounded-[36px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />

        <div className="mt-10 h-5 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-full bg-gray-200" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-40 animate-pulse rounded-3xl border-2 border-dashed border-gray-200 bg-white/70"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
