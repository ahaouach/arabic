"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient backdrop for the shapes lesson — soft pastel gradient with a
 * few floating geometric glyphs. Pure decoration; `aria-hidden` so it
 * stays out of the accessibility tree.
 */
export default function ShapesBackground() {
  const prefersReducedMotion = useReducedMotion();
  const floaters = [
    { emoji: "🔺", x: "8%", y: "14%", delay: 0 },
    { emoji: "⭐", x: "82%", y: "10%", delay: 0.6 },
    { emoji: "❤️", x: "12%", y: "78%", delay: 1.1 },
    { emoji: "🟦", x: "78%", y: "80%", delay: 1.7 },
    { emoji: "🔵", x: "46%", y: "18%", delay: 0.4 },
    { emoji: "▭", x: "54%", y: "88%", delay: 1.3 },
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50"
    >
      {floaters.map((f, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl opacity-60 sm:text-5xl"
          style={{ left: f.x, top: f.y }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0], rotate: [0, 8, 0] }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
        >
          {f.emoji}
        </motion.span>
      ))}
    </div>
  );
}
