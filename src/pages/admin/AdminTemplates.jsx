import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Crown } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button } from '../../components/ui';
import {
    setTemplates,
    updateTemplate,
    removeTemplate,
    setTemplateLoading,
} from '../../store/slices/templateSlice';
import api from '../../api/api';

const AdminTemplates = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { templates, isLoading } = useSelector((state) => state.template);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTemplates = async () => {
        dispatch(setTemplateLoading(true));
        try {
            const { data } = await api.get('/admin/templates');
            dispatch(setTemplates(data));
        } catch (error) {
            toast.error('Failed to fetch templates');
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            await api.delete(`/admin/templates/${id}`);
            dispatch(removeTemplate(id));
            toast.success('Template deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete template');
        }
    };

    const handleToggleActive = async (template) => {
        try {
            const endpoint = template.isActive ? 'deactivate' : 'activate';
            await api.put(`/admin/templates/${template._id}/${endpoint}`);
            dispatch(updateTemplate({ ...template, isActive: !template.isActive }));
            toast.success(`Template ${template.isActive ? 'deactivated' : 'activated'}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const filteredTemplates = templates.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                    <p className="text-gray-600 mt-1">Manage invitation templates</p>
                </div>
                <Button onClick={() => navigate('/admin/templates/new')}>
                    <Plus size={20} className="mr-2" />
                    Create Template
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Templates Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredTemplates.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-gray-500">No templates found</p>
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
                            <Card className="overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={template.previewImage || '/placeholder-template.jpg'}
                                        alt={template.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    {template.isPremium && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                            <Crown size={12} />
                                            ₹{template.price}
                                        </div>
                                    )}
                                    {!template.isActive && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-full">
                                            Inactive
                                        </div>
                                    )}
                                </div>
                                <Card.Content>
                                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {template.category?.name || 'Uncategorized'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/admin/templates/${template._id}/edit`)}
                                        >
                                            <Edit2 size={14} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={template.isActive ? 'secondary' : 'success'}
                                            onClick={() => handleToggleActive(template)}
                                        >
                                            {template.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(template._id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTemplates;
