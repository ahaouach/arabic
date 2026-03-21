"use client";

/**
 * /subscribe — Plan-aware sign-up / login page.
 *
 * Reads ?plan= from the URL to show plan context while the user creates an
 * account or logs in.  After successful authentication it reads
 * localStorage["aq:redirectAfterLogin"] and sends the user to their intended
 * destination (typically /dashboard/subscription/payment?plan=…).
 *
 * SECURITY notes: identical to /login — honeypot, generic error messages,
 * rate limiting enforced server-side.
 */

import { Suspense, useState, useId, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { getPlanById } from "@/lib/plans";
import { loginSchema, registerSchema } from "@/lib/validation";
import type { LoginFormData, RegisterFormData } from "@/lib/validation";

// ─── Constants ───────────────────────────────────────────────────────────────

const REDIRECT_KEY = "aq:redirectAfterLogin";

type Tab = "register" | "login";
type FormState = "idle" | "loading" | "success" | "error";

// ─── Redirect helper ─────────────────────────────────────────────────────────

function doRedirectAfterAuth() {
  const dest = localStorage.getItem(REDIRECT_KEY) ?? "/dashboard";
  localStorage.removeItem(REDIRECT_KEY);
  window.location.href = dest;
}

// ─── Inner page (needs useSearchParams — must be in Suspense) ────────────────

function SubscribeContent() {
  const id = useId();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const planId = searchParams.get("plan");
  const plan = planId ? getPlanById(planId) : null;

  // Default to register tab (user is coming from pricing page)
  const [activeTab, setActiveTab] = useState<Tab>("register");

  // If already authenticated, honour stored redirect immediately
  useEffect(() => {
    if (!authLoading && user) {
      doRedirectAfterAuth();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <div className="min-h-screen bg-sand-50" aria-hidden="true" />;
  }

  return (
    <main id="main-content" className="min-h-screen bg-sand-50 py-16 px-4">
      {/* Decorative header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex flex-col items-center gap-2 group"
          aria-label="AQ Academy — Home"
        >
          <div
            className="w-16 h-16 rounded-full bg-primary-600 text-white text-3xl font-arabic flex items-center justify-center shadow-lg group-hover:bg-primary-700 transition-colors"
            aria-hidden="true"
          >
            ع
          </div>
          <span className="text-2xl font-extrabold text-primary-900 group-hover:text-primary-700 transition-colors">
            AQ Academy
          </span>
        </Link>
        <p className="text-gray-500 mt-2 text-sm">
          {activeTab === "register"
            ? "Create your account to start learning"
            : "Welcome back — sign in to continue"}
        </p>
      </div>

      {/* Selected plan context banner */}
      {plan && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-0.5">
                Selected Plan
              </p>
              <p className="text-sm font-bold text-primary-900 truncate">
                {plan.name}
                <span className="font-normal text-primary-700 ml-2">
                  {plan.currency}{plan.priceMonthly} / month
                </span>
              </p>
              <p className="text-xs text-primary-600 mt-0.5">{plan.billingLabel}</p>
            </div>
            <Link
              href="/tarif"
              className="text-xs text-primary-500 hover:text-primary-700 underline shrink-0"
            >
              Change
            </Link>
          </div>
        </div>
      )}

      {/* Auth card */}
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-sand-200" role="tablist" aria-label="Authentication options">
          {(["register", "login"] as Tab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${id}-${tab}-panel`}
              id={`${id}-${tab}-tab`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 ${
                activeTab === tab
                  ? "text-primary-700 border-b-2 border-primary-600 bg-primary-50"
                  : "text-gray-500 hover:text-primary-700 hover:bg-sand-50"
              }`}
            >
              {tab === "register" ? "Create Account" : "Sign In"}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === "register" ? (
            <RegisterForm
              id={id}
              onSuccess={() => {
                // After registration, switch to login tab (consistent with /login page)
                setActiveTab("login");
              }}
            />
          ) : (
            <LoginForm id={id} />
          )}
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-400 mt-6 max-w-sm mx-auto">
        Your data is stored securely. We never share your personal information
        with third parties.
      </p>
    </main>
  );
}

// ─── Page shell (Suspense boundary for useSearchParams) ──────────────────────

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand-50" />}>
      <SubscribeContent />
    </Suspense>
  );
}

// ─── Login form ──────────────────────────────────────────────────────────────

