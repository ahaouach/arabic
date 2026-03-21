"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type Locale,
  LOCALES,
  DEFAULT_LOCALE,
  isRTL,
  getLocaleFromString,
  LOCALE_STORAGE_KEY,
} from "@/lib/i18n";

// ─── Context ──────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface LanguageProviderProps {
  children: ReactNode;
  /**
   * Initial locale read from the server-side cookie.
   * Prevents a flash on first render — client syncs on mount if localStorage
   * holds a more recent preference.
   */
  initialLocale?: Locale;
}

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // On mount: sync from localStorage (client-side preference may differ from cookie)
  useEffect(() => {
    const stored = getLocaleFromString(localStorage.getItem(LOCALE_STORAGE_KEY));
    // Only update if it's a valid known locale AND different from current
    if ((LOCALES as ReadonlyArray<string>).includes(stored) && stored !== locale) {
      setLocaleState(stored as Locale);
    }
    // Run only once on mount — intentionally excludes `locale` from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html> attrs, localStorage, and cookie in sync whenever locale changes
  useEffect(() => {
    const dir = isRTL(locale) ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // Cookie persists across navigations and lets the server read the preference
    document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: setLocaleState }}>
      {children}
    </LanguageContext.Provider>
  );
}
