/**
 * SECURITY: Contact form API route.
 *
 * Protections applied:
 *  1. Origin validation — rejects cross-origin requests (CSRF defence)
 *  2. Rate limiting — 3 requests per minute per IP
 *  3. Server-side Zod validation — client validation is never trusted alone
 *  4. Honeypot check — reject if "website" field is populated
 *  5. Input sanitization — strip HTML and normalize strings
 *  6. Generic error messages — avoid information leakage
 */

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";
import { contactRateLimiter } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // ---- 1. CSRF: Origin validation ----------------------------------------
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // ---- 2. Rate limiting --------------------------------------------------
  // Use the forwarded IP (Vercel / proxies) or fall back to a placeholder
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { success: allowed, resetAt } = contactRateLimiter.check(ip);

  if (!allowed) {
    const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSecs) },
      }
    );
  }

  // ---- 3. Parse body -------------------------------------------------------
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ---- 4. Server-side Zod validation -------------------------------------
  const result = contactSchema.safeParse(rawBody);
  if (!result.success) {
    // Return first validation error — generic enough to not leak internal schema
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const { name, email, message, website } = result.data;

  // ---- 5. Honeypot check -------------------------------------------------
  // 'website' is a hidden field that real users never fill in.
  if (website && website.length > 0) {
    // Silently accept to not alert bots, but do nothing
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // ---- 6. Sanitize -------------------------------------------------------
  const sanitizedName = sanitizeText(name);
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedMessage = sanitizeText(message);

  // ---- 7. Process (send email, save to DB, etc.) -------------------------
  // In production: send via Nodemailer/Resend/SendGrid to CONTACT_TO_EMAIL.
  // For now we log to server console (visible only in server logs, not client).
  console.log("[Contact Form Submission]", {
    name: sanitizedName,
    email: sanitizedEmail,
    message: sanitizedMessage.slice(0, 100) + "…", // truncate for logs
    timestamp: new Date().toISOString(),
    ip, // for audit trail
  });

  return NextResponse.json(
    { success: true, message: "Your message has been received." },
    { status: 200 }
  );
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
