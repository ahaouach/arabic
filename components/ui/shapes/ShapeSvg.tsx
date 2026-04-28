"use client";

import type { ArabicShape } from "@/lib/types/shapesLesson.types";

export interface ShapeSvgProps {
  /** The shape to render. `svgPath` + `viewBox` come from DB, both Zod-validated. */
  shape: ArabicShape;
  /** Fill colour — pass `null` or `"none"` for an outline-only "to be coloured" state. */
  fill?: string | null;
  /** Stroke colour. Defaults to a soft dark grey. */
  stroke?: string;
  /** Stroke width in user units (viewBox space). */
  strokeWidth?: number;
  /** Extra classes on the root `<svg>`. Width/height come from parent. */
  className?: string;
  /** Accessibility: when omitted the SVG is decorative (aria-hidden). */
  ariaLabel?: string;
}

/**
 * Recolourable SVG atom. The DB-validated `svgPath` and `viewBox` are
 * handed to React's `<path d={...}>` / `<svg viewBox={...}>` — never via
 * `dangerouslySetInnerHTML`, so there is no XSS surface even if a row
 * is edited directly in Prisma Studio.
 */
export default function ShapeSvg({
  shape,
  fill = null,
  stroke = "#1f2937",
  strokeWidth = 3,
  className,
  ariaLabel,
}: ShapeSvgProps) {
  const hasFill = fill != null && fill !== "none";
  const roleProps = ariaLabel
    ? { role: "img" as const, "aria-label": ariaLabel }
    : { "aria-hidden": true as const };

  return (
    <svg
      viewBox={shape.viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      {...roleProps}
    >
      <path
        d={shape.svgPath}
        fill={hasFill ? fill : "none"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
