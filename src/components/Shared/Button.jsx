import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Button component with different variants and sizes
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'ghost', 'danger'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-orange to-primary-orangeDark text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed',
    blue: 'bg-gradient-to-r from-primary-blue to-primary-blueDark text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed',
    purple: 'bg-gradient-to-r from-primary-purple to-primary-purpleDark text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed',
    green: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="w-5 h-5 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
