"use client";

/**
 * useTranslation — the primary hook for translated strings in client components.
 *
 * Returns:
 *   t(key)      → translated string for the active locale (falls back to fr → key)
 *   locale      → current Locale code ("fr" | "en" | "ar")
 *   setLocale   → change language (persists to cookie + localStorage)
 *   isRTL       → true when the active locale uses right-to-left text
 */

import { useLanguage } from "@/components/LanguageProvider";
import { getT, isRTL as checkRTL } from "@/lib/i18n";

export function useTranslation() {
  const { locale, setLocale } = useLanguage();
  return {
    t: getT(locale),
    locale,
    setLocale,
    isRTL: checkRTL(locale),
  };
}
