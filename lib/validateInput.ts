/**
 * Input Validation & Sanitization Utilities
 * Prevents XSS, injection, and malformed data from reaching the database.
 */

// ─── String Sanitization ───────────────────────────────────────────

/**
 * Strips dangerous HTML/script tags and trims whitespace.
 */
export function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') return '';
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
}

/**
 * Sanitize an object's string values (shallow).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const cleaned = { ...obj };
    for (const key of Object.keys(cleaned)) {
        if (typeof cleaned[key] === 'string') {
            (cleaned as Record<string, unknown>)[key] = sanitizeString(cleaned[key]);
        }
    }
    return cleaned;
}

// ─── Validators ────────────────────────────────────────────────────

export function isValidEmail(email: unknown): email is string {
    if (typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUUID(id: unknown): id is string {
    if (typeof id !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function isPositiveNumber(val: unknown): val is number {
    return typeof val === 'number' && !isNaN(val) && val > 0;
}

const VALID_ROLES = ['buyer', 'seller', 'admin'] as const;
export function isValidRole(role: unknown): role is typeof VALID_ROLES[number] {
    return typeof role === 'string' && VALID_ROLES.includes(role as any);
}

// ─── Payload Validators ────────────────────────────────────────────

export interface OrderItemPayload {
    productId: string;
    price: number;
    quantity?: number;
    metadata?: Record<string, unknown>;
}

export interface OrderPayload {
    items: OrderItemPayload[];
    total: number;
    paymentMethod?: string;
    paymentRef?: string;
    email?: string;
    additionalInfo?: Record<string, unknown>;
    affiliateId?: string;
}

export function validateOrderPayload(body: unknown): { valid: boolean; error?: string; data?: OrderPayload } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body is required' };
    }

    const b = body as Record<string, unknown>;

    if (!Array.isArray(b.items) || b.items.length === 0) {
        return { valid: false, error: 'At least one item is required' };
    }

    if (!isPositiveNumber(b.total)) {
        return { valid: false, error: 'Total must be a positive number' };
    }

    // Validate individual items
    for (let i = 0; i < b.items.length; i++) {
        const item = b.items[i] as Record<string, unknown>;
        if (!isValidUUID(item.productId)) {
            return { valid: false, error: `Item ${i}: productId must be a valid UUID` };
        }
        if (!isPositiveNumber(item.price)) {
            return { valid: false, error: `Item ${i}: price must be a positive number` };
        }
        if (item.quantity !== undefined && (typeof item.quantity !== 'number' || item.quantity < 1)) {
            return { valid: false, error: `Item ${i}: quantity must be >= 1` };
        }
    }

    // Validate email if provided
    if (b.email !== undefined && !isValidEmail(b.email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return {
        valid: true,
        data: {
            items: b.items as OrderItemPayload[],
            total: b.total as number,
            paymentMethod: typeof b.paymentMethod === 'string' ? sanitizeString(b.paymentMethod) : undefined,
            paymentRef: typeof b.paymentRef === 'string' ? sanitizeString(b.paymentRef) : undefined,
            email: typeof b.email === 'string' ? sanitizeString(b.email) : undefined,
            additionalInfo: b.additionalInfo as Record<string, unknown> | undefined,
            affiliateId: typeof b.affiliateId === 'string' ? sanitizeString(b.affiliateId) : undefined,
        },
    };
}

export interface PayoutPayload {
    amount: number;
    bankDetails: Record<string, unknown>;
}

export function validatePayoutPayload(body: unknown): { valid: boolean; error?: string; data?: PayoutPayload } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body is required' };
    }

    const b = body as Record<string, unknown>;

    if (!isPositiveNumber(b.amount)) {
        return { valid: false, error: 'Amount must be a positive number' };
    }

    if (!b.bankDetails || typeof b.bankDetails !== 'object') {
        return { valid: false, error: 'Bank details are required' };
    }

    return {
        valid: true,
        data: {
            amount: b.amount as number,
            bankDetails: b.bankDetails as Record<string, unknown>,
        },
    };
}
