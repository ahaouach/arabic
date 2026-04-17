import { createElement, type ReactNode } from "react";

/**
 * RTL-safe wrapper that applies:
 *   - lang="ar"
 *   - dir (default "rtl", override to "auto" inside bidi content)
 *   - the Amiri → Noto Naskh Arabic → Scheherazade New → serif font stack
 *   - harakat-safe line-height (`leading-relaxed` / `leading-loose`)
 *
 * Replaces the ~25 inline `style={{ fontFamily: "…" }}` occurrences
 * across lesson components. Server-component friendly: no hooks, no
 * event handlers.
 */

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div" | "label";

const SIZE_MAP: Record<Size, string> = {
  sm: "text-sm leading-relaxed",
  md: "text-base leading-relaxed",
  lg: "text-2xl leading-relaxed",
  xl: "text-3xl leading-loose",
  "2xl": "text-4xl leading-loose",
  "3xl": "text-5xl leading-loose",
};

const FONT_STYLE = {
  fontFamily:
    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
} as const;

export interface ArabicTextProps {
  as?: Tag;
  size?: Size;
  className?: string;
  dir?: "rtl" | "auto";
  children: ReactNode;
}

export default function ArabicText({
  as = "span",
  size = "md",
  className = "",
  dir = "rtl",
  children,
}: ArabicTextProps) {
  return createElement(
    as,
    {
      lang: "ar",
      dir,
      className: `${SIZE_MAP[size]} ${className}`.trim(),
      style: FONT_STYLE,
    },
    children,
  );
}
