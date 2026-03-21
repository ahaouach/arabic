"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/useTranslation";
import { LOCALES, type Locale } from "@/lib/i18n";

// ─── Config ───────────────────────────────────────────────────────────────────

const FLAGS: Record<Locale, string> = { fr: "🇫🇷", en: "🇬🇧", ar: "🇸🇦" };
const SHORT: Record<Locale, string> = { fr: "FR", en: "EN", ar: "ع" };

// ─── Props ────────────────────────────────────────────────────────────────────

interface LanguageSwitcherProps {
  /**
   * "navbar"  — compact pill button, dropdown opens downward-right
   * "sidebar" — full-width row, dropdown opens upward-left
   */
  variant?: "navbar" | "sidebar";
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LanguageSwitcher({ variant = "navbar" }: LanguageSwitcherProps) {
  const { t, locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isSidebar = variant === "sidebar";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("lang.select")}
        className={
          isSidebar
            ? "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            : "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors border border-gray-200 hover:border-primary-300"
        }
      >
        {/* Globe icon */}
        <svg
          className={`shrink-0 ${isSidebar ? "w-5 h-5 text-gray-400" : "w-4 h-4 text-gray-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
          />
        </svg>

        {isSidebar ? (
          <span className="flex-1 text-left">{t(`lang.${locale}`)}</span>
        ) : (
          <span className="font-semibold">
            {FLAGS[locale]} {SHORT[locale]}
          </span>
        )}

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""} ${isSidebar ? "ml-auto" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-label={t("lang.select")}
          className={`absolute z-50 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden min-w-[160px] py-1 ${
            isSidebar ? "bottom-full left-0 mb-2" : "top-full right-0 mt-2"
          }`}
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={locale === l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === l
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base leading-none">{FLAGS[l]}</span>
                <span className="flex-1 text-left">{t(`lang.${l}`)}</span>
                {locale === l && (
                  <svg
                    className="w-3.5 h-3.5 text-primary-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
