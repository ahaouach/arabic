"use client";

import { motion } from "framer-motion";
import type { PaintableObjectKind } from "@/lib/lessonSections";

/* -------------------------------------------------------------------------- */
/*  Inline SVG shapes — a closed set we render ourselves so untrusted SVG     */
/*  markup can never reach the DOM.                                           */
/* -------------------------------------------------------------------------- */

function ShapeSvg({ kind, fill }: { kind: PaintableObjectKind; fill: string }) {
  const fillProps = { fill, stroke: "#1f2937", strokeWidth: 4, strokeLinejoin: "round" as const };

  switch (kind) {
    case "apple":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path
            d="M100 40 C 60 40 30 70 30 110 C 30 160 60 180 100 180 C 140 180 170 160 170 110 C 170 70 140 40 100 40 Z"
            {...fillProps}
          />
          <path d="M100 40 C 100 25 110 15 125 15" fill="none" stroke="#4d7c0f" strokeWidth={6} strokeLinecap="round" />
          <path d="M110 30 C 120 20 135 22 140 35 C 130 40 118 40 110 30 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth={3} />
        </svg>
      );
    case "car":
      return (
        <svg viewBox="0 0 240 160" className="h-full w-full">
          <path
            d="M20 110 L40 70 Q50 55 70 55 L170 55 Q190 55 200 75 L220 110 L220 135 Q220 145 210 145 L30 145 Q20 145 20 135 Z"
            {...fillProps}
          />
          <path d="M60 65 L100 65 L100 95 L50 95 Z M110 65 L160 65 L180 95 L110 95 Z" fill="#dbeafe" stroke="#1f2937" strokeWidth={3} />
          <circle cx={70} cy={145} r={20} fill="#1f2937" />
          <circle cx={70} cy={145} r={8} fill="#9ca3af" />
          <circle cx={180} cy={145} r={20} fill="#1f2937" />
          <circle cx={180} cy={145} r={8} fill="#9ca3af" />
        </svg>
      );
    case "house":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path d="M30 170 L30 90 L100 30 L170 90 L170 170 Z" {...fillProps} />
          <rect x={85} y={115} width={30} height={55} fill="#4d2600" stroke="#1f2937" strokeWidth={3} />
          <circle cx={108} cy={143} r={2.5} fill="#fde047" />
          <rect x={45} y={105} width={25} height={25} fill="#bae6fd" stroke="#1f2937" strokeWidth={3} />
          <rect x={130} y={105} width={25} height={25} fill="#bae6fd" stroke="#1f2937" strokeWidth={3} />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g stroke="#1f2937" strokeWidth={4} strokeLinecap="round">
            <line x1={100} y1={10} x2={100} y2={40} />
            <line x1={100} y1={160} x2={100} y2={190} />
            <line x1={10} y1={100} x2={40} y2={100} />
            <line x1={160} y1={100} x2={190} y2={100} />
            <line x1={35} y1={35} x2={55} y2={55} />
            <line x1={145} y1={145} x2={165} y2={165} />
            <line x1={35} y1={165} x2={55} y2={145} />
            <line x1={145} y1={55} x2={165} y2={35} />
          </g>
          <circle cx={100} cy={100} r={55} {...fillProps} />
        </svg>
      );
    case "fish":
      return (
        <svg viewBox="0 0 240 160" className="h-full w-full">
          <path
            d="M30 80 Q70 20 140 30 Q200 40 210 80 Q200 120 140 130 Q70 140 30 80 Z"
            {...fillProps}
          />
          <path d="M20 80 L-10 40 L-10 120 Z" transform="translate(20 0)" {...fillProps} />
          <circle cx={170} cy={70} r={8} fill="#1f2937" />
          <circle cx={172} cy={68} r={3} fill="#fff" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path
            d="M100 20 L123 78 L185 82 L138 122 L153 184 L100 150 L47 184 L62 122 L15 82 L77 78 Z"
            {...fillProps}
          />
        </svg>
      );
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  ObjectCard                                                                */
/* -------------------------------------------------------------------------- */

interface ObjectCardProps {
  name: string;
  kind: PaintableObjectKind;
  fill: string;
  status: "idle" | "correct" | "wrong";
  onPaint: () => void;
  disabled?: boolean;
}

export default function ObjectCard({ name, kind, fill, status, onPaint, disabled }: ObjectCardProps) {
  const ring =
    status === "correct"
      ? "ring-4 ring-emerald-400"
      : status === "wrong"
        ? "ring-4 ring-rose-400"
        : "ring-1 ring-black/5";

  return (
    <motion.button
      type="button"
      onClick={onPaint}
      disabled={disabled}
      whileHover={!disabled ? { y: -4, scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      animate={
        status === "wrong"
          ? { x: [0, -6, 6, -4, 4, 0] }
          : status === "correct"
            ? { rotate: [0, -3, 3, 0] }
            : undefined
      }
      transition={{ duration: 0.4 }}
      className={`group relative flex flex-col items-center gap-3 rounded-3xl bg-white p-5 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${ring}`}
      aria-label={`Paint ${name}`}
    >
      <div className="h-32 w-32">
        <ShapeSvg kind={kind} fill={fill} />
      </div>
      <div className="text-lg font-black text-gray-900" dir="auto">
        {name}
      </div>
      {status === "correct" && (
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-base text-white shadow-lg">
          ✓
        </span>
      )}
    </motion.button>
  );
}
