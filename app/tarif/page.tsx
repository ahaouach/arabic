import Link from "next/link";
import type { Metadata } from "next";
import PricingCard from "@/components/PricingCard";
import FAQItem from "@/components/FAQItem";
import { INDIVIDUAL_PLANS, GROUP_PLANS } from "@/lib/plans";

// ─── SEO ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Tarif — AQ Academy",
  description:
    "Flexible and affordable Arabic & Quran learning plans for children. Individual one-on-one lessons and group classes. No hidden fees.",
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Monthly subscriptions can be cancelled at any time with no penalty — your access continues until the end of the billing period. 6-month and 12-month plans include a 15-day withdrawal right from the date of purchase.",
  },
  {
    question: "How does the pause system work?",
    answer:
      "Every plan includes 7 days of pause per month. Simply let us know in advance and we will put your lessons on hold for that period without losing any credits. Pauses are available once per month.",
  },
  {
    question: "How are lessons scheduled?",
    answer:
      "After subscribing, you access our scheduling tool to book sessions at times that suit you. Individual lessons are one-on-one with your assigned teacher. Group classes run on a fixed weekly timetable that you choose when you enrol.",
  },
  {
    question: "What happens if I miss a lesson?",
    answer:
      "For individual plans, missed lessons are credited back to your account as long as you give at least 12 hours notice. Late cancellations or no-shows are not credited. Group sessions cannot be credited but recordings are shared with enrolled students.",
  },
  {
    question: "Can I change my plan after subscribing?",
    answer:
      "Yes. You can upgrade or downgrade your individual plan at any time. Unused lesson credits are carried over when upgrading. When moving to a longer commitment plan you benefit from the lower monthly rate immediately.",
  },
  {
    question: "What is the difference between individual and group lessons?",
    answer:
      "Individual lessons are 25–30 minutes of focused one-on-one teaching with a teacher dedicated to your child's level and pace. Group classes are 60-minute sessions with up to 6 children at a similar level, making them great for conversation practice and a fun social environment.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. The monthly price shown is everything you pay. There are no registration fees, no material fees, and no fees for rescheduling (with advance notice).",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TarifPage() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-geometric-pattern bg-sand-50 pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 mb-5">
            <span className="h-px w-8 bg-primary-300" />
            Pricing
            <span className="h-px w-8 bg-primary-300" />
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Our Pricing Plans
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Flexible and affordable plans tailored for your child's learning journey.
            No hidden fees, no surprises.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {[
              { icon: "🔒", label: "Secure payment" },
              { icon: "↩️", label: "15-day money back" },
              { icon: "❌", label: "Cancel anytime" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-100 rounded-full px-3.5 py-1.5 shadow-sm"
              >
                <span>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Individual plans ─────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Individual Arabic Learning Plans
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              One-on-one lessons with a qualified teacher. Progress at your child's own pace.
            </p>
          </div>

          {/* Saving callout banner */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent max-w-32" />
            <span className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Save up to 23% with a yearly commitment
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent max-w-32" />
          </div>

          <div className="grid gap-8 sm:grid-cols-3 items-start mt-6">
            {INDIVIDUAL_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                featured={plan.id === "individual-12months"}
              />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            All plans include access to your personal dashboard, lesson recordings, and progress reports.
          </p>
        </div>
      </section>

      {/* ── Group plans ──────────────────────────────────────────────────── */}
      <section className="bg-sand-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Group Learning Programs
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Learn alongside peers in a structured, motivating environment.
              Perfect for conversation practice and Quran recitation.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {GROUP_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Small groups, big impact</p>
              <p className="text-sm text-gray-500">
                Classes are capped at 6 students to ensure each child receives individual attention.
                Sessions run weekly on a fixed schedule — check our{" "}
                <Link href="/program" className="text-primary-600 font-medium hover:underline">
                  programs page
                </Link>{" "}
                for available time slots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Compare Plans</h2>
            <p className="text-gray-500">See what's included at a glance.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 font-bold text-gray-700 w-64">Feature</th>
                  <th className="px-4 py-4 font-bold text-gray-700">Monthly</th>
                  <th className="px-4 py-4 font-bold text-blue-700 bg-blue-50/50">6-Month</th>
                  <th className="px-4 py-4 font-bold text-purple-700 bg-purple-50/50">12-Month</th>
                  <th className="px-4 py-4 font-bold text-accent-700">Groups</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Price / month",        vals: ["€129",     "€119",     "€99",      "€39"] },
                  { label: "Lessons",               vals: ["8 / month","48 total", "96 total", "4 / month"] },
                  { label: "Lesson format",         vals: ["1-on-1",   "1-on-1",   "1-on-1",   "Group ≤ 6"] },
                  { label: "Lesson duration",       vals: ["25–30 min","25–30 min","25–30 min","60 min"] },
                  { label: "Progress tracking",     vals: [true, true, true, false] },
                  { label: "Pause (7 days/month)",  vals: [true, true, true, true] },
                  { label: "Withdrawal right",      vals: [false, "15 days", "15 days", false] },
                  { label: "Commitment",            vals: ["None", "6 months", "12 months", "None"] },
                  { label: "Savings vs monthly",    vals: ["—", "-8%", "-23%", "—"] },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-600 font-medium">{row.label}</td>
                    {row.vals.map((val, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3.5 text-center ${
                          i === 1 ? "bg-blue-50/30" : i === 2 ? "bg-purple-50/30" : ""
                        }`}
                      >
                        {val === true ? (
                          <span className="inline-flex justify-center">
                            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                        ) : val === false ? (
                          <span className="inline-flex justify-center">
                            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>
                        ) : (
                          <span className="text-gray-700">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-sand-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
              Still have questions?{" "}
              <Link href="/contact" className="text-primary-600 font-medium hover:underline">
                Contact us
              </Link>{" "}
              and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4 bg-geometric-pattern">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-primary-200 text-xs font-bold uppercase tracking-widest mb-4">
            Ready to begin?
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 leading-tight">
            Start your child's Arabic journey today
          </h2>
          <p className="text-primary-200 mb-8 max-w-md mx-auto">
            Join hundreds of families learning Arabic and Quran with AQ Academy.
            Your first month includes a free assessment session.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 text-sm font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
