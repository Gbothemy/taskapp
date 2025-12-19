import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { logout } from '../../store/slices/authSlice';
import Badge from '../ui/Badge';
// import NotificationCenter from '../ui/NotificationCenter'; // Temporarily disabled

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, profile, isAuthenticated } = useSelector((state) => state.auth);
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
    // { name: 'Pricing', href: '/pricing' }, // Removed pricing feature
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
      { name: 'Create Task', href: '/employer/create-task' },
      { name: 'My Tasks', href: '/employer/my-tasks' },
      { name: 'Review Submissions', href: '/employer/review-submissions' },
      { name: 'Wallet', href: '/wallet' },
    ],
    admin: [
      { name: 'Admin Panel', href: '/admin' },
      { name: 'Dashboard', href: '/admin/dashboard' },
      { name: 'Analytics', href: '/admin/analytics' },
      { name: 'Reports', href: '/admin/reports' },
      { name: 'User Management', href: '/admin/users' },
      { name: 'Task Management', href: '/admin/tasks' },
      { name: 'Payment Management', href: '/admin/payments' },
      { name: 'Settings', href: '/admin/settings' },
    ],
  };

  const profileMenuItems = [
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-primary-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="/logo task.jpg" 
                    alt="TaskApp Logo" 
                    className="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-all duration-300 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    TaskApp
                  </span>
                  <span className="text-xs text-secondary-500 font-medium -mt-1">
                    Professional Platform
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden lg:ml-12 lg:flex lg:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative text-secondary-700 hover:text-primary-600 px-4 py-3 text-sm font-semibold transition-all duration-300 group rounded-xl hover:bg-primary-50/50"
                >
                  {item.name}
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User-specific navigation */}
                {profile && userNavigation[profile.user_type] && (
                  <div className="hidden lg:flex lg:space-x-2">
                    {userNavigation[profile.user_type].slice(0, 3).map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="relative text-secondary-700 hover:text-primary-600 px-4 py-3 text-sm font-semibold transition-all duration-300 group rounded-xl hover:bg-primary-50/50"
                      >
                        {item.name}
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Notifications - Temporarily disabled */}
                {/* <NotificationCenter /> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-3 p-2 text-secondary-600 hover:text-primary-600 transition-all duration-300 rounded-xl hover:bg-primary-50/50">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                        <span className="text-white text-sm font-bold">
                          {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-semibold text-secondary-900">
                        {profile?.full_name || 'User'}
                      </div>
                      <div className="text-xs text-secondary-500">
                        {profile?.user_type || 'Member'}
                      </div>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-200/50 focus:outline-none overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-200/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold">
                              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-secondary-900">
                              {profile?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-secondary-600 truncate">
                              {user?.email}
                            </p>
                            {profile?.user_type && (
                              <Badge variant="primary" size="sm" className="mt-1">
                                {profile.user_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        {profileMenuItems.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={`${
                                  active ? 'bg-secondary-50 text-primary-600' : 'text-secondary-700'
                                } group flex items-center px-4 py-2 text-sm transition-colors`}
                              >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-secondary-50 text-error-600' : 'text-secondary-700'
                              } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                            >
                              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-secondary-700 hover:text-primary-600 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 rounded-xl hover:bg-primary-50/50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-secondary-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {isAuthenticated && profile && userNavigation[profile.user_type] && (
              <>
                <div className="border-t border-secondary-200 pt-4 mt-4">
                  <div className="text-xs font-semibold text-secondary-400 uppercase tracking-wider px-4 mb-2">
                    {profile.user_type} Menu
                  </div>
                  {userNavigation[profile.user_type].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="border-t border-secondary-200 pt-4 mt-4">
                <div className="space-y-2 px-4">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center btn-modern text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;