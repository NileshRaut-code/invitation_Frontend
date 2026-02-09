import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/layout/AdminSidebar';

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <motion.main
                animate={{ marginLeft: isCollapsed ? 80 : 280 }}
                className="p-8 transition-all"
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default AdminLayout;
