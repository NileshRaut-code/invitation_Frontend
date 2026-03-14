import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
            <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="text-9xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    404
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link to="/">
                        <Button>
                            <Home size={18} className="mr-2" /> Go Home
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft size={18} className="mr-2" /> Go Back
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