function LoginForm({ id }: { id: string }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState("");
  const [fields, setFields] = useState<LoginFormData>({ email: "", password: "", website: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(fields);
    if (!result.success) {
      const fe: Partial<LoginFormData> = {};
      for (const issue of result.error.issues) {
        const f = issue.path[0] as keyof LoginFormData;
        if (!fe[f]) (fe as Record<string, string>)[f] = issue.message;
      }
      setErrors(fe);
      return;
    }

    setFormState("loading");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        setFormState("success");
        doRedirectAfterAuth();
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setServerError("Too many attempts. Please wait a minute and try again.");
        } else {
          setServerError(data?.error ?? "Invalid email or password.");
        }
        setFormState("error");
      }
    } catch {
      setServerError("Network error. Please try again.");
      setFormState("error");
    }
  }

  return (
    <form
      id={`${id}-login-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-login-tab`}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Login form"
    >
      {/* Honeypot */}
      <div aria-hidden="true" className="hidden" tabIndex={-1}>
        <input
          name="website"
          type="text"
          value={fields.website}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {serverError && (
        <div role="alert" className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {serverError}
        </div>
      )}

      <div className="mb-5">
        <label htmlFor={`${id}-s-login-email`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          id={`${id}-s-login-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          value={fields.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={inputClass(!!errors.email)}
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </div>

      <div className="mb-7">
        <label htmlFor={`${id}-s-login-password`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id={`${id}-s-login-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          value={fields.password}
          onChange={handleChange}
          placeholder="••••••••"
          className={inputClass(!!errors.password)}
        />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      <SubmitButton loading={formState === "loading"}>Sign In</SubmitButton>

      <p className="mt-4 text-center text-xs text-gray-400">
        Demo: <strong>demo@example.com</strong> / <strong>Demo1234</strong>
      </p>
    </form>
  );
}

// ─── Register form ───────────────────────────────────────────────────────────

function RegisterForm({ id, onSuccess }: { id: string; onSuccess: () => void }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [fields, setFields] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = registerSchema.safeParse(fields);
    if (!result.success) {
      const fe: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const f = String(issue.path[0]);
        if (!fe[f]) fe[f] = issue.message;
      }
      setErrors(fe);
      return;
    }

    setFormState("loading");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        setFormState("success");
        onSuccess(); // switch to login tab
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(data?.error ?? "Registration failed. Please try again.");
        setFormState("error");
      }
    } catch {
      setServerError("Network error. Please try again.");
      setFormState("error");
    }
  }

  return (
    <form
      id={`${id}-register-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-register-tab`}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Registration form"
    >
      {/* Honeypot */}
      <div aria-hidden="true" className="hidden" tabIndex={-1}>
        <input
          name="website"
          type="text"
          value={fields.website}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {serverError && (
        <div role="alert" className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {serverError}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor={`${id}-s-reg-name`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Full Name
        </label>
        <input
          id={`${id}-s-reg-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          value={fields.name}
          onChange={handleChange}
          placeholder="Sarah Johnson"
          className={inputClass(!!errors.name)}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </div>

      <div className="mb-4">
        <label htmlFor={`${id}-s-reg-email`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          id={`${id}-s-reg-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          value={fields.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={inputClass(!!errors.email)}
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </div>

      <div className="mb-4">
        <label htmlFor={`${id}-s-reg-password`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id={`${id}-s-reg-password`}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={`${id}-s-reg-pw-hint`}
          value={fields.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          className={inputClass(!!errors.password)}
        />
        <p id={`${id}-s-reg-pw-hint`} className="mt-1 text-xs text-gray-400">
          At least 8 characters, including upper &amp; lowercase and a number.
        </p>
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      <div className="mb-7">
        <label htmlFor={`${id}-s-reg-confirm`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Confirm Password
        </label>
        <input
          id={`${id}-s-reg-confirm`}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-invalid={!!errors.confirmPassword}
          value={fields.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          className={inputClass(!!errors.confirmPassword)}
        />
        {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
      </div>

      <SubmitButton loading={formState === "loading"}>Create Account</SubmitButton>
    </form>
  );
}

// ─── Shared UI helpers ───────────────────────────────────────────────────────

function inputClass(hasError: boolean): string {
  return `w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
    hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-200 bg-white hover:border-primary-300"
  }`;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="mt-1.5 text-xs text-red-600">{children}</p>;
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="w-full py-3.5 px-6 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-300"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Please wait…
        </span>
      ) : children}
    </button>
  );
}
