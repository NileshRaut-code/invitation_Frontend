import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Layers, FileImage, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '../../components/ui';
import api from '../../api/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCategories: 0,
        totalTemplates: 0,
        totalRevenue: 0,
        recentPayments: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch categories
                const categoriesRes = await api.get('/admin/categories');
                const templatesRes = await api.get('/admin/templates');
                const paymentsRes = await api.get('/payments/all');
                const usersRes = await api.get('/admin/users');

                setStats({
                    totalUsers: usersRes.data.length || 0,
                    totalCategories: categoriesRes.data.length || 0,
                    totalTemplates: templatesRes.data.length || 0,
                    totalRevenue: paymentsRes.data.totalRevenue || 0,
                    recentPayments: paymentsRes.data.payments?.slice(0, 5) || [],
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-blue-600' },
        { icon: Layers, label: 'Categories', value: stats.totalCategories, color: 'from-green-500 to-green-600' },
        { icon: FileImage, label: 'Templates', value: stats.totalTemplates, color: 'from-purple-500 to-purple-600' },
        { icon: DollarSign, label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: 'from-amber-500 to-amber-600' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your platform overview.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="text-white" size={24} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Payments */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
                    <TrendingUp className="text-green-500" size={24} />
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : stats.recentPayments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No payments yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b">
                                    <th className="pb-3">User</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentPayments.map((payment) => (
                                    <tr key={payment._id} className="border-b last:border-0">
                                        <td className="py-4">
                                            <p className="font-medium text-gray-900">{payment.user?.name}</p>
                                            <p className="text-sm text-gray-500">{payment.user?.email}</p>
                                        </td>
                                        <td className="py-4 font-semibold text-gray-900">₹{payment.amount}</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminDashboard;
