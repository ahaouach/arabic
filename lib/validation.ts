/**
 * SECURITY: Central validation module using Zod.
 *
 * All user-facing form data passes through these schemas on both the
 * client (for UX feedback) and the server (for actual enforcement).
 * Never trust client-side validation alone.
 */

import { z } from "zod";

// ---- Shared field helpers ------------------------------------------------

/**
 * A safe string field that:
 *  - Trims whitespace
 *  - Removes control characters (prevents injection of null bytes, etc.)
 *  - Enforces a max length to prevent oversized payloads
 */
function safeString(maxLength: number) {
  return z
    .string()
    .trim()
    // Strip ASCII control characters (0x00–0x1F, 0x7F) except common whitespace
    .transform((val) => val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""))
    .pipe(z.string().min(1, "This field is required").max(maxLength));
}

/**
 * A safe email field — normalised to lowercase.
 */
const safeEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address")
  .max(254, "Email address is too long"); // RFC 5321 limit

// ---- Contact form schema -------------------------------------------------

export const contactSchema = z.object({
  name: safeString(100).pipe(
    z.string().regex(
      /^[\p{L}\p{M}\s'\-\.]+$/u,
      "Name may only contain letters, spaces, hyphens, apostrophes, or periods"
    )
  ),
  email: safeEmail,
  message: safeString(2000).pipe(
    z.string().min(10, "Message must be at least 10 characters")
  ),
  // Honeypot field — bots fill this; real users leave it blank
  website: z.string().max(0, "Invalid submission").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ---- Login / auth schema -------------------------------------------------

export const loginSchema = z.object({
  email: safeEmail,
  /**
   * SECURITY: We intentionally keep the password error messages generic to
   * avoid confirming whether an account exists (user enumeration prevention).
   */
  password: z
    .string()
    .min(8, "Invalid credentials")
    .max(128, "Invalid credentials"),
  // Honeypot
  website: z.string().max(0, "Invalid submission").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ---- Registration / subscription schema ----------------------------------

export const registerSchema = z
  .object({
    name: safeString(100),
    email: safeEmail,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    website: z.string().max(0, "Invalid submission").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ---- Update profile schema -----------------------------------------------

const nameField = (label: string) =>
  safeString(50).pipe(
    z
      .string()
      .regex(
        /^[\p{L}\p{M}\s'\-\.]+$/u,
        `${label} may only contain letters, spaces, hyphens, or apostrophes`
      )
  );

export const updateProfileSchema = z.object({
  firstName: nameField("First name"),
  lastName: nameField("Last name"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(/^[\+\d\s\-\(\)]*$/, "Invalid phone number format")
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),
  language: z.enum(["fr", "en", "ar"], {
    errorMap: () => ({ message: "Please select a valid language" }),
  }),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

// ---- Change password schema ----------------------------------------------

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(128, "Invalid password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
