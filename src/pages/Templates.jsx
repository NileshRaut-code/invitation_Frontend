import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Crown, Eye, Search, SlidersHorizontal, X } from 'lucide-react';
import { Card, CardSkeleton, Button, TemplatePreviewModal } from '../components/ui';
import api from '../api/api';

const Templates = () => {
    const { categorySlug } = useParams();
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    // Search & Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, free, premium
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories for filter
                const catRes = await api.get('/public/categories');
                setCategories(catRes.data);

                if (categorySlug) {
                    const { data } = await api.get(`/public/categories/${categorySlug}/templates`);
                    setCategory(data.category);
                    setTemplates(data.templates);
                } else {
                    const { data } = await api.get('/public/templates');
                    setTemplates(data);
                }
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [categorySlug]);

    const filteredTemplates = useMemo(() => {
        let result = [...templates];

        // Search
        if (searchQuery.trim()) {
            result = result.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Type filter
        if (filterType === 'free') result = result.filter(t => !t.isPremium);
        if (filterType === 'premium') result = result.filter(t => t.isPremium);

        // Category filter
        if (filterCategory !== 'all') {
            result = result.filter(t => t.category?._id === filterCategory || t.category === filterCategory);
        }

        // Sort
        if (sortBy === 'price-low') result.sort((a, b) => (a.price || 0) - (b.price || 0));
        if (sortBy === 'price-high') result.sort((a, b) => (b.price || 0) - (a.price || 0));
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        return result;
    }, [templates, searchQuery, filterType, filterCategory, sortBy]);

    const hasActiveFilters = searchQuery || filterType !== 'all' || filterCategory !== 'all';

    const clearFilters = () => {
        setSearchQuery('');
        setFilterType('all');
        setFilterCategory('all');
        setSortBy('newest');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {category ? category.name + ' Templates' : 'All Templates'}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {category?.description || 'Find the perfect template for your invitation'}
                    </p>
                </div>

                {/* Search & Filters Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Filter chips */}
                        <div className="flex gap-2 flex-wrap items-center">
                            <SlidersHorizontal size={16} className="text-gray-500" />
                            {['all', 'free', 'premium'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterType === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}

                            {/* Category filter */}
                            {!categorySlug && categories.length > 0 && (
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            )}

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low → High</option>
                                <option value="price-high">Price: High → Low</option>
                            </select>

                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                                    <X size={14} /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {!isLoading && (
                    <p className="text-sm text-gray-500 mb-4">{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found</p>
                )}

                {/* Templates Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)}
                    </div>
                ) : filteredTemplates.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Star size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {hasActiveFilters ? 'No templates match your filters' : 'No templates available'}
                        </h3>
                        <p className="text-gray-600">
                            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'Check back soon for new templates!'}
                        </p>
                        {hasActiveFilters && (
                            <Button variant="outline" onClick={clearFilters} className="mt-4">Clear Filters</Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map((template, index) => (
                            <motion.div
                                key={template._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden group">
                                    <div className="relative">
                                        <img
                                            src={template.previewImage || '/placeholder-template.jpg'}
                                            alt={template.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {template.isPremium && (
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                                                <Crown size={14} /> Premium
                                            </div>
                                        )}
                                        {!template.isPremium && (
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">Free</div>
                                        )}
                                        <button
                                            onClick={() => setPreviewTemplate(template)}
                                            className="absolute top-3 left-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                            title="Preview"
                                        >
                                            <Eye size={18} className="text-gray-700" />
                                        </button>
                                    </div>
                                    <Card.Content>
                                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                        {template.category?.name && (
                                            <p className="text-xs text-gray-500 mb-2">{template.category.name}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-indigo-600">
                                                {template.isPremium ? `₹${template.price}` : 'Free'}
                                            </span>
                                            <Link to={`/dashboard/create?template=${template._id}`}>
                                                <Button size="sm">Use Template</Button>
                                            </Link>
                                        </div>
                                    </Card.Content>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
            />
        </div>
    );
};

export default Templates;
