/**
 * SECURITY: Server-side string sanitization utilities.
 *
 * React already escapes JSX output by default, but we add an extra
 * layer of sanitization on the server before storing or forwarding
 * user-supplied data (e.g. to email bodies, logs, or a database).
 */

/**
 * Strip HTML tags from a string.
 * Prevents stored-XSS when content is later rendered in email or CMS.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Escape characters that have special meaning in HTML.
 * Use this when you must embed user content in raw HTML strings.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] ?? char);
}

/**
 * General-purpose sanitizer for contact form text fields.
 * Trims, strips HTML tags, and collapses excess whitespace.
 */
export function sanitizeText(input: string): string {
  return stripHtml(input).replace(/\s{3,}/g, "  ").trim();
}

/**
 * Normalise an email address: trim + lowercase.
 * Does NOT validate format — use Zod for that.
 */
export function sanitizeEmail(input: string): string {
  return input.trim().toLowerCase();
}
