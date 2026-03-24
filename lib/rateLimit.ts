/**
 * Rate Limiting Utility
 * 
 * Uses an in-memory sliding window approach suitable for 
 * serverless environments with limited concurrency.
 * 
 * Falls back gracefully — if the store is unavailable,
 * requests are allowed through (fail-open).
 */

import { NextRequest, NextResponse } from 'next/server';

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

// ─── In-Memory Store ───────────────────────────────────────────────

interface RateLimitEntry {
    count: number;
    resetAt: number; // timestamp in ms
}

// In-memory store — survives within a single serverless instance lifetime
const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 60 seconds
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

// ─── Core Rate Limiter ─────────────────────────────────────────────

export function getClientIdentifier(req: NextRequest): string {
    // Try standard forwarded headers first
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp;
    // Fallback
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
}

/**
 * Check if a request is within the rate limit.
 * Returns the result without modifying the response.
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
    cleanupStore();

    const key = `${config.name}:${identifier}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
        // New window
        const resetAt = now + config.windowSeconds * 1000;
        store.set(key, { count: 1, resetAt });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt,
            limit: config.maxRequests,
        };
    }

    // Existing window
    entry.count += 1;

    if (entry.count > config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            limit: config.maxRequests,
        };
    }

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
        limit: config.maxRequests,
    };
}

/**
 * Apply rate limit headers to a response.
 */
export function applyRateLimitHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, result.remaining).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetAt / 1000).toString());

    if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
        response.headers.set('Retry-After', Math.max(1, retryAfter).toString());
    }

    return response;
}

/**
 * Create a 429 Too Many Requests response.
 */
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
