"use client";

import { useState, useEffect } from "react";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validation";
import type { UpdateProfileData, ChangePasswordData } from "@/lib/validation";

// ---- Types -----------------------------------------------------------------

type FormState = "idle" | "loading" | "success" | "error";

type ProfileFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: "fr" | "en" | "ar";
};

// ---- Profile form ----------------------------------------------------------

function ProfileForm() {
  const [fields, setFields] = useState<ProfileFields>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "fr",
  });
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof UpdateProfileData, string>>
  >({});

  useEffect(() => {
    fetch("/api/user/profile", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setFields({
            firstName: data.user.firstName ?? "",
            lastName: data.user.lastName ?? "",
            email: data.user.email ?? "",
            phone: data.user.phone ?? "",
            language: data.user.language ?? "fr",
          });
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (state !== "idle") setState("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const payload = {
      firstName: fields.firstName,
      lastName: fields.lastName,
      phone: fields.phone,
      language: fields.language,
    };

    const result = updateProfileSchema.safeParse(payload);
    if (!result.success) {
      const fe: Partial<Record<keyof UpdateProfileData, string>> = {};
      for (const issue of result.error.issues) {
        const f = issue.path[0] as keyof UpdateProfileData;
        if (!fe[f]) fe[f] = issue.message;
      }
      setFieldErrors(fe);
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setState("success");
        // Reload to apply language change if needed
        if (fields.language !== (await res.json())?.user?.language) {
          window.location.reload();
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to update profile. Please try again.");
        setState("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {state === "success" && (
        <SuccessMessage>Profile updated successfully.</SuccessMessage>
      )}
      {error && <FormError>{error}</FormError>}

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <InputField
          label="First Name"
          name="firstName"
          value={fields.firstName}
          onChange={handleChange}
          autoComplete="given-name"
          required
          error={fieldErrors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={fields.lastName}
          onChange={handleChange}
          autoComplete="family-name"
          required
          error={fieldErrors.lastName}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={fields.email}
          readOnly
          hint="Contact support to change your email address."
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={fields.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="+33 6 00 00 00 00"
          error={fieldErrors.phone}
        />
      </div>

      {/* Language */}
      <div className="mb-6">
        <SelectField
          label="Preferred Language"
          name="language"
          value={fields.language}
          onChange={handleChange}
          options={[
            { value: "fr", label: "🇫🇷  Français" },
            { value: "en", label: "🇬🇧  English" },
            { value: "ar", label: "🇸🇦  العربية" },
          ]}
        />
      </div>

      <SubmitButton loading={state === "loading"}>Save Changes</SubmitButton>
    </form>
  );
}

// ---- Password form ---------------------------------------------------------

function PasswordForm() {
  const [fields, setFields] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ChangePasswordData, string>>
  >({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (state !== "idle") setState("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = changePasswordSchema.safeParse(fields);
    if (!result.success) {
      const fe: Partial<Record<keyof ChangePasswordData, string>> = {};
      for (const issue of result.error.issues) {
        const f = issue.path[0] as keyof ChangePasswordData;
        if (!fe[f]) fe[f] = issue.message;
      }
      setFieldErrors(fe);
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        setState("success");
        setFields({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to update password. Please try again.");
        setState("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {state === "success" && (
        <SuccessMessage>Password changed successfully.</SuccessMessage>
      )}
      {error && <FormError>{error}</FormError>}

      <div className="space-y-4 mb-6">
        <InputField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={fields.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
          required
          error={fieldErrors.currentPassword}
        />
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          value={fields.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
          hint="Min. 8 characters — uppercase, lowercase, and a number."
          error={fieldErrors.newPassword}
        />
        <InputField
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          value={fields.confirmNewPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
          error={fieldErrors.confirmNewPassword}
        />
      </div>

      <SubmitButton loading={state === "loading"}>Change Password</SubmitButton>
    </form>
  );
}

// ---- Shared UI components --------------------------------------------------

function InputField({
  label,
  hint,
  error,
  readOnly,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {props.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        readOnly={readOnly}
        aria-invalid={!!error}
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
          readOnly
            ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
            : error
            ? "border-red-400 bg-red-50 text-gray-900"
            : "border-gray-200 bg-white text-gray-900 hover:border-primary-300"
        }`}
      />
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-primary-300"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SuccessMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2.5 mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm"
    >
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {children}
    </div>
  );
}

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
    >
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      {children}
    </div>
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
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-300"
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading ? "Saving…" : children}
    </button>
  );
}

// ---- Page ------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Sticky header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your account information and preferences.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Profile ────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Update your name, contact details, and preferred language.
            </p>
          </div>
          <div className="px-6 py-5">
            <ProfileForm />
          </div>
        </section>

        {/* ── Password ───────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              You must enter your current password to set a new one.
            </p>
          </div>
          <div className="px-6 py-5">
            <PasswordForm />
          </div>
        </section>

        {/* ── Danger zone ────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-red-100 shadow-sm">
          <div className="px-6 py-4 border-b border-red-100">
            <h2 className="font-semibold text-red-700">Danger Zone</h2>
          </div>
          <div className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete account</p>
              <p className="text-sm text-gray-400 mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              type="button"
              disabled
              title="Contact support to delete your account"
              className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Delete Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
