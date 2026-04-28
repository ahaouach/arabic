"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient backdrop for the alphabet course — soft pastel gradient with a
 * few floating Arabic letter glyphs. Decoration only; `aria-hidden` so it
 * stays out of the accessibility tree.
 */
export default function AlphabetBackground() {
  const prefersReducedMotion = useReducedMotion();
  const floaters = [
    { glyph: "ا", x: "6%", y: "10%", delay: 0 },
    { glyph: "ب", x: "84%", y: "8%", delay: 0.6 },
    { glyph: "ج", x: "12%", y: "78%", delay: 1.1 },
    { glyph: "م", x: "80%", y: "82%", delay: 1.7 },
    { glyph: "ع", x: "48%", y: "16%", delay: 0.4 },
    { glyph: "ر", x: "56%", y: "88%", delay: 1.3 },
    { glyph: "ف", x: "30%", y: "42%", delay: 0.9 },
    { glyph: "ق", x: "72%", y: "46%", delay: 1.5 },
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-amber-50 via-sky-50 to-fuchsia-50"
    >
      {floaters.map((f, i) => (
        <motion.span
          key={i}
          className="absolute text-5xl font-black opacity-25 sm:text-6xl"
          style={{
            left: f.x,
            top: f.y,
            fontFamily:
              '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
            color: "#334155",
          }}
          lang="ar"
          dir="rtl"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0], rotate: [0, 6, 0] }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
        >
          {f.glyph}
        </motion.span>
      ))}
    </div>
  );
}
