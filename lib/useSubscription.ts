"use client";

import { useState, useEffect, useCallback } from "react";

// ---- Types -----------------------------------------------------------------

export type PlanId = "starter" | "basic" | "premium";
export type SubscriptionStatus = "active" | "expired" | "cancelled";
export type InvoiceStatus = "paid" | "pending" | "failed";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}

export interface Subscription {
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  plan: string;
  status: InvoiceStatus;
}

export interface PaymentInput {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

// ---- Static plan data (display purposes) -----------------------------------

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    currency: "€",
    period: "month",
    stripePriceId: "price_starter_monthly",
    features: [
      "1 child",
      "2 sessions per week",
      "Arabic program only",
      "Community access",
      "Email support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 19.99,
    currency: "€",
    period: "month",
    popular: true,
    stripePriceId: "price_basic_monthly",
    features: [
      "Up to 2 children",
      "3 sessions per week",
      "Arabic + Quran programs",
      "Homework submissions",
      "Community access",
      "Priority email support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 34.99,
    currency: "€",
    period: "month",
    stripePriceId: "price_premium_monthly",
    features: [
      "Up to 4 children",
      "Unlimited sessions",
      "Arabic + Quran programs",
      "Homework + lesson scheduling",
      "Community access",
      "Dedicated teacher support",
      "Monthly progress reports",
    ],
  },
];

// ---- Hook ------------------------------------------------------------------

export interface UseSubscriptionReturn {
  subscription: Subscription | null;
  invoices: Invoice[];
  plans: Plan[];
  processing: boolean;
  upgradePlan: (planId: string, payment: PaymentInput) => Promise<void>;
  downloadInvoice: (invoice: Invoice) => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [processing, setProcessing] = useState(false);

  const fetchSubscription = useCallback(() => {
    fetch("/api/subscription", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { subscription: null, invoices: [] }))
      .then((data) => {
        setSubscription(data.subscription ?? null);
        setInvoices(data.invoices ?? []);
      })
      .catch(() => {
        setSubscription(null);
        setInvoices([]);
      });
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  async function upgradePlan(planId: string, payment: PaymentInput): Promise<void> {
    // In production: tokenise card via Stripe.js first, then send paymentMethodId
    // For now we send planId and handle payment server-side (Stripe webhook flow)
    void payment; // will be used when Stripe is connected

    setProcessing(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (res.ok) {
        const { subscription: sub, invoice } = await res.json();
        setSubscription(sub);
        setInvoices((prev) => [invoice, ...prev]);
      }
    } finally {
      setProcessing(false);
    }
  }

  function downloadInvoice(invoice: Invoice): void {
    const html = buildInvoiceHTML(invoice);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  return { subscription, invoices, plans: PLANS, processing, upgradePlan, downloadInvoice };
}

// ---- Invoice HTML generator ------------------------------------------------

function buildInvoiceHTML(invoice: Invoice): string {
  const formatted = new Date(invoice.date).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoice.id} — AQ Academy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
    .brand h1 { font-size: 22px; color: #0d6e6e; }
    .brand p  { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .invoice-title h2 { font-size: 28px; font-weight: 700; color: #111; text-align: right; }
    .invoice-title p  { font-size: 13px; color: #6b7280; text-align: right; margin-top: 4px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 36px; }
    .meta-item label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af; display: block; margin-bottom: 4px; }
    .meta-item span  { font-size: 14px; color: #111; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af; font-weight: 700; padding: 8px 12px; border-bottom: 2px solid #e5e7eb; text-align: left; }
    td { padding: 14px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .amount { font-weight: 700; }
    .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #111; border-bottom: none; padding-top: 16px; }
    .status-paid { display: inline-block; background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 99px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>AQ Academy</h1>
      <p>Arabic &amp; Quran Education Online</p>
    </div>
    <div class="invoice-title">
      <h2>INVOICE</h2>
      <p>${invoice.id}</p>
    </div>
  </div>

  <div class="meta">
    <div class="meta-item"><label>Invoice Date</label><span>${formatted}</span></div>
    <div class="meta-item"><label>Status</label><span class="status-paid">Paid</span></div>
    <div class="meta-item"><label>Bill To</label><span>AQ Academy Parent</span></div>
    <div class="meta-item"><label>Invoice ID</label><span>${invoice.id}</span></div>
  </div>

  <table>
    <thead>
      <tr><th>Description</th><th>Period</th><th style="text-align:right">Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${invoice.plan} Subscription</td>
        <td>${formatted}</td>
        <td class="amount" style="text-align:right">${invoice.currency}${invoice.amount.toFixed(2)}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="2">Total</td>
        <td style="text-align:right">${invoice.currency}${invoice.amount.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>AQ Academy · Arabic &amp; Quran Education · support@aqacademy.com</p>
    <p style="margin-top:6px">Thank you for learning with us!</p>
  </div>

  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;
}
