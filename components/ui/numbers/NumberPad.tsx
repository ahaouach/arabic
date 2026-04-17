"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback } from "react";

export interface NumberPadProps {
  /** Currently typed value, Western-digit string, e.g. "", "1", "10". */
  value: string;
  /** Called with the new value on every press of a digit / backspace. */
  onChange: (next: string) => void;
  /** Called when the child presses the ✓ submit button. */
  onSubmit: () => void;
  /** Max length of the accumulator — default 2 (enough for 10). */
  maxLength?: number;
  /** Disable all keys (e.g. while feedback is showing). */
  disabled?: boolean;
  /** Visual label above the pad (already vowelized if Arabic). */
  label?: string;
}

/**
 * Digit keypad 1..9, 0, backspace, submit. Every button is ≥ 72×72 px per
 * the spec. Numbers are displayed Western-style (1, 2, 3…) — Eastern
 * glyphs are never shown here because the child must type the Western
 * digit they see in the rest of the lesson.
 */
export default function NumberPad({
  value,
  onChange,
  onSubmit,
  maxLength = 2,
  disabled = false,
  label,
}: NumberPadProps) {
  const prefersReducedMotion = useReducedMotion();

  const pushDigit = useCallback(
    (d: string) => {
      if (disabled) return;
      if (value.length >= maxLength) return;
      onChange(value + d);
    },
    [disabled, maxLength, onChange, value],
  );

  const backspace = useCallback(() => {
    if (disabled) return;
    if (value.length === 0) return;
    onChange(value.slice(0, -1));
  }, [disabled, onChange, value]);

  const canSubmit = !disabled && value.length > 0;

  const keyTap = prefersReducedMotion ? undefined : { scale: 0.94 };
  const keyHover = prefersReducedMotion ? undefined : { y: -2, scale: 1.03 };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <div className="text-xs font-black uppercase tracking-widest text-gray-500">
          {label}
        </div>
      )}

      {/* Accumulator display */}
      <div
        aria-live="polite"
        aria-label="Typed answer"
        dir="ltr"
        className="flex h-20 min-w-[6rem] items-center justify-center rounded-3xl bg-white px-6 text-5xl font-black text-gray-900 shadow-inner ring-2 ring-black/5 tabular-nums"
        style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
      >
        {value || <span className="text-gray-300">—</span>}
      </div>

      {/* Keypad grid */}
      <div className="grid grid-cols-3 gap-3" dir="ltr">
        {digits.map((d) => (
          <motion.button
            key={d}
            type="button"
            disabled={disabled || value.length >= maxLength}
            onClick={() => pushDigit(d)}
            whileHover={keyHover}
            whileTap={keyTap}
            aria-label={`Digit ${d}`}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white text-3xl font-black text-gray-900 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
          >
            {d}
          </motion.button>
        ))}

        {/* Bottom row: backspace, 0, submit */}
        <motion.button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={backspace}
          whileHover={keyHover}
          whileTap={keyTap}
          aria-label="Backspace"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gray-100 text-2xl font-black text-gray-700 shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ⌫
        </motion.button>

        <motion.button
          type="button"
          disabled={disabled || value.length >= maxLength}
          onClick={() => pushDigit("0")}
          whileHover={keyHover}
          whileTap={keyTap}
          aria-label="Digit 0"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white text-3xl font-black text-gray-900 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: '"Nunito", system-ui, sans-serif' }}
        >
          0
        </motion.button>

        <motion.button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          whileHover={keyHover}
          whileTap={keyTap}
          aria-label="Submit answer"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-3xl font-black text-white shadow-lg transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✓
        </motion.button>
      </div>
    </div>
  );
}
