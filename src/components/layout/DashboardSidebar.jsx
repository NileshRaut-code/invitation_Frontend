import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Mail,
    Plus,
    CreditCard,
    Settings,
    LogOut,
    ChevronLeft,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../../api/api';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Create Invitation', path: '/dashboard/create' },
    { icon: Mail, label: 'My Invitations', path: '/dashboard/invitations' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const DashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {
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
            className="fixed left-0 top-0 h-screen bg-white border-r shadow-sm z-40"
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!isCollapsed && (
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                InviteMe
                            </span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronLeft
                            size={20}
                            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-all ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon size={20} />
                                {!isCollapsed && <span className="ml-3">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t">
                    {!isCollapsed && (
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''
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

export default DashboardSidebar;
