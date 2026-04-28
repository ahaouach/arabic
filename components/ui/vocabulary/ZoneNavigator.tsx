"use client";

/**
 * Dispatcher — routes a `VocabularyLessonZone` to its zone component.
 * Exhaustive switch over `kind`; new kinds added to the schema must be
 * handled here, otherwise the `_exhaustive: never` line will fail to
 * compile and surface the gap.
 */

import ColorItemZone from "./zones/ColorItemZone";
import ColorLettersZone from "./zones/ColorLettersZone";
import CountZone from "./zones/CountZone";
import DiscoveryZone from "./zones/DiscoveryZone";
import ListenPickZone from "./zones/ListenPickZone";
import type {
  VocabularyItem,
  VocabularyLessonZone,
  VocabularyWord,
} from "@/lib/types/vocabularyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface ZoneNavigatorProps {
  zone: VocabularyLessonZone;
  theme: string;
  items: VocabularyItem[];
  words: VocabularyWord[];
  colors: ArabicColor[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

export default function ZoneNavigator({
  zone,
  theme,
  items,
  words,
  colors,
  onComplete,
  onAdvance,
}: ZoneNavigatorProps) {
  switch (zone.kind) {
    case "vocab_discovery":
      return (
        <DiscoveryZone
          zone={zone}
          theme={theme}
          items={items}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "vocab_listen_pick":
      return (
        <ListenPickZone
          zone={zone}
          theme={theme}
          items={items}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "vocab_count":
      return (
        <CountZone
          zone={zone}
          theme={theme}
          items={items}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "vocab_color_item":
      return (
        <ColorItemZone
          zone={zone}
          theme={theme}
          items={items}
          colors={colors}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "vocab_color_letters":
      return (
        <ColorLettersZone
          zone={zone}
          words={words}
          colors={colors}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    default: {
      const _exhaustive: never = zone;
      void _exhaustive;
      return null;
    }
  }
}
