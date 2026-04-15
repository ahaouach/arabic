"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAudio } from "@/lib/useAudio";
import type { DrawShapesSection } from "@/lib/lessonSections";

export default function ShapeDrawSection({ section }: { section: DrawShapesSection }) {
  const { playAudio } = useAudio();

  const [index, setIndex] = useState(0);
  const [clicked, setClicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"ok" | "retry" | null>(null);

  const total = section.challenges.length;
  const challenge = section.challenges[index];
  if (!challenge) return null;

  const done = clicked.length === challenge.dots.length;

  const onClickDot = (dotIdx: number) => {
    if (done) return;
    // Must click dots in order (0, 1, 2, …).
    if (dotIdx === clicked.length) {
      const next = [...clicked, dotIdx];
      setClicked(next);
      if (next.length === challenge.dots.length) {
        setFeedback("ok");
        playAudio(undefined, "أَحْسَنْتَ");
      }
    } else {
      setFeedback("retry");
      setClicked([]);
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      window.setTimeout(() => setFeedback(null), 800);
    }
  };

  const nextChallenge = () => {
    setClicked([]);
    setFeedback(null);
    setIndex((i) => (i + 1 < total ? i + 1 : i));
  };

  const reset = () => {
    setClicked([]);
    setFeedback(null);
  };

  // Build the polyline from the already-clicked dots.
  const polylinePoints = clicked
    .map((i) => `${challenge.dots[i].x},${challenge.dots[i].y}`)
    .join(" ");

  // Close the loop once all dots have been connected.
  const closingLine = done
    ? `M ${challenge.dots[clicked[clicked.length - 1]].x} ${
        challenge.dots[clicked[clicked.length - 1]].y
      } L ${challenge.dots[clicked[0]].x} ${challenge.dots[clicked[0]].y}`
    : null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {section.title && (
            <h3
              className="text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.title}
            </h3>
          )}
          {section.instructions && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.instructions}
            </p>
          )}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5">
          {index + 1} / {total}
        </div>
      </div>

      {/* Challenge name */}
      <div
        className="mb-3 text-center text-xl font-black text-gray-800"
        lang="ar"
        dir="rtl"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
      >
        {challenge.name}
      </div>

      {/* Canvas */}
      <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-inner ring-1 ring-black/5">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          role="img"
          aria-label={`Connect the dots to draw ${challenge.name}`}
        >
          {/* Connecting polyline */}
          {clicked.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {closingLine && (
            <path
              d={closingLine}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          )}

          {/* Dots */}
          {challenge.dots.map((dot, i) => {
            const state =
              clicked.indexOf(i) >= 0
                ? "done"
                : i === clicked.length
                  ? "next"
                  : "idle";
            const fill =
              state === "done" ? "#10b981" : state === "next" ? "#f59e0b" : "#ffffff";
            return (
              <g key={i}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={3}
                  fill={fill}
                  stroke="#111827"
                  strokeWidth={0.6}
                  onClick={() => onClickDot(i)}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={dot.x}
                  y={dot.y + 1}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight={800}
                  fill={state === "idle" ? "#111827" : "#ffffff"}
                  pointerEvents="none"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Feedback + actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {feedback === "ok" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-black text-emerald-700"
            lang="ar"
            dir="rtl"
          >
            أَحْسَنْتَ! 🎉
          </motion.span>
        )}
        {feedback === "retry" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-rose-100 px-4 py-1 text-sm font-black text-rose-700"
            lang="ar"
            dir="rtl"
          >
            حَاوِلْ مَرَّةً أُخْرَى
          </motion.span>
        )}

        {done ? (
          index + 1 < total ? (
            <button
              type="button"
              onClick={nextChallenge}
              className="rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 px-5 py-2 text-sm font-black text-white shadow-lg"
            >
              Next shape →
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-white px-5 py-2 text-sm font-black text-gray-800 shadow ring-1 ring-black/5"
            >
              ↺ Try again
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-white px-4 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
          >
            ↺ Reset
          </button>
        )}
      </div>
    </div>
  );
}
