import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../../components/ui';
import api from '../../api/api';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payments/all');
            setPayments(data.payments || []);
            setTotalRevenue(data.totalRevenue || 0);
        } catch {
            toast.error('Failed to fetch payments');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPayments = payments.filter(
        (payment) =>
            payment.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-600 mt-1">View all payment transactions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">₹{totalRevenue}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <DollarSign className="text-white" size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Avg. Transaction</p>
                            <p className="text-3xl font-bold text-gray-900">
                                ₹{payments.length > 0 ? Math.round(totalRevenue / payments.length) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <Download className="text-white" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Payments Table */}
            <Card className="overflow-hidden">
                {isLoading ? (
                    <div className="p-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded mb-4 animate-pulse" />
                        ))}
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No payments found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-600 text-sm">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Invitation</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{payment.user?.name}</p>
                                                <p className="text-sm text-gray-500">{payment.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">₹{payment.amount}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {payment.invitation?.content?.eventName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'captured'
                                                ? 'bg-green-100 text-green-700'
                                                : payment.status === 'failed'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminPayments;
