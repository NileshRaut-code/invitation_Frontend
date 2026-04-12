import axios from 'axios';
import { clearAllCache } from '../utils/inviteCache';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This sends cookies with every request
});

// ── Request Deduplication ──
// Prevents duplicate concurrent GET requests to the same URL.
// If two components request GET /public/categories at the same time,
// only one network request is made.
const pendingRequests = new Map();

api.interceptors.request.use((config) => {
    if (config.method === 'get') {
        const key = config.url + (config.params ? JSON.stringify(config.params) : '');

        if (pendingRequests.has(key)) {
            // Cancel this request and return the existing promise
            const controller = new AbortController();
            config.signal = controller.signal;
            controller.abort('Deduplicated');

            // Return the existing promise result through the response interceptor
            config.__dedupKey = key;
        } else {
            config.__dedupKey = key;
            // We'll track this in the response interceptor
        }
    }
    return config;
});

// ── Response interceptor to handle dedup cleanup + token refresh ──
api.interceptors.response.use(
    (response) => {
        // Clean up dedup tracking
        if (response.config.__dedupKey) {
            pendingRequests.delete(response.config.__dedupKey);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Clean up dedup tracking on error
        if (originalRequest?.__dedupKey) {
            pendingRequests.delete(originalRequest.__dedupKey);
        }

        // If request was deduplicated/aborted, silently ignore
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        // If 401 and not already retrying, attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint - cookies are sent automatically
                await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                // Retry original request - new cookie will be sent automatically
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user — clear cache too
                localStorage.removeItem('user');
                clearAllCache();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

