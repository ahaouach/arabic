/**
 * Six idle-animation personalities applied to vocabulary cards while
 * they sit at rest. Returns Framer-Motion `animate` + `transition`
 * objects ready to spread onto a `<motion.*>` element.
 *
 * Caller is responsible for honouring `prefers-reduced-motion`: pass
 * `reduced=true` and the helper returns an empty object so the card
 * stays still. Never call this with reduced=false in a context where
 * the user has the OS preference set.
 */

import type { TargetAndTransition, Transition } from "framer-motion";
import type { IdleAnimationKind } from "@/lib/types/vocabularyLesson.types";

interface IdleAnimationProps {
  animate?: TargetAndTransition;
  transition?: Transition;
}

export function getIdleAnimation(
  kind: IdleAnimationKind | undefined,
  reduced: boolean,
): IdleAnimationProps {
  if (reduced || !kind) return {};

  switch (kind) {
    case "bounce":
      return {
        animate: { y: [0, -10, 0] },
        transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
      };
    case "wiggle":
      return {
        animate: { rotate: [-4, 4, -4] },
        transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
      };
    case "bob":
      return {
        animate: { y: [0, -4, 0] },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
      };
    case "sway":
      return {
        animate: { rotate: [-3, 3, -3], x: [-2, 2, -2] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      };
    case "hop":
      return {
        animate: { y: [0, -12, 0] },
        transition: {
          duration: 1.1,
          repeat: Infinity,
          repeatDelay: 0.7,
          ease: "easeOut",
        },
      };
    case "breathe":
      return {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
      };
  }
}
