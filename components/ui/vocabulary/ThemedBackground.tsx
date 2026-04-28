/**
 * Per-theme decorative background.
 *
 * Pure SSR-friendly component (no hooks, no event handlers). Each
 * theme owns a gradient pair + a glyph + an accent palette. Five
 * floating glyphs at fixed positions; gradient covers the full screen.
 *
 * Themes that aren't in the table fall back to the neutral gradient.
 * Phase 2 / later can swap glyphs for richer SVGs without API change.
 */

import type { CSSProperties } from "react";

interface ThemeBg {
  gradient: string;
  glyphPath: string; // SVG path — drawn inside a 24x24 viewBox
  glyphs: Array<{
    left: string;
    top: string;
    size: number;
    rotate: number;
    color: string;
    opacity: number;
  }>;
}

const HEART_PATH = "M12 21s-7-4.35-9.5-9.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5.5C19 16.65 12 21 12 21Z";
const STAR_PATH = "M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.27 5.79 22l2.39-8.15L2 9.36h7.61L12 2z";
const CIRCLE_PATH = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z";
const LEAF_PATH = "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.11-.34c.32-1 .87-2.37 1.43-3.34L8 17.5C13 17 17 13 17 8Z";
const CLOUD_PATH = "M19 16H6a4 4 0 0 1 0-8 4 4 0 0 1 .27-1.45A5 5 0 0 1 11 5a5 5 0 0 1 4.65 3.16A4 4 0 0 1 19 16Z";
const NOTE_PATH = "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z";
const SUN_PATH = "M12 4V2M12 22v-2M4.93 4.93L3.5 3.5M20.5 20.5l-1.43-1.43M2 12H4M20 12h2M4.93 19.07L3.5 20.5M20.5 3.5l-1.43 1.43M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z";
const PAW_PATH = "M12 13c1.66 0 3 1.34 3 3 0 .55-.45 1-1 1h-4a1 1 0 0 1-1-1c0-1.66 1.34-3 3-3Zm-5-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM10 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z";
const SQUARE_PATH = "M4 4h16v16H4z";

