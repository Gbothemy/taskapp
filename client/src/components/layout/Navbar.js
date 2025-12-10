import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ];

  const userNavigation = {
    worker: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Browse Tasks', href: '/tasks' },
      { name: 'My Submissions', href: '/my-submissions' },
      { name: 'Wallet', href: '/wallet' },
    ],
    employer: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Create Task', href: '/create-task' },
      { name: 'My Tasks', href: '/my-tasks' },
      { name: 'Review Submissions', href: '/review-submissions' },
      { name: 'Wallet', href: '/wallet' },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'User Management', href: '/admin/users' },
      { name: 'Task Management', href: '/admin/tasks' },
    ],
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-18">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img 
                  src="/logo.jpg" 
                  alt="TaskApp Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">TaskApp</span>
              </div>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-all duration-200 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User-specific navigation */}
                {user && userNavigation[user.role] && (
                  <div className="hidden lg:flex lg:space-x-4">
                    {userNavigation[user.role].slice(0, 3).map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="relative text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-all duration-200 group"
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="p-2 text-gray-400 hover:text-primary-500 relative rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationOpen && (
                    <NotificationDropdown onClose={() => setNotificationOpen(false)} />
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8" />
                    <span className="hidden lg:block font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" style={{
                      transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 backdrop-blur-md">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200 rounded-lg mx-2"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200 rounded-lg mx-2"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && user && userNavigation[user.role] && (
              <>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                    {user.role} Menu
                  </div>
                  {userNavigation[user.role].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;