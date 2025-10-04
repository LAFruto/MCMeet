/**
 * Rate limiting utilities for MCMeet
 * Prevents API abuse and ensures fair usage
 */

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * In-memory rate limiter (for development)
 * For production, use Redis-based solution like @upstash/ratelimit
 */
class InMemoryRateLimiter {
  private store: RateLimitStore = {};
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if request should be rate limited
   */
  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.store[key];

    // Clean up expired entries periodically
    this.cleanup(now);

    // No existing record or expired
    if (!record || now > record.resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };

      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: now + this.windowMs,
      };
    }

    // Increment count
    record.count++;

    // Check if over limit
    if (record.count > this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - record.count,
      reset: record.resetTime,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(now: number): void {
    // Only cleanup every 5 minutes to avoid performance impact
    const keys = Object.keys(this.store);
    if (keys.length > 1000) {
      for (const key of keys) {
        if (now > this.store[key].resetTime) {
          delete this.store[key];
        }
      }
    }
  }
}

/**
 * Chat API rate limiter: 60 requests per minute
 */
export const chatRateLimit = new InMemoryRateLimiter(60, 60 * 1000);

/**
 * Booking API rate limiter: 10 requests per minute
 */
export const bookingRateLimit = new InMemoryRateLimiter(10, 60 * 1000);

/**
 * Auth API rate limiter: 5 requests per minute
 */
export const authRateLimit = new InMemoryRateLimiter(5, 60 * 1000);

/**
 * Check rate limit for chat endpoint
 */
export async function checkChatRateLimit(
  userId?: string,
  ip?: string
): Promise<RateLimitResult> {
  const key = `chat:${userId ?? ip ?? "anon"}`;
  return chatRateLimit.check(key);
}

/**
 * Check rate limit for booking endpoint
 */
export async function checkBookingRateLimit(
  userId?: string,
  ip?: string
): Promise<RateLimitResult> {
  const key = `booking:${userId ?? ip ?? "anon"}`;
  return bookingRateLimit.check(key);
}

/**
 * Check rate limit for auth endpoint
 */
export async function checkAuthRateLimit(
  identifier: string,
  ip?: string
): Promise<RateLimitResult> {
  const key = `auth:${identifier ?? ip ?? "anon"}`;
  return authRateLimit.check(key);
}

/**
 * Helper to create rate limit headers for responses
 */
export function createRateLimitHeaders(result: RateLimitResult): Headers {
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", result.limit.toString());
  headers.set("X-RateLimit-Remaining", result.remaining.toString());
  headers.set("X-RateLimit-Reset", result.reset.toString());
  return headers;
}

/**
 * Note: For production, replace InMemoryRateLimiter with Redis-based solution
 *
 * Example using @upstash/ratelimit:
 *
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 *
 * export const chatRateLimit = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(60, "1 m"),
 *   analytics: true,
 * });
 */
