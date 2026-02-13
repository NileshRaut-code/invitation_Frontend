import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ChevronDown, Sparkles, ArrowRight, Zap, Palette, Crown } from 'lucide-react';
import SEO from '../components/SEO';

const Pricing = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const plans = [
        {
            name: 'Free',
            tagline: 'Get started instantly',
            price: '₹0',
            priceNote: 'forever',
            popular: false,
            icon: Sparkles,
            gradient: 'from-gray-600 to-gray-800',
            features: [
                { text: 'Use free templates', included: true },
                { text: 'RSVP collection', included: true },
                { text: 'Shareable invite link', included: true },
                { text: 'Basic customization', included: true },
                { text: 'QR code generation', included: false },
                { text: 'Gallery & video blocks', included: false },
                { text: 'Custom branded links', included: false },
                { text: 'WhatsApp/Email sharing', included: false },
                { text: 'Invitation analytics', included: false },
            ],
            cta: 'Start Free',
            ctaLink: '/register',
        },
        {
            name: 'Premium',
            tagline: 'For your special occasions',
            price: '₹49 – ₹199',
            priceNote: 'per invitation',
            popular: true,
            icon: Crown,
            gradient: 'from-indigo-500 to-purple-600',
            features: [
                { text: 'All premium templates', included: true },
                { text: 'Full template customization', included: true },
                { text: 'RSVP collection & tracking', included: true },
                { text: 'QR code generation', included: true },
                { text: 'Gallery & video blocks', included: true },
                { text: 'WhatsApp/Email/SMS sharing', included: true },
                { text: 'Custom branded links', included: true },
                { text: 'Invitation analytics', included: true },
                { text: 'Expiry customization', included: true },
            ],
            cta: 'Browse Templates',
            ctaLink: '/templates',
        },
        {
            name: 'Custom',
            tagline: 'Build from scratch',
            price: 'Custom Price',
            priceNote: 'depends on your design',
            popular: false,
            icon: Palette,
            gradient: 'from-emerald-500 to-teal-600',
            features: [
                { text: 'Start from blank canvas', included: true },
                { text: 'Visual block editor', included: true },
                { text: 'Full design control', included: true },
                { text: 'RSVP collection & tracking', included: true },
                { text: 'QR code generation', included: true },
                { text: 'All premium blocks', included: true },
                { text: 'WhatsApp/Email/SMS sharing', included: true },
                { text: 'Custom branded links', included: true },
                { text: 'Invitation analytics', included: true },
            ],
            cta: 'Start Designing',
            ctaLink: '/register',
        },
    ];

    const faqs = [
        { q: 'How does pricing work?', a: 'We use a simple per-invitation model. Free templates cost nothing. Premium templates have a one-time price (₹49–₹199) set by the template designer. Custom (scratch) designs have a price set by the admin. You only pay once per invitation — no subscriptions, no hidden fees.' },
        { q: 'What\'s included in free templates?', a: 'Free templates give you basic customization, RSVP collection, and a shareable invite link. Premium features like gallery blocks, video embeds, branded links, and analytics are available with paid templates.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major payment methods including UPI, credit/debit cards, net banking, and popular wallets through our secure payment gateway.' },
        { q: 'What\'s the difference between Premium and Custom?', a: 'Premium templates are pre-designed — you just fill in your details and customize. Custom designs let you start from a blank canvas using our visual block editor, giving you complete control over the layout and design.' },
        { q: 'Can I try before I pay?', a: 'Absolutely! You can preview any template before purchasing. Free templates let you create a fully functional invitation at no cost, so you can explore all the features.' },
        { q: 'Is my data secure?', a: 'Yes. We use enterprise-grade encryption for all data. Your personal information and invitation details are never shared with third parties.' },
    ];

    return (
        <>
            <SEO title="Pricing - Invite Me" description="Simple per-invitation pricing. Free templates, premium templates from ₹49, and custom designs." url="/pricing" />

            <div className="overflow-hidden">
                {/* Hero */}
                <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-400/30"
                                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd' }}>
                                <Zap size={16} /> Pay Per Invitation — No Subscriptions
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Simple, Honest Pricing</h1>
                            <p className="text-lg max-w-xl mx-auto" style={{ color: '#a5b4fc' }}>
                                Pay only for what you use. No monthly fees, no surprises.
                            </p>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
                </section>

                {/* Pricing Cards */}
                <section className="pb-24 pt-8 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15 }}
                                    className={`relative rounded-3xl border-2 p-8 bg-white transition-all hover:shadow-2xl ${plan.popular ? 'border-indigo-500 shadow-xl md:scale-105 z-10' : 'border-gray-100'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold text-white shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                            <Crown size={14} className="inline mr-1" /> Most Popular
                                        </div>
                                    )}

                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-md`}>
                                        <plan.icon size={22} className="text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                                    <p className="text-gray-500 text-sm mb-5">{plan.tagline}</p>

                                    <div className="mb-8">
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        <p className="text-sm text-gray-400 mt-1">{plan.priceNote}</p>
                                    </div>

                                    <Link to={plan.ctaLink}>
                                        <button
                                            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-105 ${plan.popular
                                                ? 'text-white shadow-lg hover:shadow-xl'
                                                : 'border-2 border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                                                }`}
                                            style={plan.popular ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
                                        >
                                            {plan.cta} <ArrowRight size={16} className="inline ml-1" />
                                        </button>
                                    </Link>

                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900 mb-4">What's included:</p>
                                        <ul className="space-y-3">
                                            {plan.features.map((f) => (
                                                <li key={f.text} className={`flex items-center gap-3 text-sm ${f.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                                    {f.included
                                                        ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                        : <X size={16} className="text-gray-300 flex-shrink-0" />
                                                    }
                                                    {f.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* How it works note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-16 max-w-3xl mx-auto text-center p-8 rounded-3xl border border-gray-200 bg-white"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 How our pricing works</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Free Templates</p>
                                    <p className="text-sm text-gray-500">Choose a free template and create your invitation at zero cost. Limited customization options.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Paid Templates</p>
                                    <p className="text-sm text-gray-500">Each template has a fixed price (₹49–₹199). Pay once per invitation — it's yours forever.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Scratch Designs</p>
                                    <p className="text-sm text-gray-500">Build from scratch with our visual editor. Price depends on what you choose and is set by the admin.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-24 bg-white">
                    <div className="max-w-3xl mx-auto px-4">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                            <p className="text-lg text-gray-500">Everything you need to know about pricing.</p>
                        </motion.div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border border-gray-200 rounded-2xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                                        <ChevronDown size={20} className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.a}</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="relative max-w-3xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to create your invitation?</h2>
                        <p className="text-indigo-100 text-lg mb-8">Start with a free template — no credit card required.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <button className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-semibold text-lg hover:scale-105 transition-all shadow-lg">
                                    Get Started Free <ArrowRight size={18} className="inline ml-1" />
                                </button>
                            </Link>
                            <Link to="/templates">
                                <button className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all">
                                    Browse Templates
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Pricing;
