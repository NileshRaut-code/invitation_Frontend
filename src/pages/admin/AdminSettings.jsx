import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Input } from '../../components/ui';
import api from '../../api/api';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        scratchDesignPrice: 99,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            setSettings({
                scratchDesignPrice: data.scratchDesignPrice || 99,
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/settings', settings);
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Settings className="text-gray-400" size={32} />
                        System Settings
                    </h1>
                    <p className="text-gray-600 mt-1">Configure global application settings</p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Pricing Configuration</h2>
                        <div className="space-y-4">
                            <Input
                                type="number"
                                label="Scratch Design Price (₹)"
                                name="scratchDesignPrice"
                                value={settings.scratchDesignPrice}
                                onChange={handleChange}
                                min="0"
                                required
                                description="The base price for invitations designed from scratch."
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            <Save size={18} className="mr-2" />
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </Card>
        </motion.div>
    );
};

export default AdminSettings;
