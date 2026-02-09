import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardSkeleton } from '../../components/ui';
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="text-green-500" size={18} />;
            case 'pending':
                return <Clock className="text-yellow-500" size={18} />;
            case 'failed':
                return <XCircle className="text-red-500" size={18} />;
            default:
                return <Clock className="text-gray-500" size={18} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600 mt-1">View your payment transactions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                            <CreditCard className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                            <CheckCircle className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Successful Payments</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {payments.filter(p => p.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Payments</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {payments.filter(p => p.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Payment List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                </div>
            ) : payments.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-600">Your payment history will appear here.</p>
                </Card>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b">
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Invitation</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-gray-600">
                                                {payment.razorpayPaymentId || payment._id.slice(-8)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900">
                                                {payment.invitation?.content?.eventName || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-gray-900">₹{payment.amount}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                <span className="ml-1 capitalize">{payment.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default PaymentHistory;
