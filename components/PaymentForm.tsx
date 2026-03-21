"use client";

import { useState } from "react";
import type { Plan, PaymentInput } from "@/lib/useSubscription";

// ─── Card utilities ──────────────────────────────────────────────────────────

type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

function detectBrand(number: string): CardBrand {
  const d = number.replace(/\D/g, "");
  if (d.startsWith("4"))       return "visa";
  if (/^5[1-5]/.test(d))      return "mastercard";
  if (/^3[47]/.test(d))       return "amex";
  return "unknown";
}

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/** Basic Luhn algorithm — standard card number validity check */
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
  const exp = new Date(2000 + parseInt(yy, 10), m - 1, 1);
  return exp > new Date();
}

// ─── Brand badge ─────────────────────────────────────────────────────────────

const BRAND_STYLES: Record<CardBrand, string> = {
  visa:       "bg-blue-600 text-white",
  mastercard: "bg-red-600 text-white",
  amex:       "bg-green-700 text-white",
  unknown:    "bg-gray-200 text-gray-500",
};
const BRAND_LABELS: Record<CardBrand, string> = {
  visa: "VISA", mastercard: "MC", amex: "AMEX", unknown: "CARD",
};

// ─── Form types ──────────────────────────────────────────────────────────────

interface Fields {
  cardholderName: string;
  cardNumber: string;  // formatted with spaces
  expiry: string;
  cvv: string;
}

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { cardholderName: "", cardNumber: "", expiry: "", cvv: "" };

interface PaymentFormProps {
  plan: Plan;
  processing: boolean;
  onSubmit: (input: PaymentInput) => void;
  onCancel: () => void;
}

export default function PaymentForm({ plan, processing, onSubmit, onCancel }: PaymentFormProps) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
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
    const e: Errors = {};
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
    onSubmit({
      cardholderName: fields.cardholderName.trim(),
      cardNumber: fields.cardNumber.replace(/\s/g, ""),
      expiry: fields.expiry,
      cvv: fields.cvv,
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Payment details</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Subscribing to <span className="font-semibold text-primary-700">{plan.name}</span> · {plan.currency}{plan.price.toFixed(2)}/month
          </p>
        </div>
        {/* Security badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Secure
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Cardholder name */}
        <Field label="Cardholder name" error={errors.cardholderName} required>
          <input
            type="text"
            value={fields.cardholderName}
            onChange={(e) => set("cardholderName", e.target.value)}
            autoComplete="cc-name"
            placeholder="Ahmed Benali"
            disabled={processing}
            className={inputClass(!!errors.cardholderName, processing)}
          />
        </Field>

        {/* Card number */}
        <Field label="Card number" error={errors.cardNumber} required>
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
              className={`${inputClass(!!errors.cardNumber, processing)} pr-16`}
            />
            {/* Brand badge */}
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black px-2 py-0.5 rounded ${BRAND_STYLES[brand]}`}>
              {BRAND_LABELS[brand]}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Test card: 4242 4242 4242 4242</p>
        </Field>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry date" error={errors.expiry} required>
            <input
              type="text"
              inputMode="numeric"
              value={fields.expiry}
              onChange={(e) => set("expiry", e.target.value)}
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              disabled={processing}
              className={inputClass(!!errors.expiry, processing)}
            />
          </Field>
          <Field label={`CVV (${cvvLength} digits)`} error={errors.cvv} required>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                value={fields.cvv}
                onChange={(e) => set("cvv", e.target.value)}
                autoComplete="cc-csc"
                placeholder={"•".repeat(cvvLength)}
                maxLength={cvvLength}
                disabled={processing}
                className={inputClass(!!errors.cvv, processing)}
              />
            </div>
          </Field>
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
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pay {plan.currency}{plan.price.toFixed(2)}
              </>
            )}
          </button>
        </div>

        {/* Trust note */}
        <p className="text-xs text-gray-400 text-center">
          Your payment is secured. No card data is stored on our servers.
        </p>
      </form>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({
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

function inputClass(hasError: boolean, disabled: boolean) {
  return `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
    disabled   ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200" :
    hasError   ? "border-red-300 bg-red-50" :
                 "border-gray-200 bg-white hover:border-primary-300"
  }`;
}
