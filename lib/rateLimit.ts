/**
 * Minimal in-memory sliding-window rate limiter, keyed by IP.
 * Good enough for a single-instance deployment or local dev. For
 * multi-instance production deployments, swap this for Upstash Redis
 * or Vercel KV using the same `check` interface.
 */
const WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const limit = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 20);
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, remaining: limit - timestamps.length };
}
