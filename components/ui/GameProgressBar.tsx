"use client";

import { motion } from "framer-motion";

interface GameProgressBarProps {
  current: number;
  total: number;
  stars: number;
  level?: number;
}

export default function GameProgressBar({
  current,
  total,
  stars,
  level = 1,
}: GameProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex h-10 shrink-0 items-center gap-1 rounded-full bg-white px-3 text-xs font-black text-gray-800 shadow-md ring-1 ring-black/5">
        <span aria-hidden>🏆</span>
        Level {level}
      </div>

      <div className="relative flex-1">
        <div className="h-5 overflow-hidden rounded-full bg-white/90 shadow-inner ring-1 ring-black/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-500 to-amber-400"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-700 drop-shadow-sm">
          {current} / {total}
        </div>
      </div>

      <div className="flex h-10 shrink-0 items-center gap-1 rounded-full bg-white px-3 text-sm font-black text-amber-500 shadow-md ring-1 ring-black/5">
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ⭐
        </motion.span>
        <span className="tabular-nums">{stars}</span>
      </div>
    </div>
  );
}
