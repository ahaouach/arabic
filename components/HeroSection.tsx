"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative bg-geometric-pattern bg-primary-50 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative arc */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        aria-hidden="true"
      />

      {/* Arabic decorative text */}
      <div
        className="absolute top-6 right-6 text-primary-200 text-6xl font-arabic opacity-40 select-none pointer-events-none"
        aria-hidden="true"
      >
        بسم الله
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
        {/* Text content */}
        <div className="flex-1 text-center md:text-left">
          {/* Age badge */}
          <span className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-accent-200">
            <span aria-hidden="true">★</span> {t("home.badge")}
          </span>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-900 leading-tight mb-6"
          >
            {t("home.hero.title.before")}{" "}
            <span className="text-primary-600">{t("home.hero.title.product")}</span>
            {t("home.hero.title.middle") && (
              <>
                <br className="hidden sm:block" />
                {" "}{t("home.hero.title.middle")}{" "}
              </>
            )}
            <span className="relative inline-block">
              <span className="relative z-10">{t("home.hero.title.fun")}</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-3 bg-accent-300 opacity-60 -z-0 rounded"
                aria-hidden="true"
              />
            </span>
            {t("home.hero.title.after") && <>{" "}{t("home.hero.title.after")}</>}
          </h1>

          <p className="text-lg sm:text-xl text-primary-700 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              href="/login#subscribe"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              {t("home.hero.cta.start")}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/program"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-xl border border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {t("home.hero.cta.programs")}
            </Link>
          </div>
        </div>

        {/* Illustration card */}
        <div className="flex-shrink-0 w-full max-w-sm" aria-hidden="true">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-sand-200">
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-b-full" />

            {/* Arabic letters showcase */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["ا", "ب", "ت", "ث", "ج", "ح"].map((letter) => (
                <div
                  key={letter}
                  className="aspect-square bg-primary-50 rounded-2xl flex items-center justify-center text-3xl text-primary-700 font-arabic border border-primary-100 hover:bg-primary-100 transition-colors"
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex justify-around text-center border-t border-sand-200 pt-5">
              {[
                { value: "8",    key: "home.stats.arabicLevels" },
                { value: "2",    key: "home.stats.quranLevels"  },
                { value: "5–12", key: "home.stats.ages"         },
              ].map(({ value, key }) => (
                <div key={key}>
                  <p className="text-2xl font-extrabold text-primary-700">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t(key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
