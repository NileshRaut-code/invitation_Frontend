const Skeleton = ({ className = '', variant = 'text', width, height }) => {
    const baseClasses = 'animate-pulse bg-gray-200 rounded';

    const variants = {
        text: 'h-4 w-full',
        title: 'h-6 w-3/4',
        avatar: 'h-12 w-12 rounded-full',
        thumbnail: 'h-48 w-full rounded-lg',
        button: 'h-10 w-24',
        card: 'h-64 w-full rounded-2xl',
    };

    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={style}
        />
    );
};

// Skeleton variants for common use cases
export const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <Skeleton variant="thumbnail" />
        <Skeleton variant="title" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-2/3" />
    </div>
);

export const TableRowSkeleton = () => (
    <div className="flex items-center space-x-4 p-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/4" />
            <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="button" />
    </div>
);

export default Skeleton;
