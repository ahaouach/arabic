import type { TextSection } from "@/lib/lessonSections";

export default function TextBlock({ section }: { section: TextSection }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      {section.title && (
        <h3 className="mb-3 text-xl font-black text-gray-900" dir="auto">
          {section.title}
        </h3>
      )}
      <p
        className="whitespace-pre-line text-base leading-relaxed text-gray-700"
        dir="auto"
      >
        {section.body}
      </p>
    </div>
  );
}
