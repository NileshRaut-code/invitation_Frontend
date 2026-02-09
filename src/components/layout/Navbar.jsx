import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../../api/api';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            dispatch(logout());
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            dispatch(logout());
            navigate('/');
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">I</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            InviteMe
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/categories" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Categories
                        </Link>
                        <Link to="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Templates
                        </Link>
                        <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Pricing
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.name}</span>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2"
                                        >
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <LayoutDashboard size={18} className="mr-3" />
                                                Dashboard
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <Settings size={18} className="mr-3" />
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={18} className="mr-3" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <Link to="/categories" className="block py-2 text-gray-600">Categories</Link>
                            <Link to="/templates" className="block py-2 text-gray-600">Templates</Link>
                            <Link to="/pricing" className="block py-2 text-gray-600">Pricing</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="block py-2 text-gray-600">Dashboard</Link>
                                    <button onClick={handleLogout} className="block py-2 text-red-600">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block py-2 text-gray-600">Login</Link>
                                    <Link to="/register" className="block py-2 text-indigo-600 font-medium">Get Started</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
