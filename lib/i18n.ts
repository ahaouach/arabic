/**
 * Core i18n module — no React dependency, usable in server and client contexts.
 *
 * Usage in server components:
 *   import { getT, getLocaleFromString } from "@/lib/i18n";
 *   import { cookies } from "next/headers";
 *   const locale = getLocaleFromString((await cookies()).get("aq_lang")?.value);
 *   const t = getT(locale);
 *
 * Usage in client components:
 *   import { useTranslation } from "@/lib/useTranslation";
 *   const { t, locale, setLocale } = useTranslation();
 *
 * ─── Adding a new language ───────────────────────────────────────────────────
 * 1. Add a JSON file to /locales/<code>.json
 * 2. Import it below
 * 3. Add to LOCALES and TRANSLATIONS
 * 4. Add flag/label in LanguageSwitcher.tsx
 * ────────────────────────────────────────────────────────────────────────────
 */

import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

// ─── Types ───────────────────────────────────────────────────────────────────

export const LOCALES = ["fr", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/** Languages that require right-to-left layout */
export const RTL_LOCALES: ReadonlyArray<Locale> = ["ar"];

// ─── Translation map ──────────────────────────────────────────────────────────

const TRANSLATIONS: Record<Locale, Record<string, string>> = { fr, en, ar };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a `t(key)` function for the given locale.
 * Falls back to DEFAULT_LOCALE, then to the raw key if still missing.
 */
export function getT(locale: Locale) {
  const dict = TRANSLATIONS[locale];
  const fallback = TRANSLATIONS[DEFAULT_LOCALE];
  return function t(key: string): string {
    return dict[key] ?? fallback[key] ?? key;
  };
}

/** Coerce an arbitrary string into a valid Locale, defaulting when invalid. */
export function getLocaleFromString(value: string | undefined | null): Locale {
  if (value && (LOCALES as ReadonlyArray<string>).includes(value)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE;
}

export function isRTL(locale: Locale): boolean {
  return (RTL_LOCALES as ReadonlyArray<Locale>).includes(locale);
}

/** The cookie / localStorage key used to persist the user's preference. */
export const LOCALE_STORAGE_KEY = "aq_lang";
