"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ShapeKind } from "@/lib/types/colorsLesson.types";

export interface ColoredShapeProps {
  /** Shape to draw. One of the 10 `SHAPE_KINDS`. */
  kind: ShapeKind;
  /** Hex colour fill — validated upstream by Zod (cannot inject CSS). */
  fill: string;
  /** Selection / validation status. */
  status?: "idle" | "selected" | "correct" | "wrong" | "missed";
  /** Disable pointer + focus. */
  disabled?: boolean;
  /** Arabic ARIA label (e.g. "قَلْبٌ أَحْمَرُ"). */
  ariaLabel: string;
  onClick?: () => void;
  /** Stagger index for entrance animation. */
  index?: number;
}

/**
 * Inline-SVG coloured shape atom used by `PickObjectsZone`. Each `kind`
 * has a hand-tuned path on a 100×100 viewBox; `fill` is applied dynamically
 * so the same markup serves every palette colour.
 *
 * Selection / validation states:
 *   - `selected`  → gray-900 ring (user picked it)
 *   - `correct`   → emerald ring + ✓ badge
 *   - `wrong`     → rose ring + ✕ badge (wrongly picked)
 *   - `missed`    → amber dashed ring (target that wasn't picked)
 */
export default function ColoredShape({
  kind,
  fill,
  status = "idle",
  disabled = false,
  ariaLabel,
  onClick,
  index = 0,
}: ColoredShapeProps) {
  const prefersReducedMotion = useReducedMotion();
  const interactive = typeof onClick === "function";

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : status === "missed"
          ? "ring-4 ring-amber-400 ring-dashed"
          : status === "selected"
            ? "ring-4 ring-gray-900"
            : "ring-1 ring-black/5";

  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;
  const celebrate =
    status === "correct" && !prefersReducedMotion
      ? { scale: [1, 1.1, 1] }
      : undefined;
  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [12, 0] };

  const transition =
    shake || celebrate
      ? { duration: 0.45, ease: "easeInOut" as const }
      : {
          delay: index * 0.03,
          type: "spring" as const,
          stiffness: 220,
          damping: 22,
        };

  const body = (
    <>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-hidden
      >
        <ShapePath kind={kind} fill={fill} />
      </svg>
      {status === "correct" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm text-white shadow-lg"
        >
          ✓
        </span>
      )}
      {status === "wrong" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm text-white shadow-lg"
        >
          ✕
        </span>
      )}
      {status === "missed" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm text-gray-900 shadow-lg"
        >
          !
        </span>
      )}
    </>
  );

  const baseCls = `relative flex aspect-square min-h-16 min-w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-md transition-shadow ${ring}`;

  if (!interactive) {
    return (
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={baseCls}
      >
        {body}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={status === "selected"}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        !disabled && !prefersReducedMotion ? { y: -3, scale: 1.05 } : undefined
      }
      whileTap={
        !disabled && !prefersReducedMotion ? { scale: 0.94 } : undefined
      }
      transition={transition}
      className={`${baseCls} ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"}`}
    >
      {body}
    </motion.button>
  );
}

function ShapePath({ kind, fill }: { kind: ShapeKind; fill: string }) {
  const stroke = "rgba(0,0,0,0.15)";
  const strokeWidth = 1.5;
  const common = { fill, stroke, strokeWidth, strokeLinejoin: "round" as const };

  switch (kind) {
    case "circle":
      return <circle cx="50" cy="50" r="42" {...common} />;
    case "square":
      return (
        <rect x="10" y="10" width="80" height="80" rx="12" ry="12" {...common} />
      );
    case "triangle":
      return <polygon points="50,10 92,86 8,86" {...common} />;
    case "heart":
      return (
        <path
          d="M50 86 C 18 64 8 44 20 28 C 30 16 46 18 50 32 C 54 18 70 16 80 28 C 92 44 82 64 50 86 Z"
          {...common}
        />
      );
    case "star":
      return (
        <polygon
          points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38"
          {...common}
        />
      );
    case "flower":
      return (
        <g>
          <circle cx="50" cy="20" r="14" {...common} />
          <circle cx="80" cy="40" r="14" {...common} />
          <circle cx="70" cy="75" r="14" {...common} />
          <circle cx="30" cy="75" r="14" {...common} />
          <circle cx="20" cy="40" r="14" {...common} />
          <circle cx="50" cy="50" r="12" fill="#FDE68A" stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );
    case "apple":
      return (
        <g>
          <path
            d="M50 30 C 30 30 18 44 18 60 C 18 78 34 92 50 92 C 66 92 82 78 82 60 C 82 44 70 30 50 30 Z"
            {...common}
          />
          <path
            d="M50 30 C 50 22 52 16 58 12"
            fill="none"
            stroke="#78350F"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M52 24 C 60 18 70 22 72 28 C 62 30 55 28 52 24 Z"
            fill="#16A34A"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    case "balloon":
      return (
        <g>
          <path
            d="M50 14 C 30 14 22 32 22 46 C 22 62 36 74 48 76 L 48 82 L 52 82 L 52 76 C 64 74 78 62 78 46 C 78 32 70 14 50 14 Z"
            {...common}
          />
          <polygon points="48,82 52,82 50,86" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <path
            d="M50 86 C 46 90 54 92 50 96"
            fill="none"
            stroke="#4B5563"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </g>
      );
    case "car":
      return (
        <g>
          <path
            d="M10 62 L 10 50 L 24 38 L 74 38 L 86 50 L 92 50 L 92 62 Z"
            {...common}
          />
          <rect x="26" y="42" width="20" height="14" rx="2" fill="#DBEAFE" stroke={stroke} strokeWidth={strokeWidth} />
          <rect x="50" y="42" width="20" height="14" rx="2" fill="#DBEAFE" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="26" cy="66" r="8" fill="#1F2937" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="74" cy="66" r="8" fill="#1F2937" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="26" cy="66" r="3" fill="#9CA3AF" />
          <circle cx="74" cy="66" r="3" fill="#9CA3AF" />
        </g>
      );
    case "ball":
      return (
        <g>
          <circle cx="50" cy="50" r="42" {...common} />
          <polygon
            points="50,30 64,40 58,56 42,56 36,40"
            fill="rgba(0,0,0,0.35)"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={1}
          />
          <path
            d="M50 30 L 50 14 M 64 40 L 78 34 M 58 56 L 68 72 M 42 56 L 32 72 M 36 40 L 22 34"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
