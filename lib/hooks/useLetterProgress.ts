"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "alphabet_progress_v1";

/** Parsed / serialised shape. Keys are letter keys; values are lists of completed zone kinds. */
type Stored = Record<string, string[]>;

/**
 * Per-letter progress tracking backed by `localStorage`.
 *
 * Behavior:
 * - Reads are lazy + SSR-safe (initial state is empty until the first client effect runs).
 * - Writes are synchronous + immediate; cross-tab sync via the `storage` event.
 * - Returns stable setters via `useCallback` so consumers can pass them to memoised children.
 *
 * Malformed JSON is silently replaced with an empty map — we never crash a
 * child's lesson page over a corrupted key.
 */
export function useLetterProgress() {
  const [data, setData] = useState<Stored>({});
  const [hydrated, setHydrated] = useState(false);

  // Load once on client.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const clean: Stored = {};
          for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
            if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
              clean[k] = v as string[];
            }
          }
          setData(clean);
        }
      }
    } catch {
      // Swallow — corrupted storage falls back to empty.
    }
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const next = e.newValue ? (JSON.parse(e.newValue) as Stored) : {};
        setData(next);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Stored) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode — swallow; in-memory state still works */
    }
  }, []);

  const completedZones = useCallback(
    (letterKey: string): Set<string> => new Set(data[letterKey] ?? []),
    [data],
  );

  const markZoneComplete = useCallback(
    (letterKey: string, zoneKind: string) => {
      setData((prev) => {
        const current = prev[letterKey] ?? [];
        if (current.includes(zoneKind)) return prev;
        const next = { ...prev, [letterKey]: [...current, zoneKind] };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isLetterComplete = useCallback(
    (letterKey: string, totalZones: number): boolean =>
      (data[letterKey]?.length ?? 0) >= totalZones,
    [data],
  );

  const resetLetter = useCallback(
    (letterKey: string) => {
      setData((prev) => {
        if (!(letterKey in prev)) return prev;
        const next = { ...prev };
        delete next[letterKey];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    setData({});
    persist({});
  }, [persist]);

  const totals = useMemo(() => {
    const lettersStarted = Object.keys(data).length;
    const zonesCompleted = Object.values(data).reduce(
      (acc, arr) => acc + arr.length,
      0,
    );
    return { lettersStarted, zonesCompleted };
  }, [data]);

  return {
    hydrated,
    completedZones,
    markZoneComplete,
    isLetterComplete,
    resetLetter,
    resetAll,
    totals,
  };
}
