import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui';
import { setCredentials, setLoading, setError } from '../../store/slices/authSlice';
import api from '../../api/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
        if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

        dispatch(setLoading(true));
        try {
            const { data } = await api.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });
            dispatch(setCredentials(data));
            toast.success('Account created! Check your email to verify.');
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            dispatch(setError(message));
            toast.error(message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await api.post('/auth/google', { credential: credentialResponse.credential });
            dispatch(setCredentials(data));
            toast.success('Account created!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
                <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Join us and start creating beautiful invitations</p>
                    </div>

                    {/* Google Sign Up */}
                    <div className="mb-6 flex justify-center">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google signup failed')} size="large" text="signup_with" shape="rectangular" theme="outline" />
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-600"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white/80 dark:bg-slate-800/90 text-gray-500 dark:text-gray-400">or register with email</span></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" required className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" />
                        </div>
                        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Create Account</Button>
                    </form>

                    <p className="mt-4 text-xs text-gray-500 text-center">
                        By signing up, you agree to our <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>.
                    </p>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600 dark:text-gray-400">Already have an account?{' '}<Link to="/login" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500">Sign in</Link></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
