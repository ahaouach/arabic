import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import { getT, getLocaleFromString } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "AQ Academy — Learn Arabic & Quran Online for Children",
  description:
    "Fun, structured Arabic language and Quran lessons for non-Arabic-speaking children aged 5–12. Qualified teachers, 8 Arabic levels, 2 Quran levels.",
  keywords: ["learn arabic online", "quran for kids", "arabic for children", "online quran lessons"],
  openGraph: {
    title: "AQ Academy — Arabic & Quran for Children",
    description: "Interactive online Arabic and Quran lessons for children aged 5–12.",
    type: "website",
  },
};

export default async function HomePage() {
  // Read locale from cookie — server-side translation for static sections
  const cookieStore = await cookies();
  const locale = getLocaleFromString(cookieStore.get("aq_lang")?.value);
  const t = getT(locale);

  const testimonials = [
    { quoteKey: "home.trust.q1", authorKey: "home.trust.a1" },
    { quoteKey: "home.trust.q2", authorKey: "home.trust.a2" },
    { quoteKey: "home.trust.q3", authorKey: "home.trust.a3" },
  ];

  return (
    <main id="main-content">
      {/* Hero — client component (interactive, self-translating) */}
      <HeroSection />

      {/* Mission Statement — server-rendered */}
      <section className="bg-primary-600 py-14 text-center" aria-labelledby="mission-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-4xl font-arabic text-primary-200 mb-4 select-none" aria-hidden="true">
            اقْرَأْ بِاسْمِ رَبِّكَ
          </p>
          <h2 id="mission-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t("home.mission.title")}
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            {t("home.mission.text")}
          </p>
        </div>
      </section>

      {/* Benefits — client component (self-translating) */}
      <BenefitsSection />

      {/* Testimonials — server-rendered */}
      <section className="bg-sand-50 border-y border-sand-200 py-14" aria-labelledby="trust-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 id="trust-heading" className="text-2xl sm:text-3xl font-extrabold text-primary-900 mb-10">
            {t("home.trust.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(({ quoteKey, authorKey }) => (
              <blockquote
                key={authorKey}
                className="bg-white rounded-2xl p-6 border border-sand-200 shadow-sm text-left"
              >
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t(quoteKey)}&rdquo;
                </p>
                <footer className="text-primary-700 text-sm font-semibold">
                  — {t(authorKey)}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — server-rendered */}
      <section className="bg-white py-20 text-center" aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold text-primary-900 mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login#subscribe"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              {t("home.cta.start")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-sand-50 rounded-xl border border-primary-200 hover:border-primary-400 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {t("home.cta.question")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
