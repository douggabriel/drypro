import React, { forwardRef } from 'react';

/**
 * Textarea component
 * @param {Object} props
 * @param {string} props.label - Textarea label
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Is required
 * @param {number} props.rows - Number of rows
 * @param {number} props.maxLength - Maximum character length
 * @param {boolean} props.showCount - Show character count
 * @param {string} props.className - Additional CSS classes
 */
const Textarea = forwardRef(({
  label,
  error,
  placeholder,
  required = false,
  rows = 4,
  maxLength = null,
  showCount = false,
  value = '',
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

      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        className={`w-full px-4 py-3 border-2 ${
          error ? 'border-red-500' : 'border-gray-200'
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base`}
        {...props}
      />

      <div className="flex justify-between items-center mt-1">
        <div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        {showCount && maxLength && (
          <p className="text-sm text-gray-500">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
