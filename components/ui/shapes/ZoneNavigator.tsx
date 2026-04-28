"use client";

import ColorLettersWordZone from "./ColorLettersWordZone";
import ColorShapeZone from "./ColorShapeZone";
import CountShapesZone from "./CountShapesZone";
import DiscoveryZone from "./DiscoveryZone";
import DrawShapeZone from "./DrawShapeZone";
import ListenPickZone from "./ListenPickZone";
import type {
  ArabicColor,
  ArabicShape,
  ShapeWord,
  ShapesLessonZone,
} from "@/lib/types/shapesLesson.types";

export interface ZoneResult {
  correct: number;
  total: number;
}

export interface ZoneNavigatorProps {
  zone: ShapesLessonZone;
  shapes: ArabicShape[];
  shapeWords: ShapeWord[];
  colors: ArabicColor[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

/**
 * Dispatcher — picks the right shapes-zone component from `zone.kind`.
 * Kept stateless so it's trivial to swap an implementation for A/B
 * testing later.
 */
export default function ZoneNavigator({
  zone,
  shapes,
  shapeWords,
  colors,
  onComplete,
  onAdvance,
}: ZoneNavigatorProps) {
  switch (zone.kind) {
    case "discovery":
      return (
        <DiscoveryZone
          shapes={shapes}
          zone={zone}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "listen_pick":
      return (
        <ListenPickZone
          shapes={shapes}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "count_shapes":
      return (
        <CountShapesZone
          shapes={shapes}
          colors={colors}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "color_shape":
      return (
        <ColorShapeZone
          shapes={shapes}
          colors={colors}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "color_letters_word":
      return (
        <ColorLettersWordZone
          shapes={shapes}
          shapeWords={shapeWords}
          colors={colors}
          zone={zone}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "draw_shape":
      return (
        <DrawShapeZone
          shapes={shapes}
          colors={colors}
          zone={zone}
          onComplete={() => onComplete?.()}
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
