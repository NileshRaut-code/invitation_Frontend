import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui';
import { setCredentials, setLoading, setError } from '../../store/slices/authSlice';
import api from '../../api/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading } = useSelector((state) => state.auth);
    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const { data } = await api.post('/auth/login', formData);
            dispatch(setCredentials(data));
            toast.success('Login successful!');
            navigate(from, { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            dispatch(setError(message));
            toast.error(message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await api.post('/auth/google', { credential: credentialResponse.credential });
            dispatch(setCredentials(data));
            toast.success('Login successful!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
                <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
                    </div>

                    {/* Google Sign In */}
                    <div className="mb-6 flex justify-center">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed')} size="large" text="signin_with" shape="rectangular" theme="outline" />
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-600"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white/80 dark:bg-slate-800/90 text-gray-500 dark:text-gray-400">or continue with email</span></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" required className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Forgot password?</Link>
                        </div>
                        <Button type="submit" isLoading={isLoading} className="w-full py-3">Sign In</Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">Don't have an account?{' '}<Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Sign up</Link></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
