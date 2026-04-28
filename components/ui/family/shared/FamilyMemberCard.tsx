"use client";

import { motion, useReducedMotion } from "framer-motion";
import FamilyMemberRenderer from "./FamilyMemberRenderer";
import type { FamilyMember } from "@/lib/types/familyLesson.types";

export type FamilyMemberCardStatus = "idle" | "selected" | "correct" | "wrong" | "locked";

interface FamilyMemberCardProps {
  member: FamilyMember;
  status?: FamilyMemberCardStatus;
  onClick?: () => void;
  /** Stagger / entrance delay, in index units. */
  index?: number;
  /** Shorter card, no transliteration — used in grid-y zones. */
  compact?: boolean;
  /** Render the SVG in outlined (grey) state. */
  outlined?: boolean;
  /** Dynamic fill applied to the SVG's recolourable region. */
  fillColor?: string;
  /** Visual size preset for the inner SVG. */
  svgSize?: number;
  /** Optional secondary caption (e.g. transliteration override). */
  captionOverride?: string | null;
  /** Disable all interactivity. Defaults to `true` when no `onClick`. */
  disabled?: boolean;
}

/**
 * Reusable card for a family member: SVG illustration + vowelised name.
 *
 * Visual states:
 *   - idle:     white card, subtle shadow
 *   - selected: purple ring (user picked it, awaiting validation)
 *   - correct:  emerald ring + ✓ badge
 *   - wrong:    rose ring + ✕ badge + shake
 *   - locked:   dimmed, no hover (already matched / disabled)
 *
 * The card is RTL-aware for its Arabic caption; the SVG keeps its own
 * natural direction (character faces forward regardless of page dir).
 */
export default function FamilyMemberCard({
  member,
  status = "idle",
  onClick,
  index = 0,
  compact = false,
  outlined = false,
  fillColor,
  svgSize,
  captionOverride,
  disabled,
}: FamilyMemberCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const interactive = !disabled && typeof onClick === "function" && status !== "locked";

  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-500"
      : status === "wrong"
        ? "ring-4 ring-rose-500"
        : status === "selected"
          ? "ring-4 ring-violet-500"
          : status === "locked"
            ? "ring-2 ring-gray-200"
            : "ring-2 ring-gray-200 hover:ring-violet-300";

  const shake =
    status === "wrong" && !prefersReducedMotion
      ? { x: [0, -6, 6, -4, 4, 0] }
      : undefined;
  const celebrate =
    status === "correct" && !prefersReducedMotion
      ? { scale: [1, 1.08, 1] }
      : undefined;
  const entrance = prefersReducedMotion
    ? undefined
    : { opacity: [0, 1], y: [16, 0] };

  const transition =
    shake || celebrate
      ? { duration: 0.45, ease: "easeInOut" as const }
      : {
          delay: index * 0.05,
          type: "spring" as const,
          stiffness: 240,
          damping: 22,
        };

  return (
    <motion.button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      aria-label={member.nameAr}
      aria-pressed={status === "selected" || status === "correct"}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shake ?? celebrate ?? entrance}
      whileHover={
        interactive && !prefersReducedMotion
          ? { y: -4, scale: 1.03 }
          : undefined
      }
      whileTap={interactive && !prefersReducedMotion ? { scale: 0.97 } : undefined}
      transition={transition}
      className={`relative flex flex-col items-center gap-3 rounded-3xl bg-white p-4 shadow-md transition-shadow ${
        interactive
          ? "hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70 cursor-pointer"
          : "opacity-90 cursor-default"
      } ${status === "locked" ? "opacity-60" : ""} ${ring}`}
    >
      <div className="flex items-center justify-center">
        <FamilyMemberRenderer
          svgKey={member.svgComponent}
          size={svgSize ?? (compact ? 96 : 140)}
          outlined={outlined}
          fillColor={fillColor}
          aria-label={member.nameAr}
        />
      </div>

      <div className="flex flex-col items-center gap-0.5" dir="rtl" lang="ar">
        <span
          className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} font-black text-gray-900 leading-tight`}
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          {member.nameAr}
        </span>
        {!compact && captionOverride !== null && (
          <span
            className="text-sm text-gray-500"
            style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
            dir="ltr"
          >
            {captionOverride ?? member.transliteration}
          </span>
        )}
      </div>

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
    </motion.button>
  );
}
