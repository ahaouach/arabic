"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import ColorPalette from "./ColorPalette";
import Confetti from "./Confetti";
import PaintCanvas from "./PaintCanvas";
import { useAudio } from "@/lib/useAudio";
import type { PaintGameSection } from "@/lib/lessonSections";

export default function PaintGame({ section }: { section: PaintGameSection }) {
  const { playAudio, isMuted, toggleMute } = useAudio();

  const [selected, setSelected] = useState<PaintGameSection["colors"][number] | null>(null);
  const [fills, setFills] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, "idle" | "correct" | "wrong">>({});
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: "good" | "retry" | "hint"; text: string } | null>(
    null,
  );
  const [confettiKey, setConfettiKey] = useState(0);

  const total = section.objects.length;

  const correctCount = useMemo(
    () => Object.values(statuses).filter((s) => s === "correct").length,
    [statuses],
  );

  const hexByName = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of section.colors) m.set(c.name, c.hex);
    return m;
  }, [section.colors]);

  const onHoverColor = (color: PaintGameSection["colors"][number]) => {
    playAudio(undefined, color.audioText ?? color.name);
  };

  const onSelectColor = (color: PaintGameSection["colors"][number]) => {
    setSelected(color);
    playAudio(undefined, color.audioText ?? color.name);
  };

  const onPaint = (index: number) => {
    if (!selected) {
      setFeedback({ kind: "hint", text: "اِخْتَرْ لَوْنًا أَوَّلًا!" });
      window.setTimeout(() => setFeedback(null), 1500);
      return;
    }
    const obj = section.objects[index];
    if (!obj) return;

    // Already correctly painted — ignore.
    if (statuses[index] === "correct") return;

    setFills((prev) => ({ ...prev, [index]: selected.hex }));

    if (selected.name === obj.correctColor) {
      setStatuses((prev) => ({ ...prev, [index]: "correct" }));
      setStars((s) => s + 1);
      setConfettiKey((k) => k + 1);
      setFeedback({ kind: "good", text: "أَحْسَنْتَ! 🎉" });
      playAudio(undefined, "أَحْسَنْتَ");
    } else {
      setStatuses((prev) => ({ ...prev, [index]: "wrong" }));
      setFeedback({ kind: "retry", text: "جَرِّبْ لَوْنًا آخَرَ!" });
      playAudio(undefined, "جَرِّبْ لَوْنًا آخَرَ");
      // Clear the wrong fill after a brief moment so kids can retry.
      window.setTimeout(() => {
        setStatuses((prev) => {
          if (prev[index] !== "wrong") return prev;
          const next = { ...prev };
          delete next[index];
          return next;
        });
        setFills((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      }, 900);
    }

    window.setTimeout(() => setFeedback(null), 1800);
  };

  const reset = () => {
    setFills({});
    setStatuses({});
    setStars(0);
    setSelected(null);
    setFeedback(null);
  };

  const done = correctCount === total;

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
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
            <span aria-hidden>⭐</span>
            {stars} / {total}
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
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-800 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Palette */}
      <ColorPalette
        colors={section.colors}
        selected={selected?.name ?? null}
        onSelect={onSelectColor}
        onHover={onHoverColor}
      />

      {/* Feedback */}
      <div className="mt-4 flex h-8 items-center justify-center">
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback.text}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className={`rounded-full px-4 py-1 text-sm font-black shadow ${
                feedback.kind === "good"
                  ? "bg-emerald-100 text-emerald-700"
                  : feedback.kind === "retry"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
              }`}
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas */}
      <div className="mt-4">
        <PaintCanvas
          objects={section.objects}
          fills={fills}
          statuses={statuses}
          onPaint={onPaint}
        />
      </div>

      {/* Current color chip */}
      {selected && (
        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-gray-700">
          <span>Selected:</span>
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-full ring-2 ring-gray-900"
            style={{ backgroundColor: selected.hex }}
          />
          <span lang="ar" dir="rtl">
            {selected.name}
          </span>
        </div>
      )}

      {/* Completion banner */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-gradient-to-br from-amber-300 to-pink-400 p-5 text-center text-white shadow-xl"
        >
          <div className="text-4xl" aria-hidden>
            🏆
          </div>
          <p className="mt-2 text-xl font-black" lang="ar" dir="rtl">
            أَحْسَنْتَ! لَقَدْ أَكْمَلْتَ كُلَّ الْأَلْوَانِ!
          </p>
        </motion.div>
      )}
    </div>
  );
}
