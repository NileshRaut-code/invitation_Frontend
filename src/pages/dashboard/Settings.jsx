import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Loader, Check, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Input } from '../../components/ui';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../api/api';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
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
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-56 flex-shrink-0">
                    <Card className="p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={18} className="mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </Card>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

                                {/* Avatar */}
                                <div className="flex items-center mb-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600">
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <div className="ml-6">
                                        <p className="font-semibold text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Full Name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            placeholder="Your full name"
                                        />
                                        <Input
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                        <Input
                                            label="Phone Number"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            placeholder="+91 9876543210"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader size={16} className="mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={16} className="mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

                                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                    <Input
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                    />
                                    <Input
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                    />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader size={16} className="mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Password'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>

                            {/* Security Info */}
                            <Card className="p-6 mt-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Security Tips</h2>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <Shield size={18} className="mr-3 text-green-500 mt-0.5" />
                                        Use a strong password with at least 8 characters
                                    </li>
                                    <li className="flex items-start">
                                        <Shield size={18} className="mr-3 text-green-500 mt-0.5" />
                                        Never share your password with anyone
                                    </li>
                                    <li className="flex items-start">
                                        <Shield size={18} className="mr-3 text-green-500 mt-0.5" />
                                        Use unique passwords for different accounts
                                    </li>
                                </ul>
                            </Card>
                        </motion.div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                                <div className="space-y-6">
                                    {[
                                        { id: 'email_rsvp', label: 'RSVP Notifications', description: 'Get notified when someone RSVPs to your invitation', enabled: true },
                                        { id: 'email_payment', label: 'Payment Confirmations', description: 'Receive payment confirmation emails', enabled: true },
                                        { id: 'email_marketing', label: 'Marketing Updates', description: 'Receive news about new templates and features', enabled: false },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={item.enabled}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-6">
                                    <Button>Save Preferences</Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
