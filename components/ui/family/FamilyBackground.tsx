import type { CSSProperties } from "react";

/**
 * Soft decorative background for the family lesson — a pastel gradient
 * plus a few floating heart / star glyphs. Purely decorative
 * (`aria-hidden`), server-renderable, no hooks or state.
 */
const HEARTS = [
  { left: "6%", top: "12%", size: 34, rotate: -8, color: "#FCA5A5", opacity: 0.35 },
  { left: "86%", top: "18%", size: 44, rotate: 14, color: "#C4B5FD", opacity: 0.3 },
  { left: "18%", top: "72%", size: 30, rotate: -16, color: "#6EE7B7", opacity: 0.3 },
  { left: "78%", top: "78%", size: 40, rotate: 8, color: "#FDE68A", opacity: 0.35 },
  { left: "50%", top: "40%", size: 24, rotate: -4, color: "#F9A8D4", opacity: 0.2 },
];

export default function FamilyBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-rose-50"
    >
      {HEARTS.map((h, i) => {
        const style: CSSProperties = {
          left: h.left,
          top: h.top,
          width: h.size,
          height: h.size,
          transform: `rotate(${h.rotate}deg)`,
          opacity: h.opacity,
          color: h.color,
        };
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute"
            style={style}
          >
            <path d="M12 21s-7-4.35-9.5-9.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5.5C19 16.65 12 21 12 21Z" />
          </svg>
        );
      })}
    </div>
  );
}
