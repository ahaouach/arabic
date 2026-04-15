"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  /** Incrementing this value re-fires the confetti burst. */
  trigger: number;
  /** Number of particles. Default 40. */
  count?: number;
}

const COLORS = [
  "#fbbf24",
  "#f472b6",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#fb7185",
  "#facc15",
];

const EMOJIS = ["⭐", "✨", "🎉", "🌟", "💫"];

export default function Confetti({ trigger, count = 40 }: ConfettiProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    setActive(trigger);
    const t = setTimeout(() => setActive(0), 1800);
    return () => clearTimeout(t);
  }, [trigger]);

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const distance = 180 + Math.random() * 220;
    const useEmoji = i % 3 === 0;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 60,
      rotate: Math.random() * 720 - 360,
      color: COLORS[i % COLORS.length],
      emoji: useEmoji ? EMOJIS[i % EMOJIS.length] : null,
      size: 8 + Math.random() * 8,
    };
  });

  return (
    <AnimatePresence>
      {active > 0 && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        >
          {particles.map((p) => (
            <motion.div
              key={`${active}-${p.id}`}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0.6 }}
              animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.15, 0.65, 0.45, 1] }}
              className="absolute flex items-center justify-center"
              style={{
                fontSize: p.emoji ? `${p.size * 2}px` : undefined,
                width: p.emoji ? undefined : p.size,
                height: p.emoji ? undefined : p.size,
                borderRadius: 999,
                backgroundColor: p.emoji ? undefined : p.color,
              }}
            >
              {p.emoji ?? null}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
