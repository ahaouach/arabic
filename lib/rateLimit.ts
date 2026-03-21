/**
 * SECURITY: In-memory sliding-window rate limiter for API routes.
 *
 * This protects login and contact endpoints against brute-force and spam.
 * In production with multiple instances you should replace this with a
 * Redis-backed solution (e.g. Upstash Rate Limit).
 *
 * Usage:
 *   const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });
 *   const { success } = limiter.check(ip);
 *   if (!success) return new Response('Too Many Requests', { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { limit, windowMs } = options;
  // Map<ip, entry> — stored in server memory
  const store = new Map<string, RateLimitEntry>();

  // Periodically clean up expired entries to avoid memory leaks
  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(key);
    }
  };
  // Run cleanup every 5 minutes
  if (typeof setInterval !== "undefined") {
    setInterval(cleanup, 5 * 60 * 1000);
  }

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || entry.resetAt <= now) {
        // First request in this window
        store.set(identifier, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: limit - 1, resetAt: now + windowMs };
      }

      if (entry.count >= limit) {
        return { success: false, remaining: 0, resetAt: entry.resetAt };
      }

      entry.count += 1;
      return {
        success: true,
        remaining: limit - entry.count,
        resetAt: entry.resetAt,
      };
    },
  };
}

// ---- Pre-configured limiters (imported by API routes) -------------------

/** Login: 5 attempts per minute per IP */
export const loginRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 60_000,
});

/** Contact form: 3 submissions per minute per IP */
export const contactRateLimiter = createRateLimiter({
  limit: 3,
  windowMs: 60_000,
});

/** Community comments: 10 per minute per user */
export const commentRateLimiter = createRateLimiter({
  limit: 10,
  windowMs: 60_000,
});
