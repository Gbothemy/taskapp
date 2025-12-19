import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    activeTasks: 0,
    completedTasks: 0,
    totalEarnings: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    // Set loading to false after a short delay to ensure smooth loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    // Set basic stats from user profile
    if (profile) {
      setStats({
        activeTasks: profile.tasks_created || 0,
        completedTasks: profile.tasks_completed || 0,
        totalEarnings: profile.total_earnings || 0,
        pendingPayments: 0
      });
    }

    return () => clearTimeout(timer);
  }, [profile]);

  // Auto-redirect to specific dashboard based on user type
  useEffect(() => {
    if (profile?.user_type) {
      switch (profile.user_type) {
        case 'employer':
          navigate('/employer/dashboard', { replace: true });
          break;
        case 'worker':
          navigate('/worker/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          // Stay on general dashboard
          break;
      }
    }
  }, [profile, navigate]);

  // Determine user type and redirect accordingly
  const getUserTypeInfo = () => {
    if (!user) return { type: 'guest', title: 'Welcome', description: 'Please log in to continue' };
    
    const userType = profile?.user_type || user?.user_type;
    switch (userType) {
      case 'admin':
        return {
          type: 'admin',
          title: 'Admin Dashboard',
          description: 'Manage platform operations and users',
          primaryAction: { text: 'Go to Admin Panel', path: '/admin/dashboard' },
          secondaryAction: { text: 'User Management', path: '/admin/users' }
        };
      case 'employer':
        return {
          type: 'employer',
          title: 'Employer Dashboard',
          description: 'Manage your tasks and review submissions',
          primaryAction: { text: 'Create New Task', path: '/employer/create-task' },
          secondaryAction: { text: 'My Tasks', path: '/employer/my-tasks' }
        };
      case 'worker':
        return {
          type: 'worker',
          title: 'Worker Dashboard',
          description: 'Find tasks and manage your submissions',
          primaryAction: { text: 'Browse Tasks', path: '/worker/tasks' },
          secondaryAction: { text: 'My Submissions', path: '/worker/submissions' }
        };
      default:
        return {
          type: 'unknown',
          title: 'Dashboard',
          description: 'Welcome to TaskApp',
          primaryAction: { text: 'Browse Tasks', path: '/tasks' },
          secondaryAction: { text: 'Profile', path: '/profile' }
        };
    }
  };

  const userInfo = getUserTypeInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                {userInfo.title}
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                {userInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-600">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">
                    {user.full_name || 'User'}
                  </h3>
                  <p className="text-secondary-600">
                    {user.email} • {profile?.user_type || user?.user_type || 'User'}
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Active
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.activeTasks}
            </div>
            <div className="text-sm text-secondary-600">Active Tasks</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-secondary-600">Completed</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              ${stats.totalEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-secondary-600">Total Earnings</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.pendingPayments}
            </div>
            <div className="text-sm text-secondary-600">Pending</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {userInfo.primaryAction && (
                <Button
                  onClick={() => navigate(userInfo.primaryAction.path)}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700"
                  size="lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  {userInfo.primaryAction.text}
                </Button>
              )}
              {userInfo.secondaryAction && (
                <Button
                  onClick={() => navigate(userInfo.secondaryAction.path)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <EyeIcon className="w-5 h-5 mr-2" />
                  {userInfo.secondaryAction.text}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Navigation</h3>
            <div className="space-y-3">
              <Link
                to="/wallet"
                className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-secondary-900">Wallet</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-secondary-400" />
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-secondary-900">Profile</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-secondary-400" />
              </Link>

              <Link
                to="/settings"
                className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BriefcaseIcon className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-secondary-900">Settings</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-secondary-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {user && (!profile?.tasks_completed && !profile?.tasks_created) && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              Welcome to TaskApp! 🎉
            </h3>
            <p className="text-secondary-700 mb-4">
              Get started by exploring the platform and {(profile?.user_type || user?.user_type) === 'employer' ? 'creating your first task' : 'browsing available tasks'}.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate(userInfo.primaryAction?.path || '/tasks')}
                className="bg-gradient-to-r from-primary-600 to-primary-700"
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate('/help')}
                variant="outline"
              >
                Learn More
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default UserDashboard;