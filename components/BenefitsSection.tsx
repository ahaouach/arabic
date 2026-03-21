"use client";

import { useTranslation } from "@/lib/useTranslation";

// Icons are static SVGs — only titles/descriptions need translation
const BENEFIT_KEYS = [
  {
    titleKey: "home.benefits.fun.title",
    descKey:  "home.benefits.fun.desc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titleKey: "home.benefits.structured.title",
    descKey:  "home.benefits.structured.desc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    titleKey: "home.benefits.teachers.title",
    descKey:  "home.benefits.teachers.desc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    titleKey: "home.benefits.beginners.title",
    descKey:  "home.benefits.beginners.desc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    titleKey: "home.benefits.anywhere.title",
    descKey:  "home.benefits.anywhere.desc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titleKey: "home.benefits.safe.title",
    descKey:  "home.benefits.safe.desc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
] as const;

export default function BenefitsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white" aria-labelledby="benefits-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-primary-600 text-sm font-semibold tracking-widest uppercase mb-2">
            {t("home.benefits.eyebrow")}
          </span>
          <h2
            id="benefits-heading"
            className="text-3xl sm:text-4xl font-extrabold text-primary-900 mb-4"
          >
            {t("home.benefits.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("home.benefits.subtitle")}
          </p>
        </div>

        {/* Benefits grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
        >
          {BENEFIT_KEYS.map(({ titleKey, descKey, icon }) => (
            <li
              key={titleKey}
              className="bg-sand-50 rounded-2xl p-6 border border-sand-200 hover:border-primary-200 hover:shadow-md transition-all group"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors"
                aria-hidden="true"
              >
                {icon}
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-2">{t(titleKey)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(descKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
