import React from 'react';
import { getStatusFromProgress } from '../../utils/formatters';

/**
 * Progress bar component
 * @param {Object} props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} props.size - Bar size: 'sm', 'md', 'lg'
 * @param {boolean} props.showLabel - Show percentage label
 * @param {string} props.labelPosition - Label position: 'inside', 'outside', 'none'
 * @param {string} props.className - Additional CSS classes
 */
const ProgressBar = ({
  progress = 0,
  size = 'md',
  showLabel = false,
  labelPosition = 'outside',
  className = '',
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const status = getStatusFromProgress(normalizedProgress);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    pending: 'bg-gray-300',
    in_progress: 'bg-gradient-to-r from-primary-blue to-primary-blueDark',
    completed: 'bg-gradient-to-r from-green-500 to-green-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && labelPosition === 'outside' && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{normalizedProgress}%</span>
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[status]} rounded-full transition-all duration-300 ease-out flex items-center justify-center`}
          style={{ width: `${normalizedProgress}%` }}
        >
          {showLabel && labelPosition === 'inside' && normalizedProgress > 10 && (
            <span className="text-xs font-bold text-white">{normalizedProgress}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Circular progress component
 * @param {Object} props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {number} props.size - Circle size in pixels
 * @param {number} props.strokeWidth - Stroke width
 * @param {boolean} props.showLabel - Show percentage in center
 * @param {string} props.className - Additional CSS classes
 */
export const CircularProgress = ({
  progress = 0,
  size = 80,
  strokeWidth = 8,
  showLabel = true,
  className = '',
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const status = getStatusFromProgress(normalizedProgress);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;

  const colorClasses = {
    pending: '#e5e7eb',
    in_progress: '#3b82f6',
    completed: '#22c55e',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClasses[status]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{normalizedProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
