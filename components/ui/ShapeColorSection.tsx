"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAudio } from "@/lib/useAudio";
import type { ColorShapeKind, ColorShapesSection } from "@/lib/lessonSections";

/* Inline SVGs for the 4 shape kinds — closed enum, no external markup. */
function ShapeSvg({ kind, fill }: { kind: ColorShapeKind; fill: string }) {
  const stroke = "#111827";
  const sw = 3;
  switch (kind) {
    case "circle":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx={50} cy={50} r={40} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect x={15} y={15} width={70} height={70} rx={4} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <polygon points="50,12 90,85 10,85" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    case "rectangle":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x={10} y={15} width={100} height={50} rx={4} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    default:
      return null;
  }
}

export default function ShapeColorSection({ section }: { section: ColorShapesSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [selected, setSelected] = useState<ColorShapesSection["colors"][number] | null>(null);
  const [fills, setFills] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, "correct" | "wrong">>({});

  const onSelectColor = (c: ColorShapesSection["colors"][number]) => {
    setSelected(c);
    playAudio(undefined, c.audioText ?? c.name);
  };

  const onPaint = (i: number) => {
    if (!selected) {
      playAudio(undefined, "اِخْتَرْ لَوْنًا أَوَّلًا");
      return;
    }
    if (statuses[i] === "correct") return;

    setFills((prev) => ({ ...prev, [i]: selected.hex }));
    const obj = section.objects[i];
    if (!obj) return;

    if (selected.name === obj.correctColor) {
      setStatuses((prev) => ({ ...prev, [i]: "correct" }));
      playAudio(undefined, "أَحْسَنْتَ");
    } else {
      setStatuses((prev) => ({ ...prev, [i]: "wrong" }));
      playAudio(undefined, "جَرِّبْ لَوْنًا آخَرَ");
      window.setTimeout(() => {
        setStatuses((prev) => {
          if (prev[i] !== "wrong") return prev;
          const next = { ...prev };
          delete next[i];
          return next;
        });
        setFills((prev) => {
          const next = { ...prev };
          delete next[i];
          return next;
        });
      }, 800);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      {/* Header */}
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
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Palette */}
      <div
        role="radiogroup"
        aria-label="Color palette"
        className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white/80 p-3 shadow-inner ring-1 ring-black/5"
      >
        {section.colors.map((c) => {
          const active = selected?.name === c.name;
          return (
            <motion.button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={c.name}
              onClick={() => onSelectColor(c)}
              onMouseEnter={() => playAudio(undefined, c.audioText ?? c.name)}
              whileHover={{ y: -4, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                aria-hidden
                className={`h-12 w-12 rounded-full ring-4 transition-all ${
                  active ? "ring-gray-900 scale-110" : "ring-white"
                }`}
                style={{ backgroundColor: c.hex }}
              />
              <span
                className="text-xs font-black text-gray-700"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {c.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Shapes grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {section.objects.map((obj, i) => {
          const status = statuses[i];
          const fill = fills[i] ?? "#f3f4f6";
          const ring =
            status === "correct"
              ? "ring-4 ring-emerald-400"
              : status === "wrong"
                ? "ring-4 ring-rose-400"
                : "ring-1 ring-black/5";
          return (
            <motion.button
              key={`${obj.kind}-${i}`}
              type="button"
              onClick={() => onPaint(i)}
              whileHover={status !== "correct" ? { y: -4, scale: 1.03 } : undefined}
              whileTap={status !== "correct" ? { scale: 0.97 } : undefined}
              animate={
                status === "wrong"
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : status === "correct"
                    ? { rotate: [0, -3, 3, 0] }
                    : undefined
              }
              transition={{ duration: 0.4 }}
              className={`relative flex flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${ring}`}
              aria-label={`Paint ${obj.name}`}
            >
              <div className="h-24 w-24">
                <ShapeSvg kind={obj.kind} fill={fill} />
              </div>
              <div
                className="text-lg font-black text-gray-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {obj.name}
              </div>
              {status === "correct" && (
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm text-white shadow-lg">
                  ✓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
