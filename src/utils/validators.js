/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone format
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null
 */
export const validateEmail = (email) => {
  const requiredError = validateRequired(email, 'Email');
  if (requiredError) return requiredError;

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate phone
 * @param {string} phone - Phone to validate
 * @returns {string|null} Error message or null
 */
export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional in most cases

  if (!isValidPhone(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null
 */
export const validatePassword = (password) => {
  const requiredError = validateRequired(password, 'Password');
  if (requiredError) return requiredError;

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value (optional)
 * @returns {string|null} Error message or null
 */
export const validateNumberRange = (value, min, max = null, fieldName = 'Value') => {
  if (isNaN(value)) {
    return `${fieldName} must be a number`;
  }

  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }

  if (max !== null && value > max) {
    return `${fieldName} must be at most ${max}`;
  }

  return null;
};

/**
 * Validate text length
 * @param {string} text - Text to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateTextLength = (text, min, max, fieldName = 'Text') => {
  if (!text) text = '';

  if (text.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }

  if (text.length > max) {
    return `${fieldName} must be at most ${max} characters`;
  }

  return null;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum size in megabytes
 * @returns {string|null} Error message or null
 */
export const validateFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return null;

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return `File size must be less than ${maxSizeInMB}MB`;
  }

  return null;
};

/**
 * Validate image file type
 * @param {File} file - File to validate
 * @returns {string|null} Error message or null
 */
export const validateImageFile = (file) => {
  if (!file) return null;

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'File must be an image (JPEG, PNG, GIF, or WebP)';
  }

  return null;
};
