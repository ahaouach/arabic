"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export interface FeedbackOverlayProps {
  /** `null` = hidden, `correct` = ✓ green, `wrong` = ✕ rose. */
  kind: "correct" | "wrong" | null;
  /** Called after the overlay auto-dismisses. */
  onDismiss?: () => void;
  /** Auto-dismiss delay in ms. 0 disables auto-dismiss. Default 1400. */
  autoDismissMs?: number;
  /** Override the default Arabic caption (fully vowelized). */
  message?: string;
}

const DEFAULT_MESSAGES: Record<"correct" | "wrong", string> = {
  correct: "أَحْسَنْتَ!",
  wrong: "حَاوِلْ مَرَّةً أُخْرَى",
};

/**
 * Inline feedback card. Pairs colour (green / rose) with a bold glyph
 * (✓ / ✕) so it is legible to colour-blind and low-vision children.
 * Absolutely positioned inside its relative-parent zone, not full-screen,
 * so keyboard focus stays in the zone.
 */
export default function FeedbackOverlay({
  kind,
  onDismiss,
  autoDismissMs = 1400,
  message,
}: FeedbackOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!kind || autoDismissMs <= 0 || !onDismiss) return;
    const t = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(t);
  }, [kind, autoDismissMs, onDismiss]);

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          key={kind}
          role="status"
          aria-live="polite"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.8, y: 12 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className={`pointer-events-none absolute inset-x-0 top-4 z-20 mx-auto flex w-fit items-center gap-3 rounded-full px-5 py-2 shadow-xl ring-1 ring-black/5 ${
            kind === "correct" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          }`}
        >
          <span aria-hidden className="text-2xl font-black">
            {kind === "correct" ? "✓" : "✕"}
          </span>
          <span
            lang="ar"
            dir="rtl"
            className="text-base font-black"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {message ?? DEFAULT_MESSAGES[kind]}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
