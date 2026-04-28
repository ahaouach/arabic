"use client";

import { motion, useReducedMotion } from "framer-motion";

interface NumberPadProps {
  value: string;
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  /** Submit button label — defaults to "تَحَقَّقْ" (verify). */
  submitLabel?: string;
}

/**
 * Western-digit (0-9) keypad with ⌫ backspace, ✕ clear, and a submit
 * button. The Count zone uses this; future zones that need numeric
 * input can reuse it. RTL-friendly Arabic submit label, LTR digit
 * display so numbers read naturally.
 */
export default function NumberPad({
  value,
  onDigit,
  onBackspace,
  onClear,
  onSubmit,
  submitLabel = "تَحَقَّقْ",
}: NumberPadProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl bg-white p-4 shadow-md ring-1 ring-gray-100">
      <div
        role="status"
        aria-live="polite"
        className="flex h-20 w-full items-center justify-center rounded-2xl bg-gray-50 text-5xl font-black text-gray-900 ring-1 ring-gray-200"
        style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
      >
        {value || "·"}
      </div>

      <div className="grid w-full grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <NumberKey
            key={d}
            label={d}
            onClick={() => onDigit(d)}
            reduced={!!prefersReducedMotion}
          />
        ))}
        <NumberKey
          label="✕"
          onClick={onClear}
          ariaLabel="مَسْحٌ"
          tone="neutral"
          reduced={!!prefersReducedMotion}
        />
        <NumberKey label="0" onClick={() => onDigit("0")} reduced={!!prefersReducedMotion} />
        <NumberKey
          label="⌫"
          onClick={onBackspace}
          ariaLabel="تَرَاجُعٌ"
          tone="neutral"
          reduced={!!prefersReducedMotion}
        />
      </div>

      <motion.button
        type="button"
        onClick={onSubmit}
        disabled={!value}
        whileHover={prefersReducedMotion || !value ? undefined : { scale: 1.03 }}
        whileTap={prefersReducedMotion || !value ? undefined : { scale: 0.97 }}
        className={`w-full rounded-2xl px-6 py-3 text-lg font-black text-white shadow-md transition ${
          value
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        dir="rtl"
        lang="ar"
        style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
      >
        {submitLabel}
      </motion.button>
    </div>
  );
}

function NumberKey({
  label,
  onClick,
  ariaLabel,
  tone = "digit",
  reduced,
}: {
  label: string;
  onClick: () => void;
  ariaLabel?: string;
  tone?: "digit" | "neutral";
  reduced: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      className={`flex h-14 items-center justify-center rounded-xl text-2xl font-black shadow-sm ring-1 ring-gray-200 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/70 ${
        tone === "digit"
          ? "bg-white text-gray-900 hover:bg-violet-50"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </motion.button>
  );
}
