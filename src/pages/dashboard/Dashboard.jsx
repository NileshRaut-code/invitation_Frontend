import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, Mail, Eye, Users, Calendar, TrendingUp,
    ArrowRight, Settings, CreditCard, BarChart3, Sparkles
} from 'lucide-react';
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

            setStats({
                totalInvitations: invitations.length,
                totalViews: invitations.reduce((sum, inv) => sum + (inv.views || 0), 0),
                totalRSVPs: invitations.reduce((sum, inv) => sum + (inv.rsvpCount || 0), 0),
                activeInvitations: invitations.filter((inv) => inv.isPaid && inv.status === 'published').length,
            });

            setRecentInvitations(invitations.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        { icon: Mail, label: 'Total Invitations', value: stats.totalInvitations, gradient: 'from-indigo-500 to-purple-600', bg: 'rgba(99, 102, 241, 0.1)' },
        { icon: Eye, label: 'Total Views', value: stats.totalViews, gradient: 'from-emerald-500 to-green-600', bg: 'rgba(16, 185, 129, 0.1)' },
        { icon: Users, label: 'Total RSVPs', value: stats.totalRSVPs, gradient: 'from-amber-500 to-orange-600', bg: 'rgba(245, 158, 11, 0.1)' },
        { icon: TrendingUp, label: 'Active', value: stats.activeInvitations, gradient: 'from-pink-500 to-rose-600', bg: 'rgba(236, 72, 153, 0.1)' },
    ];

    const quickActions = [
        { icon: Plus, label: 'Create Invitation', to: '/dashboard/create', gradient: 'from-indigo-500 to-purple-600' },
        { icon: Mail, label: 'My Invitations', to: '/dashboard/invitations', gradient: 'from-emerald-500 to-green-600' },
        { icon: CreditCard, label: 'Payments', to: '/dashboard/payments', gradient: 'from-amber-500 to-orange-600' },
        { icon: Settings, label: 'Settings', to: '/dashboard/settings', gradient: 'from-gray-500 to-gray-700' },
    ];

    if (isLoading) {
        return (
            <div>
                <div className="mb-8 p-8 rounded-3xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
                    <p className="text-indigo-100 mt-1">Loading your dashboard...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-8 rounded-3xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
                </div>
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
                                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                                </h1>
                                <p style={{ color: '#a5b4fc' }} className="text-sm">Here's what's happening with your invitations</p>
                            </div>
                        </div>
                    </div>
                    <Link to="/dashboard/create">
                        <button className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                            <Plus size={18} />
                            Create Invitation
                        </button>
                    </Link>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                    >
                        <div className="p-5 md:p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                        >
                            <Link to={action.to}
                                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                    <action.icon size={22} className="text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{action.label}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Invitations */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Recent Invitations</h2>
                    <Link to="/dashboard/invitations" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {recentInvitations.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No invitations yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first digital invitation to get started!</p>
                        <Link to="/dashboard/create">
                            <button className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto hover:scale-105 transition-all"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <Plus size={18} />
                                Create Your First Invitation
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentInvitations.map((inv, index) => (
                            <motion.div
                                key={inv._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                            >
                                <Link
                                    to={`/dashboard/invitations/${inv._id}`}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                            <img
                                                src={inv.template?.previewImage || ''}
                                                alt={inv.content?.eventName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-sm">' + (inv.content?.eventName?.charAt(0) || 'E') + '</div>'; }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {inv.content?.eventName || 'Untitled Event'}
                                            </h3>
                                            <div className="flex items-center text-xs text-gray-400 gap-3 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={11} /> {inv.content?.eventDate
                                                        ? new Date(inv.content.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                        : 'No date'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={11} /> {inv.views || 0} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {inv.isPaid && inv.status === 'published' ? (
                                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                                style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                                                Active
                                            </span>
                                        ) : inv.isPaid ? (
                                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                                style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                                Draft
                                            </span>
                                        ) : (
                                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                                style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                                                Pending Payment
                                            </span>
                                        )}
                                        <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
