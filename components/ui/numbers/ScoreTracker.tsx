"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface ScoreTrackerProps {
  /** Index of the current zone (0-based). */
  zoneIndex: number;
  /** Total number of zones. */
  totalZones: number;
  /** Fully-vowelized zone title, optional. */
  zoneTitle?: string;
  /** Star/xp counter. */
  stars: number;
  /** Sticky to the top of its scrolling container. Default true. */
  sticky?: boolean;
}

/**
 * Sticky progress header for the numbers lesson.
 *
 * Shows "الْمِنْطَقَةُ N مِنْ M" (Zone N of M), optional zone title, a
 * gradient progress bar, and a live star counter.
 *
 * Arabic ordinals use the full form with harakat; Western digits for N
 * and M stay LTR inside an inline `<bdi dir="ltr">` so they render in
 * natural reading order regardless of the parent RTL container.
 */
export default function ScoreTracker({
  zoneIndex,
  totalZones,
  zoneTitle,
  stars,
  sticky = true,
}: ScoreTrackerProps) {
  const prefersReducedMotion = useReducedMotion();
  const safeTotal = Math.max(1, totalZones);
  const pct = Math.min(100, Math.round(((zoneIndex + 1) / safeTotal) * 100));

  return (
    <div
      className={`${
        sticky ? "sticky top-0 z-10" : ""
      } w-full rounded-3xl bg-white/90 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-xs font-black uppercase tracking-widest text-sky-600"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            الْمِنْطَقَةُ{" "}
            <bdi dir="ltr" className="tabular-nums">
              {zoneIndex + 1}
            </bdi>{" "}
            مِنْ{" "}
            <bdi dir="ltr" className="tabular-nums">
              {safeTotal}
            </bdi>
          </p>
          {zoneTitle && (
            <h2
              className="mt-1 truncate text-lg font-black text-gray-900 sm:text-xl"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {zoneTitle}
            </h2>
          )}
        </div>

        <div
          className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-700 shadow ring-1 ring-amber-200"
          aria-label={`${stars} stars earned`}
        >
          <motion.span
            aria-hidden
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ⭐
          </motion.span>
          <span className="tabular-nums">{stars}</span>
        </div>
      </div>

      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Lesson progress"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 18 }
          }
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-500 to-amber-400"
        />
      </div>
    </div>
  );
}
