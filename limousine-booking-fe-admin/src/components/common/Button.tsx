import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';

    const variants = {
        primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${className}
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

export default Button; 