/**
 * Lightweight client-side cache using localStorage with TTL (time-to-live).
 * Reduces redundant API calls for public data that changes infrequently.
 *
 * Cache durations:
 *   - Public invitations: 10 minutes
 *   - Templates list:    30 minutes
 *   - Categories:        1 hour
 */

const CACHE_PREFIX = 'im_cache_';

// Default TTLs in milliseconds
export const CACHE_TTL = {
    INVITATION: 10 * 60 * 1000,   // 10 minutes
    TEMPLATES: 30 * 60 * 1000,    // 30 minutes
    CATEGORIES: 60 * 60 * 1000,   // 1 hour
    TEMPLATE_DETAIL: 30 * 60 * 1000, // 30 minutes
};

/**
 * Get a cached value by key. Returns null if expired or not found.
 */
export const getCache = (key) => {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;

        const { data, expiresAt } = JSON.parse(raw);

        if (Date.now() > expiresAt) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }

        return data;
    } catch {
        // If JSON parsing fails or storage is corrupted, remove the key
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
    }
};

/**
 * Set a cache value with a TTL (in milliseconds).
 */
export const setCache = (key, data, ttl) => {
    try {
        const entry = {
            data,
            expiresAt: Date.now() + ttl,
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
        // localStorage might be full — silently fail, caching is optional
        if (e.name === 'QuotaExceededError') {
            clearAllCache(); // Free up space
        }
    }
};

/**
 * Remove a specific cache entry.
 */
export const invalidateCache = (key) => {
    localStorage.removeItem(CACHE_PREFIX + key);
};

/**
 * Clear all cache entries (useful on logout or when admin updates data).
 */
export const clearAllCache = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
};

// ── Convenience helpers for specific data types ──

export const getCachedInvitation = (slug) => getCache(`invitation_${slug}`);
export const setCachedInvitation = (slug, data) => setCache(`invitation_${slug}`, data, CACHE_TTL.INVITATION);

export const getCachedTemplates = () => getCache('templates_all');
export const setCachedTemplates = (data) => setCache('templates_all', data, CACHE_TTL.TEMPLATES);

export const getCachedCategoryTemplates = (slug) => getCache(`templates_cat_${slug}`);
export const setCachedCategoryTemplates = (slug, data) => setCache(`templates_cat_${slug}`, data, CACHE_TTL.TEMPLATES);

export const getCachedCategories = () => getCache('categories_all');
export const setCachedCategories = (data) => setCache('categories_all', data, CACHE_TTL.CATEGORIES);

export const getCachedTemplateDetail = (id) => getCache(`template_${id}`);
export const setCachedTemplateDetail = (id, data) => setCache(`template_${id}`, data, CACHE_TTL.TEMPLATE_DETAIL);

/**
 * Check if a public invitation view has already been tracked this session.
 * Uses sessionStorage so each browser tab session counts as one view.
 */
export const hasTrackedView = (slug) => {
    return sessionStorage.getItem(`im_viewed_${slug}`) === '1';
};

export const markViewTracked = (slug) => {
    sessionStorage.setItem(`im_viewed_${slug}`, '1');
};
