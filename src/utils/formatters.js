/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate color from string (for avatars)
 * @param {string} str - String to generate color from
 * @returns {string} CSS gradient string
 */
export const generateColorFromString = (str) => {
  if (!str) return 'linear-gradient(135deg, #6b7280, #4b5563)';

  const colors = [
    'linear-gradient(135deg, #fb923c, #f97316)', // orange
    'linear-gradient(135deg, #60a5fa, #3b82f6)', // blue
    'linear-gradient(135deg, #c084fc, #a855f7)', // purple
    'linear-gradient(135deg, #f472b6, #ec4899)', // pink
    'linear-gradient(135deg, #4ade80, #22c55e)', // green
    'linear-gradient(135deg, #facc15, #eab308)', // yellow
    'linear-gradient(135deg, #f87171, #ef4444)', // red
    'linear-gradient(135deg, #34d399, #10b981)', // emerald
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Calculate progress percentage
 * @param {Array} phases - Array of phases with progress
 * @returns {number} Overall progress percentage
 */
export const calculateOverallProgress = (phases) => {
  if (!phases || phases.length === 0) return 0;
  const total = phases.reduce((sum, phase) => sum + (phase.progress || 0), 0);
  return Math.round(total / phases.length);
};

/**
 * Determine activity status from progress
 * @param {number} progress - Progress percentage
 * @returns {string} Status
 */
export const getStatusFromProgress = (progress) => {
  if (progress === 0) return 'pending';
  if (progress === 100) return 'completed';
  return 'in_progress';
};
