"use client";

/**
 * Login / Subscribe page.
 *
 * SECURITY notes:
 *  - Passwords are never sent to the server in plain text over insecure channels
 *    (HTTPS is enforced via HSTS in middleware for production).
 *  - Error messages are intentionally generic to prevent user enumeration.
 *  - Honeypot field present on both forms.
 *  - Rate limiting enforced in the API route.
 */

import { useState, useId, useEffect } from "react";
import { loginSchema, registerSchema } from "@/lib/validation";
import type { LoginFormData, RegisterFormData } from "@/lib/validation";

type Tab = "login" | "register";
type FormState = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const id = useId();
  const [activeTab, setActiveTab] = useState<Tab>("login");

  // Switch to register tab if URL has #subscribe hash
  useEffect(() => {
    if (window.location.hash === "#subscribe") {
      setActiveTab("register");
    }
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-sand-50 py-16 px-4">
      {/* Decorative header */}
      <div className="text-center mb-10">
        <div
          className="w-16 h-16 rounded-full bg-primary-600 text-white text-3xl font-arabic flex items-center justify-center mx-auto mb-4 shadow-lg"
          aria-hidden="true"
        >
          ع
        </div>
        <h1 className="text-3xl font-extrabold text-primary-900 mb-1">
          AQ Academy
        </h1>
        <p className="text-gray-600">
          {activeTab === "login"
            ? "Welcome back — sign in to your account"
            : "Create an account to start learning"}
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-sand-200" role="tablist" aria-label="Authentication options">
          {(["login", "register"] as Tab[]).map((tab) => (
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
              {tab === "login" ? "Login" : "Subscribe"}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="p-8">
          {activeTab === "login" ? (
            <LoginForm id={id} />
          ) : (
            <RegisterForm id={id} onSuccess={() => setActiveTab("login")} />
          )}
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-400 mt-6 max-w-sm mx-auto">
        Your data is stored securely. We never share your personal information
        with third parties. See our privacy policy for details.
      </p>
    </main>
  );
}

// ---- Login form ----------------------------------------------------------

function LoginForm({ id }: { id: string }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState("");
  const [fields, setFields] = useState<LoginFormData>({
    email: "",
    password: "",
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
        // Honour any stored redirect (e.g. from pricing page plan selection)
        const stored = localStorage.getItem("aq:redirectAfterLogin");
        localStorage.removeItem("aq:redirectAfterLogin");
        window.location.href = stored ?? "/dashboard";
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setServerError("Too many attempts. Please wait a minute and try again.");
        } else {
          // SECURITY: Generic error — do not reveal whether email exists
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
        <label htmlFor={`${id}-login-email`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          id={`${id}-login-email`}
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
        <label htmlFor={`${id}-login-password`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id={`${id}-login-password`}
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
        Demo account: <strong>demo@example.com</strong> / <strong>Demo1234</strong>
      </p>
    </form>
  );
}

// ---- Register form -------------------------------------------------------

function RegisterForm({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: () => void;
}) {
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
        onSuccess();
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
      aria-label="Subscription registration form"
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

      {/* Name */}
      <div className="mb-4">
        <label htmlFor={`${id}-reg-name`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Full Name
        </label>
        <input
          id={`${id}-reg-name`}
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

      {/* Email */}
      <div className="mb-4">
        <label htmlFor={`${id}-reg-email`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          id={`${id}-reg-email`}
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

      {/* Password */}
      <div className="mb-4">
        <label htmlFor={`${id}-reg-password`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id={`${id}-reg-password`}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={`${id}-reg-password-hint`}
          value={fields.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          className={inputClass(!!errors.password)}
        />
        <p id={`${id}-reg-password-hint`} className="mt-1 text-xs text-gray-400">
          At least 8 characters, including upper &amp; lowercase and a number.
        </p>
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      {/* Confirm password */}
      <div className="mb-7">
        <label htmlFor={`${id}-reg-confirm`} className="block text-sm font-semibold text-gray-700 mb-1.5">
          Confirm Password
        </label>
        <input
          id={`${id}-reg-confirm`}
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

// ---- Shared UI helpers ---------------------------------------------------

function inputClass(hasError: boolean): string {
  return `w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
    hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-200 bg-white hover:border-primary-300"
  }`;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-600">
      {children}
    </p>
  );
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
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
      ) : (
        children
      )}
    </button>
  );
}
