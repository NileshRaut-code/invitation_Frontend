import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const TermsOfService = () => {
    return (
        <>
            <SEO title="Terms of Service — Invite Me" description="Read the terms and conditions for using Invite Me." />
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <motion.div
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

                    <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing or using Invite Me ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Description of Service</h2>
                            <p>Invite Me is a digital invitation platform that allows users to create, customize, and share event invitations online. The Service includes both free and premium features.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. User Accounts</h2>
                            <p>You must provide accurate, complete information when creating an account. You are responsible for maintaining the security of your account credentials. You must not share your account with others or allow unauthorized access.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. User Content</h2>
                            <p>You retain ownership of content you upload (images, text, designs). By uploading content, you grant us a non-exclusive license to display and distribute your content as part of the Service. You must not upload content that is illegal, offensive, or infringes on others' rights.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Payments & Refunds</h2>
                            <p>Premium templates and features require payment processed through Razorpay. All payments are final. Refunds may be considered on a case-by-case basis within 7 days of purchase. Prices are listed in INR and may change without prior notice.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Invitation Hosting & Expiry</h2>
                            <p>Free invitations are hosted for 30 days after the event date. Premium invitations may have extended or permanent hosting. We reserve the right to remove inactive or expired invitations.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Prohibited Use</h2>
                            <p>You may not use the Service for spam, phishing, or sending unsolicited messages. You may not attempt to reverse-engineer, hack, or disrupt the Service. You may not use the Service for any unlawful purpose.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8. Limitation of Liability</h2>
                            <p>The Service is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9. Changes to Terms</h2>
                            <p>We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10. Contact</h2>
                            <p>For questions about these terms, please contact us at <a href="mailto:support@inviteme.app" className="text-indigo-600 hover:underline">support@inviteme.app</a>.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default TermsOfService;
