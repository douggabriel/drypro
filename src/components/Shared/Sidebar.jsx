import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Package,
  Users,
  Wrench,
  Building2,
  X,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

/**
 * Sidebar component
 * @param {Object} props
 * @param {boolean} props.isOpen - Is sidebar open (mobile)
 * @param {Function} props.onClose - Close sidebar handler
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, isSupervisor } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['supervisor', 'trade'],
    },
    {
      name: 'Activities',
      path: '/activities',
      icon: ClipboardList,
      roles: ['supervisor', 'trade'],
    },
    {
      name: 'Defects',
      path: '/defects',
      icon: AlertTriangle,
      roles: ['supervisor', 'trade'],
    },
    {
      name: 'Materials',
      path: '/materials',
      icon: Package,
      roles: ['supervisor'],
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: Users,
      roles: ['supervisor'],
    },
    {
      name: 'Sites',
      path: '/sites',
      icon: Building2,
      roles: ['supervisor'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(currentUser?.role)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-orange to-primary-orangeDark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {currentUser?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
