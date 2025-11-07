import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Loading spinner component
 * @param {Object} props
 * @param {string} props.size - Spinner size: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.text - Loading text
 * @param {boolean} props.fullScreen - Show as full screen overlay
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader className={`${sizeClasses[size]} text-primary-orange animate-spin`} />
      {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
