import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'im_cookie_consent';

/**
 * Cookie Consent Banner
 *
 * Shows a beautiful animated popup on first visit asking users to accept cookies.
 * This is required for:
 *   - GDPR / ePrivacy compliance
 *   - Browsers properly accepting SameSite=None cookies in production
 *   - Proper authentication flow with httpOnly cookies
 *
 * Stores consent in localStorage so it only shows once.
 */
const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Small delay so banner doesn't flash on fast page loads
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            essential: true,
            analytics: true,
            accepted: true,
            timestamp: Date.now(),
        }));
        setIsVisible(false);
    };

    const handleEssentialOnly = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            essential: true,
            analytics: false,
            accepted: true,
            timestamp: Date.now(),
        }));
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
                >
                    <div
                        className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl border shadow-2xl overflow-hidden"
                        style={{
                            background: 'rgba(15, 12, 41, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(139, 92, 246, 0.2)',
                        }}
                    >
                        <div className="p-5 md:p-6">
                            {/* Close button */}
                            <button
                                onClick={handleEssentialOnly}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                aria-label="Close cookie banner"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                                >
                                    <Cookie size={22} className="text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
                                        <Shield size={14} className="text-indigo-400" />
                                        We value your privacy
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: '#a5b4fc' }}>
                                        We use essential cookies to keep you logged in and make the site work.
                                        Optional cookies help us understand how you use our platform.{' '}
                                        <Link
                                            to="/privacy"
                                            className="underline hover:text-white transition-colors"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                                    <button
                                        onClick={handleEssentialOnly}
                                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/15"
                                        style={{
                                            color: '#c4b5fd',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                            background: 'rgba(139, 92, 246, 0.1)',
                                        }}
                                    >
                                        Essential Only
                                    </button>
                                    <button
                                        onClick={handleAcceptAll}
                                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:scale-105 transition-all"
                                        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                                    >
                                        Accept All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * Helper to check the current cookie consent status.
 * Can be used throughout the app to conditionally load analytics/tracking scripts.
 */
export const getCookieConsent = () => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const hasAnalyticsConsent = () => {
    const consent = getCookieConsent();
    return consent?.analytics === true;
};

export default CookieConsent;
