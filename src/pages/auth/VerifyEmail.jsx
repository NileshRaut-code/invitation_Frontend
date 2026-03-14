import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../api/api';
import { Button } from '../../components/ui';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            try {
                await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
            } catch {
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
            <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 text-center max-w-md w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {status === 'verifying' && (
                    <>
                        <Loader2 className="mx-auto text-indigo-600 animate-spin mb-4" size={48} />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifying your email...</h1>
                        <p className="text-gray-600 dark:text-gray-400">Please wait a moment.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Your email has been verified. You can now use all features.</p>
                        <Link to="/dashboard">
                            <Button>Go to Dashboard</Button>
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">This link is invalid or has expired. Please request a new one.</p>
                        <Link to="/login">
                            <Button>Go to Login</Button>
                        </Link>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
