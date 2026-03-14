import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import DashboardSidebar from '../components/layout/DashboardSidebar';

const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Mobile hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm z-50 flex items-center px-4 py-3">
                <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                    <Menu size={24} className="text-gray-700 dark:text-gray-200" />
                </button>
                <span className="ml-3 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">InviteMe</span>
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

            {/* Desktop sidebar */}
            <div className="hidden lg:block">
                <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-0 top-0 z-50 lg:hidden"
                    >
                        <DashboardSidebar isCollapsed={false} setIsCollapsed={() => { }} onMobileClose={() => setIsMobileOpen(false)} />
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

export default DashboardLayout;
