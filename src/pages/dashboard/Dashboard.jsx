import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Mail, Eye, Users, Calendar, TrendingUp, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, CardSkeleton } from '../../components/ui';
import { useSelector } from 'react-redux';
import api from '../../api/api';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        totalInvitations: 0,
        totalViews: 0,
        totalRSVPs: 0,
        activeInvitations: 0,
    });
    const [recentInvitations, setRecentInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/invitations');
            const invitations = data || [];

            // Calculate stats
            setStats({
                totalInvitations: invitations.length,
                totalViews: invitations.reduce((sum, inv) => sum + (inv.views || 0), 0),
                totalRSVPs: invitations.reduce((sum, inv) => sum + (inv.rsvpCount || 0), 0),
                activeInvitations: invitations.filter((inv) => inv.isPaid && inv.status === 'published').length,
            });

            // Get recent invitations
            setRecentInvitations(invitations.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            icon: Mail,
            label: 'Total Invitations',
            value: stats.totalInvitations,
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
        {
            icon: Eye,
            label: 'Total Views',
            value: stats.totalViews,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: Users,
            label: 'Total RSVPs',
            value: stats.totalRSVPs,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-100',
            iconColor: 'text-amber-600',
        },
        {
            icon: TrendingUp,
            label: 'Active Invitations',
            value: stats.activeInvitations,
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-100',
            iconColor: 'text-pink-600',
        },
    ];

    if (isLoading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your invitations</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your invitations</p>
                </div>
                <Link to="/dashboard/create">
                    <Button>
                        <Plus size={18} className="mr-2" />
                        Create Invitation
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6" hover={false}>
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                                    <stat.icon size={24} className={stat.iconColor} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Invitations */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Invitations</h2>
                    <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline text-sm">
                        View All →
                    </Link>
                </div>

                {recentInvitations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={32} className="text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
                        <p className="text-gray-600 mb-4">Create your first digital invitation to get started</p>
                        <Link to="/dashboard/create">
                            <Button>
                                <Plus size={18} className="mr-2" />
                                Create Your First Invitation
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentInvitations.map((invitation, index) => (
                            <motion.div
                                key={invitation._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/dashboard/invitations/${invitation._id}`}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={invitation.template?.previewImage || 'https://via.placeholder.com/100'}
                                                alt={invitation.content?.eventName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {invitation.content?.eventName || 'Untitled Event'}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 gap-3">
                                                <span className="flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    {invitation.content?.eventDate
                                                        ? new Date(invitation.content.eventDate).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })
                                                        : 'No date'}
                                                </span>
                                                <span className="flex items-center">
                                                    <Eye size={12} className="mr-1" />
                                                    {invitation.views || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {invitation.isPaid ? (
                                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
