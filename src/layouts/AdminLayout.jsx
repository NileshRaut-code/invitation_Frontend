import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
            {/* Mobile hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 flex items-center px-4 py-3">
                <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-800">
                    <Menu size={24} />
                </button>
                <span className="ml-3 text-lg font-bold">Admin Panel</span>
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar — hidden on mobile, shown on desktop */}
            <div className={`hidden lg:block`}>
                <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            {/* Mobile drawer sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-0 top-0 z-50 lg:hidden"
                    >
                        <AdminSidebar isCollapsed={false} setIsCollapsed={() => { }} onMobileClose={() => setIsMobileOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.main
                animate={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isCollapsed ? 80 : 280) : 0 }}
                className="p-4 md:p-8 pt-16 lg:pt-8 transition-all"
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default AdminLayout;
