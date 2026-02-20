import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, Mail, Calendar, Eye, Trash2, ExternalLink, Copy,
    CheckCircle, Clock, Loader, AlertCircle, Edit3, Search,
    Filter, MoreVertical, Sparkles, Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, CardSkeleton, Modal } from '../../components/ui';
import api from '../../api/api';

const MyInvitations = () => {
    const navigate = useNavigate();
    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const { data } = await api.get('/invitations');
            setInvitations(data || []);
        } catch (error) {
            console.error('Failed to load invitations:', error);
            toast.error('Failed to load invitations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;

        setIsDeleting(true);
        try {
            await api.delete(`/invitations/${deleteModal.id}`);
            setInvitations(prev => prev.filter(inv => inv._id !== deleteModal.id));
            toast.success('Invitation deleted');
            setDeleteModal({ show: false, id: null });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    const copyLink = (slug) => {
        const url = `${window.location.origin}/invite/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    const getStatusInfo = (invitation) => {
        if (!invitation.isPaid && invitation.template?.isPremium) {
            return { label: 'Payment Pending', icon: Clock, color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)' };
        }
        if (invitation.status === 'published') {
            return { label: 'Active', icon: CheckCircle, color: '#059669', bg: 'rgba(16, 185, 129, 0.1)' };
        }
        return { label: 'Draft', icon: AlertCircle, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' };
    };

    // Filter and search
    const filtered = invitations.filter(inv => {
        const matchesSearch = !searchTerm || inv.content?.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
        const status = getStatusInfo(inv);
        const matchesFilter = filterStatus === 'all'
            || (filterStatus === 'active' && status.label === 'Active')
            || (filterStatus === 'draft' && status.label === 'Draft')
            || (filterStatus === 'pending' && status.label === 'Payment Pending');
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: invitations.length,
        active: invitations.filter(i => i.isPaid && i.status === 'published').length,
        drafts: invitations.filter(i => i.status === 'draft' || (!i.isPaid && !i.template?.isPremium)).length,
        views: invitations.reduce((sum, i) => sum + (i.views || 0), 0),
    };

    if (isLoading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
                    <p className="text-gray-500 mt-1">Manage your digital invitations</p>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
                    <p className="text-gray-500 mt-1">Manage and track all your digital invitations</p>
                </div>
                <Link to="/dashboard/create">
                    <button className="px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-md"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <Plus size={18} />
                        Create New
                    </button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total', value: stats.total, color: '#6366f1' },
                    { label: 'Active', value: stats.active, color: '#059669' },
                    { label: 'Drafts', value: stats.drafts, color: '#d97706' },
                    { label: 'Views', value: stats.views, color: '#ec4899' },
                ].map(s => (
                    <div key={s.label} className="p-4 rounded-xl bg-white border border-gray-100">
                        <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search invitations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'draft', 'pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterStatus(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filterStatus === f
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Invitations List */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-white border border-gray-100">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {searchTerm || filterStatus !== 'all' ? 'No matching invitations' : 'No invitations yet'}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        {searchTerm || filterStatus !== 'all'
                            ? 'Try adjusting your search or filter'
                            : 'Create your first digital invitation to get started!'}
                    </p>
                    {!searchTerm && filterStatus === 'all' && (
                        <Link to="/dashboard/create">
                            <button className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto hover:scale-105 transition-all"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <Plus size={18} />
                                Create Invitation
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((invitation, index) => {
                        const status = getStatusInfo(invitation);
                        return (
                            <motion.div
                                key={invitation._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <div className="p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Preview Image */}
                                        <div className="w-full md:w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-50 to-purple-50 border border-gray-100">
                                            <img
                                                src={invitation.template?.previewImage || ''}
                                                alt={invitation.content?.eventName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-indigo-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
                                                }}
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                                    {invitation.content?.eventName || 'Untitled Event'}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                                                    style={{ background: status.bg, color: status.color }}>
                                                    <status.icon size={11} className="mr-1" />
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-400 gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={13} />
                                                    {invitation.content?.eventDate
                                                        ? new Date(invitation.content.eventDate).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })
                                                        : 'Date not set'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={13} />
                                                    {invitation.views || 0} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={13} />
                                                    {invitation.rsvpCount || 0} RSVPs
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            {invitation.isPaid ? (
                                                <>
                                                    <button
                                                        onClick={() => copyLink(invitation.slug)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Copy Link"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <a
                                                        href={`/invite/${invitation.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                        title="View Public Page"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                </>
                                            ) : (
                                                <Link to={`/dashboard/payment/${invitation._id}`}>
                                                    <button className="px-3 py-1.5 text-xs font-semibold rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all">
                                                        Pay Now
                                                    </button>
                                                </Link>
                                            )}
                                            <Link
                                                to={`/dashboard/edit/${invitation._id}`}
                                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit3 size={16} />
                                            </Link>
                                            <Link
                                                to={`/dashboard/invitations/${invitation._id}`}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal({ show: true, id: invitation._id })}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, id: null })}
                title="Delete Invitation"
            >
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this invitation? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setDeleteModal({ show: false, id: null })}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <Loader size={16} className="mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default MyInvitations;
