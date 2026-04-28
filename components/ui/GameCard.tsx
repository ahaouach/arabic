"use client";

/**
 * Planet card — each course track is a tappable little world.
 *
 * Anatomy:
 *   - Atmospheric glow (pulses with the theme colour)
 *   - Saturn-like rings (rotating slowly)
 *   - Planet body — radial gradient + swirl overlay + hero glyph
 *   - 3 orbiting moons, each carrying a theme glyph
 *   - Sparkles in the surrounding space
 *   - Title + tagline + star rating + lesson count + EXPLORE CTA
 *
 * The whole composition tilts in 3D toward the cursor on hover, and
 * collapses to a still-pretty static planet under
 * `prefers-reduced-motion`.
 */

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

export type ThemeSlug = "arabic" | "islamic" | "quran" | "others";

export interface GameCardProps {
  id: string;
  name: string;
  slug: string;
  level?: number;
  badge?: string;
  index?: number;
  lessonsCount?: number;
}

interface ThemeStyle {
  /** Outer atmospheric halo colour. */
  glow: string;
  /** Inline `radial-gradient` painting the planet body — light highlight → dark rim. */
  surfaceGradient: string;
  /** Secondary radial swirl overlaid for "stormy" surface depth. */
  swirlGradient: string;
  /** Saturn-ring colour (kept light against the dark planet). */
  ringStroke: string;
  /** Theme-spread base colour for stars / borders. */
  accent: string;
  /** Big hero glyph painted on the planet's face. */
  hero: React.ReactNode;
  /** Tagline shown below the planet title. */
  tagline: string;
  /** Three theme glyphs that orbit the planet as moons. */
  moons: string[];
  /** Star rating 1..3 (kid-readable difficulty signal). */
  stars: number;
}

const THEME_STYLES: Record<ThemeSlug, ThemeStyle> = {
  arabic: {
    glow: "bg-sky-400/60",
    surfaceGradient:
      "radial-gradient(circle at 30% 28%, #BAE6FD 0%, #38BDF8 30%, #4F46E5 60%, #312E81 100%)",
    swirlGradient:
      "radial-gradient(ellipse at 70% 70%, rgba(244, 114, 182, 0.55) 0%, rgba(99, 102, 241, 0) 55%)",
    ringStroke: "#E0F2FE",
    accent: "#38BDF8",
    hero: (
      <span
        className="text-5xl font-black text-white drop-shadow-2xl"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        dir="rtl"
        lang="ar"
        aria-hidden
      >
        ا ب ت
      </span>
    ),
    tagline: "Letters, words & stories",
    moons: ["✏️", "📚", "✨"],
    stars: 1,
  },
  islamic: {
    glow: "bg-emerald-400/60",
    surfaceGradient:
      "radial-gradient(circle at 30% 28%, #A7F3D0 0%, #34D399 30%, #0D9488 60%, #064E3B 100%)",
    swirlGradient:
      "radial-gradient(ellipse at 70% 70%, rgba(34, 211, 238, 0.55) 0%, rgba(16, 185, 129, 0) 55%)",
    ringStroke: "#D1FAE5",
    accent: "#34D399",
    hero: (
      <span className="text-7xl drop-shadow-2xl" aria-hidden>
        ☪︎
      </span>
    ),
    tagline: "Values, stories & duas",
    moons: ["🌙", "⭐", "🕌"],
    stars: 2,
  },
  quran: {
    glow: "bg-amber-400/60",
    surfaceGradient:
      "radial-gradient(circle at 30% 28%, #FEF3C7 0%, #FBBF24 30%, #F97316 60%, #9A3412 100%)",
    swirlGradient:
      "radial-gradient(ellipse at 70% 70%, rgba(244, 63, 94, 0.55) 0%, rgba(251, 191, 36, 0) 55%)",
    ringStroke: "#FEF3C7",
    accent: "#FBBF24",
    hero: (
      <span className="text-7xl drop-shadow-2xl" aria-hidden>
        ۞
      </span>
    ),
    tagline: "Memorize with Tajweed",
    moons: ["📖", "🌟", "🤍"],
    stars: 3,
  },
  others: {
    glow: "bg-violet-400/60",
    surfaceGradient:
      "radial-gradient(circle at 30% 28%, #DDD6FE 0%, #A78BFA 30%, #7C3AED 60%, #3B0764 100%)",
    swirlGradient:
      "radial-gradient(ellipse at 70% 70%, rgba(244, 114, 182, 0.55) 0%, rgba(139, 92, 246, 0) 55%)",
    ringStroke: "#EDE9FE",
    accent: "#A78BFA",
    hero: (
      <span className="text-7xl drop-shadow-2xl" aria-hidden>
        ✦
      </span>
    ),
    tagline: "Games, crafts & more",
    moons: ["🎨", "🧩", "🎮"],
    stars: 2,
  },
};

