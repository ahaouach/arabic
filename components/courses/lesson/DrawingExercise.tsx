"use client";

import { useEffect, useRef, useState } from "react";
import type { DrawingStep } from "@/lib/lessons-schema";

interface DrawingExerciseProps {
  step: DrawingStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: string) => void;
}

const CANVAS_SIZE = 400;
const STROKE_COLOR = "#0f766e";
const STROKE_WIDTH = 12;
const GUIDE_COLOR = "rgba(16, 185, 129, 0.18)";

/**
 * Canvas-based letter tracing.
 *
 * SECURITY:
 *  - The component only renders local canvas state — nothing is sent to
 *    the server except the sentinel string `"completed"` once the
 *    learner taps "I'm done". No image data, blob, or upload is ever
 *    produced. There is no arbitrary-file-upload surface.
 *  - The guide letter comes from the Zod-validated `step.letter`
 *    (max 8 chars) and is drawn into the canvas only — never injected
 *    into the DOM as HTML.
 */
export default function DrawingExercise({
  step,
  feedback,
  onAnswer,
}: DrawingExerciseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // (Re)draw the faded guide letter on mount and on step change.
  useEffect(() => {
    setHasStrokes(false);
    setSubmitted(false);
    redrawGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id, step.letter]);

  function redrawGuide() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = GUIDE_COLOR;
    ctx.font = `bold ${Math.floor(canvas.height * 0.78)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(step.letter, canvas.width / 2, canvas.height / 2);
  }

  function getCoords(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      if (!t) return { x: 0, y: 0 };
      return {
        x: ((t.clientX - rect.left) / rect.width) * canvas.width,
        y: ((t.clientY - rect.top) / rect.height) * canvas.height,
      };
    }
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function start(e: React.MouseEvent | React.TouchEvent) {
    if (submitted) return;
    if ("touches" in e) e.preventDefault();
    drawingRef.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasStrokes(true);
  }

  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current || submitted) return;
    if ("touches" in e) e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() {
    drawingRef.current = false;
  }

  function clear() {
    if (submitted) return;
    redrawGuide();
    setHasStrokes(false);
  }

  function done() {
    if (submitted || !hasStrokes) return;
    setSubmitted(true);
    onAnswer("completed");
  }

  const locked = feedback !== null;

  return (
    <div>
      {step.guide && (
        <p className="mb-4 text-center text-sm text-gray-500">{step.guide}</p>
      )}

      <div className="mx-auto max-w-md">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          className={[
            "aspect-square w-full rounded-2xl border-2 bg-white shadow-sm",
            locked
              ? feedback === "correct"
                ? "border-emerald-500"
                : "border-rose-500"
              : "border-gray-200",
          ].join(" ")}
          style={{ touchAction: "none" }}
          aria-label={`Trace the letter ${step.letter}`}
        />

        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={clear}
            disabled={submitted || !hasStrokes}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={done}
            disabled={submitted || !hasStrokes}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            I'm done
          </button>
        </div>
      </div>
    </div>
  );
}
