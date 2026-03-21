/**
 * Canonical AQ Academy subscription plan definitions.
 *
 * Single source of truth for all pricing UI, subscription flows, and payment pages.
 *
 * ─── Future integration path ────────────────────────────────────────────────
 * Stripe:
 *   1. Replace stripePriceId values with live Stripe Price IDs.
 *   2. On payment page, call stripe.createPaymentMethod() → POST /api/checkout
 *      with { planId, paymentMethodId }.
 *   3. Server creates a Stripe Subscription, returns clientSecret if 3DS needed.
 *   4. Webhooks (invoice.paid, customer.subscription.updated) keep DB in sync.
 * Multi-currency:
 *   Replace static `currency` / `priceMonthly` with GET /api/plans?currency=USD.
 * ────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type TarifPlanId =
  | "individual-monthly"
  | "individual-6months"
  | "individual-12months"
  | "group-conversation"
  | "group-quran";

export interface TarifPlanFeature {
  text: string;
  /** true (default) = checkmark; false = crossed-out */
  included?: boolean;
}

export interface TarifPlan {
  id: TarifPlanId;
  name: string;
  /** Monthly equivalent price (integer, no cents) – future: from Stripe Products */
  priceMonthly: number;
  currency: string;
  /** Short line under price: "No commitment · cancel anytime" */
  billingLabel: string;
  /** Smaller line above price: "Billed every 6 months" */
  billingNote?: string;
  savingsBadge?: string;
  popularBadge?: string;
  features: TarifPlanFeature[];
  category: "individual" | "group";
  /** Card accent for the pricing UI */
  accent: "green" | "blue" | "purple" | "yellow" | "orange";
  ctaLabel?: string;
  /** Future: live Stripe Price ID */
  stripePriceId?: string;
}

// ─── Plan data ────────────────────────────────────────────────────────────────

export const INDIVIDUAL_PLANS: TarifPlan[] = [
  {
    id: "individual-monthly",
    name: "Monthly",
    priceMonthly: 129,
    currency: "€",
    billingLabel: "No commitment · cancel anytime",
    billingNote: "Billed monthly",
    category: "individual",
    accent: "green",
    ctaLabel: "Start Now",
    stripePriceId: "price_individual_monthly",
    features: [
      { text: "8 lessons per month" },
      { text: "Flexible booking" },
      { text: "25–30 min one-on-one lessons" },
      { text: "Regular progress tracking" },
      { text: "7 days pause per month" },
      { text: "Cancel anytime" },
      { text: "Automatic renewal" },
    ],
  },
  {
    id: "individual-6months",
    name: "6-Month Subscription",
    priceMonthly: 119,
    currency: "€",
    billingLabel: "48 lessons · 6-month commitment",
    billingNote: "Billed every 6 months",
    savingsBadge: "Save 8%",
    category: "individual",
    accent: "blue",
    ctaLabel: "Start Now",
    stripePriceId: "price_individual_6months",
    features: [
      { text: "48 lessons over 6 months" },
      { text: "Flexible booking" },
      { text: "~2 lessons per week" },
      { text: "25–30 min one-on-one lessons" },
      { text: "Regular progress tracking" },
      { text: "7 days pause per month" },
      { text: "15-day withdrawal right" },
    ],
  },
  {
    id: "individual-12months",
    name: "12-Month Subscription",
    priceMonthly: 99,
    currency: "€",
    billingLabel: "96 lessons · 12-month commitment",
    billingNote: "Billed every 12 months",
    savingsBadge: "Save 23%",
    popularBadge: "Best Value",
    category: "individual",
    accent: "purple",
    ctaLabel: "Start Now",
    stripePriceId: "price_individual_12months",
    features: [
      { text: "96 lessons over 12 months" },
      { text: "Flexible booking" },
      { text: "~2 lessons per week" },
      { text: "25–30 min one-on-one lessons" },
      { text: "Regular progress tracking" },
      { text: "7 days pause per month" },
      { text: "15-day withdrawal right" },
    ],
  },
];

export const GROUP_PLANS: TarifPlan[] = [
  {
    id: "group-conversation",
    name: "Conversation Club",
    priceMonthly: 39,
    currency: "€",
    billingLabel: "No commitment · cancel anytime",
    billingNote: "Billed monthly",
    category: "group",
    accent: "yellow",
    ctaLabel: "Join Now",
    stripePriceId: "price_group_conversation",
    features: [
      { text: "1 lesson per week" },
      { text: "60-minute sessions" },
      { text: "Up to 6 students" },
      { text: "Interactive conversation practice" },
      { text: "7 days pause per month" },
      { text: "Cancel anytime" },
      { text: "Automatic renewal" },
    ],
  },
  {
    id: "group-quran",
    name: "Quran Group",
    priceMonthly: 39,
    currency: "€",
    billingLabel: "No commitment · cancel anytime",
    billingNote: "Billed monthly",
    category: "group",
    accent: "orange",
    ctaLabel: "Join Now",
    stripePriceId: "price_group_quran",
    features: [
      { text: "1 lesson per week" },
      { text: "60-minute sessions" },
      { text: "Up to 6 students" },
      { text: "Tajweed & recitation focus" },
      { text: "7 days pause per month" },
      { text: "Cancel anytime" },
    ],
  },
];

export const ALL_TARIF_PLANS: TarifPlan[] = [...INDIVIDUAL_PLANS, ...GROUP_PLANS];

export function getPlanById(id: string): TarifPlan | undefined {
  return ALL_TARIF_PLANS.find((p) => p.id === id);
}
