"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type FeedbackKind = "correct" | "wrong" | "hint" | null;

interface FeedbackOverlayProps {
  /** `null` hides the overlay. */
  kind: FeedbackKind;
  /** Arabic vowelised message. Per-kind defaults below. */
  message?: string;
  /** Auto-dismiss delay; ≤ 0 means never auto-dismiss. */
  ttlMs?: number;
  /** Fires when the TTL expires. */
  onDismiss?: () => void;
}

const DEFAULT_MESSAGES: Record<Exclude<FeedbackKind, null>, string> = {
  correct: "أَحْسَنْتَ!",
  wrong: "حَاوِلْ مَرَّةً أُخْرَى",
  hint: "اِنْظُرْ جَيِّدًا",
};

const PALETTE: Record<
  Exclude<FeedbackKind, null>,
  { bg: string; ring: string; text: string; emoji: string }
> = {
  correct: { bg: "bg-emerald-500/95", ring: "ring-emerald-300", text: "text-white", emoji: "✨" },
  wrong: { bg: "bg-rose-500/95", ring: "ring-rose-300", text: "text-white", emoji: "💫" },
  hint: { bg: "bg-amber-400/95", ring: "ring-amber-200", text: "text-amber-950", emoji: "💡" },
};

/**
 * Transient correct/wrong/hint badge centred at the top of a zone.
 * Mirrors the family-shared variant but lives under vocabulary so the
 * runtime stays self-contained.
 */
export default function FeedbackOverlay({
  kind,
  message,
  ttlMs = 1200,
  onDismiss,
}: FeedbackOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          key={kind + (message ?? "")}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onAnimationComplete={() => {
            if (ttlMs <= 0) return;
            window.setTimeout(() => onDismiss?.(), ttlMs);
          }}
          className={`pointer-events-none absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3 shadow-2xl ring-4 ${PALETTE[kind].bg} ${PALETTE[kind].ring}`}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden className="text-2xl">{PALETTE[kind].emoji}</span>
          <span
            className={`text-xl font-black ${PALETTE[kind].text}`}
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            dir="rtl"
            lang="ar"
          >
            {message ?? DEFAULT_MESSAGES[kind]}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
