import { useState, useCallback } from 'react';

let toastId = 0;

/**
 * Custom hook for managing toast notifications
 * @returns {Object} { toasts, showToast, hideToast }
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({
    type = 'info',
    message,
    duration = 5000,
    position = 'top',
  }) => {
    const id = toastId++;
    const toast = { id, type, message, duration, position };

    setToasts((prevToasts) => [...prevToasts, toast]);

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return showToast({ type: 'success', message, duration });
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast({ type: 'error', message, duration });
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    return showToast({ type: 'warning', message, duration });
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast({ type: 'info', message, duration });
  }, [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;
