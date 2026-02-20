import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Loader, Check, Camera, Mail, Phone, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input } from '../../components/ui';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../api/api';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const { data } = await api.put('/auth/profile', profileData);
            dispatch(setCredentials({ ...user, ...data }));
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsSaving(true);
        try {
            await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, gradient: 'from-indigo-500 to-purple-600' },
        { id: 'security', label: 'Security', icon: Lock, gradient: 'from-emerald-500 to-green-600' },
        { id: 'notifications', label: 'Notifications', icon: Bell, gradient: 'from-amber-500 to-orange-600' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-60 flex-shrink-0">
                    {/* User Card */}
                    <div className="p-5 rounded-2xl bg-white border border-gray-100 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="p-2 rounded-2xl bg-white border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${activeTab === tab.id
                                        ? `bg-gradient-to-br ${tab.gradient}`
                                        : 'bg-gray-100'
                                    }`}>
                                    <tab.icon size={15} className={activeTab === tab.id ? 'text-white' : 'text-gray-400'} />
                                </div>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="p-6 rounded-2xl bg-white border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>

                                {/* Avatar */}
                                <div className="flex items-center mb-8 p-4 rounded-xl bg-gray-50/80">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-colors border border-gray-100">
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div className="ml-5">
                                        <p className="font-semibold text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                        <p className="text-xs text-gray-400 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    name="name"
                                                    value={profileData.name}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled
                                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                            <div className="relative">
                                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleProfileChange}
                                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-md disabled:opacity-50"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                        >
                                            {isSaving ? (
                                                <><Loader size={16} className="animate-spin" /> Saving...</>
                                            ) : (
                                                <><Check size={16} /> Save Changes</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="p-6 rounded-2xl bg-white border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>

                                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                        <div className="relative">
                                            <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                name="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                name="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-md disabled:opacity-50"
                                            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                                        >
                                            {isSaving ? (
                                                <><Loader size={16} className="animate-spin" /> Updating...</>
                                            ) : (
                                                'Update Password'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Security Tips */}
                            <div className="p-5 rounded-2xl bg-white border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Security Tips</h3>
                                <div className="space-y-2.5">
                                    {[
                                        'Use a strong password with at least 8 characters',
                                        'Never share your password with anyone',
                                        'Use unique passwords for different accounts',
                                    ].map((tip, i) => (
                                        <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <div className="w-5 h-5 rounded-md flex items-center justify-center bg-emerald-50">
                                                <Shield size={12} className="text-emerald-500" />
                                            </div>
                                            {tip}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="p-6 rounded-2xl bg-white border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>

                                <div className="space-y-1">
                                    {[
                                        { id: 'email_rsvp', label: 'RSVP Notifications', description: 'Get notified when someone RSVPs', enabled: true },
                                        { id: 'email_payment', label: 'Payment Confirmations', description: 'Receive payment confirmation emails', enabled: true },
                                        { id: 'email_marketing', label: 'Marketing Updates', description: 'News about new templates and features', enabled: false },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 transition-all">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={item.enabled}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        className="px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-md"
                                        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
