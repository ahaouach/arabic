"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Numbers-themed ambient background.
 *
 * Pastel gradient + floating Western digits in the filigree. The digits
 * stay decorative (`aria-hidden`) and are rendered in `Nunito` to match
 * the rest of the lesson's numeric typography. Respects
 * `prefers-reduced-motion` — the floats and drift animations are skipped
 * entirely when the user opts out.
 */
const BLOBS = [
  { top: "-10%", left: "-10%", size: 440, color: "from-sky-300/60 to-violet-300/60", delay: 0 },
  { top: "20%", right: "-15%", size: 380, color: "from-amber-300/60 to-pink-300/60", delay: 1.5 },
  { bottom: "-12%", left: "30%", size: 500, color: "from-emerald-300/60 to-sky-300/60", delay: 3 },
];

const DIGIT_FLOATERS = [
  { digit: "1", top: "12%", left: "7%", size: 56, rotate: -8, delay: 0 },
  { digit: "2", top: "28%", right: "9%", size: 64, rotate: 10, delay: 0.8 },
  { digit: "3", bottom: "24%", left: "11%", size: 52, rotate: -4, delay: 1.2 },
  { digit: "5", top: "60%", right: "6%", size: 72, rotate: 6, delay: 0.4 },
  { digit: "7", bottom: "14%", right: "18%", size: 48, rotate: -12, delay: 2 },
  { digit: "9", top: "44%", left: "22%", size: 44, rotate: 14, delay: 1.6 },
];

const SPARKLES = [
  { emoji: "✨", top: "18%", right: "22%", size: 26, delay: 0.3 },
  { emoji: "🌟", bottom: "30%", right: "40%", size: 22, delay: 1.1 },
  { emoji: "💫", top: "70%", left: "48%", size: 24, delay: 2.2 },
];

export default function NumbersBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50" />

      {/* Blobs */}
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

      {/* Floating Western digits — decorative filigree */}
      {DIGIT_FLOATERS.map((d, i) => (
        <motion.span
          key={`digit-${i}`}
          dir="ltr"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, -18, 0],
                  rotate: [d.rotate, d.rotate + 8, d.rotate - 6, d.rotate],
                }
          }
          transition={{
            duration: 6 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: d.delay,
          }}
          className="absolute select-none font-black text-sky-200/70 mix-blend-multiply"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
            fontSize: d.size,
            fontFamily: '"Nunito", system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          {d.digit}
        </motion.span>
      ))}

      {/* Sparkles */}
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
