"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import type { TarifPlan } from "@/lib/plans";

// Re-export so existing imports of `PricingPlan` keep working
export type { TarifPlan as PricingPlan };

// localStorage key — shared with subscribe page and login page
export const REDIRECT_AFTER_LOGIN_KEY = "aq:redirectAfterLogin";

interface PricingCardProps {
  plan: TarifPlan;
  /** Visually elevate this card as the hero/recommended plan */
  featured?: boolean;
}

// ─── Accent palettes ─────────────────────────────────────────────────────────

const ACCENT: Record<TarifPlan["accent"], {
  border: string;
  ring: string;
  badge: string;
  savings: string;
  bullet: string;
  ctaFilled: string;
  ctaOutline: string;
}> = {
  green: {
    border:     "border-primary-500",
    ring:       "ring-2 ring-primary-500/30",
    badge:      "bg-primary-600 text-white",
    savings:    "bg-primary-100 text-primary-700",
    bullet:     "text-primary-500",
    ctaFilled:  "bg-primary-600 hover:bg-primary-700 text-white",
    ctaOutline: "bg-white border-2 border-primary-300 text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600",
  },
  blue: {
    border:     "border-blue-400",
    ring:       "ring-2 ring-blue-400/30",
    badge:      "bg-blue-600 text-white",
    savings:    "bg-blue-100 text-blue-700",
    bullet:     "text-blue-500",
    ctaFilled:  "bg-blue-600 hover:bg-blue-700 text-white",
    ctaOutline: "bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600",
  },
  purple: {
    border:     "border-purple-400",
    ring:       "ring-2 ring-purple-400/30",
    badge:      "bg-purple-600 text-white",
    savings:    "bg-purple-100 text-purple-700",
    bullet:     "text-purple-500",
    ctaFilled:  "bg-purple-600 hover:bg-purple-700 text-white",
    ctaOutline: "bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600",
  },
  yellow: {
    border:     "border-accent-400",
    ring:       "ring-2 ring-accent-400/30",
    badge:      "bg-accent-500 text-white",
    savings:    "bg-accent-100 text-accent-700",
    bullet:     "text-accent-500",
    ctaFilled:  "bg-accent-500 hover:bg-accent-600 text-white",
    ctaOutline: "bg-white border-2 border-accent-300 text-accent-700 hover:bg-accent-500 hover:text-white hover:border-accent-500",
  },
  orange: {
    border:     "border-orange-400",
    ring:       "ring-2 ring-orange-400/30",
    badge:      "bg-orange-500 text-white",
    savings:    "bg-orange-100 text-orange-700",
    bullet:     "text-orange-500",
    ctaFilled:  "bg-orange-500 hover:bg-orange-600 text-white",
    ctaOutline: "bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PricingCard({ plan, featured = false }: PricingCardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const a = ACCENT[plan.accent];

  function handleSelectPlan() {
    // Don't act while auth state is still resolving
    if (loading) return;

    const paymentUrl = `/dashboard/subscription/payment?plan=${plan.id}`;

    if (user) {
      // Already authenticated → go straight to payment
      router.push(paymentUrl);
    } else {
      // Store the intended destination, then send to sign-up flow
      localStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, paymentUrl);
      router.push(`/subscribe?plan=${plan.id}`);
    }
  }

  const ctaLabel = plan.ctaLabel ?? "Subscribe";

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? `border-2 ${a.border} ${a.ring} shadow-lg`
          : "border border-gray-100 shadow-sm hover:border-gray-200"
      }`}
    >
      {/* Popular badge — floats above card */}
      {plan.popularBadge && (
        <div className="absolute -top-3.5 inset-x-0 flex justify-center">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-4 py-1 rounded-full shadow-sm ${a.badge}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {plan.popularBadge}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
            {plan.billingNote && (
              <p className="text-xs text-gray-400 mt-0.5">{plan.billingNote}</p>
            )}
          </div>
          {plan.savingsBadge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${a.savings}`}>
              {plan.savingsBadge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {plan.currency}{plan.priceMonthly}
          </span>
          <span className="text-sm text-gray-400">/ month</span>
        </div>
        <p className="text-xs text-gray-400 mb-6">{plan.billingLabel}</p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-5" />

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-6" role="list">
          {plan.features.map((feat) => (
            <li key={feat.text} className="flex items-start gap-2.5 text-sm text-gray-600">
              {feat.included !== false ? (
                <svg className={`w-4 h-4 mt-0.5 shrink-0 ${a.bullet}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className={feat.included === false ? "text-gray-400 line-through" : ""}>{feat.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          type="button"
          onClick={handleSelectPlan}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            featured ? a.ctaFilled : a.ctaOutline
          }`}
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
