import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = forwardRef(({ label, error, className, icon: Icon = Lock, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                    <Icon size={18} />
                </div>
                <input
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-gray-400 bg-gray-50 focus:bg-white
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}
            ${className}
          `}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors duration-200 p-1"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
