"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArabicShape } from "@/lib/types/shapesLesson.types";

export interface PlacedShape {
  /** Same key as the underlying shape (used to light up "target" shapes in hint mode). */
  shapeKey: string;
  shape: ArabicShape;
  /** Center x/y in the outer viewBox coordinate space. */
  x: number;
  y: number;
  /** Square side in viewBox units. Expected range ≈ 40–80. */
  size: number;
  /** Fill colour — validated upstream (hex regex). */
  fill: string;
}

export interface ScatteredShapesCanvasProps {
  placed: PlacedShape[];
  /** When true, shapes matching `targetKey` pulse gently. */
  hintTargetKey?: string | null;
  /** Outer canvas width in viewBox units. */
  viewWidth?: number;
  viewHeight?: number;
  /** ARIA label for the scene. */
  ariaLabel: string;
}

/**
 * Renders a scene of scattered, non-overlapping shapes on a single
 * outer `<svg>`. Each shape lives in a nested `<svg>` that consumes its
 * own `viewBox`, so a triangle authored in `"0 0 100 100"` space scales
 * cleanly to whatever `size` we placed it at.
 *
 * This component is pure — positions and colours are computed by the
 * caller (see `CountShapesZone`). Keeping the renderer stateless means
 * replays regenerate everything from a fresh seed with no lingering DOM.
 */
export default function ScatteredShapesCanvas({
  placed,
  hintTargetKey = null,
  viewWidth = 400,
  viewHeight = 300,
  ariaLabel,
}: ScatteredShapesCanvasProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50 to-amber-50 shadow-inner ring-1 ring-black/5"
      style={{ aspectRatio: `${viewWidth} / ${viewHeight}` }}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel}
        className="h-full w-full"
      >
        {placed.map((p, i) => {
          const isHinted = hintTargetKey != null && p.shapeKey === hintTargetKey;
          const pulse =
            isHinted && !prefersReducedMotion
              ? { scale: [1, 1.12, 1] }
              : undefined;
          return (
            <motion.g
              key={i}
              initial={
                prefersReducedMotion ? undefined : { opacity: 0, scale: 0.6 }
              }
              animate={pulse ?? { opacity: 1, scale: 1 }}
              transition={
                pulse
                  ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                  : {
                      delay: i * 0.02,
                      type: "spring",
                      stiffness: 240,
                      damping: 20,
                    }
              }
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <svg
                x={p.x - p.size / 2}
                y={p.y - p.size / 2}
                width={p.size}
                height={p.size}
                viewBox={p.shape.viewBox}
                overflow="visible"
              >
                <path
                  d={p.shape.svgPath}
                  fill={p.fill}
                  stroke="#1f2937"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
