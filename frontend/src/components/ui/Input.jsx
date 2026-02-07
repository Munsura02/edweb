import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className, icon: Icon, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-gray-400 bg-gray-50 focus:bg-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-500 ml-1 flex items-center animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-red-500 mr-1.5"></span>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
