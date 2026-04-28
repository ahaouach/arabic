"use client";

import ColorLettersZone from "./zones/ColorLettersZone";
import ColorMemberZone from "./zones/ColorMemberZone";
import CountFamilyZone from "./zones/CountFamilyZone";
import DiscoveryZone from "./zones/DiscoveryZone";
import ListenPickZone from "./zones/ListenPickZone";
import MatchingZone from "./zones/MatchingZone";
import type {
  FamilyLessonZone,
  FamilyMember,
  FamilyWord,
} from "@/lib/types/familyLesson.types";
import type { ArabicColor } from "@/lib/schemas/colorsLesson.schema";
import type { ZoneResult } from "@/lib/hooks/useLessonProgress";

export interface ZoneNavigatorProps {
  zone: FamilyLessonZone;
  members: FamilyMember[];
  words: FamilyWord[];
  colors: ArabicColor[];
  onComplete?: (result?: ZoneResult) => void;
  onAdvance?: () => void;
}

/** Dispatcher — picks the right family-zone component from `zone.kind`. */
export default function ZoneNavigator({
  zone,
  members,
  words,
  colors,
  onComplete,
  onAdvance,
}: ZoneNavigatorProps) {
  switch (zone.kind) {
    case "family_discovery":
      return (
        <DiscoveryZone
          zone={zone}
          members={members}
          onComplete={() => onComplete?.()}
          onAdvance={onAdvance}
        />
      );
    case "family_listen_pick":
      return (
        <ListenPickZone
          zone={zone}
          members={members}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "family_matching":
      return (
        <MatchingZone
          zone={zone}
          members={members}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "family_count":
      return (
        <CountFamilyZone
          zone={zone}
          members={members}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "family_color_member":
      return (
        <ColorMemberZone
          zone={zone}
          members={members}
          colors={colors}
          onComplete={(r) => onComplete?.(r)}
          onAdvance={onAdvance}
        />
      );
    case "family_color_letters":
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
      return null;
    }
  }
}
