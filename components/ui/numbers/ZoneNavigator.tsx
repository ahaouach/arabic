"use client";

import ColorTargetDigitZone from "./ColorTargetDigitZone";
import CountColorZone from "./CountColorZone";
import DiscoveryZone from "./DiscoveryZone";
import ListenPickZone from "./ListenPickZone";
import MatchingZone from "./MatchingZone";
import WriteNumberZone from "./WriteNumberZone";
import type {
  NumberItem,
  NumbersLessonZone,
} from "@/lib/types/numbersLesson.types";

export interface ZoneResult {
  correct: number;
  total: number;
}

export interface ZoneNavigatorProps {
  zone: NumbersLessonZone;
  numbers: NumberItem[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

/**
 * Thin dispatcher: picks the right zone component from `zone.kind`.
 * Keeps the orchestrator (`NumbersLessonPage`) free of a giant switch and
 * gives us one place to swap implementations if we ever want to A/B-test
 * alternate zone UIs.
 */
export default function ZoneNavigator({
  zone,
  numbers,
  onComplete,
  onAdvance,
}: ZoneNavigatorProps) {
  switch (zone.kind) {
    case "discovery":
      return (
        <DiscoveryZone
          numbers={numbers}
          zone={zone}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "listen_pick":
      return (
        <ListenPickZone
          numbers={numbers}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "count_color":
      return (
        <CountColorZone
          numbers={numbers}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "matching":
      return (
        <MatchingZone
          numbers={numbers}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "write_number":
      return (
        <WriteNumberZone
          numbers={numbers}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "color_target_digit":
      return (
        <ColorTargetDigitZone
          numbers={numbers}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    default: {
      // Exhaustive check — TS error here means a new zone kind was added
      // without a matching case above.
      const _exhaustive: never = zone;
      return null;
    }
  }
}
