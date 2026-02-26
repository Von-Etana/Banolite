/**
 * Storage Service - LocalStorage wrapper with type safety and JSON serialization
 */

const STORAGE_KEYS = {
    USERS: 'banolite_users',
    CURRENT_USER: 'banolite_current_user',
    PRODUCTS: 'banolite_products',
    ORDERS: 'banolite_orders',
    REVIEWS: 'banolite_reviews',
    NOTIFICATIONS: 'banolite_notifications',
    CART: 'banolite_cart',
    SITE_CONTENT: 'banolite_site_content',
    BOOKINGS: 'banolite_bookings',
    TICKETS: 'banolite_tickets',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Get data from localStorage with automatic JSON parsing
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
    try {
        if (typeof window === 'undefined') return defaultValue;
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item) as T;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Set data in localStorage with automatic JSON stringification
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
    try {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: StorageKey): void {
    try {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
}

/**
 * Clear all Redex-related data from localStorage
 */
export function clearAllStorage(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Simple hash function for password storage (for demo purposes only)
 * In production, use proper server-side hashing with bcrypt
 */
export function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

export { STORAGE_KEYS };
