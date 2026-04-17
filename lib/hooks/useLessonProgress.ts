"use client";

import { useCallback, useMemo, useRef, useState } from "react";

/**
 * Lesson-level progression state machine used by every lesson
 * orchestrator (`LessonAdventure`, `NumbersLessonPage`, …).
 *
 * Phases: `intro` → `zone[0..N-1]` → `complete`.
 * Stars increment once per zone completion (idempotent — a zone
 * calling `completeZone` twice for the same index only awards one
 * star). Confetti fires once per `completeZone`, plus once more on
 * the final `advanceZone` that lands on `complete`.
 */

export type LessonPhase =
  | { kind: "intro" }
  | { kind: "zone"; index: number }
  | { kind: "complete" };

export interface ZoneResult {
  correct: number;
  total: number;
}

export interface UseLessonProgressReturn {
  phase: LessonPhase;
  stars: number;
  confettiKey: number;
  zoneResults: Record<number, ZoneResult | null>;
  /** Aggregated correct / total across zones that report a result. */
  totals: { correct: number; total: number };
  start(): void;
  completeZone(index: number, result?: ZoneResult): void;
  advanceZone(index: number): void;
  reset(): void;
}

export function useLessonProgress(totalZones: number): UseLessonProgressReturn {
  const [phase, setPhase] = useState<LessonPhase>({ kind: "intro" });
  const [stars, setStars] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [zoneResults, setZoneResults] = useState<Record<number, ZoneResult | null>>({});

  // Idempotence gate for completeZone — a ref survives strict-mode
  // double-invocation without awarding two stars.
  const completedRef = useRef<Set<number>>(new Set());

  const totals = useMemo(() => {
    let correct = 0;
    let total = 0;
    for (const r of Object.values(zoneResults)) {
      if (!r) continue;
      correct += r.correct;
      total += r.total;
    }
    return { correct, total };
  }, [zoneResults]);

  const start = useCallback(() => {
    if (totalZones > 0) setPhase({ kind: "zone", index: 0 });
    else setPhase({ kind: "complete" });
  }, [totalZones]);

  const completeZone = useCallback(
    (index: number, result?: ZoneResult) => {
      if (completedRef.current.has(index)) return;
      completedRef.current.add(index);
      setZoneResults((prev) => ({ ...prev, [index]: result ?? null }));
      setStars((s) => s + 1);
      setConfettiKey((k) => k + 1);
    },
    [],
  );

  const advanceZone = useCallback(
    (index: number) => {
      const next = index + 1;
      if (next >= totalZones) {
        setPhase({ kind: "complete" });
        // Second confetti burst once the completion screen mounts.
        window.setTimeout(() => setConfettiKey((k) => k + 1), 400);
      } else {
        setPhase({ kind: "zone", index: next });
      }
    },
    [totalZones],
  );

  const reset = useCallback(() => {
    completedRef.current = new Set();
    setPhase({ kind: "intro" });
    setStars(0);
    setConfettiKey(0);
    setZoneResults({});
  }, []);

  return {
    phase,
    stars,
    confettiKey,
    zoneResults,
    totals,
    start,
    completeZone,
    advanceZone,
    reset,
  };
}
