"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Colors-themed ambient background. Pastel gradient + drifting coloured
 * circles in the palette's primary colours. `aria-hidden` + pointer-
 * events-none so it never steals focus or clicks.
 */

const BLOBS = [
  { top: "-8%", left: "-10%", size: 420, color: "from-sky-300/60 to-violet-300/60", delay: 0 },
  { top: "18%", right: "-12%", size: 380, color: "from-amber-300/60 to-pink-300/60", delay: 1.5 },
  { bottom: "-14%", left: "32%", size: 500, color: "from-emerald-300/60 to-sky-300/60", delay: 3 },
];

// Coloured circles drifting across the view — the colour IDs mirror the
// palette so the background quietly reinforces "this is a colours lesson".
const CIRCLES: ReadonlyArray<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  color: string;
  delay: number;
}> = [
  { top: "12%", left: "8%", size: 38, color: "#DC2626", delay: 0 },
  { top: "28%", right: "10%", size: 44, color: "#2563EB", delay: 0.6 },
  { bottom: "22%", left: "14%", size: 34, color: "#16A34A", delay: 1.2 },
  { top: "60%", right: "7%", size: 48, color: "#EAB308", delay: 0.3 },
  { bottom: "12%", right: "20%", size: 32, color: "#9333EA", delay: 1.8 },
  { top: "44%", left: "22%", size: 28, color: "#F97316", delay: 1.4 },
  { top: "74%", left: "48%", size: 30, color: "#EC4899", delay: 2.2 },
];

const SPARKLES = [
  { emoji: "✨", top: "20%", right: "28%", size: 24, delay: 0.3 },
  { emoji: "🌟", bottom: "36%", right: "42%", size: 22, delay: 1.1 },
  { emoji: "💫", top: "68%", left: "52%", size: 26, delay: 2.2 },
];

export default function ColorsBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50" />

      {BLOBS.map((b, i) => (
        <motion.div
          key={`blob-${i}`}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 20, -10, 0],
                  y: [0, -15, 10, 0],
                  scale: [1, 1.05, 0.98, 1],
                }
          }
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
          className={`absolute rounded-full bg-gradient-to-br ${b.color} blur-3xl`}
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
          }}
        />
      ))}

      {CIRCLES.map((c, i) => (
        <motion.div
          key={`circle-${i}`}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -18, 0], scale: [1, 1.12, 1] }
          }
          transition={{
            duration: 5 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.delay,
          }}
          className="absolute rounded-full opacity-50 mix-blend-multiply ring-2 ring-white/70"
          style={{
            backgroundColor: c.color,
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
          }}
        />
      ))}

      {SPARKLES.map((s, i) => (
        <motion.span
          key={`sparkle-${i}`}
          animate={
            prefersReducedMotion
              ? undefined
              : { opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }
          }
          transition={{
            duration: 2.6 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
          className="absolute select-none"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            fontSize: s.size,
          }}
        >
          {s.emoji}
        </motion.span>
      ))}
    </div>
  );
}
