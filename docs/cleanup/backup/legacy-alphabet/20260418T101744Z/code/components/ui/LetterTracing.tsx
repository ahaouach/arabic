"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Confetti from "./Confetti";
import { useAudio } from "@/lib/useAudio";
import type { LetterTracingSection } from "@/lib/lessonSections";

export default function LetterTracing({ section }: { section: LetterTracingSection }) {
  const { playAudio } = useAudio();

  const [clicked, setClicked] = useState<number[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "retry" | null>(null);

  const done = clicked.length === section.points.length;

  const onDot = (i: number) => {
    if (done) return;
    if (i === clicked.length) {
      const next = [...clicked, i];
      setClicked(next);
      if (next.length === section.points.length) {
        setFeedback("ok");
        setConfettiKey((k) => k + 1);
        playAudio(undefined, "أَحْسَنْتَ");
      }
    } else {
      setFeedback("retry");
      setClicked([]);
      playAudio(undefined, "حَاوِلْ مَرَّةً أُخْرَى");
      window.setTimeout(() => setFeedback(null), 800);
    }
  };

  const reset = () => {
    setClicked([]);
    setFeedback(null);
  };

  const polyline = clicked
    .map((i) => `${section.points[i].x},${section.points[i].y}`)
    .join(" ");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <Confetti trigger={confettiKey} />

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
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-inner ring-1 ring-black/5">
        {/* Ghost letter in the background as a visual guide */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-[18rem] font-black text-gray-100"
          lang="ar"
          dir="rtl"
          style={{
            fontFamily: '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
            lineHeight: 1,
          }}
        >
          {section.letter}
        </div>

        {/* Interactive dots on top */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {clicked.length > 1 && (
            <polyline
              points={polyline}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {section.points.map((p, i) => {
            const status =
              clicked.indexOf(i) >= 0
                ? "done"
                : i === clicked.length
                  ? "next"
                  : "idle";
            const fill =
              status === "done" ? "#10b981" : status === "next" ? "#f59e0b" : "#ffffff";
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={fill}
                  stroke="#111827"
                  strokeWidth={0.6}
                  onClick={() => onDot(i)}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={p.x}
                  y={p.y + 1}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight={800}
                  fill={status === "idle" ? "#111827" : "#ffffff"}
                  pointerEvents="none"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

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
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-white px-4 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
