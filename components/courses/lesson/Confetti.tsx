"use client";

import { useEffect, useState } from "react";

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  shape: "square" | "circle";
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#a855f7", "#ec4899"];

interface ConfettiProps {
  /** Set true to trigger a 2.5s burst. Setting back to false stops new bursts. */
  active: boolean;
  count?: number;
}

/**
 * CSS-only confetti burst. Pieces are generated client-side after mount
 * (deterministic positions per render to avoid hydration mismatch — the
 * component renders nothing on the server). Auto-clears after ~2.5s.
 *
 * Zero dependencies — pure React + Tailwind + a single keyframe.
 */
export default function Confetti({ active, count = 50 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const next: Piece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.2,
      color: COLORS[i % COLORS.length],
      shape: i % 2 === 0 ? "square" : "circle",
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 2800);
    return () => clearTimeout(t);
  }, [active, count]);

  if (pieces.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`absolute h-3 w-3 ${p.shape === "circle" ? "rounded-full" : "rounded-sm"}`}
          style={{
            left: `${p.left}%`,
            top: 0,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
