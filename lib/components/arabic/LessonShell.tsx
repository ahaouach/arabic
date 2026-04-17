import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Reusable lesson chrome shared by every orchestrator.
 *
 * Renders the breadcrumb, background slot, optional overlay slot (for
 * confetti), optional header slot (hero or sticky progress tracker),
 * and the main content slot. Does not manage state — orchestrators
 * (`LessonAdventure`, `NumbersLessonPage`, …) pass already-computed
 * children.
 *
 * Server-component friendly (no hooks, no event handlers).
 */

export interface LessonShellProps {
  /** `{ name }` is the URL slug, `{ title }` the breadcrumb label. */
  theme: { name: string; title: string };
  /** Lesson title, shown in the breadcrumb. */
  lessonTitle: string;
  /** Background layer (e.g. `<NumbersBackground />`). Rendered -z-10. */
  background?: ReactNode;
  /** Overlay layer (e.g. `<Confetti trigger={…} />`). Rendered on top. */
  overlay?: ReactNode;
  /** Slot above `children` — typically `<ScoreTracker />` or a hero. */
  header?: ReactNode;
  /** Main lesson content. */
  children: ReactNode;
  /** Override the max width of the content column. Default `max-w-5xl`. */
  maxWidthClass?: string;
}

export default function LessonShell({
  theme,
  lessonTitle,
  background,
  overlay,
  header,
  children,
  maxWidthClass = "max-w-5xl",
}: LessonShellProps) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {background}
      {overlay}

      <nav
        aria-label="Breadcrumb"
        className={`mx-auto ${maxWidthClass} px-6 pt-6 text-sm text-gray-500 sm:px-10`}
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard/courses" className="hover:text-gray-800">
              Courses
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/dashboard/courses/${encodeURIComponent(theme.name)}`}
              className="hover:text-gray-800"
            >
              {theme.title}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li
            aria-current="page"
            className="truncate font-semibold text-gray-800"
            lang="ar"
            dir="auto"
          >
            {lessonTitle}
          </li>
        </ol>
      </nav>

      {header && (
        <div className={`mx-auto mt-4 ${maxWidthClass} px-6 sm:px-10`}>
          {header}
        </div>
      )}

      <main
        className={`mx-auto mt-5 ${maxWidthClass} px-6 pb-24 sm:px-10`}
      >
        {children}
      </main>
    </div>
  );
}
