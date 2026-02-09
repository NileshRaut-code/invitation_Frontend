import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, Mail, Calendar, Eye, Trash2, ExternalLink, Copy,
    CheckCircle, Clock, Loader, AlertCircle
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

    const getStatusBadge = (invitation) => {
        if (!invitation.isPaid && invitation.template?.isPremium) {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <Clock size={12} className="mr-1" />
                    Payment Pending
                </span>
            );
        }
        if (invitation.status === 'published') {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle size={12} className="mr-1" />
                    Active
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <AlertCircle size={12} className="mr-1" />
                Draft
            </span>
        );
    };

    if (isLoading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
                        <p className="text-gray-600 mt-1">Manage your digital invitations</p>
                    </div>
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
                    <p className="text-gray-600 mt-1">Manage your digital invitations</p>
                </div>
                <Link to="/dashboard/create">
                    <Button>
                        <Plus size={18} className="mr-2" />
                        Create New
                    </Button>
                </Link>
            </div>

            {/* Invitations List */}
            {invitations.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No invitations yet</h3>
                    <p className="text-gray-600 mb-6">Create your first digital invitation to get started</p>
                    <Link to="/dashboard/create">
                        <Button>
                            <Plus size={18} className="mr-2" />
                            Create Invitation
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-4">
                    {invitations.map((invitation, index) => (
                        <motion.div
                            key={invitation._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6" hover={false}>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Preview Image */}
                                    <div className="w-full md:w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img
                                            src={invitation.template?.previewImage || 'https://via.placeholder.com/200x150'}
                                            alt={invitation.content?.eventName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {invitation.content?.eventName || 'Untitled Event'}
                                            </h3>
                                            {getStatusBadge(invitation)}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 gap-4">
                                            <span className="flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                {invitation.content?.eventDate
                                                    ? new Date(invitation.content.eventDate).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })
                                                    : 'Date not set'}
                                            </span>
                                            <span className="flex items-center">
                                                <Eye size={14} className="mr-1" />
                                                {invitation.views || 0} views
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {invitation.isPaid ? (
                                            <>
                                                <button
                                                    onClick={() => copyLink(invitation.slug)}
                                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Copy Link"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <a
                                                    href={`/invite/${invitation.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="View Public Page"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            </>
                                        ) : (
                                            <Link to={`/dashboard/payment/${invitation._id}`}>
                                                <Button size="sm" variant="outline">
                                                    Complete Payment
                                                </Button>
                                            </Link>
                                        )}
                                        <Link
                                            to={`/dashboard/invitations/${invitation._id}`}
                                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, id: invitation._id })}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
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
