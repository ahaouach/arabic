"use client";

/**
 * /dashboard/subscription/payment
 *
 * Dedicated payment page for plans chosen on /tarif.
 * Protected by middleware — user must be authenticated to reach this page.
 *
 * ─── Stripe integration path ────────────────────────────────────────────────
 * 1. Load @stripe/stripe-js and mount CardElement.
 * 2. On submit: const { paymentMethod } = await stripe.createPaymentMethod(...)
 * 3. POST /api/checkout { planId: plan.stripePriceId, paymentMethodId }
 * 4. If requires 3DS: await stripe.confirmCardPayment(clientSecret)
 * 5. On success: redirect to /dashboard or show confirmation with real invoice.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPlanById, type TarifPlan } from "@/lib/plans";

// ─── Card utilities (self-contained, no external deps) ────────────────────

type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

function detectBrand(number: string): CardBrand {
  const d = number.replace(/\D/g, "");
  if (d.startsWith("4"))       return "visa";
  if (/^5[1-5]/.test(d))      return "mastercard";
  if (/^3[47]/.test(d))       return "amex";
  return "unknown";
}

function formatCardNumber(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function luhnValid(number: string): boolean {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i]);
    if (isEven) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function isExpiryValid(expiry: string): boolean {
  const [mm, yy] = expiry.split("/");
  if (!mm || !yy || mm.length < 2 || yy.length < 2) return false;
  const m = parseInt(mm, 10);
  if (m < 1 || m > 12) return false;
  return new Date(2000 + parseInt(yy, 10), m - 1, 1) > new Date();
}

const BRAND_STYLES: Record<CardBrand, string> = {
  visa: "bg-blue-600 text-white",
  mastercard: "bg-red-600 text-white",
  amex: "bg-green-700 text-white",
  unknown: "bg-gray-200 text-gray-500",
};
const BRAND_LABELS: Record<CardBrand, string> = {
  visa: "VISA", mastercard: "MC", amex: "AMEX", unknown: "CARD",
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface Fields {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY_FIELDS: Fields = { cardholderName: "", cardNumber: "", expiry: "", cvv: "" };

// ─── Plan summary card ────────────────────────────────────────────────────────

function PlanSummaryCard({ plan }: { plan: TarifPlan }) {
  const topFeatures = plan.features.slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white h-fit">
      {/* Header */}
      <div className="mb-6">
        {plan.popularBadge && (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {plan.popularBadge}
          </span>
        )}
        <p className="text-primary-200 text-xs font-bold uppercase tracking-widest mb-1">
          Your selected plan
        </p>
        <h2 className="text-2xl font-extrabold">{plan.name}</h2>
        <p className="text-primary-200 text-sm mt-1">{plan.billingNote}</p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-extrabold tracking-tight">
          {plan.currency}{plan.priceMonthly}
        </span>
        <span className="text-primary-200 text-sm">/ month</span>
      </div>
      {plan.savingsBadge && (
        <span className="inline-block mt-1 mb-4 text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
          {plan.savingsBadge}
        </span>
      )}
      <p className="text-primary-200 text-xs mb-6">{plan.billingLabel}</p>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-5" />

      {/* Features */}
      <ul className="space-y-3" role="list">
        {topFeatures.map((feat) => (
          <li key={feat.text} className="flex items-start gap-2.5 text-sm text-primary-100">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feat.text}
          </li>
        ))}
        {plan.features.length > 5 && (
          <li className="text-xs text-primary-300 pl-6.5">
            + {plan.features.length - 5} more included
          </li>
        )}
      </ul>

      {/* Change plan link */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <Link
          href="/tarif"
          className="inline-flex items-center gap-1.5 text-xs text-primary-300 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Change plan
        </Link>
      </div>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ plan }: { plan: TarifPlan }) {
  return (
    <div className="max-w-lg mx-auto text-center py-12 px-6">
      {/* Animated checkmark */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment successful!</h1>
      <p className="text-gray-500 mb-2">
        Welcome to the <strong className="text-primary-700">{plan.name}</strong> plan.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        A confirmation email has been sent to your registered address.
      </p>

      {/* Plan summary pill */}
      <div className="inline-flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-2xl px-5 py-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-primary-900">{plan.name}</p>
          <p className="text-xs text-primary-600">{plan.currency}{plan.priceMonthly}/month · {plan.billingLabel}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Go to Dashboard
        </Link>
        <Link
          href="/dashboard/subscription"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          View Subscription
        </Link>
      </div>

      {/* Schedule CTA */}
      <p className="mt-8 text-sm text-gray-400">
        Ready to book your first lesson?{" "}
        <Link href="/dashboard/schedule" className="text-primary-600 font-medium hover:underline">
          Open the scheduler
        </Link>
      </p>
    </div>
  );
}

// ─── Payment form ─────────────────────────────────────────────────────────────

interface PaymentFormProps {
  plan: TarifPlan;
  processing: boolean;
  onSubmit: (fields: Fields) => void;
  onCancel: () => void;
}

function PaymentForm({ plan, processing, onSubmit, onCancel }: PaymentFormProps) {
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>({});

  const brand = detectBrand(fields.cardNumber);
  const cvvLength = brand === "amex" ? 4 : 3;

  function set(key: keyof Fields, raw: string) {
    let value = raw;
    if (key === "cardNumber") value = formatCardNumber(raw);
    if (key === "expiry")     value = formatExpiry(raw);
    if (key === "cvv")        value = raw.replace(/\D/g, "").slice(0, cvvLength);
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!fields.cardholderName.trim() || fields.cardholderName.trim().length < 2)
      e.cardholderName = "Please enter the cardholder name.";
    if (!luhnValid(fields.cardNumber))
      e.cardNumber = "Invalid card number.";
    if (!isExpiryValid(fields.expiry))
      e.expiry = "Invalid or expired date.";
    if (fields.cvv.length < cvvLength)
      e.cvv = `CVV must be ${cvvLength} digits.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(fields);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Payment details</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Subscribing to{" "}
            <span className="font-semibold text-primary-700">{plan.name}</span>
            {" "}·{" "}
            {plan.currency}{plan.priceMonthly}/month
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Secure
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Cardholder name */}
        <FormField label="Cardholder name" error={errors.cardholderName} required>
          <input
            type="text"
            value={fields.cardholderName}
            onChange={(e) => set("cardholderName", e.target.value)}
            autoComplete="cc-name"
            placeholder="Ahmed Benali"
            disabled={processing}
            className={inputCls(!!errors.cardholderName, processing)}
          />
        </FormField>

        {/* Card number */}
        <FormField label="Card number" error={errors.cardNumber} required>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={fields.cardNumber}
              onChange={(e) => set("cardNumber", e.target.value)}
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              disabled={processing}
              className={`${inputCls(!!errors.cardNumber, processing)} pr-16`}
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black px-2 py-0.5 rounded ${BRAND_STYLES[brand]}`}>
              {BRAND_LABELS[brand]}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Test card: 4242 4242 4242 4242</p>
        </FormField>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Expiry date" error={errors.expiry} required>
            <input
              type="text"
              inputMode="numeric"
              value={fields.expiry}
              onChange={(e) => set("expiry", e.target.value)}
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              disabled={processing}
              className={inputCls(!!errors.expiry, processing)}
            />
          </FormField>
          <FormField label={`CVV (${cvvLength} digits)`} error={errors.cvv} required>
            <input
              type="password"
              inputMode="numeric"
              value={fields.cvv}
              onChange={(e) => set("cvv", e.target.value)}
              autoComplete="cc-csc"
              placeholder={"•".repeat(cvvLength)}
              maxLength={cvvLength}
              disabled={processing}
              className={inputCls(!!errors.cvv, processing)}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pay {plan.currency}{plan.priceMonthly}
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Your payment is secured. No card data is stored on our servers.
        </p>
      </form>
    </div>
  );
}

