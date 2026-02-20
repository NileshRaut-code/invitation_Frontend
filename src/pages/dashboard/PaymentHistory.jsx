import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, XCircle, Receipt, TrendingUp, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import { CardSkeleton } from '../../components/ui';
import api from '../../api/api';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payments/my-payments');
            setPayments(data);
        } catch {
            toast.error('Failed to load payments');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed':
                return { icon: CheckCircle, color: '#059669', bg: 'rgba(16, 185, 129, 0.1)', label: 'Completed' };
            case 'pending':
                return { icon: Clock, color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)', label: 'Pending' };
            case 'failed':
                return { icon: XCircle, color: '#dc2626', bg: 'rgba(239, 68, 68, 0.1)', label: 'Failed' };
            default:
                return { icon: Clock, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', label: status };
        }
    };

    const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const successCount = payments.filter(p => p.status === 'completed').length;
    const pendingCount = payments.filter(p => p.status === 'pending').length;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-500 mt-1">Track all your payment transactions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    { icon: IndianRupee, label: 'Total Spent', value: `₹${totalSpent}`, gradient: 'from-emerald-500 to-green-600' },
                    { icon: CheckCircle, label: 'Successful', value: successCount, gradient: 'from-indigo-500 to-purple-600' },
                    { icon: Clock, label: 'Pending', value: pendingCount, gradient: 'from-amber-500 to-orange-600' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                <stat.icon size={18} className="text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Payment List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-white border border-gray-100">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <Receipt size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Your payment history will appear here once you make your first purchase.</p>
                </div>
            ) : (
                <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invitation</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</span>
                    </div>

                    {/* Table Rows */}
                    {payments.map((payment, index) => {
                        const status = getStatusStyle(payment.status);
                        return (
                            <motion.div
                                key={payment._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                            >
                                <div>
                                    <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Transaction</span>
                                    <p className="font-mono text-sm text-gray-600">
                                        {payment.razorpayPaymentId || `#${payment._id.slice(-8)}`}
                                    </p>
                                </div>
                                <div>
                                    <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Invitation</span>
                                    <p className="font-medium text-gray-900 truncate">
                                        {payment.invitation?.content?.eventName || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Amount</span>
                                    <p className="font-semibold text-gray-900">₹{payment.amount}</p>
                                </div>
                                <div>
                                    <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Status</span>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                                        style={{ background: status.bg, color: status.color }}>
                                        <status.icon size={12} className="mr-1" />
                                        {status.label}
                                    </span>
                                </div>
                                <div>
                                    <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Date</span>
                                    <p className="text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
