/**
 * Redis Cache Client — Upstash
 *
 * Provides a singleton Redis client with graceful fallback.
 * If UPSTASH_REDIS_REST_URL / TOKEN are not set, all cache
 * operations are no-ops and the app falls through to Supabase.
 *
 * Cache Key Conventions:
 *   products:list:{paramsHash}   → 5 min TTL
 *   products:id:{id}             → 10 min TTL
 *   reviews:product:{productId}  → 5 min TTL
 *   profile:public:{userId}      → 10 min TTL
 *   banks:list                   → 24 hr TTL
 *   ratelimit:{name}:{ip}        → sliding window
 */

import { Redis } from '@upstash/redis';

// ─── Singleton client ──────────────────────────────────────────────

let _redis: Redis | null = null;

function getRedis(): Redis | null {
    if (_redis) return _redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        // Redis not configured — graceful no-op mode
        return null;
    }

    try {
        _redis = new Redis({ url, token });
        return _redis;
    } catch {
        console.warn('[Redis] Failed to initialise client');
        return null;
    }
}

// ─── Public TTL constants ──────────────────────────────────────────

export const TTL = {
    PRODUCTS_LIST: 5 * 60,      // 5 minutes
    PRODUCT_SINGLE: 10 * 60,    // 10 minutes
    REVIEWS: 5 * 60,            // 5 minutes
    PROFILE: 10 * 60,           // 10 minutes
    BANKS: 24 * 60 * 60,        // 24 hours
} as const;

// ─── Cache helpers ─────────────────────────────────────────────────

/**
 * Get a cached value. Returns null on miss or if Redis is unavailable.
 */
export async function getCache<T>(key: string): Promise<T | null> {
    const redis = getRedis();
    if (!redis) return null;

    try {
        const data = await redis.get<T>(key);
        return data ?? null;
    } catch (err) {
        console.warn(`[Redis] getCache failed for "${key}":`, err);
        return null;
    }
}

/**
 * Store a value in the cache with a TTL in seconds.
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    try {
        await redis.set(key, value, { ex: ttlSeconds });
    } catch (err) {
        console.warn(`[Redis] setCache failed for "${key}":`, err);
    }
}

/**
 * Invalidate one or more specific cache keys.
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
    const redis = getRedis();
    if (!redis || keys.length === 0) return;

    try {
        await redis.del(...keys);
    } catch (err) {
        console.warn('[Redis] invalidateCache failed:', err);
    }
}

/**
 * Invalidate all keys matching a pattern (e.g. "products:list:*").
 * Uses SCAN to avoid blocking the server.
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    try {
        let cursor = 0;
        do {
            const [nextCursor, keys] = await redis.scan(cursor, {
                match: pattern,
                count: 100,
            });
            cursor = Number(nextCursor);
            if (keys.length > 0) {
                await redis.del(...(keys as string[]));
            }
        } while (cursor !== 0);
    } catch (err) {
        console.warn(`[Redis] invalidateCachePattern failed for "${pattern}":`, err);
    }
}

// ─── Rate limiting helpers ─────────────────────────────────────────

export interface RedisRateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number; // Unix ms
    limit: number;
}

/**
 * Redis-backed sliding window rate limiter using INCR + EXPIRE.
 * Returns null if Redis is unavailable (caller should fall back to in-memory).
 */
export async function checkRedisRateLimit(
    identifier: string,
    config: { name: string; maxRequests: number; windowSeconds: number }
): Promise<RedisRateLimitResult | null> {
    const redis = getRedis();
    if (!redis) return null;

    const key = `ratelimit:${config.name}:${identifier}`;
    const now = Date.now();

    try {
        // Increment atomically; set TTL only on first request in the window
        const count = await redis.incr(key);

        if (count === 1) {
            // First hit in this window — set expiry
            await redis.expire(key, config.windowSeconds);
        }

        // Estimate reset time (TTL remaining)
        const ttlSecs = await redis.ttl(key);
        const resetAt = now + (ttlSecs > 0 ? ttlSecs * 1000 : config.windowSeconds * 1000);

        const allowed = count <= config.maxRequests;

        return {
            allowed,
            remaining: Math.max(0, config.maxRequests - count),
            resetAt,
            limit: config.maxRequests,
        };
    } catch (err) {
        console.warn(`[Redis] checkRedisRateLimit failed for "${key}":`, err);
        return null; // fall back to in-memory
    }
}

// ─── Key builders ──────────────────────────────────────────────────

/**
 * Generate a stable cache key from URL search params.
 * Sorts params so order doesn't matter.
 */
export function buildProductsListKey(searchParams: URLSearchParams): string {
    const sorted = [...searchParams.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    return `products:list:${sorted || 'all'}`;
}
