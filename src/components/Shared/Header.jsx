import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import Button from './Button';
import NotificationCenter from './NotificationCenter';

/**
 * Header component
 * @param {Object} props
 * @param {Function} props.onMenuClick - Menu button click handler
 */
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-40">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-orange to-primary-orangeDark flex items-center justify-center text-xl">
              🏗️
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              DryBuild Pro
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification Center */}
          <NotificationCenter />

          {/* User menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <Avatar
              name={currentUser?.name || 'User'}
              src={currentUser?.avatar_url}
              size="md"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {currentUser?.role || 'User'}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            Logout
          </Button>

          {/* Mobile logout */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
