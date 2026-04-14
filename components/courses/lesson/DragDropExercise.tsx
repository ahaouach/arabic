"use client";

import { useEffect, useMemo, useState } from "react";
import type { DragDropStep } from "@/lib/lessons-schema";

interface DragDropExerciseProps {
  step: DragDropStep;
  feedback: "correct" | "incorrect" | null;
  onAnswer: (value: Record<string, string>) => void;
}

/**
 * SECURITY: All text fields rendered as JSX children — React auto-escapes.
 * No `dangerouslySetInnerHTML`.
 *
 * Implementation note: uses native HTML5 drag-and-drop to keep dependencies
 * to zero. Tap-to-place fallback is supported by clicking the item then a
 * drop zone — useful on mobile / touch devices where HTML5 DnD is flaky.
 */
export default function DragDropExercise({
  step,
  feedback,
  onAnswer,
}: DragDropExerciseProps) {
  const items = step.pairs.map((p) => p.item);
  // Stable shuffle of the right-column targets so SSR/CSR match.
  const targets = useMemo(
    () => shuffleStable(step.pairs.map((p) => p.target), step.id),
    [step.id, step.pairs]
  );

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [pickedItem, setPickedItem] = useState<string | null>(null);

  useEffect(() => {
    setPlacements({});
    setPickedItem(null);
  }, [step.id]);

  const locked = feedback !== null;

  function place(item: string, target: string) {
    if (locked) return;
    const next = { ...placements, [item]: target };
    setPlacements(next);
    setPickedItem(null);
    if (Object.keys(next).length === items.length) {
      onAnswer(next);
    }
  }

  function pickItem(item: string) {
    if (locked || placements[item]) return;
    setPickedItem(item === pickedItem ? null : item);
  }

  function tapTarget(target: string) {
    if (!pickedItem) return;
    place(pickedItem, target);
  }

  function itemForTarget(target: string): string | undefined {
    return Object.entries(placements).find(([, t]) => t === target)?.[0];
  }

  return (
    <div>
      {/* Items pool */}
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {items.map((item) => {
          const isPlaced = placements[item] != null;
          const isPicked = pickedItem === item;
          if (isPlaced) return null;
          return (
            <button
              key={item}
              type="button"
              draggable={!locked}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", item);
                setPickedItem(item);
              }}
              onClick={() => pickItem(item)}
              disabled={locked}
              className={[
                "cursor-grab rounded-2xl border-2 px-5 py-4 text-3xl font-bold shadow-sm transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500",
                isPicked
                  ? "border-primary-500 bg-primary-100 scale-105"
                  : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-primary-300",
              ].join(" ")}
              aria-pressed={isPicked}
              aria-label={`Item ${item}`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Targets / drop zones */}
      <div className="grid gap-3 sm:grid-cols-2">
        {targets.map((target) => {
          const placed = itemForTarget(target);
          const correctItem = step.pairs.find((p) => p.target === target)?.item;
          const isCorrect = locked && placed === correctItem;
          const isWrong = locked && placed !== undefined && placed !== correctItem;
          return (
            <div
              key={target}
              onDragOver={(e) => {
                if (!locked) e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (locked) return;
                const item = e.dataTransfer.getData("text/plain");
                if (item) place(item, target);
              }}
              onClick={() => tapTarget(target)}
              role="button"
              tabIndex={0}
              className={[
                "flex min-h-[64px] cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed px-4 py-3 text-base font-medium transition-all",
                locked
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50"
                    : isWrong
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-200 bg-gray-50"
                  : placed
                    ? "border-primary-300 bg-primary-50"
                    : pickedItem
                      ? "border-primary-400 bg-primary-50/50 hover:bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-300",
              ].join(" ")}
            >
              <span className="text-gray-700">{target}</span>
              {placed && (
                <span className="ml-3 text-2xl font-bold text-primary-700">
                  {placed}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!locked && (
        <p className="mt-4 text-center text-xs text-gray-400">
          Drag the items above onto the matching boxes — or tap an item then tap a box.
        </p>
      )}
    </div>
  );
}

/** Stable shuffle so SSR/CSR produce the same order. */
function shuffleStable<T>(arr: T[], seed: string): T[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
