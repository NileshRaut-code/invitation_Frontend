import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Heart } from 'lucide-react';
import { Button } from '../components/ui';
import SEO from '../components/SEO';

const Home = () => {
    const features = [
        {
            icon: Sparkles,
            title: 'Beautiful Templates',
            description: 'Choose from hundreds of stunning templates for every occasion.',
        },
        {
            icon: Zap,
            title: 'Easy Customization',
            description: 'Personalize every detail with our intuitive editor.',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is protected with enterprise-grade security.',
        },
        {
            icon: Heart,
            title: 'RSVP Management',
            description: 'Track responses and manage your guest list effortlessly.',
        },
    ];

    return (
        <>
            <SEO
                title="Invite Me - Create Beautiful Digital Invitations"
                description="Design stunning digital invitations for weddings, birthdays, parties, and more. Share instantly and collect RSVPs with ease."
                url="/"
            />
            <div className="overflow-hidden">
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                                ✨ Create Beautiful Digital Invitations
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                                Make Every Moment
                                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Unforgettable
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                                Design stunning digital invitations for weddings, birthdays, parties, and more.
                                Share instantly and collect RSVPs with ease.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="px-8">
                                        Get Started Free
                                        <ArrowRight className="ml-2" size={20} />
                                    </Button>
                                </Link>
                                <Link to="/templates">
                                    <Button variant="outline" size="lg" className="px-8">
                                        Browse Templates
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Everything You Need
                            </h2>
                            <p className="text-xl text-gray-600">
                                Create, customize, and share your invitations in minutes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                        <feature.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Create Something Beautiful?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-10">
                            Join thousands of happy users creating stunning invitations.
                        </p>
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-white text-indigo-600 hover:bg-gray-100 px-8"
                            >
                                Start Creating Now
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;

