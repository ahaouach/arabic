"use client";

import { motion, useReducedMotion } from "framer-motion";
import ReplayButton from "./ReplayButton";

interface InstructionBannerProps {
  textAr: string;
  subTextAr?: string;
  colorChipHex?: string;
  onReplayAudio?: () => void;
  replayAriaLabel?: string;
  changeKey?: string | number;
  className?: string;
}

/** RTL banner with optional colour chip + audio replay. */
export default function InstructionBanner({
  textAr,
  subTextAr,
  colorChipHex,
  onReplayAudio,
  replayAriaLabel,
  changeKey,
  className = "",
}: InstructionBannerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={changeKey}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex w-full items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-violet-50 to-sky-50 p-4 sm:p-6 shadow-inner ring-1 ring-violet-100 ${className}`}
    >
      <div className="flex flex-1 items-center gap-4" dir="rtl" lang="ar">
        {colorChipHex && (
          <span
            aria-hidden
            className="inline-block h-9 w-9 shrink-0 rounded-full ring-4 ring-white shadow-md"
            style={{ backgroundColor: colorChipHex }}
          />
        )}
        <div className="flex flex-col gap-1">
          <span
            className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {textAr}
          </span>
          {subTextAr && (
            <span
              className="text-base text-gray-600"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {subTextAr}
            </span>
          )}
        </div>
      </div>

      {onReplayAudio && (
        <ReplayButton
          onClick={onReplayAudio}
          variant="audio"
          ariaLabel={replayAriaLabel}
          size="md"
        />
      )}
    </motion.div>
  );
}
