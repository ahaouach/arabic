"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import { useAudio } from "@/lib/useAudio";
import type { BodyMapSection, BodyPartKey } from "@/lib/lessonSections";

type Part = BodyMapSection["parts"][number];

/* -------------------------------------------------------------------------- */
/*  Body shapes — inline SVG, closed enum. Each shape is a <g> with its own   */
/*  hitbox that triggers the same hover/click handlers.                       */
/* -------------------------------------------------------------------------- */

interface HotspotProps {
  active: boolean;
  visited: boolean;
  onHover: () => void;
  onClick: () => void;
  children: React.ReactNode;
}

function Hotspot({ active, visited, onHover, onClick, children }: HotspotProps) {
  return (
    <motion.g
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      tabIndex={0}
      role="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: "pointer", transformOrigin: "center" }}
      filter={active ? "url(#glow)" : visited ? "url(#softGlow)" : undefined}
    >
      {children}
    </motion.g>
  );
}

function BodyShape({
  kind,
  active,
  visited,
  onHover,
  onClick,
}: {
  kind: BodyPartKey;
  active: boolean;
  visited: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const base = { active, visited, onHover, onClick };
  // Base fill colors reused across parts
  const skin = "#fde68a";
  const skinStroke = "#92400e";

  switch (kind) {
    case "head":
      return (
        <Hotspot {...base}>
          <circle
            cx={150}
            cy={80}
            r={50}
            fill={visited ? "#fcd34d" : skin}
            stroke={skinStroke}
            strokeWidth={4}
          />
        </Hotspot>
      );
    case "eye":
      return (
        <Hotspot {...base}>
          <circle cx={132} cy={72} r={7} fill="#fff" stroke="#111827" strokeWidth={2.5} />
          <circle cx={132} cy={72} r={3} fill="#111827" />
          <circle cx={168} cy={72} r={7} fill="#fff" stroke="#111827" strokeWidth={2.5} />
          <circle cx={168} cy={72} r={3} fill="#111827" />
        </Hotspot>
      );
    case "ear":
      return (
        <Hotspot {...base}>
          <ellipse
            cx={98}
            cy={82}
            rx={8}
            ry={14}
            fill={skin}
            stroke={skinStroke}
            strokeWidth={3}
          />
          <ellipse
            cx={202}
            cy={82}
            rx={8}
            ry={14}
            fill={skin}
            stroke={skinStroke}
            strokeWidth={3}
          />
        </Hotspot>
      );
    case "nose":
      return (
        <Hotspot {...base}>
          <path
            d="M 150 82 L 156 100 Q 150 106 144 100 Z"
            fill={skin}
            stroke={skinStroke}
            strokeWidth={2.5}
          />
        </Hotspot>
      );
    case "mouth":
      return (
        <Hotspot {...base}>
          <path
            d="M 132 112 Q 150 124 168 112"
            fill="none"
            stroke="#dc2626"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Hotspot>
      );
    case "hand":
      return (
        <Hotspot {...base}>
          <circle cx={70} cy={215} r={12} fill={skin} stroke={skinStroke} strokeWidth={3} />
          <circle cx={230} cy={215} r={12} fill={skin} stroke={skinStroke} strokeWidth={3} />
        </Hotspot>
      );
    case "foot":
      return (
        <Hotspot {...base}>
          <ellipse
            cx={128}
            cy={360}
            rx={18}
            ry={10}
            fill={skin}
            stroke={skinStroke}
            strokeWidth={3}
          />
          <ellipse
            cx={172}
            cy={360}
            rx={18}
            ry={10}
            fill={skin}
            stroke={skinStroke}
            strokeWidth={3}
          />
        </Hotspot>
      );
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  HumanBodyMap                                                              */
/* -------------------------------------------------------------------------- */

export default function HumanBodyMap({ section }: { section: BodyMapSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [active, setActive] = useState<BodyPartKey | null>(null);
  const [visited, setVisited] = useState<Set<BodyPartKey>>(new Set());
  const [confettiKey, setConfettiKey] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  const total = section.parts.length;
  const allDone = visited.size === total && total > 0;

  useEffect(() => {
    if (allDone && !celebrated) {
      setCelebrated(true);
      setConfettiKey((k) => k + 1);
      playAudio(undefined, "أَحْسَنْتَ");
    }
  }, [allDone, celebrated, playAudio]);

  const play = (part: Part) => {
    setActive(part.key);
    setVisited((prev) => {
      if (prev.has(part.key)) return prev;
      const next = new Set(prev);
      next.add(part.key);
      return next;
    });
    playAudio(undefined, part.audioText ?? part.name);
  };

  // Order of shape rendering ensures smaller hotspots (eye/nose/mouth) sit
  // on top of the head, so clicks land on the right layer.
  const SHAPE_ORDER: BodyPartKey[] = ["head", "ear", "eye", "nose", "mouth", "hand", "foot"];
  const partByKey = new Map<BodyPartKey, Part>();
  for (const p of section.parts) partByKey.set(p.key, p);

  const activePart = active ? partByKey.get(active) : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <Confetti trigger={confettiKey} />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {section.title && (
            <h3
              className="text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.title}
            </h3>
          )}
          {section.instructions && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {section.instructions}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-black text-amber-600 shadow ring-1 ring-black/5">
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.span>
            {visited.size} / {total}
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* SVG body */}
      <div className="relative mx-auto max-w-sm">
        <svg
          viewBox="0 0 300 400"
          className="h-auto w-full"
          role="img"
          aria-label="Interactive human body"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#0ea5e9" floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="#10b981" floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Neck + body (non-interactive) */}
          <rect x={140} y={125} width={20} height={18} fill="#fde68a" stroke="#92400e" strokeWidth={3} />
          <path
            d="M 115 145 Q 115 135 130 135 L 170 135 Q 185 135 185 145 L 195 235 Q 195 250 180 250 L 120 250 Q 105 250 105 235 Z"
            fill="#60a5fa"
            stroke="#1e3a8a"
            strokeWidth={3}
          />
          {/* Arms */}
          <path
            d="M 110 150 Q 85 180 75 210"
            fill="none"
            stroke="#fde68a"
            strokeWidth={14}
            strokeLinecap="round"
          />
          <path
            d="M 190 150 Q 215 180 225 210"
            fill="none"
            stroke="#fde68a"
            strokeWidth={14}
            strokeLinecap="round"
          />
          <path
            d="M 110 150 Q 85 180 75 210"
            fill="none"
            stroke="#92400e"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d="M 190 150 Q 215 180 225 210"
            fill="none"
            stroke="#92400e"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Legs */}
          <rect x={120} y={250} width={24} height={100} rx={10} fill="#312e81" stroke="#1e1b4b" strokeWidth={3} />
          <rect x={156} y={250} width={24} height={100} rx={10} fill="#312e81" stroke="#1e1b4b" strokeWidth={3} />

          {/* Interactive parts — render in z-order */}
          {SHAPE_ORDER.map((key) => {
            const part = partByKey.get(key);
            if (!part) return null;
            return (
              <BodyShape
                key={key}
                kind={key}
                active={active === key}
                visited={visited.has(key)}
                onHover={() => play(part)}
                onClick={() => play(part)}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating tooltip with the active part name */}
      <div className="mt-4 flex h-12 items-center justify-center">
        <AnimatePresence mode="wait">
          {activePart && (
            <motion.div
              key={activePart.key}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-xl ring-1 ring-black/5"
            >
              <span
                className="text-2xl font-black text-gray-900"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                {activePart.name}
              </span>
              {activePart.meaning && (
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {activePart.meaning}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-gradient-to-br from-amber-300 to-pink-400 p-4 text-center text-white shadow-xl"
        >
          <p
            className="text-xl font-black"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            أَحْسَنْتَ! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
}
