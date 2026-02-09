import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Eye, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './index';

const TemplatePreviewModal = ({ template, isOpen, onClose }) => {
    if (!template) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
                                {template.isPremium ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
                                        <Crown size={12} />
                                        Premium
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        Free
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Preview Panel */}
                            <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-auto">
                                <div className="bg-white rounded-xl shadow-lg max-w-sm mx-auto overflow-hidden">
                                    {/* Mobile Frame */}
                                    <div className="bg-gray-900 px-4 py-2 flex items-center justify-center">
                                        <div className="w-20 h-1.5 bg-gray-700 rounded-full" />
                                    </div>

                                    {/* Template Preview */}
                                    <div className="aspect-[9/16] relative">
                                        <img
                                            src={template.previewImage || 'https://via.placeholder.com/360x640?text=Preview'}
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Details Panel */}
                            <div className="w-80 border-l bg-white p-6 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-2">Template Details</h3>
                                    <p className="text-gray-600 text-sm mb-6">
                                        {template.description || 'A beautiful template for your special occasion.'}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Smartphone size={16} className="mr-2 text-indigo-500" />
                                            Mobile Responsive
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Eye size={16} className="mr-2 text-indigo-500" />
                                            RSVP Tracking
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="text-3xl font-bold text-indigo-600">
                                            {template.isPremium ? `₹${template.price}` : 'Free'}
                                        </p>
                                    </div>

                                    {/* Category */}
                                    {template.category && (
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 mb-1">Category</p>
                                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                                {template.category.name || template.category}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <Link to={`/dashboard/create?template=${template._id}`} className="block">
                                        <Button className="w-full">
                                            Use This Template
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full" onClick={onClose}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TemplatePreviewModal;