const FALLBACK = THEME_STYLES.others;

function pickStyle(slug: string): ThemeStyle {
  if (slug in THEME_STYLES) return THEME_STYLES[slug as ThemeSlug];
  return FALLBACK;
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.5 } as const;
const TILT_AMPLITUDE_DEG = 10;
const PLANET_SIZE = 220; // diameter in px

export default function GameCard({
  id,
  name,
  slug,
  badge,
  index = 0,
  lessonsCount,
}: GameCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const style = useMemo(() => pickStyle(slug), [slug]);
  const planetIndex = (index % 3) + 1; // I / II / III roman label

  const href = `/dashboard/courses/${encodeURIComponent(slug)}`;

  /* --- 3D tilt: mouse-tracked rotation around the card centre. ---------- */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, SPRING);
  const rotateY = useSpring(rawX, SPRING);
  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawX.set((px - 0.5) * 2 * TILT_AMPLITUDE_DEG);
    rawY.set((py - 0.5) * -2 * TILT_AMPLITUDE_DEG);
  };
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.18, type: "spring", stiffness: 110, damping: 14 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group select-none flex flex-col items-center w-full max-w-xs"
    >
      {/* PLANET visual (top half of the card) */}
      <motion.div
        className="relative"
        style={{
          width: PLANET_SIZE,
          height: PLANET_SIZE,
          transform,
          transformStyle: "preserve-3d",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, -10, 0] }
        }
        transition={{ duration: 6 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Pulsing atmospheric halo */}
        <motion.div
          aria-hidden
          className={`absolute inset-0 rounded-full blur-3xl ${style.glow}`}
          animate={
            prefersReducedMotion
              ? { opacity: 0.55 }
              : { opacity: [0.45, 0.85, 0.45], scale: [1, 1.18, 1] }
          }
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Saturn-like rings — counter-rotating ellipse */}
        <motion.svg
          aria-hidden
          viewBox="0 0 220 220"
          className="absolute inset-0"
          style={{ overflow: "visible" }}
          animate={prefersReducedMotion ? undefined : { rotate: [0, -360] }}
          transition={{ duration: 28 + index * 4, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer ring */}
          <ellipse
            cx="110"
            cy="110"
            rx="135"
            ry="32"
            fill="none"
            stroke={style.ringStroke}
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />
          {/* Inner ring */}
          <ellipse
            cx="110"
            cy="110"
            rx="120"
            ry="22"
            fill="none"
            stroke={style.ringStroke}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* Ring particles */}
          {[0, 90, 180, 270].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            const x = 110 + Math.cos(r) * 130;
            const y = 110 + Math.sin(r) * 28;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill={style.ringStroke}
                opacity="0.9"
              />
            );
          })}
        </motion.svg>

        {/* Planet body — slow rotation of the swirl overlay */}
        <div
          className="absolute inset-3 rounded-full shadow-2xl shadow-black/30 ring-2 ring-white/40"
          style={{
            background: style.surfaceGradient,
            transform: "translateZ(20px)",
          }}
        >
          {/* Swirl overlay rotates inside the body so the highlight stays put */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: style.swirlGradient }}
            animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
            transition={{ duration: 35 + index * 5, repeat: Infinity, ease: "linear" }}
          />
          {/* Bright crescent highlight (inner glow) */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 28% 26%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 35%)",
            }}
          />
          {/* Hero glyph centred on the planet face */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {style.hero}
            </motion.div>
          </div>
        </div>

        {/* 3 orbiting moons */}
        {!prefersReducedMotion &&
          style.moons.map((moon, mi) => {
            const orbitRadius = 110 + mi * 12; // 110, 122, 134
            const orbitDuration = 9 + mi * 3; // 9s, 12s, 15s
            const startAngle = mi * 120; // distribute around
            return (
              <motion.div
                key={mi}
                aria-hidden
                className="absolute inset-0"
                animate={{ rotate: [startAngle, startAngle + 360] }}
                transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translateZ(40px)" }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg shadow-lg ring-2 ring-white"
                  style={{ transform: `translate(-50%, -50%) translateY(-${orbitRadius}px)` }}
                  // Counter-rotate so the glyph stays upright as the orbital ring spins.
                  animate={{ rotate: [-startAngle, -startAngle - 360] }}
                  transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
                >
                  {moon}
                </motion.div>
              </motion.div>
            );
          })}

        {/* Sparkles in the surrounding space */}
        {!prefersReducedMotion && (
          <>
            <motion.span
              className="absolute -top-4 left-6 text-2xl"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              aria-hidden
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -bottom-2 right-8 text-xl"
              animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
              aria-hidden
            >
              ⭐
            </motion.span>
            <motion.span
              className="absolute top-12 -right-6 text-sm"
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.7, 1, 0.7] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 1.2 }}
              aria-hidden
            >
              ✦
            </motion.span>
          </>
        )}
      </motion.div>

      {/* Card body below the planet — title, tagline, stars, CTA */}
      <Link
        href={href}
        aria-label={`Explore the ${name} planet`}
        className="mt-6 block w-full rounded-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2"
      >
        <motion.div
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="relative rounded-3xl bg-white/85 px-5 py-5 text-center shadow-xl ring-1 ring-white/70 backdrop-blur-sm"
        >
          {/* Planet roman-numeral tag */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
            style={{ backgroundColor: `${style.accent}22`, color: style.accent }}
          >
            <span aria-hidden>🪐</span>
            Planet {romanNumeral(planetIndex)}
            {badge ? <span className="text-gray-600/80 normal-case tracking-normal"> · {badge}</span> : null}
          </div>

          {/* Title */}
          <h3 className="mt-3 text-2xl font-black tracking-tight text-gray-900">
            {name}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-600">{style.tagline}</p>

          {/* Stars + lessons count row */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1" aria-label={`${style.stars} of 3 stars`}>
              {[0, 1, 2].map((s) => (
                <motion.span
                  key={s}
                  aria-hidden
                  className={`text-xl ${s < style.stars ? "text-amber-400" : "text-gray-200"}`}
                  animate={
                    prefersReducedMotion || s >= style.stars
                      ? undefined
                      : { scale: [1, 1.18, 1] }
                  }
                  transition={{ duration: 1.6, repeat: Infinity, delay: s * 0.2 }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            {typeof lessonsCount === "number" && lessonsCount > 0 && (
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
                <span aria-hidden>📚</span>
                {lessonsCount} lesson{lessonsCount === 1 ? "" : "s"}
              </div>
            )}
          </div>

          {/* EXPLORE CTA with shimmer */}
          <motion.span
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            className="relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-3 text-sm font-black text-white shadow-lg ring-1 ring-black/10"
            style={{ background: `linear-gradient(135deg, ${style.accent}, #1F2937)` }}
            data-theme-id={id}
          >
            {!prefersReducedMotion && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-full w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                animate={{ x: ["0%", "350%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              />
            )}
            <span className="relative">EXPLORE</span>
            <motion.span
              aria-hidden
              animate={prefersReducedMotion ? undefined : { x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="relative text-base"
            >
              🚀
            </motion.span>
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function romanNumeral(n: number): string {
  return n === 1 ? "I" : n === 2 ? "II" : n === 3 ? "III" : `${n}`;
}
