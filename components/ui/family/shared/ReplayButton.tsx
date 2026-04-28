"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ReplayButtonProps {
  onClick: () => void;
  /** Aria label in Arabic. Defaults to "اسْتَمِعْ مَرَّةً أُخْرَى". */
  ariaLabel?: string;
  /** Button label next to the icon. Set to null to hide. */
  label?: string | null;
  /** Bigger primary variant for round-start replays. */
  size?: "sm" | "md";
  /** Intended purpose — drives the icon. "audio" (🔊) or "round" (🔄). */
  variant?: "audio" | "round";
  disabled?: boolean;
}

/**
 * Shared replay / audio-retrigger button. Consumers decide whether it
 * re-plays audio (variant="audio") or re-generates a round
 * (variant="round"); the icon differs, the interaction contract is the
 * same.
 */
export default function ReplayButton({
  onClick,
  ariaLabel,
  label = null,
  size = "md",
  variant = "audio",
  disabled = false,
}: ReplayButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const defaultAria =
    variant === "round" ? "جَرِّبْ مَرَّةً أُخْرَى" : "اسْتَمِعْ مَرَّةً أُخْرَى";

  const icon = variant === "round" ? "🔄" : "🔊";
  const dims =
    size === "sm"
      ? "h-10 w-10 text-lg"
      : "h-14 min-w-14 px-4 text-2xl";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? defaultAria}
      whileHover={prefersReducedMotion || disabled ? undefined : { scale: 1.05 }}
      whileTap={prefersReducedMotion || disabled ? undefined : { scale: 0.95 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white font-bold text-gray-800 shadow-md ring-2 ring-gray-200 transition-shadow ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:shadow-xl hover:ring-violet-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70"
      } ${dims}`}
    >
      <span aria-hidden>{icon}</span>
      {label && (
        <span
          className="text-base font-bold"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          dir="rtl"
          lang="ar"
        >
          {label}
        </span>
      )}
    </motion.button>
  );
}
