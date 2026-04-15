"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type MascotMood = "happy" | "cheer" | "think" | "sad";

interface MascotProps {
  message: string;
  mood?: MascotMood;
  /** Where to pin the mascot. Default bottom-left. */
  position?: "bottom-left" | "bottom-right" | "inline";
}

const MOOD_EMOJI: Record<MascotMood, string> = {
  happy: "🦁",
  cheer: "🎉",
  think: "🤔",
  sad: "😿",
};

export default function Mascot({
  message,
  mood = "happy",
  position = "bottom-left",
}: MascotProps) {
  // Re-animate the bubble whenever the message changes.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [message]);

  const positionClass =
    position === "inline"
      ? "relative"
      : position === "bottom-right"
        ? "fixed bottom-4 right-4 z-40"
        : "fixed bottom-4 left-4 z-40";

  return (
    <div className={`${positionClass} flex items-end gap-3`} aria-live="polite">
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, -2, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 text-5xl shadow-xl ring-4 ring-white"
      >
        <span aria-hidden>{MOOD_EMOJI[mood]}</span>
      </motion.div>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="relative max-w-xs rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-xl ring-1 ring-black/5"
            dir="auto"
          >
            <div
              aria-hidden
              className="absolute -left-2 bottom-4 h-4 w-4 rotate-45 bg-white ring-1 ring-black/5"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
            />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
