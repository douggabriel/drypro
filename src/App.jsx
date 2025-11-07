import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginScreen from './components/Auth/LoginScreen';
import Header from './components/Shared/Header';
import Sidebar from './components/Shared/Sidebar';
import OfflineIndicator from './components/Shared/OfflineIndicator';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import DashboardScreen from './components/Dashboard/DashboardScreen';
import ActivitiesScreen from './components/Activities/ActivitiesScreen';
import ActivityDetail from './components/Activities/ActivityDetail';
import DefectsScreen from './components/Defects/DefectsScreen';
import DefectDetail from './components/Defects/DefectDetail';
import MaterialsScreen from './components/Materials/MaterialsScreen';
import EmployeesScreen from './components/Employees/EmployeesScreen';
import SitesScreen from './components/Sites/SitesScreen';
import useToast from './hooks/useToast';
import { ToastContainer } from './components/Shared/Toast';

// Layout component for authenticated pages
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <OfflineIndicator />

      <main className="pt-16 lg:pl-64">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const { toasts, hideToast } = useToast();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginScreen />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DashboardScreen />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/activities"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ActivitiesScreen />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/activities/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ActivityDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/defects"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DefectsScreen />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/defects/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DefectDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/materials"
                  element={
                    <ProtectedRoute allowedRoles={['supervisor']}>
                      <Layout>
                        <MaterialsScreen />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute allowedRoles={['supervisor']}>
                      <Layout>
                        <EmployeesScreen />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/sites"
                  element={
                    <ProtectedRoute allowedRoles={['supervisor']}>
                      <Layout>
                        <SitesScreen />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch all - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Toast notifications */}
              <ToastContainer toasts={toasts} removeToast={hideToast} />
            </Router>
          </NotificationProvider>
        </OfflineProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