const THEMES: Record<string, ThemeBg> = {
  fruits: {
    gradient: "from-rose-50 via-orange-50 to-yellow-50",
    glyphPath: CIRCLE_PATH,
    glyphs: [
      { left: "8%", top: "12%", size: 36, rotate: -8, color: "#FCA5A5", opacity: 0.35 },
      { left: "84%", top: "20%", size: 44, rotate: 14, color: "#FBBF24", opacity: 0.3 },
      { left: "20%", top: "76%", size: 30, rotate: -16, color: "#86EFAC", opacity: 0.3 },
      { left: "78%", top: "78%", size: 40, rotate: 8, color: "#F87171", opacity: 0.35 },
      { left: "50%", top: "44%", size: 28, rotate: -4, color: "#FDBA74", opacity: 0.25 },
    ],
  },
  vegetables: {
    gradient: "from-emerald-50 via-lime-50 to-amber-50",
    glyphPath: LEAF_PATH,
    glyphs: [
      { left: "10%", top: "16%", size: 38, rotate: -10, color: "#34D399", opacity: 0.3 },
      { left: "82%", top: "22%", size: 42, rotate: 18, color: "#84CC16", opacity: 0.3 },
      { left: "18%", top: "72%", size: 30, rotate: -20, color: "#A3E635", opacity: 0.3 },
      { left: "76%", top: "74%", size: 40, rotate: 6, color: "#10B981", opacity: 0.3 },
      { left: "48%", top: "42%", size: 26, rotate: -2, color: "#65A30D", opacity: 0.2 },
    ],
  },
  "body-parts": {
    gradient: "from-pink-50 via-violet-50 to-sky-50",
    glyphPath: HEART_PATH,
    glyphs: [
      { left: "8%", top: "14%", size: 34, rotate: -6, color: "#F472B6", opacity: 0.3 },
      { left: "86%", top: "18%", size: 42, rotate: 14, color: "#A78BFA", opacity: 0.3 },
      { left: "18%", top: "74%", size: 30, rotate: -14, color: "#60A5FA", opacity: 0.3 },
      { left: "78%", top: "78%", size: 38, rotate: 8, color: "#F9A8D4", opacity: 0.3 },
      { left: "50%", top: "44%", size: 24, rotate: -2, color: "#C4B5FD", opacity: 0.2 },
    ],
  },
  clothes: {
    gradient: "from-fuchsia-50 via-rose-50 to-amber-50",
    glyphPath: SQUARE_PATH,
    glyphs: [
      { left: "10%", top: "16%", size: 32, rotate: -12, color: "#E879F9", opacity: 0.25 },
      { left: "84%", top: "20%", size: 38, rotate: 18, color: "#FB7185", opacity: 0.25 },
      { left: "20%", top: "74%", size: 28, rotate: -18, color: "#FBBF24", opacity: 0.25 },
      { left: "76%", top: "76%", size: 36, rotate: 6, color: "#F472B6", opacity: 0.25 },
      { left: "50%", top: "42%", size: 24, rotate: 0, color: "#F0ABFC", opacity: 0.2 },
    ],
  },
  jobs: {
    gradient: "from-sky-50 via-indigo-50 to-fuchsia-50",
    glyphPath: STAR_PATH,
    glyphs: [
      { left: "8%", top: "16%", size: 34, rotate: -10, color: "#38BDF8", opacity: 0.3 },
      { left: "84%", top: "22%", size: 40, rotate: 12, color: "#818CF8", opacity: 0.3 },
      { left: "18%", top: "72%", size: 28, rotate: -16, color: "#C084FC", opacity: 0.3 },
      { left: "78%", top: "78%", size: 38, rotate: 6, color: "#60A5FA", opacity: 0.3 },
      { left: "50%", top: "42%", size: 24, rotate: -2, color: "#A78BFA", opacity: 0.2 },
    ],
  },
  transport: {
    gradient: "from-sky-50 via-cyan-50 to-emerald-50",
    glyphPath: CLOUD_PATH,
    glyphs: [
      { left: "12%", top: "14%", size: 42, rotate: 0, color: "#7DD3FC", opacity: 0.4 },
      { left: "78%", top: "20%", size: 48, rotate: 0, color: "#67E8F9", opacity: 0.35 },
      { left: "22%", top: "76%", size: 36, rotate: 0, color: "#6EE7B7", opacity: 0.35 },
      { left: "82%", top: "74%", size: 44, rotate: 0, color: "#7DD3FC", opacity: 0.35 },
      { left: "50%", top: "46%", size: 30, rotate: 0, color: "#A7F3D0", opacity: 0.25 },
    ],
  },
  days: {
    gradient: "from-violet-50 via-indigo-50 to-sky-50",
    glyphPath: CIRCLE_PATH,
    glyphs: [
      { left: "10%", top: "14%", size: 28, rotate: 0, color: "#A78BFA", opacity: 0.3 },
      { left: "82%", top: "20%", size: 32, rotate: 0, color: "#818CF8", opacity: 0.3 },
      { left: "20%", top: "74%", size: 24, rotate: 0, color: "#60A5FA", opacity: 0.3 },
      { left: "78%", top: "76%", size: 30, rotate: 0, color: "#C4B5FD", opacity: 0.3 },
      { left: "50%", top: "44%", size: 22, rotate: 0, color: "#A5B4FC", opacity: 0.25 },
    ],
  },
  seasons: {
    gradient: "from-orange-50 via-rose-50 to-emerald-50",
    glyphPath: LEAF_PATH,
    glyphs: [
      { left: "10%", top: "14%", size: 36, rotate: -10, color: "#FB923C", opacity: 0.3 },
      { left: "82%", top: "22%", size: 40, rotate: 14, color: "#FB7185", opacity: 0.3 },
      { left: "18%", top: "72%", size: 30, rotate: -16, color: "#34D399", opacity: 0.3 },
      { left: "78%", top: "76%", size: 38, rotate: 8, color: "#FDBA74", opacity: 0.3 },
      { left: "50%", top: "42%", size: 26, rotate: 0, color: "#FECACA", opacity: 0.2 },
    ],
  },
  weather: {
    gradient: "from-sky-50 via-blue-50 to-slate-50",
    glyphPath: SUN_PATH,
    glyphs: [
      { left: "12%", top: "14%", size: 38, rotate: 0, color: "#FBBF24", opacity: 0.35 },
      { left: "82%", top: "22%", size: 44, rotate: 0, color: "#7DD3FC", opacity: 0.35 },
      { left: "20%", top: "74%", size: 30, rotate: 0, color: "#94A3B8", opacity: 0.3 },
      { left: "78%", top: "76%", size: 38, rotate: 0, color: "#FDE68A", opacity: 0.3 },
      { left: "50%", top: "44%", size: 26, rotate: 0, color: "#BAE6FD", opacity: 0.25 },
    ],
  },
  emotions: {
    gradient: "from-rose-50 via-pink-50 to-amber-50",
    glyphPath: HEART_PATH,
    glyphs: [
      { left: "10%", top: "14%", size: 36, rotate: -8, color: "#FCA5A5", opacity: 0.35 },
      { left: "84%", top: "20%", size: 42, rotate: 14, color: "#F472B6", opacity: 0.3 },
      { left: "18%", top: "74%", size: 30, rotate: -16, color: "#FBBF24", opacity: 0.3 },
      { left: "78%", top: "76%", size: 40, rotate: 8, color: "#FDA4AF", opacity: 0.35 },
      { left: "50%", top: "44%", size: 24, rotate: -4, color: "#FBCFE8", opacity: 0.25 },
    ],
  },
  food: {
    gradient: "from-amber-50 via-orange-50 to-rose-50",
    glyphPath: CIRCLE_PATH,
    glyphs: [
      { left: "10%", top: "16%", size: 34, rotate: 0, color: "#FB923C", opacity: 0.3 },
      { left: "82%", top: "20%", size: 40, rotate: 0, color: "#F59E0B", opacity: 0.3 },
      { left: "18%", top: "74%", size: 28, rotate: 0, color: "#FCA5A5", opacity: 0.3 },
      { left: "78%", top: "76%", size: 38, rotate: 0, color: "#FBBF24", opacity: 0.3 },
      { left: "50%", top: "42%", size: 26, rotate: 0, color: "#FDBA74", opacity: 0.2 },
    ],
  },
  instruments: {
    gradient: "from-violet-50 via-fuchsia-50 to-rose-50",
    glyphPath: NOTE_PATH,
    glyphs: [
      { left: "10%", top: "14%", size: 36, rotate: -8, color: "#A78BFA", opacity: 0.3 },
      { left: "82%", top: "22%", size: 40, rotate: 12, color: "#E879F9", opacity: 0.3 },
      { left: "18%", top: "74%", size: 30, rotate: -14, color: "#FB7185", opacity: 0.3 },
      { left: "78%", top: "76%", size: 38, rotate: 6, color: "#C084FC", opacity: 0.3 },
      { left: "50%", top: "42%", size: 26, rotate: 0, color: "#F0ABFC", opacity: 0.2 },
    ],
  },
  animals: {
    gradient: "from-emerald-50 via-amber-50 to-sky-50",
    glyphPath: PAW_PATH,
    glyphs: [
      { left: "10%", top: "16%", size: 36, rotate: -10, color: "#34D399", opacity: 0.3 },
      { left: "82%", top: "20%", size: 42, rotate: 12, color: "#FBBF24", opacity: 0.3 },
      { left: "18%", top: "74%", size: 30, rotate: -16, color: "#7DD3FC", opacity: 0.3 },
      { left: "78%", top: "76%", size: 38, rotate: 6, color: "#A78BFA", opacity: 0.3 },
      { left: "50%", top: "42%", size: 24, rotate: 0, color: "#86EFAC", opacity: 0.2 },
    ],
  },
};

