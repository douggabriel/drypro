import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../Shared/LoadingSpinner';

/**
 * Protected route component - redirects to login if not authenticated
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array<string>} props.allowedRoles - Allowed user roles
 */
const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary-orange to-primary-orangeDark text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
