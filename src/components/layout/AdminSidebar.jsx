import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Layers,
    FileImage,
    Users,
    CreditCard,
    Settings,
    LogOut,
    ChevronLeft,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../../api/api';

const adminSidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: FileImage, label: 'Templates', path: '/admin/templates' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="fixed left-0 top-0 h-screen bg-gray-900 text-white z-40"
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {!isCollapsed && (
                        <Link to="/admin" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-xl font-bold">Admin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <ChevronLeft
                            size={20}
                            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {adminSidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-all ${isActive
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                                        : 'hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon size={20} />
                                {!isCollapsed && <span className="ml-3">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-gray-800">
                    {!isCollapsed && (
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-sm text-gray-400">Administrator</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-colors ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};

export default AdminSidebar;
