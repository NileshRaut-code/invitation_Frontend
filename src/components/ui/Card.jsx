import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {}}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};

const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-slate-700 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
