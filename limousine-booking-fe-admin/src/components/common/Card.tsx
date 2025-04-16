import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', actions }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {actions && <div className="flex items-center space-x-2">{actions}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};

export default Card; 