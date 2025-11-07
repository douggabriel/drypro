import React, { forwardRef } from 'react';

/**
 * Input component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Is required
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.className - Additional CSS classes
 */
const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  required = false,
  icon = null,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} border-2 ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
