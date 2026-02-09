import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { Card, CardSkeleton } from '../components/ui';
import api from '../api/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
                    <p className="text-xl text-gray-600">Find the perfect template for your special occasion</p>
                </div>

                {/* Categories Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
                    </div>
                ) : categories.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Layers size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
                        <p className="text-gray-600">Check back soon for new invitation categories!</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/categories/${category.slug}`}>
                                    <Card className="overflow-hidden group">
                                        <div
                                            className="h-48 bg-cover bg-center relative"
                                            style={{
                                                backgroundImage: category.image
                                                    ? `url(${category.image})`
                                                    : 'linear-gradient(to right, #6366f1, #a855f7)',
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                                                <p className="text-sm text-white/80 mt-1">{category.templateCount || 0} templates</p>
                                            </div>
                                        </div>
                                        <Card.Content>
                                            <p className="text-gray-600 line-clamp-2">{category.description}</p>
                                        </Card.Content>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
