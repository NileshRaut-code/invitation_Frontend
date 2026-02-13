import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Search, ArrowRight } from 'lucide-react';
import { Card, CardSkeleton } from '../components/ui';
import SEO from '../components/SEO';
import api from '../api/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/public/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <SEO title="Categories - Invite Me" description="Browse invitation categories for every occasion." url="/categories" />
            <div className="overflow-hidden">
                {/* Hero Banner */}
                <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Browse Categories</h1>
                            <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#a5b4fc' }}>
                                Find the perfect template for your special occasion
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-md mx-auto">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all"
                                />
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
                </section>

                {/* Categories Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                    <Layers size={36} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {searchQuery ? 'No matching categories' : 'No categories yet'}
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {searchQuery ? `No categories match "${searchQuery}". Try a different search.` : 'Check back soon for new invitation categories!'}
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filtered.map((category, index) => (
                                    <motion.div
                                        key={category._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        <Link to={`/categories/${category.slug}`} className="block group">
                                            <div className="rounded-3xl overflow-hidden bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                                <div
                                                    className="h-56 bg-cover bg-center relative overflow-hidden"
                                                    style={{
                                                        backgroundImage: category.image
                                                            ? `url(${category.image})`
                                                            : 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                                                    }}
                                                >
                                                    {/* Zoom effect on hover */}
                                                    {category.image && (
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                            style={{ backgroundImage: `url(${category.image})` }}
                                                        />
                                                    )}
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                                    {/* Template count badge */}
                                                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                                                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                                                        {category.templateCount || 0} Templates
                                                    </div>

                                                    {/* Category name */}
                                                    <div className="absolute bottom-5 left-5 right-5">
                                                        <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                                                    </div>
                                                </div>

                                                <div className="p-5 flex items-center justify-between">
                                                    <p className="text-gray-500 text-sm line-clamp-1 flex-1 mr-4">{category.description || 'Explore templates'}</p>
                                                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                                        <ArrowRight size={16} className="text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Categories;
