"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ArabicShape } from "@/lib/types/shapesLesson.types";

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  color: string;
  size: number;
  points: Point[];
}

export interface UseDrawingOptions {
  /** Reference shape used to draw the dashed tracing guide. */
  shape: ArabicShape;
  /** Render the tracing guide (faint dashed outline of the reference shape). */
  showGuide: boolean;
  /** Maximum stored strokes. Older ones are dropped when exceeded. */
  maxUndoStack: number;
}

export interface UseDrawingReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  color: string;
  setColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (n: number) => void;
  undo: () => void;
  clear: () => void;
  toDataURL: () => string | null;
  canUndo: boolean;
  hasStrokes: boolean;
}

const DEFAULT_COLOR = "#1f2937";
const DEFAULT_BRUSH = 8;

/**
 * Canvas-drawing hook.
 *
 * - Uses pointer events → mouse / touch / stylus all go through the same path.
 * - Stores strokes in a ref (no state spam during drag); only commits to a
 *   counter state on pointer-up / undo / clear so React re-renders the toolbar
 *   affordances.
 * - Incremental rendering while drawing, full re-render on resize / undo / clear.
 * - DPR-scaled backing store keeps strokes crisp on retina displays.
 */
export function useDrawing({
  shape,
  showGuide,
  maxUndoStack,
}: UseDrawingOptions): UseDrawingReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);

  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH);
  const [strokeCount, setStrokeCount] = useState(0);

  const colorRef = useRef(color);
  const brushRef = useRef(brushSize);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    brushRef.current = brushSize;
  }, [brushSize]);

  const drawGuide = useCallback(
    (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
      const parts = shape.viewBox.split(/\s+/).map(Number);
      if (parts.length !== 4) return;
      const [, , vw, vh] = parts;
      if (!vw || !vh) return;
      try {
        const path = new Path2D(shape.svgPath);
        const scale = (Math.min(cw / vw, ch / vh) * 0.75) / 1;
        const dx = (cw - vw * scale) / 2;
        const dy = (ch - vh * scale) / 2;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.scale(scale, scale);
        ctx.setLineDash([8 / scale, 6 / scale]);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
        ctx.lineWidth = 2.5 / scale;
        ctx.stroke(path);
        ctx.restore();
      } catch {
        // Path2D may throw on malformed paths — skip the guide silently.
      }
    },
    [shape],
  );

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, s: Stroke) => {
      const pts = s.points;
      if (pts.length === 0) return;
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    },
    [],
  );

  /** Clear + re-paint everything from the stored stroke stack. */
  const rerender = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    if (showGuide) drawGuide(ctx, cw, ch);
    for (const s of strokesRef.current) drawStroke(ctx, s);
    if (currentRef.current) drawStroke(ctx, currentRef.current);
  }, [drawGuide, drawStroke, showGuide]);

  /** Draw just the newest segment of `currentRef.current` on top — no clear. */
  const drawLatestSegment = useCallback(() => {
    const canvas = canvasRef.current;
    const cur = currentRef.current;
    if (!canvas || !cur) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStroke(ctx, cur);
  }, [drawStroke]);

  // Resize handling: keep backing store DPR-aligned to the element size.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      rerender();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [rerender]);

  // Re-render when the guide toggle flips.
  useEffect(() => {
    rerender();
  }, [rerender, showGuide]);

  // Pointer event bindings.
  //
  // `pointerdown` is attached to the canvas; `pointermove` / `pointerup` are
  // attached to `window` only during an active drag. This matches the
  // idiomatic drawing-app pattern and avoids two well-known footguns:
  //   1. `pointerleave` on the canvas would commit a stroke prematurely if
  //      the finger briefly left the canvas area.
  //   2. `setPointerCapture` is flaky across browsers when reused for many
  //      consecutive strokes (second tap sometimes routes events elsewhere).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPoint = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    let activePointerId: number | null = null;

    const onPointerMove = (e: PointerEvent) => {
      if (!currentRef.current || e.pointerId !== activePointerId) return;
      currentRef.current.points.push(getPoint(e));
      drawLatestSegment();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== activePointerId) return;
      activePointerId = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (!currentRef.current) return;
      strokesRef.current.push(currentRef.current);
      if (strokesRef.current.length > maxUndoStack) {
        strokesRef.current = strokesRef.current.slice(-maxUndoStack);
      }
      currentRef.current = null;
      setStrokeCount(strokesRef.current.length);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (activePointerId !== null) return; // one pointer at a time
      activePointerId = e.pointerId;
      currentRef.current = {
        color: colorRef.current,
        size: brushRef.current,
        points: [getPoint(e)],
      };
      drawLatestSegment();
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      e.preventDefault();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [drawLatestSegment, maxUndoStack]);

  const undo = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    rerender();
  }, [rerender]);

  const clear = useCallback(() => {
    strokesRef.current = [];
    currentRef.current = null;
    setStrokeCount(0);
    rerender();
  }, [rerender]);

  const toDataURL = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    try {
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  }, []);

  return {
    canvasRef,
    color,
    setColor,
    brushSize,
    setBrushSize,
    undo,
    clear,
    toDataURL,
    canUndo: strokeCount > 0,
    hasStrokes: strokeCount > 0,
  };
}
