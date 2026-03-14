import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Star, Eye } from 'lucide-react';
import { Button, Card, CardSkeleton } from '../components/ui';
import { BlocksRenderer } from '../components/blocks/BlockRenderer';
import api from '../api/api';

const TemplatePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const { data } = await api.get(`/public/templates/${id}`);
                setTemplate(data);
            } catch (err) {
                setError('Template not found');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplate();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <CardSkeleton />
                </div>
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <Card className="p-12 text-center">
                        <p className="text-red-500">{error || 'Template not found'}</p>
                        <Link to="/templates" className="text-indigo-600 hover:underline mt-4 inline-block">← Back to Templates</Link>
                    </Card>
                </div>
            </div>
        );
    }

    const design = template.design || {};
    const theme = design.theme || {};

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Link to="/templates" className="text-indigo-600 hover:underline flex items-center mb-6">
                    <ArrowLeft size={18} className="mr-1" /> Back to Templates
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Preview */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden">
                            {template.previewImage && (
                                <img src={template.previewImage} alt={template.name} className="w-full h-80 object-cover" />
                            )}
                            {design.blocks && design.blocks.length > 0 ? (
                                <div
                                    className="min-h-[400px]"
                                    style={{
                                        backgroundColor: theme.colors?.background || '#fff',
                                        fontFamily: theme.fonts?.body || 'sans-serif',
                                    }}
                                >
                                    <BlocksRenderer
                                        blocks={design.blocks}
                                        data={{ eventName: 'Sample Event', hostName: 'Your Name', venue: 'Beautiful Venue', eventDate: new Date().toISOString(), eventTime: '7:00 PM', message: 'You are cordially invited!' }}
                                        theme={theme}
                                        onRSVP={() => { }}
                                    />
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    <Eye size={48} className="mx-auto mb-4 opacity-40" />
                                    <p>Live preview not available for this template</p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h1>
                                {template.description && <p className="text-gray-600 mb-4">{template.description}</p>}

                                <div className="flex items-center gap-3 mb-6">
                                    {template.isPremium ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium">
                                            <Crown size={14} /> Premium
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">Free</span>
                                    )}
                                    <span className="text-2xl font-bold text-indigo-600">
                                        {template.isPremium ? `₹${template.price}` : 'Free'}
                                    </span>
                                </div>

                                <Button onClick={() => navigate(`/dashboard/create?template=${template._id}`)} className="w-full py-3 text-base">
                                    Use This Template
                                </Button>
                            </Card>
                        </motion.div>

                        <Card className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium text-gray-900">{template.category?.name || 'General'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Blocks</span><span className="font-medium text-gray-900">{design.blocks?.length || 0}</span></div>
                                {template.tags?.length > 0 && (
                                    <div className="pt-2">
                                        <span className="text-gray-500 block mb-2">Tags</span>
                                        <div className="flex flex-wrap gap-1">
                                            {template.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;
