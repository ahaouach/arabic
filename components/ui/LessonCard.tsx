"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LevelBadge from "./LevelBadge";
import type { LessonLevel } from "@/lib/lessonLevel";

export interface LessonCardProps {
  id: string;
  title: string;
  slug: string;
  themeSlug: string;
  level: LessonLevel;
  icon?: string | null;
  description?: string | null;
  isLocked?: boolean;
  index?: number;
}

export default function LessonCard({
  title,
  slug,
  themeSlug,
  level,
  icon,
  description,
  isLocked = false,
  index = 0,
}: LessonCardProps) {
  const href = `/dashboard/courses/${encodeURIComponent(themeSlug)}/${encodeURIComponent(slug)}`;

  const body = (
    <>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-200 to-pink-200 opacity-40 blur-2xl transition-opacity group-hover:opacity-80" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-3xl shadow-inner">
          {icon ?? "📘"}
        </div>
        <LevelBadge level={level} size="sm" />
      </div>

      <h3 className="relative mt-4 text-base font-black text-gray-900" dir="auto">
        {title}
      </h3>
      {description ? (
        <p className="relative mt-1 line-clamp-2 text-xs font-medium text-gray-500" dir="auto">
          {description}
        </p>
      ) : (
        <p className="relative mt-1 text-xs font-medium text-gray-500">
          {isLocked ? "Locked for now" : "Tap to start this lesson"}
        </p>
      )}

      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex -space-x-1" aria-hidden>
          <span className="text-lg">⭐</span>
          <span className="text-lg opacity-60">⭐</span>
          <span className="text-lg opacity-30">⭐</span>
        </div>
        <span
          aria-hidden
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white ${
            isLocked ? "bg-gray-400" : "bg-gray-900"
          }`}
        >
          {isLocked ? "🔒 Locked" : "Play →"}
        </span>
      </div>
    </>
  );

  const shared =
    "relative block overflow-hidden rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5 transition-shadow";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={!isLocked ? { y: -6, rotate: -0.5 } : undefined}
      className="group"
    >
      {isLocked ? (
        <div
          aria-disabled
          className={`${shared} cursor-not-allowed opacity-70`}
        >
          {body}
        </div>
      ) : (
        <Link
          href={href}
          aria-label={`Open lesson ${title}`}
          className={`${shared} hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70`}
        >
          {body}
        </Link>
      )}
    </motion.div>
  );
}
