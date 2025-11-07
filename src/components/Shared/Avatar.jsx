import React from 'react';
import { User } from 'lucide-react';
import { getInitials, generateColorFromString } from '../../utils/formatters';

/**
 * Avatar component
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.name - User name (used for initials)
 * @param {string} props.size - Avatar size: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {boolean} props.showOnlineStatus - Show online indicator
 * @param {boolean} props.isOnline - Online status
 * @param {string} props.className - Additional CSS classes
 */
const Avatar = ({
  src = null,
  name = '',
  size = 'md',
  showOnlineStatus = false,
  isOnline = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const onlineIndicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const gradient = generateColorFromString(name);
  const initials = getInitials(name);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white overflow-hidden ring-2 ring-white`}
        style={{ background: src ? 'transparent' : gradient }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>

      {showOnlineStatus && (
        <div
          className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
