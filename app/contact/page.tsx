"use client";

/**
 * Contact page — client component because it manages form state.
 *
 * SECURITY measures on this form:
 *  1. Zod validation runs client-side for UX *and* server-side for enforcement
 *  2. Honeypot "website" field: hidden from real users, traps bots
 *  3. Rate limiting enforced in the API route
 *  4. All inputs sanitized before display and before sending
 *  5. Error messages are generic to avoid information disclosure
 */

import { useState, useId } from "react";
import type { Metadata } from "next";
import { contactSchema, type ContactFormData } from "@/lib/validation";

// Note: metadata export works only in Server Components.
// Move to a separate layout.ts or use generateMetadata in a server wrapper.

type FormState = "idle" | "loading" | "success" | "error";

interface FieldError {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const id = useId(); // Stable IDs for accessibility (label/input linking)

  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldError>({});
  const [serverError, setServerError] = useState<string>("");

  const [fields, setFields] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot — always empty for real users
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    // ---- Client-side Zod validation (for immediate UX feedback) ----------
    const result = contactSchema.safeParse(fields);
    if (!result.success) {
      const fieldErrors: FieldError = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldError;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setFormState("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
        // SECURITY: credentials 'same-origin' ensures cookies are sent only to same origin
        credentials: "same-origin",
      });

      if (response.ok) {
        setFormState("success");
        setFields({ name: "", email: "", message: "", website: "" });
      } else {
        const data = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setServerError("Too many requests. Please wait a minute before trying again.");
        } else {
          setServerError(data?.error ?? "Something went wrong. Please try again.");
        }
        setFormState("error");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <main id="main-content" className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-sm border border-sand-200">
          {/* Success icon */}
          <div
            className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5"
            aria-hidden="true"
          >
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Message sent!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
          </p>
          <button
            onClick={() => setFormState("idle")}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300"
          >
            Send another message
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-sand-50">
      {/* Page header */}
      <section className="bg-primary-700 text-white py-14 text-center" aria-labelledby="contact-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 id="contact-heading" className="text-4xl font-extrabold mb-3">
            Contact Us
          </h1>
          <p className="text-primary-200 text-lg">
            Have a question about enrollment, programs, or pricing? We&apos;re
            here to help.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Info sidebar */}
        <aside className="md:col-span-2 flex flex-col gap-6" aria-label="Contact information">
          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-4">Get in touch</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "Email",
                  value: "info@aqacademy.example.com",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: "Response time",
                  value: "Within 1–2 business days",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: "We serve",
                  value: "Families worldwide (online)",
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-gray-800 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ teaser */}
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h3 className="font-bold text-primary-900 text-sm mb-2">Common questions</h3>
            <ul className="flex flex-col gap-2 text-sm text-primary-700">
              {[
                "What age groups do you accept?",
                "Do you offer trial lessons?",
                "What languages do teachers speak?",
              ].map((q) => (
                <li key={q} className="flex items-start gap-2">
                  <span className="text-primary-400 font-bold mt-0.5" aria-hidden="true">›</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Contact form */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-primary-900 mb-6">Send us a message</h2>

            {serverError && (
              <div
                role="alert"
                className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
              >
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
            >
              {/*
               * SECURITY: Honeypot field.
               * Hidden visually and from screen readers via aria-hidden.
               * If a bot fills this field, the server rejects the submission.
               */}
              <div aria-hidden="true" className="hidden" tabIndex={-1}>
                <label htmlFor={`${id}-website`}>Leave this empty</label>
                <input
                  id={`${id}-website`}
                  name="website"
                  type="text"
                  value={fields.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              {/* Name */}
              <div className="mb-5">
                <label
                  htmlFor={`${id}-name`}
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Full Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-describedby={errors.name ? `${id}-name-error` : undefined}
                  aria-invalid={!!errors.name}
                  value={fields.name}
                  onChange={handleChange}
                  placeholder="Sarah Johnson"
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    errors.name
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                />
                {errors.name && (
                  <p id={`${id}-name-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-5">
                <label
                  htmlFor={`${id}-email`}
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-describedby={errors.email ? `${id}-email-error` : undefined}
                  aria-invalid={!!errors.email}
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    errors.email
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                />
                {errors.email && (
                  <p id={`${id}-email-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="mb-7">
                <label
                  htmlFor={`${id}-message`}
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Message <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <textarea
                  id={`${id}-message`}
                  name="message"
                  rows={5}
                  required
                  aria-required="true"
                  aria-describedby={errors.message ? `${id}-message-error` : undefined}
                  aria-invalid={!!errors.message}
                  value={fields.message}
                  onChange={handleChange}
                  placeholder="Tell us about your child's age, current level, and any questions you have..."
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none ${
                    errors.message
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                />
                {errors.message && (
                  <p id={`${id}-message-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                    {errors.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {fields.message.length}/2000
                </p>
              </div>

              <button
                type="submit"
                disabled={formState === "loading"}
                aria-busy={formState === "loading"}
                className="w-full py-3.5 px-6 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                {formState === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

              <p className="mt-4 text-xs text-gray-400 text-center">
                We respect your privacy and will never share your information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
