import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Crown, Eye } from 'lucide-react';
import { Card, CardSkeleton, Button, TemplatePreviewModal } from '../components/ui';
import api from '../api/api';

const Templates = () => {
    const { categorySlug } = useParams();
    const [templates, setTemplates] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                if (categorySlug) {
                    const { data } = await api.get(`/public/categories/${categorySlug}/templates`);
                    setCategory(data.category);
                    setTemplates(data.templates);
                } else {
                    // Fetch all published templates
                    const { data } = await api.get('/public/templates');
                    setTemplates(data);
                }
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, [categorySlug]);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {category ? category.name + ' Templates' : 'All Templates'}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {category?.description || 'Find the perfect template for your invitation'}
                    </p>
                </div>

                {/* Templates Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <CardSkeleton key={i} />)}
                    </div>
                ) : templates.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Star size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates available</h3>
                        <p className="text-gray-600">Check back soon for new templates!</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {templates.map((template, index) => (
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
                                                <Crown size={14} />
                                                Premium
                                            </div>
                                        )}
                                        {!template.isPremium && (
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                                                Free
                                            </div>
                                        )}
                                        {/* Preview Button */}
                                        <button
                                            onClick={() => setPreviewTemplate(template)}
                                            className="absolute top-3 left-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                            title="Preview"
                                        >
                                            <Eye size={18} className="text-gray-700" />
                                        </button>
                                    </div>
                                    <Card.Content>
                                        <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
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

            {/* Preview Modal */}
            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
            />
        </div>
    );
};

export default Templates;
