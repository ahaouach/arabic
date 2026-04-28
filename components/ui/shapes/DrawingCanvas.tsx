"use client";

import type { RefObject } from "react";

export interface DrawingCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** ARIA label for the drawing surface (Arabic, vowelized). */
  ariaLabel: string;
}

/**
 * Thin wrapper around a full-size `<canvas>`. All drawing logic and
 * pointer wiring lives in `useDrawing`; this component is purely the
 * surface + its accessibility hints.
 *
 * `touch-action: none` is required so horizontal swipes don't trigger
 * browser gestures (scroll, page back) instead of drawing.
 */
export default function DrawingCanvas({
  canvasRef,
  ariaLabel,
}: DrawingCanvasProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-inner ring-1 ring-black/5">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        className="block h-full w-full cursor-crosshair"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
