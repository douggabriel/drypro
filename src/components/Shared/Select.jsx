import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select component
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {string} props.error - Error message
 * @param {Array} props.options - Options array [{value, label}]
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Is required
 * @param {string} props.className - Additional CSS classes
 */
const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option...',
  required = false,
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
        <select
          ref={ref}
          className={`w-full px-4 py-3 pr-10 border-2 ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-base bg-white`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
