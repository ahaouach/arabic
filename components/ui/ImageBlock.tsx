import type { ImageSection } from "@/lib/lessonSections";

export default function ImageBlock({ section }: { section: ImageSection }) {
  return (
    <figure className="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-fuchsia-100 p-6 shadow-lg ring-1 ring-black/5 sm:p-10">
      <div className="flex flex-col items-center">
        {section.url ? (
          // Plain <img> — URL is validated to be an internal path,
          // so there is no SSRF / external-content risk.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={section.url}
            alt={section.alt ?? section.caption ?? ""}
            className="max-h-64 w-auto rounded-2xl shadow-inner"
          />
        ) : null}

        {section.letter && (
          <div
            className="mt-2 text-8xl font-black text-gray-900 drop-shadow-sm"
            aria-label={section.alt ?? section.letter}
            dir="auto"
          >
            {section.letter}
          </div>
        )}

        {section.caption && (
          <figcaption className="mt-4 text-sm font-medium text-gray-600" dir="auto">
            {section.caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
