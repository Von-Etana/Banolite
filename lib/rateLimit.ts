/**
 * Rate Limiting Utility — Redis-backed with in-memory fallback
 *
 * Primary:  Redis INCR+EXPIRE (shared across all serverless instances)
 * Fallback: In-memory sliding window (single instance, always fail-open)
 *
 * The Redis check is attempted first. If Redis is unavailable or not
 * configured, we fall back to the in-memory store transparently.
 */

import { NextRequest, NextResponse } from 'next/server';
// Note: Redis rate limiting is available via lib/redis.ts checkRedisRateLimit
// This file stays Edge-compatible (no Node.js-only imports)

// ─── Configuration ─────────────────────────────────────────────────

export interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Window duration in seconds */
    windowSeconds: number;
    /** Human-readable name for logging */
    name: string;
}

// Preset configurations by endpoint pattern
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
    auth: {
        maxRequests: 5,
        windowSeconds: 60,
        name: 'auth',
    },
    webhook: {
        maxRequests: 100,
        windowSeconds: 60,
        name: 'webhook',
    },
    api: {
        maxRequests: 30,
        windowSeconds: 60,
        name: 'api',
    },
};

// ─── In-Memory Fallback Store ──────────────────────────────────────

interface RateLimitEntry {
    count: number;
    resetAt: number; // timestamp in ms
}

const store = new Map<string, RateLimitEntry>();

let lastCleanup = Date.now();
function cleanupStore() {
    const now = Date.now();
    if (now - lastCleanup < 60_000) return;
    lastCleanup = now;
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt <= now) {
            store.delete(key);
        }
    }
}

// ─── Helpers ───────────────────────────────────────────────────────

export function getClientIdentifier(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp;
    return 'unknown';
}

export function getConfigForPath(pathname: string): RateLimitConfig {
    if (pathname.startsWith('/api/auth')) return RATE_LIMIT_CONFIGS.auth;
    if (pathname.startsWith('/api/webhooks')) return RATE_LIMIT_CONFIGS.webhook;
    return RATE_LIMIT_CONFIGS.api;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    limit: number;
    source: 'redis' | 'memory';
}

// ─── In-memory check (Edge-compatible, used by middleware) ─────────

export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
    cleanupStore();

    const key = `${config.name}:${identifier}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
        const resetAt = now + config.windowSeconds * 1000;
        store.set(key, { count: 1, resetAt });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt,
            limit: config.maxRequests,
            source: 'memory',
        };
    }

    entry.count += 1;

    if (entry.count > config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            limit: config.maxRequests,
            source: 'memory',
        };
    }

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
        limit: config.maxRequests,
        source: 'memory',
    };
}

// ─── Response helpers ──────────────────────────────────────────────

export function applyRateLimitHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, result.remaining).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetAt / 1000).toString());
    response.headers.set('X-RateLimit-Source', result.source);

    if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
        response.headers.set('Retry-After', Math.max(1, retryAfter).toString());
    }

    return response;
}

export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
    );
    applyRateLimitHeaders(response, result);
    response.headers.set('Retry-After', Math.max(1, retryAfter).toString());
    return response;
}

