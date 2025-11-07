import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {string} props.message - Toast message
 * @param {Function} props.onClose - Close handler
 * @param {number} props.duration - Auto-close duration in ms (0 = no auto-close)
 * @param {string} props.position - Toast position: 'top', 'bottom'
 */
const Toast = ({
  type = 'info',
  message,
  onClose,
  duration = 5000,
  position = 'top',
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  const positionClasses = position === 'top'
    ? 'top-4 left-1/2 transform -translate-x-1/2'
    : 'bottom-4 left-1/2 transform -translate-x-1/2';

  return (
    <div
      className={`fixed ${positionClasses} z-50 animate-slide-up`}
      role="alert"
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg border-l-4 ${config.bgColor} ${config.borderColor} min-w-[320px] max-w-md`}
      >
        {config.icon}
        <p className={`flex-1 font-medium ${config.textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors ${config.textColor}`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * Toast container component for managing multiple toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
          position={toast.position}
        />
      ))}
    </>
  );
};

export default Toast;
