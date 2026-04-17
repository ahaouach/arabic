import type { AriaAttributes, ReactNode } from "react";

/**
 * Accessibility-friendly chip / badge.
 *
 * Enforces a minimum tap-target height (40 px for `sm`, 48 px for `md`)
 * so score counters and status badges never drop below 44 px. Use this
 * instead of ad-hoc `text-xs px-3 py-1` patterns.
 */

export type ChipSize = "sm" | "md";
export type ChipTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "accent";

const SIZE_MAP: Record<ChipSize, string> = {
  sm: "min-h-10 gap-1 px-3 py-1.5 text-xs",
  md: "min-h-12 gap-1.5 px-4 py-2 text-sm",
};

const TONE_MAP: Record<ChipTone, string> = {
  neutral: "bg-white text-gray-800 ring-1 ring-black/5",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  accent: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200",
};

export interface ChipProps extends Pick<AriaAttributes, "aria-live" | "aria-label"> {
  size?: ChipSize;
  tone?: ChipTone;
  className?: string;
  children: ReactNode;
}

export default function Chip({
  size = "sm",
  tone = "neutral",
  className = "",
  children,
  "aria-live": ariaLive,
  "aria-label": ariaLabel,
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-black shadow ${SIZE_MAP[size]} ${TONE_MAP[tone]} ${className}`.trim()}
      aria-live={ariaLive}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
}
