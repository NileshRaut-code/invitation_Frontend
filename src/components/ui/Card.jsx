import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {}}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};

const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t bg-gray-50 ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
