import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, Sparkles, Zap, Shield, Heart, Palette, Share2,
    Users, BarChart3, Clock, Star, CheckCircle, MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui';
import SEO from '../components/SEO';

const Home = () => {
    const features = [
        { icon: Sparkles, title: 'Stunning Templates', description: 'Hand-crafted premium templates for weddings, birthdays, corporate events & more.', color: 'from-violet-500 to-purple-600' },
        { icon: Palette, title: 'Visual Editor', description: 'Drag, drop, and customize every block with live preview — no coding needed.', color: 'from-pink-500 to-rose-600' },
        { icon: Share2, title: 'Instant Sharing', description: 'Share via WhatsApp, Email, SMS, or custom branded links in one click.', color: 'from-blue-500 to-cyan-600' },
        { icon: Heart, title: 'RSVP Tracking', description: 'Collect guest responses and manage your guest list effortlessly.', color: 'from-amber-500 to-orange-600' },
        { icon: Shield, title: 'Secure & Private', description: 'Enterprise-grade security. Your data is encrypted and never shared.', color: 'from-emerald-500 to-green-600' },
        { icon: BarChart3, title: 'Analytics', description: 'Track views, clicks, and RSVPs with a beautiful real-time dashboard.', color: 'from-indigo-500 to-blue-600' },
    ];

    const steps = [
        { step: '01', title: 'Choose a Template', description: 'Browse our curated collection or start from scratch with the visual editor.', icon: Sparkles },
        { step: '02', title: 'Customize Everything', description: 'Edit text, upload photos, add videos, change colors — make it uniquely yours.', icon: Palette },
        { step: '03', title: 'Share & Celebrate', description: 'Send your invitation via WhatsApp, email, or a branded link. Track RSVPs live.', icon: Share2 },
    ];

    const testimonials = [
        { name: 'Priya & Rahul', event: 'Wedding', quote: 'Our guests were blown away by the digital invitation. It was so easy to customize!', rating: 5 },
        { name: 'Anita Sharma', event: 'Birthday Party', quote: 'Created a beautiful birthday invite in under 10 minutes. The RSVP tracking saved me hours!', rating: 5 },
        { name: 'Vikram Patel', event: 'Corporate Event', quote: 'Professional templates that impressed our clients. The analytics dashboard is a game changer.', rating: 5 },
    ];

    const stats = [
        { value: '10,000+', label: 'Invitations Created' },
        { value: '50+', label: 'Premium Templates' },
        { value: '98%', label: 'Happy Users' },
        { value: '4.9★', label: 'User Rating' },
    ];

    const pricingPreview = [
        { name: 'Free', price: '₹0', features: ['1 Invitation', 'Basic Templates', 'RSVP Collection'], cta: 'Start Free', popular: false },
        { name: 'Pro', price: '₹299', period: '/event', features: ['Premium Templates', 'Custom Branding', 'WhatsApp Sharing', 'Analytics'], cta: 'Go Pro', popular: true },
        { name: 'Business', price: '₹999', period: '/mo', features: ['Unlimited Invitations', 'All Premium Features', 'Priority Support', 'Custom Domain'], cta: 'Contact Us', popular: false },
    ];

    return (
        <>
            <SEO
                title="Invite Me - Create Beautiful Digital Invitations"
                description="Design stunning digital invitations for weddings, birthdays, parties, and more. Share instantly and collect RSVPs with ease."
                url="/"
            />
            <div className="overflow-hidden">
                {/* ── Hero Section ── */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
                    {/* Animated background orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
                        {/* Grid pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8 border border-purple-400/30"
                                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd' }}>
                                <Sparkles size={16} />
                                India's #1 Digital Invitation Platform
                            </span>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight text-white">
                                Make Every Event
                                <span className="block mt-2" style={{
                                    background: 'linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Unforgettable
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: '#a5b4fc' }}>
                                Design stunning digital invitations for weddings, birthdays, parties & more.
                                Share via WhatsApp in seconds. Track RSVPs in real-time.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                                <Link to="/register">
                                    <button className="px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-2 transition-all hover:scale-105 hover:shadow-2xl"
                                        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                                        Create Free Invitation
                                        <ArrowRight size={20} />
                                    </button>
                                </Link>
                                <Link to="/templates">
                                    <button className="px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 border transition-all hover:scale-105"
                                        style={{ borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c4b5fd', background: 'rgba(139, 92, 246, 0.1)' }}>
                                        Browse Templates
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Stats Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                        >
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm" style={{ color: '#94a3b8' }}>{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                </section>

                {/* ── How It Works ── */}
                <section className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
                            <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-4">How It Works</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Three Simple Steps</h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Create and share a beautiful invitation in under 5 minutes.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connecting line (desktop only) */}
                            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />

                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="text-center relative"
                                >
                                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                        <step.icon className="text-white" size={32} />
                                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-indigo-600">
                                            {step.step}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features Grid ── */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-4">Features</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything You Need</h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Powerful tools to create, customize, and share your invitations.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Social Proof / Testimonials ── */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-medium mb-4">Testimonials</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Loved by Thousands</h2>
                            <p className="text-xl text-gray-500">See what our users are saying about Invite Me.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((t, index) => (
                                <motion.div
                                    key={t.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow relative"
                                    style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff 50%)' }}
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{t.name}</div>
                                            <div className="text-sm text-gray-500">{t.event}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Pricing Preview ── */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">Pricing</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-xl text-gray-500">Start free. Upgrade when you need more.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {pricingPreview.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative p-8 rounded-3xl border-2 transition-all hover:shadow-xl ${plan.popular
                                        ? 'border-indigo-500 shadow-lg scale-105'
                                        : 'border-gray-100 bg-white'
                                        }`}
                                    style={plan.popular ? { background: 'linear-gradient(135deg, #eef2ff 0%, #fff 100%)' } : {}}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        {plan.period && <span className="text-gray-500">{plan.period}</span>}
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-gray-600">
                                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/pricing">
                                        <button className={`w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 ${plan.popular
                                            ? 'text-white shadow-lg'
                                            : 'border-2 border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                                            }`}
                                            style={plan.popular ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
                                            {plan.cta}
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link to="/pricing" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1">
                                View full pricing details <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ── */}
                <section className="relative py-28 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Ready to Create Something
                                <span className="block mt-2" style={{
                                    background: 'linear-gradient(135deg, #c084fc, #818cf8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}> Beautiful?</span>
                            </h2>
                            <p className="text-xl mb-10 max-w-xl mx-auto" style={{ color: '#a5b4fc' }}>
                                Join thousands of happy users creating stunning invitations. Start for free today.
                            </p>
                            <Link to="/register">
                                <button className="px-10 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105 hover:shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                                    Get Started Free
                                    <ArrowRight size={20} />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
