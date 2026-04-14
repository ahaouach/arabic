"use client";

import { useEffect, useState } from "react";
import type {
  ColorizeStep,
  ColorName,
  ShapeKind,
} from "@/lib/lessons-schema";

interface ColorizeExerciseProps {
  step: ColorizeStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: Record<string, string>) => void;
}

/**
 * Pick a color from the palette, then tap an empty shape to fill it.
 * All shapes start uncolored (stroke outline only). The grader accepts
 * an answer when every target shape is painted with the target color
 * AND no distractor has stolen the target color.
 *
 * SECURITY: The palette + shape kinds are strict Zod enums so a
 * tampered lesson row cannot inject arbitrary SVG or CSS. Colors are
 * mapped from a fixed whitelist → hex codes — user-supplied names are
 * never concatenated into style strings.
 */
export default function ColorizeExercise({
  step,
  feedback,
  onAnswer,
}: ColorizeExerciseProps) {
  const [picked, setPicked] = useState<ColorName | null>(null);
  const [fills, setFills] = useState<Record<string, ColorName>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPicked(null);
    setFills({});
    setSubmitted(false);
  }, [step.id]);

  const locked = feedback !== null;

  function paint(shapeId: string) {
    if (locked || submitted || !picked) return;
    setFills((prev) => ({ ...prev, [shapeId]: picked }));
  }

  function reset() {
    if (locked || submitted) return;
    setFills({});
    setPicked(null);
  }

  function submit() {
    if (locked || submitted) return;
    if (Object.keys(fills).length === 0) return;
    setSubmitted(true);
    onAnswer(fills);
  }

  const paintedCount = Object.keys(fills).length;

  return (
    <div>
      {/* Palette */}
      <div className="mb-4">
        <p className="mb-2 text-center text-sm font-medium text-gray-500">
          1. Choisis une couleur
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {step.palette.map((color) => {
            const isPicked = picked === color;
            return (
              <button
                key={color}
                type="button"
                disabled={locked}
                onClick={() => setPicked(color)}
                style={{ backgroundColor: COLOR_HEX[color] }}
                className={[
                  "h-14 w-14 rounded-full border-4 shadow-md transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                  isPicked
                    ? "scale-110 border-gray-900 shadow-lg"
                    : "border-white hover:scale-105",
                  color === "blanc" ? "ring-1 ring-gray-300" : "",
                ].join(" ")}
                aria-label={`Couleur ${color}`}
                aria-pressed={isPicked}
                title={color}
              />
            );
          })}
        </div>
      </div>

      {picked && !locked && (
        <p className="mb-4 text-center text-sm text-gray-600">
          2. Clique sur la forme à colorier en{" "}
          <strong style={{ color: COLOR_HEX[picked] }}>{picked}</strong>
        </p>
      )}
      {!picked && !locked && (
        <p className="mb-4 text-center text-sm text-gray-400">
          ↑ commence par choisir une couleur
        </p>
      )}

      {/* Shapes */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {step.shapes.map((shape) => {
          const fill = fills[shape.id];
          const isCorrectLock =
            locked && shape.isTarget && fill === step.targetColor;
          const isMissed =
            locked && shape.isTarget && fill !== step.targetColor;
          const isWrongPaint =
            locked && !shape.isTarget && fill === step.targetColor;

          return (
            <button
              key={shape.id}
              type="button"
              disabled={locked || !picked}
              onClick={() => paint(shape.id)}
              className={[
                "aspect-square rounded-2xl border-2 p-3 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500",
                locked
                  ? isCorrectLock
                    ? "border-emerald-500 bg-emerald-50"
                    : isMissed
                      ? "border-amber-400 bg-amber-50"
                      : isWrongPaint
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-100 bg-gray-50"
                  : picked
                    ? "cursor-pointer border-primary-200 bg-white hover:-translate-y-0.5 hover:border-primary-500 hover:shadow-md"
                    : "border-gray-200 bg-white",
              ].join(" ")}
              aria-label={shape.kind}
            >
              <ShapeSvg
                kind={shape.kind}
                fill={fill ? COLOR_HEX[fill] : "#FFFFFF"}
              />
            </button>
          );
        })}
      </div>

      {/* Controls */}
      {!submitted && !locked && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            disabled={paintedCount === 0}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Effacer tout
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={paintedCount === 0}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Valider
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Color whitelist → hex ------------------------------------------------

const COLOR_HEX: Record<ColorName, string> = {
  rouge: "#EF4444",
  vert: "#10B981",
  bleu: "#3B82F6",
  jaune: "#FBBF24",
  noir: "#0F172A",
  blanc: "#FFFFFF",
  violet: "#A855F7",
  orange: "#FB923C",
  rose: "#EC4899",
  marron: "#92400E",
};

// ---- SVG shape renderer ---------------------------------------------------

function ShapeSvg({ kind, fill }: { kind: ShapeKind; fill: string }) {
  const stroke = "#334155";
  const strokeWidth = 4;
  const common = { stroke, strokeWidth, fill };

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {kind === "square" && (
        <rect x="12" y="12" width="76" height="76" rx="2" {...common} />
      )}
      {kind === "rectangle" && (
        <rect x="15" y="28" width="70" height="44" rx="2" {...common} />
      )}
      {kind === "triangle" && (
        <polygon points="50,12 90,88 10,88" {...common} strokeLinejoin="round" />
      )}
      {kind === "circle" && <circle cx="50" cy="50" r="38" {...common} />}
      {kind === "crescent" && (
        // Right-facing crescent: big circle minus smaller offset circle.
        // Uses evenodd fill-rule so the subtracted area is empty.
        <path
          d="M 68 50 m -38 0 a 38 38 0 1 0 76 0 a 38 38 0 1 0 -76 0 M 82 50 m -30 0 a 30 30 0 1 1 60 0 a 30 30 0 1 1 -60 0"
          fillRule="evenodd"
          {...common}
        />
      )}
    </svg>
  );
}
