"use client";

import { resolveFamilySvg, type FamilyMemberSvgProps } from "@/lib/svg/family";

interface FamilyMemberRendererProps extends FamilyMemberSvgProps {
  /** Registry key — must match `FamilyMember.svgComponent` in the DB. */
  svgKey: string;
}

/**
 * Central dispatcher from `svgComponent` registry key → React element.
 *
 * Falls back to a soft grey silhouette if the key is unknown or the
 * registry hasn't been populated yet (Phase B is authoring SVGs in
 * batches, so early builds will have empty/partial registries).
 */
export default function FamilyMemberRenderer({
  svgKey,
  size = 120,
  outlined = false,
  "aria-label": ariaLabel,
  ...rest
}: FamilyMemberRendererProps) {
  const Component = resolveFamilySvg(svgKey);

  if (!Component) {
    return (
      <svg
        role="img"
        aria-label={ariaLabel ?? svgKey}
        viewBox="0 0 200 300"
        width={size}
        height={(size * 300) / 200}
        className={rest.className}
      >
        <title>{ariaLabel ?? svgKey}</title>
        <rect
          x="10"
          y="10"
          width="180"
          height="280"
          rx="24"
          fill={outlined ? "none" : "#F3F4F6"}
          stroke="#9CA3AF"
          strokeWidth="3"
          strokeDasharray={outlined ? undefined : "8 6"}
        />
        <circle cx="100" cy="110" r="40" fill={outlined ? "none" : "#E5E7EB"} stroke="#9CA3AF" strokeWidth="3" />
        <path
          d="M 50 260 Q 50 170 100 170 Q 150 170 150 260 Z"
          fill={outlined ? "none" : "#E5E7EB"}
          stroke="#9CA3AF"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return <Component size={size} outlined={outlined} aria-label={ariaLabel} {...rest} />;
}
