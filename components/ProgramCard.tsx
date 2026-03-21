interface ProgramCardProps {
  level: number | string;
  title: string;
  description: string;
  goals: readonly string[];
  accentColor?: "primary" | "accent" | "purple";
  badge?: string;
}

const COLOR_MAP = {
  primary: {
    bg: "bg-primary-50",
    border: "border-primary-200",
    badge: "bg-primary-100 text-primary-700 border-primary-200",
    levelBg: "bg-primary-600",
    dot: "bg-primary-400",
    hover: "hover:border-primary-400",
  },
  accent: {
    bg: "bg-accent-50",
    border: "border-accent-200",
    badge: "bg-accent-100 text-accent-700 border-accent-200",
    levelBg: "bg-accent-500",
    dot: "bg-accent-400",
    hover: "hover:border-accent-400",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    levelBg: "bg-purple-600",
    dot: "bg-purple-400",
    hover: "hover:border-purple-400",
  },
} as const;

export default function ProgramCard({
  level,
  title,
  description,
  goals,
  accentColor = "primary",
  badge,
}: ProgramCardProps) {
  const c = COLOR_MAP[accentColor];

  return (
    <article
      className={`${c.bg} ${c.border} ${c.hover} border rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-md group`}
      aria-label={`${title} program card`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        {/* Level bubble */}
        <div
          className={`${c.levelBg} text-white text-xs font-bold w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
          aria-label={`Level ${level}`}
        >
          {level}
        </div>

        {badge && (
          <span
            className={`${c.badge} border text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-800 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Goals list */}
      <ul className="flex flex-col gap-1.5 mt-auto" role="list" aria-label="Learning goals">
        {goals.map((goal) => (
          <li key={goal} className="flex items-start gap-2 text-sm text-gray-700">
            <span
              className={`${c.dot} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}
              aria-hidden="true"
            />
            {goal}
          </li>
        ))}
      </ul>
    </article>
  );
}
