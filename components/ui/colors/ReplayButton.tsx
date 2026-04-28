"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface ReplayButtonProps {
  onClick: () => void;
  /** Vowelized Arabic label. Default `"أَعِدْ مَرَّةً أُخْرَى"`. */
  label?: string;
  /** Short visual size. */
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}

const SIZE_CLS: Record<NonNullable<ReplayButtonProps["size"]>, string> = {
  sm: "min-h-12 px-5 py-2 text-sm",
  md: "min-h-16 px-6 py-3 text-base",
};

/**
 * Re-randomize button shared by every zone. Keeps the Arabic label
 * vowelized and uses `<bdi>` only if the label ever holds numerals
 * (not today, but safe).
 */
export default function ReplayButton({
  onClick,
  label = "أَعِدْ مَرَّةً أُخْرَى",
  size = "md",
  className = "",
  disabled = false,
}: ReplayButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={
        prefersReducedMotion ? undefined : { y: -2, scale: 1.04 }
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      aria-label="Replay with new content"
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70 disabled:cursor-not-allowed disabled:opacity-40 ${SIZE_CLS[size]} ${className}`}
    >
      <span aria-hidden>🔄</span>
      <span
        lang="ar"
        dir="rtl"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
      >
        {label}
      </span>
    </motion.button>
  );
}
