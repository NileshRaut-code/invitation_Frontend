import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Modal, Input } from '../../components/ui';
import {
    setCategories,
    addCategory,
    updateCategory,
    removeCategory,
    setCategoryLoading,
} from '../../store/slices/categorySlice';
import api from '../../api/api';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector((state) => state.category);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
    });

    const fetchCategories = async () => {
        dispatch(setCategoryLoading(true));
        try {
            const { data } = await api.get('/admin/categories');
            dispatch(setCategories(data));
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                image: category.image || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', image: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                const { data } = await api.put(`/admin/categories/${editingCategory._id}`, formData);
                dispatch(updateCategory(data));
                toast.success('Category updated successfully');
            } else {
                const { data } = await api.post('/admin/categories', formData);
                dispatch(addCategory(data));
                toast.success('Category created successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/admin/categories/${id}`);
            dispatch(removeCategory(id));
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleTogglePublish = async (category) => {
        try {
            if (category.isPublished) {
                await api.put(`/admin/categories/${category._id}/unpublish`);
                dispatch(updateCategory({ ...category, isPublished: false }));
                toast.success('Category unpublished');
            } else {
                await api.put(`/admin/categories/${category._id}/publish`);
                dispatch(updateCategory({ ...category, isPublished: true }));
                toast.success('Category published');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage invitation categories</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus size={20} className="mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Categories Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCategories.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-gray-500">No categories found</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category, index) => (
                        <motion.div
                            key={category._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="overflow-hidden">
                                <div
                                    className="h-32 bg-cover bg-center"
                                    style={{
                                        backgroundImage: category.image
                                            ? `url(${category.image})`
                                            : 'linear-gradient(to right, #6366f1, #a855f7)',
                                    }}
                                />
                                <Card.Content>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${category.isPublished
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {category.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {category.templateCount || 0} templates
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenModal(category)}
                                        >
                                            <Edit2 size={14} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={category.isPublished ? 'secondary' : 'success'}
                                            onClick={() => handleTogglePublish(category)}
                                        >
                                            {category.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(category._id)}
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <Input
                        label="Image URL"
                        name="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminCategories;
