import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { categoriesService } from '../../services/supabase';

const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      hasSubmenu: true
    },
    {
      name: isAuthenticated ? 'Dashboard' : 'Sign In',
      href: isAuthenticated ? '/dashboard' : '/login',
      icon: isAuthenticated ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      name: 'More',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      hasSubmenu: true
    }
  ];

  // const moreItems = [
  //   { name: 'About', href: '/about' },
  //   { name: 'How It Works', href: '/how-it-works' },
  //   // { name: 'Pricing', href: '/pricing' }, // Removed pricing feature
  //   { name: 'Success Stories', href: '/success-stories' },
  //   { name: 'Help Center', href: '/help' },
  //   { name: 'Contact', href: '/contact' }
  // ]; // Will be used for more menu functionality

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (item) => {
    if (item.name === 'Tasks' && item.hasSubmenu) {
      setShowCategories(!showCategories);
    } else if (item.name === 'More' && item.hasSubmenu) {
      setShowMore(!showMore);
    }
  };

  return (
    <>
      {/* Categories Overlay */}
      {showCategories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Browse Categories</h3>
              <button
                onClick={() => setShowCategories(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Link
                to="/tasks"
                onClick={() => setShowCategories(false)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-primary-600 text-xl">🔍</span>
                </div>
                <span className="text-sm font-medium text-gray-900">All Tasks</span>
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/tasks?category=${category.id}`}
                  onClick={() => setShowCategories(false)}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                    <span className={`text-${category.color}-600 text-xl`}>
                      {category.icon === 'pencil' && '✏️'}
                      {category.icon === 'paint-brush' && '🎨'}
                      {category.icon === 'code' && '💻'}
                      {category.icon === 'chart-bar' && '📊'}
                      {category.icon === 'megaphone' && '📢'}
                      {category.icon === 'globe' && '🌍'}
                      {category.icon === 'briefcase' && '💼'}
                      {category.icon === 'film' && '🎬'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More Menu Overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">More Options</h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {!isAuthenticated && (
                <Link
                  to="/register"
                  onClick={() => setShowMore(false)}
                  className="flex flex-col items-center p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <span className="text-sm font-medium text-primary-900 text-center">
                    Get Started
                  </span>
                </Link>
              )}
              
              <Link
                to="/about"
                onClick={() => setShowMore(false)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-secondary-600 text-xl">ℹ️</span>
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">
                  About
                </span>
              </Link>
              
              <Link
                to="/pricing"
                onClick={() => setShowMore(false)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-secondary-600 text-xl">💰</span>
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">
                  Pricing
                </span>
              </Link>
              
              <Link
                to="/help"
                onClick={() => setShowMore(false)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-secondary-600 text-xl">❓</span>
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">
                  Help
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-primary-200/50 z-50 md:hidden shadow-2xl">
        <div className="grid grid-cols-4 h-20">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.hasSubmenu) {
                  handleNavClick(item);
                } else {
                  window.location.href = item.href;
                }
              }}
              className={`flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                isActive(item.href)
                  ? 'text-primary-600 bg-gradient-to-t from-primary-50 to-transparent scale-105'
                  : 'text-secondary-500 hover:text-primary-600 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-primary-100 shadow-lg'
                  : 'hover:bg-primary-50'
              }`}>
                {item.icon}
              </div>
              <span className="text-xs font-semibold">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden"></div>
    </>
  );
};

export default MobileNav;