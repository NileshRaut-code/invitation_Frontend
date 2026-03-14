import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <>
            <SEO title="Privacy Policy — Invite Me" description="Learn how Invite Me handles your data and privacy." />
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <motion.div
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

                    <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
                            <p><strong>Account Information:</strong> Name, email address, and password when you register.</p>
                            <p><strong>Event Data:</strong> Event names, dates, venues, and guest information you provide for your invitations.</p>
                            <p><strong>Payment Information:</strong> Processed securely through Razorpay. We do not store your card details.</p>
                            <p><strong>Usage Data:</strong> Pages visited, features used, invitation views, and RSVP interactions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. How We Use Your Information</h2>
                            <p>To provide, maintain, and improve the Service. To process payments and send transaction confirmations. To send password reset emails and important account notifications. To display your invitations to guests via shared links.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Data Sharing</h2>
                            <p>We do not sell your personal data to third parties. We share data only with: payment processors (Razorpay) for transaction processing, cloud services (Cloudinary) for image hosting, and email services for transactional emails.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Data Security</h2>
                            <p>Passwords are hashed using bcrypt. Authentication uses secure HTTP-only JWT cookies. All data is transmitted over HTTPS. We follow industry best practices for data protection.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Cookies</h2>
                            <p>We use HTTP-only cookies for authentication (access and refresh tokens). We do not use tracking cookies or third-party analytics cookies.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Data Retention</h2>
                            <p>Account data is retained while your account is active. Invitation data may be deleted after expiry (per your settings). You can request deletion of your account and data at any time.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Your Rights</h2>
                            <p>You have the right to access, correct, or delete your personal data. You may export your RSVP data at any time. You may close your account and request full data deletion.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8. Changes to This Policy</h2>
                            <p>We may update this policy from time to time. We will notify you of significant changes via email or in-app notice.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9. Contact</h2>
                            <p>For privacy-related inquiries, contact us at <a href="mailto:privacy@inviteme.app" className="text-indigo-600 hover:underline">privacy@inviteme.app</a>.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
