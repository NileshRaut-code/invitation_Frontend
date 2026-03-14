import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui';
import api from '../../api/api';

const ResetPassword = () => {
    const { resettoken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await api.put(`/auth/resetpassword/${resettoken}`, { password });
            setIsSuccess(true);
            toast.success('Password reset successful!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className={`mx-auto w-16 h-16 ${isSuccess ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} rounded-2xl flex items-center justify-center mb-4`}
                        >
                            {isSuccess ? (
                                <Check className="w-8 h-8 text-green-600" />
                            ) : (
                                <Lock className="w-8 h-8 text-white" />
                            )}
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {isSuccess ? 'Password Reset!' : 'Set New Password'}
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {isSuccess
                                ? 'Redirecting you to login...'
                                : 'Enter your new password below'}
                        </p>
                    </div>

                    {!isSuccess && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="New Password"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm New Password"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full py-3"
                            >
                                Reset Password
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <ArrowLeft size={16} className="mr-2" /> Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
