"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LessonLevel } from "@/lib/lessonLevel";

export type { LessonLevel } from "@/lib/lessonLevel";
export { LESSON_LEVELS, isLessonLevel } from "@/lib/lessonLevel";

interface LevelStyle {
  label: string;
  icon: string;
  gradient: string;
  ring: string;
  shadow: string;
}

const LEVEL_STYLES: Record<LessonLevel, LevelStyle> = {
  basic: {
    label: "Basic",
    icon: "🌱",
    gradient: "from-green-400 to-emerald-500",
    ring: "ring-emerald-200",
    shadow: "shadow-emerald-400/40",
  },
  intermediate: {
    label: "Intermediate",
    icon: "🚀",
    gradient: "from-amber-400 to-orange-500",
    ring: "ring-amber-200",
    shadow: "shadow-amber-400/40",
  },
  advanced: {
    label: "Advanced",
    icon: "🔥",
    gradient: "from-fuchsia-500 to-rose-500",
    ring: "ring-fuchsia-200",
    shadow: "shadow-fuchsia-500/40",
  },
};

interface LevelBadgeProps {
  level: LessonLevel;
  size?: "sm" | "md";
  animated?: boolean;
  className?: string;
}

export default function LevelBadge({
  level,
  size = "md",
  animated = true,
  className = "",
}: LevelBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const style = LEVEL_STYLES[level];
  const sizeClass =
    size === "sm" ? "text-[11px] px-2.5 py-1 gap-1" : "text-xs px-3 py-1.5 gap-1.5";

  const bounce =
    animated && !prefersReducedMotion
      ? { y: [0, -2, 0], scale: [1, 1.03, 1] }
      : undefined;

  return (
    <motion.span
      role="status"
      aria-label={`Level: ${style.label}`}
      animate={bounce}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className={`inline-flex items-center rounded-full bg-gradient-to-br ${style.gradient} font-bold text-white ring-2 ${style.ring} shadow-lg ${style.shadow} ${sizeClass} ${className}`}
    >
      <span aria-hidden>{style.icon}</span>
      <span>{style.label}</span>
    </motion.span>
  );
}
