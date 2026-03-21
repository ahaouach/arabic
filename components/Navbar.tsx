"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useTranslation } from "@/lib/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Nav links use translation keys instead of hard-coded labels
const NAV_LINK_KEYS = [
  { href: "/",        key: "nav.home"    },
  { href: "/program", key: "nav.program" },
  { href: "/tarif",   key: "nav.tarif"   },
  { href: "/contact", key: "nav.contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { t } = useTranslation();

  const authButtons = loading ? (
    <div className="w-40 h-9" aria-hidden="true" />
  ) : user ? (
    <>
      <Link
        href="/dashboard"
        className="px-4 py-2 text-sm font-medium text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
      >
        {t("nav.dashboard")}
      </Link>
      <button
        onClick={logout}
        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
      >
        {t("nav.logout")}
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
      >
        {t("nav.login")}
      </Link>
      <Link
        href="/login#subscribe"
        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
      >
        {t("nav.subscribe")}
      </Link>
    </>
  );

  const mobileAuthButtons = loading ? null : user ? (
    <li className="pt-2 flex flex-col gap-2">
      <Link
        href="/dashboard"
        onClick={() => setMenuOpen(false)}
        className="block text-center px-4 py-2 text-sm font-medium text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
      >
        {t("nav.dashboard")}
      </Link>
      <button
        onClick={() => { setMenuOpen(false); logout(); }}
        className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
      >
        {t("nav.logout")}
      </button>
    </li>
  ) : (
    <li className="pt-2 flex flex-col gap-2">
      <Link
        href="/login"
        onClick={() => setMenuOpen(false)}
        className="block text-center px-4 py-2 text-sm font-medium text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
      >
        {t("nav.login")}
      </Link>
      <Link
        href="/login#subscribe"
        onClick={() => setMenuOpen(false)}
        className="block text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
      >
        {t("nav.subscribe")}
      </Link>
    </li>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sand-200 shadow-sm">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary-700 font-bold text-xl hover:text-primary-800 transition-colors"
          aria-label="Arabic & Quran Academy — Home"
        >
          <span
            className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-arabic select-none"
            aria-hidden="true"
          >
            ع
          </span>
          <span className="hidden sm:inline">AQ Academy</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINK_KEYS.map(({ href, key }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop right area: language switcher + auth */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher variant="navbar" />
          {authButtons}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-b border-sand-200 px-4 pb-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINK_KEYS.map(({ href, key }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                    }`}
                  >
                    {t(key)}
                  </Link>
                </li>
              );
            })}
            {/* Language switcher in mobile menu */}
            <li className="pt-1">
              <LanguageSwitcher variant="navbar" />
            </li>
            {mobileAuthButtons}
          </ul>
        </div>
      )}
    </header>
  );
}
