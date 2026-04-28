"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ScoreTrackerProps {
  completed: number;
  total: number;
  labelAr?: string;
  accent?: "violet" | "emerald" | "sky";
}

const ACCENT_STYLES: Record<NonNullable<ScoreTrackerProps["accent"]>, string> = {
  violet: "from-violet-500 to-fuchsia-500",
  emerald: "from-emerald-500 to-teal-500",
  sky: "from-sky-500 to-indigo-500",
};

/** Compact "completed / total ⭐" pill with a gradient progress bar. */
export default function ScoreTracker({
  completed,
  total,
  labelAr = "التَّقَدُّمُ",
  accent = "violet",
}: ScoreTrackerProps) {
  const prefersReducedMotion = useReducedMotion();
  const safeTotal = Math.max(1, total);
  const pct = Math.min(100, Math.max(0, (completed / safeTotal) * 100));

  return (
    <div
      className="flex min-w-[12rem] flex-col gap-1 rounded-2xl bg-white/90 p-3 shadow-md ring-1 ring-gray-100"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-bold text-gray-700"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          dir="rtl"
          lang="ar"
        >
          {labelAr}
        </span>
        <span
          className="text-sm font-black tabular-nums text-gray-900"
          style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
        >
          {completed} / {total} ⭐
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${ACCENT_STYLES[accent]}`}
          initial={prefersReducedMotion ? { width: `${pct}%` } : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 180, damping: 22 }
          }
          aria-hidden
        />
      </div>
    </div>
  );
}
