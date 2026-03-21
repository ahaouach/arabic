"use client";

import { useState } from "react";
import { useSubscription, PLANS } from "@/lib/useSubscription";
import SubscriptionCard from "@/components/SubscriptionCard";
import PaymentForm from "@/components/PaymentForm";
import InvoiceList from "@/components/InvoiceList";
import type { PlanId } from "@/lib/useSubscription";

// ─── Current plan summary ────────────────────────────────────────────────────

function CurrentPlanBanner({
  subscription,
  onChangePlan,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscription>["subscription"]>;
  onChangePlan: () => void;
}) {
  const plan = PLANS.find((p) => p.id === subscription.planId) ?? PLANS[0];
  const isActive = subscription.status === "active";

  const renewalFormatted = new Date(subscription.renewalDate).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-primary-200 text-xs font-semibold uppercase tracking-widest mb-1">
            Current plan
          </p>
          <h2 className="text-2xl font-extrabold mb-3">{plan.name}</h2>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Status */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isActive ? "bg-green-400/20 text-green-200" : "bg-red-400/20 text-red-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-red-400"}`} />
              {isActive ? "Active" : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>

            {/* Renewal date */}
            <span className="flex items-center gap-1.5 text-xs text-primary-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Renews {renewalFormatted}
            </span>

            {/* Price */}
            <span className="text-xs text-primary-200">
              {plan.currency}{plan.price.toFixed(2)} / month
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangePlan}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl transition-colors border border-white/20 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Change plan
        </button>
      </div>
    </div>
  );
}

// ─── Success banner ──────────────────────────────────────────────────────────

function SuccessBanner({ planName, onDismiss }: { planName: string; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl"
    >
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-green-800">Payment successful!</p>
        <p className="text-sm text-green-700 mt-0.5">
          You are now subscribed to the <strong>{planName}</strong> plan. Your invoice has been added below.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-green-400 hover:text-green-600 transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const { subscription, invoices, plans, processing, upgradePlan, downloadInvoice } =
    useSubscription();

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPlanName, setSuccessPlanName] = useState("");
  const [showPlans, setShowPlans] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;
  const showPaymentForm = selectedPlanId !== null && selectedPlanId !== subscription?.planId;

  async function handlePayment(paymentInput: Parameters<typeof upgradePlan>[1]) {
    if (!selectedPlanId) return;
    const plan = plans.find((p) => p.id === selectedPlanId)!;
    await upgradePlan(selectedPlanId, paymentInput);
    setSuccessPlanName(plan.name);
    setShowSuccess(true);
    setSelectedPlanId(null);
    setShowPlans(false);
  }

  function handleChangePlan() {
    setShowPlans(true);
    setShowSuccess(false);
    // Scroll to plans section
    setTimeout(() => {
      document.getElementById("plans-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your plan and download invoices.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Success banner */}
        {showSuccess && (
          <SuccessBanner
            planName={successPlanName}
            onDismiss={() => setShowSuccess(false)}
          />
        )}

        {/* Current plan */}
        {subscription && (
          <CurrentPlanBanner
            subscription={subscription}
            onChangePlan={handleChangePlan}
          />
        )}

        {/* Plan selection */}
        {showPlans && (
          <section id="plans-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Choose a plan</h2>
              <button
                type="button"
                onClick={() => { setShowPlans(false); setSelectedPlanId(null); }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Hide
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 mt-6">
              {plans.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={plan.id === subscription?.planId}
                  isSelected={plan.id === selectedPlanId}
                  onSelect={(id) => setSelectedPlanId(id === selectedPlanId ? null : id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Payment form — appears when a different plan is selected */}
        {showPaymentForm && selectedPlan && (
          <PaymentForm
            plan={selectedPlan}
            processing={processing}
            onSubmit={handlePayment}
            onCancel={() => setSelectedPlanId(null)}
          />
        )}

        {/* Invoice history */}
        <InvoiceList invoices={invoices} onDownload={downloadInvoice} />

      </div>
    </div>
  );
}
