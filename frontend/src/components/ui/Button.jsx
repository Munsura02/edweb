import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    isLoading,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-[0.98]";

    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:-translate-y-0.5 shadow-md focus:ring-indigo-500 border-transparent",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200 shadow-sm",
        outline: "border-2 border-indigo-100 bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
        ghost: "bg-transparent text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
