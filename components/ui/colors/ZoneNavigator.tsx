"use client";

import ColorDigitsZone from "./ColorDigitsZone";
import ColorLettersZone from "./ColorLettersZone";
import DiscoveryZone from "./DiscoveryZone";
import ListenPickZone from "./ListenPickZone";
import MemoryGameZone from "./MemoryGameZone";
import PickObjectsZone from "./PickObjectsZone";
import type {
  ArabicColor,
  ArabicLetter,
  ColorsLessonZone,
} from "@/lib/types/colorsLesson.types";

export interface ZoneResult {
  correct: number;
  total: number;
}

export interface ZoneNavigatorProps {
  zone: ColorsLessonZone;
  colors: ArabicColor[];
  digits: number[];
  letters: ArabicLetter[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

/**
 * Dispatch: picks the right colour-zone component from `zone.kind`.
 * Thin switch kept free of state so it's easy to swap an implementation
 * for A/B-testing later.
 */
export default function ZoneNavigator({
  zone,
  colors,
  digits,
  letters,
  onComplete,
  onAdvance,
}: ZoneNavigatorProps) {
  switch (zone.kind) {
    case "discovery":
      return (
        <DiscoveryZone
          colors={colors}
          zone={zone}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "listen_pick":
      return (
        <ListenPickZone
          colors={colors}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "color_digits":
      return (
        <ColorDigitsZone
          colors={colors}
          digits={digits}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "color_letters":
      return (
        <ColorLettersZone
          colors={colors}
          letters={letters}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "pick_objects":
      return (
        <PickObjectsZone
          colors={colors}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "memory_game":
      return (
        <MemoryGameZone
          colors={colors}
          zone={zone}
          onComplete={(r) =>
            onComplete?.({ correct: r.stars, total: 3 })
          }
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
