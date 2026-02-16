/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach per IP address.
 * 
 * Note: In serverless (Vercel), each cold start resets the cache.
 * For stricter rate limiting, use Upstash Redis or Vercel KV.
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const cache = new Map<string, RateLimitEntry>()

// Clean expired entries periodically
const CLEANUP_INTERVAL = 60_000 // 1 minute
let lastCleanup = Date.now()

function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now

    for (const [key, entry] of cache.entries()) {
        if (now > entry.resetAt) {
            cache.delete(key)
        }
    }
}

interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    maxRequests: number
    /** Window duration in milliseconds */
    windowMs: number
}

interface RateLimitResult {
    success: boolean
    remaining: number
    resetAt: number
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    cleanup()

    const now = Date.now()
    const entry = cache.get(identifier)

    if (!entry || now > entry.resetAt) {
        // New window
        cache.set(identifier, {
            count: 1,
            resetAt: now + config.windowMs,
        })
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetAt: now + config.windowMs,
        }
    }

    if (entry.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt,
        }
    }

    entry.count++
    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    }
}

/** Default chat rate limit: 20 messages per minute per IP */
export const CHAT_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 20,
    windowMs: 60_000, // 1 minute
}