const FALLBACK: ThemeBg = {
  gradient: "from-violet-50 via-white to-rose-50",
  glyphPath: HEART_PATH,
  glyphs: [
    { left: "8%", top: "12%", size: 34, rotate: -8, color: "#FCA5A5", opacity: 0.3 },
    { left: "86%", top: "20%", size: 42, rotate: 14, color: "#C4B5FD", opacity: 0.3 },
    { left: "18%", top: "72%", size: 30, rotate: -16, color: "#6EE7B7", opacity: 0.3 },
    { left: "78%", top: "78%", size: 38, rotate: 8, color: "#FDE68A", opacity: 0.3 },
    { left: "50%", top: "42%", size: 24, rotate: -4, color: "#F9A8D4", opacity: 0.2 },
  ],
};

export interface ThemedBackgroundProps {
  theme: string;
}

export default function ThemedBackground({ theme }: ThemedBackgroundProps) {
  const cfg = THEMES[theme] ?? FALLBACK;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br ${cfg.gradient}`}
    >
      {cfg.glyphs.map((g, i) => {
        const style: CSSProperties = {
          left: g.left,
          top: g.top,
          width: g.size,
          height: g.size,
          transform: `rotate(${g.rotate}deg)`,
          opacity: g.opacity,
          color: g.color,
        };
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute"
            style={style}
          >
            <path d={cfg.glyphPath} />
          </svg>
        );
      })}
    </div>
  );
}
