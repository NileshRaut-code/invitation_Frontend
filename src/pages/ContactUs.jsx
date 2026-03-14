import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageCircle, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { Button, Input } from '../components/ui';
import api from '../api/api';

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        setSending(true);
        try {
            await api.post('/public/contact', form);
            toast.success('Message sent! We\'ll get back to you soon.');
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <SEO title="Contact Us — Invite Me" description="Get in touch with the Invite Me team." />
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
                        <p className="text-lg text-gray-600">Have a question, feedback, or need help? We'd love to hear from you.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <Mail className="text-indigo-600 mb-3" size={24} />
                                <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                                <p className="text-sm text-gray-600">support@inviteme.app</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <MessageCircle className="text-indigo-600 mb-3" size={24} />
                                <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                                <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <MapPin className="text-indigo-600 mb-3" size={24} />
                                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                                <p className="text-sm text-gray-600">India 🇮🇳</p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Tell us how we can help..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={sending} className="w-full">
                                    {sending ? 'Sending...' : <><Send size={18} className="mr-2" /> Send Message</>}
                                </Button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
