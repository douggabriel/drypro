import React from 'react';
import { STATUS_CONFIG, PRIORITY_CONFIG, URGENCY_CONFIG } from '../../utils/constants';

/**
 * Badge component for displaying status, priority, etc.
 * @param {Object} props
 * @param {string} props.type - Badge type: 'status', 'priority', 'urgency', 'custom'
 * @param {string} props.value - Badge value (status/priority/urgency level)
 * @param {string} props.label - Custom label (for type='custom')
 * @param {string} props.color - Custom color (for type='custom')
 * @param {string} props.bgColor - Custom background color (for type='custom')
 * @param {boolean} props.showIcon - Show icon in badge
 * @param {string} props.size - Badge size: 'sm', 'md', 'lg'
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({
  type = 'status',
  value,
  label = null,
  color = null,
  bgColor = null,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  let config = {};

  // Get configuration based on type
  if (type === 'status') {
    config = STATUS_CONFIG[value] || STATUS_CONFIG.pending;
  } else if (type === 'priority') {
    config = PRIORITY_CONFIG[value] || PRIORITY_CONFIG.medium;
  } else if (type === 'urgency') {
    config = URGENCY_CONFIG[value] || URGENCY_CONFIG.normal;
  } else {
    // Custom badge
    config = {
      label: label || value,
      color: color || '#6b7280',
      bgColor: bgColor || '#f3f4f6',
      icon: '',
    };
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${sizeClasses[size]} ${className}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      {showIcon && config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
};

export default Badge;