// ─── Form field wrapper ───────────────────────────────────────────────────────

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean, disabled: boolean) {
  return `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
    disabled ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200" :
    hasError  ? "border-red-300 bg-red-50" :
                "border-gray-200 bg-white hover:border-primary-300"
  }`;
}

// ─── No-plan fallback ─────────────────────────────────────────────────────────

function NoPlanSelected() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">No plan selected</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        Please choose a plan from our pricing page to continue.
      </p>
      <Link
        href="/tarif"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        View Pricing Plans
      </Link>
    </div>
  );
}

// ─── Inner page (needs useSearchParams — wrapped in Suspense below) ───────────

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan");
  const plan = planId ? getPlanById(planId) : null;

  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  if (!plan) return <NoPlanSelected />;
  if (succeeded) return <SuccessState plan={plan} />;

  async function handlePayment() {
    setProcessing(true);
    // Future: const pm = await stripe.createPaymentMethod(...)
    //         await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ planId: plan.stripePriceId, paymentMethodId: pm.id }) })
    await new Promise((r) => setTimeout(r, 1800)); // simulate network round-trip
    setProcessing(false);
    setSucceeded(true);
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/tarif")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Back to pricing"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Complete Your Subscription</h1>
            <p className="text-sm text-gray-400 mt-0.5">Secure checkout — cancel anytime</p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="border-b border-gray-100 bg-white px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <span className="font-medium text-primary-700">Select plan</span>
          </span>
          <span className="h-px flex-1 bg-primary-200 max-w-8" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">2</span>
            <span className="font-medium text-primary-700">Sign in</span>
          </span>
          <span className="h-px flex-1 bg-primary-200 max-w-8" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">3</span>
            <span className="font-bold text-primary-700">Pay</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          {/* Payment form — left column */}
          <PaymentForm
            plan={plan}
            processing={processing}
            onSubmit={handlePayment}
            onCancel={() => router.push("/tarif")}
          />

          {/* Plan summary — right column (sticky on desktop) */}
          <div className="lg:w-72 xl:w-80 lg:sticky lg:top-32">
            <PlanSummaryCard plan={plan} />

            {/* Security assurances */}
            <div className="mt-4 space-y-2">
              {[
                { icon: "🔒", text: "256-bit SSL encryption" },
                { icon: "↩️", text: "15-day money-back guarantee" },
                { icon: "❌", text: "Cancel or pause anytime" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page export (Suspense boundary for useSearchParams) ─────────────────────

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><svg className="w-6 h-6 animate-spin text-primary-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
