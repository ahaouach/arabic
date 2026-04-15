"use client";

import { motion } from "framer-motion";

const BLOBS = [
  { top: "-10%", left: "-10%", size: 420, color: "from-sky-300/60 to-fuchsia-300/60", delay: 0 },
  { top: "20%", right: "-15%", size: 380, color: "from-amber-300/60 to-pink-300/60", delay: 1.5 },
  { bottom: "-12%", left: "30%", size: 500, color: "from-emerald-300/60 to-sky-300/60", delay: 3 },
];

const FLOATERS = [
  { emoji: "⭐", top: "15%", left: "8%", size: 28, delay: 0 },
  { emoji: "✨", top: "28%", right: "10%", size: 22, delay: 0.8 },
  { emoji: "🌟", bottom: "22%", left: "12%", size: 26, delay: 1.2 },
  { emoji: "💫", top: "60%", right: "6%", size: 30, delay: 0.4 },
  { emoji: "🔆", bottom: "12%", right: "18%", size: 24, delay: 2 },
];

export default function FloatingBackground() {
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
          key={i}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
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

      {/* Floaters */}
      {FLOATERS.map((f, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 4 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
          className="absolute select-none"
          style={{
            top: f.top,
            left: f.left,
            right: f.right,
            bottom: f.bottom,
            fontSize: f.size,
          }}
        >
          {f.emoji}
        </motion.div>
      ))}
    </div>
  );
}
