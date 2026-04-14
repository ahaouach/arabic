"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export type ThemeSlug = "arabic" | "islamic" | "quran" | "others";

export interface GameCardProps {
  id: string;
  name: string;
  slug: string;
  level?: number;
  badge?: string;
  index?: number;
}

interface ThemeStyle {
  gradient: string;
  glow: string;
  accent: string;
  blob: string;
  icon: React.ReactNode;
  tagline: string;
}

const THEME_STYLES: Record<ThemeSlug, ThemeStyle> = {
  arabic: {
    gradient: "from-sky-400 via-indigo-500 to-fuchsia-500",
    glow: "bg-sky-300/60",
    accent: "text-sky-50",
    blob: "M44.3,-58.2C56.2,-48.1,63.6,-32.8,66.8,-16.9C70,-1,68.9,15.5,61.6,28.7C54.3,41.9,40.8,51.8,25.9,58.2C11,64.6,-5.4,67.6,-20.8,63.8C-36.2,60,-50.6,49.4,-59.2,35.4C-67.8,21.4,-70.6,3.9,-66.4,-11.5C-62.2,-26.9,-51,-40.2,-37.7,-50.1C-24.4,-60,-12.2,-66.5,2.4,-69.7C17,-72.9,34,-68.3,44.3,-58.2Z",
    icon: (
      <span className="text-5xl drop-shadow-lg" aria-hidden>
        ا ب ت
      </span>
    ),
    tagline: "Letters, words & stories",
  },
  islamic: {
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    glow: "bg-emerald-300/60",
    accent: "text-emerald-50",
    blob: "M39.6,-62.1C52.4,-54.6,64.9,-45.3,70.9,-32.8C76.9,-20.3,76.5,-4.6,72.8,9.9C69.1,24.4,62.1,37.6,51.6,47.9C41.1,58.2,27.1,65.5,11.7,69.1C-3.7,72.7,-20.5,72.6,-33.8,65.4C-47.1,58.2,-56.8,43.9,-62.8,28.6C-68.7,13.3,-70.9,-3,-66.5,-17.3C-62,-31.6,-50.9,-43.9,-37.9,-52.4C-24.8,-60.9,-9.8,-65.6,2.8,-69.6C15.3,-73.5,26.9,-69.7,39.6,-62.1Z",
    icon: (
      <span className="text-5xl drop-shadow-lg" aria-hidden>
        ☪︎
      </span>
    ),
    tagline: "Values, stories & duas",
  },
  quran: {
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    glow: "bg-amber-300/60",
    accent: "text-amber-50",
    blob: "M45.7,-67.8C58.3,-58.9,66.6,-43.8,70.2,-28.2C73.8,-12.6,72.6,3.6,67.6,18.3C62.6,33,53.8,46.2,41.7,55.6C29.6,65,14.8,70.7,-0.9,71.9C-16.5,73.2,-33,70,-44.9,60.3C-56.8,50.6,-64,34.3,-67.7,17.4C-71.3,0.5,-71.4,-17.1,-64.3,-30.6C-57.2,-44.1,-43,-53.6,-28.5,-62C-13.9,-70.5,1,-77.9,15.7,-76.3C30.4,-74.7,33.1,-76.7,45.7,-67.8Z",
    icon: (
      <span className="text-5xl drop-shadow-lg" aria-hidden>
        ۞
      </span>
    ),
    tagline: "Memorize with Tajweed",
  },
  others: {
    gradient: "from-violet-400 via-purple-500 to-pink-500",
    glow: "bg-violet-300/60",
    accent: "text-violet-50",
    blob: "M38.9,-61.3C50.8,-54.3,60.9,-43.5,67.3,-30.7C73.7,-17.9,76.3,-3.1,74.1,11.1C71.9,25.3,64.9,38.9,54.3,49.2C43.7,59.6,29.5,66.7,14.2,69.8C-1.1,73,-17.5,72.2,-32,66.2C-46.5,60.3,-59.1,49.1,-65.9,35.3C-72.6,21.5,-73.5,5,-70.2,-10.3C-66.9,-25.6,-59.4,-39.7,-48.2,-47.2C-37,-54.8,-22.1,-55.7,-8,-58C6.1,-60.3,27,-68.2,38.9,-61.3Z",
    icon: (
      <span className="text-5xl drop-shadow-lg" aria-hidden>
        ✦
      </span>
    ),
    tagline: "Games, crafts & more",
  },
};

const FALLBACK: ThemeStyle = THEME_STYLES.others;

function pickStyle(slug: string): ThemeStyle {
  if (slug in THEME_STYLES) return THEME_STYLES[slug as ThemeSlug];
  return FALLBACK;
}

export default function GameCard({ id, name, slug, level = 1, badge, index = 0 }: GameCardProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const style = useMemo(() => pickStyle(slug), [slug]);

  const floatAnim = prefersReducedMotion
    ? {}
    : {
        y: [0, -8, 0],
        rotate: [0, 1.5, 0, -1.5, 0],
      };

  const handleStart = () => {
    // Navigate to a slug-based sub-route. Slug is validated server-side before any DB query.
    router.push(`/dashboard/courses/${encodeURIComponent(slug)}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 120, damping: 14 }}
      whileHover={{ scale: 1.04, rotate: -1 }}
      whileTap={{ scale: 0.97 }}
      className="relative group cursor-pointer select-none"
      onClick={handleStart}
      role="button"
      tabIndex={0}
      aria-label={`Start learning ${name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStart();
        }
      }}
    >
      {/* Glow */}
      <div
        className={`absolute -inset-4 rounded-[40%] blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 ${style.glow}`}
        aria-hidden
      />

      {/* Floating card */}
      <motion.div
        animate={floatAnim}
        transition={{ duration: 5 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
        className={`relative overflow-hidden rounded-[36px] bg-gradient-to-br ${style.gradient} p-6 shadow-2xl shadow-black/20 ring-1 ring-white/30`}
      >
        {/* Organic blob backdrop */}
        <svg
          viewBox="-80 -80 160 160"
          className="absolute -right-10 -top-10 h-48 w-48 opacity-30"
          aria-hidden
        >
          <path d={style.blob} fill="white" />
        </svg>

        {/* Sparkles */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-4 right-6 text-2xl"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              aria-hidden
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute bottom-10 left-4 text-lg"
              animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              aria-hidden
            >
              ⭐
            </motion.div>
          </>
        )}

        {/* Badge */}
        <div className="relative flex items-start justify-between">
          <motion.div
            initial={{ rotate: -6 }}
            whileHover={{ rotate: 0, scale: 1.1 }}
            className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-800 shadow-md"
          >
            <span aria-hidden>🏆</span>
            {badge ?? `Level ${level}`}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="rounded-2xl bg-white/25 p-3 backdrop-blur-sm ring-1 ring-white/40"
          >
            {style.icon}
          </motion.div>
        </div>

        {/* Title */}
        <div className="relative mt-14">
          <h3 className={`text-2xl font-black tracking-tight text-white drop-shadow ${style.accent}`}>
            {name}
          </h3>
          <p className="mt-1 text-sm font-medium text-white/90">{style.tagline}</p>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${20 + index * 15}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.9 }}
              className="h-full rounded-full bg-white shadow-inner"
            />
          </div>
        </div>

        {/* CTA */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleStart();
          }}
          className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-lg ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          data-theme-id={id}
        >
          Start Learning
          <motion.span
            aria-hidden
            animate={prefersReducedMotion ? {} : { x: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.article>
  );
}
