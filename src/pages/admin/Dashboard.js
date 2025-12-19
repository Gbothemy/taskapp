import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import { adminService } from '../../services/adminService';
import { supabase } from '../../services/supabase';
import AdminDebug from '../../components/debug/AdminDebug';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    completedTasksToday: 0,
    flaggedContent: 0,
    systemHealth: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const timeoutId = setTimeout(() => {
        setError('Request timed out. Please check your connection and try again.');
        setLoading(false);
      }, 15000); // 15 second timeout

      try {
        setLoading(true);
        setError(null);
        
        console.log('Admin Dashboard: Starting data fetch...');
        console.log('Current user:', user);
        
        // Test database connection first with a simple query
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error('Database connection test failed:', testError);
          throw new Error('Database connection failed: ' + testError.message);
        }
        
        console.log('Database connection test passed');
        
        const [dashboardStats, activityData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentActivity(10)
        ]);

        console.log('Dashboard stats received:', dashboardStats);
        console.log('Activity data received:', activityData);

        clearTimeout(timeoutId);
        setStats(dashboardStats);
        setRecentActivity(activityData);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Error fetching dashboard data:', err);
        setError(`Failed to load dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_type === 'admin') {
      console.log('User is admin, fetching dashboard data...');
      fetchDashboardData();
    } else if (user && user.user_type !== 'admin') {
      console.log('User is not admin, redirecting...');
      setLoading(false);
      setError('Access denied. Admin privileges required.');
    } else {
      console.log('User not loaded yet:', user);
      // Don't set loading to false here, let the auth system handle it
    }
  }, [user]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return <UsersIcon className="w-5 h-5 text-success-600" />;
      case 'task_completed':
        return <CheckCircleIcon className="w-5 h-5 text-info-600" />;
      case 'payment_processed':
        return <CurrencyDollarIcon className="w-5 h-5 text-success-600" />;
      case 'content_flagged':
        return <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />;
      case 'user_suspended':
        return <ShieldCheckIcon className="w-5 h-5 text-error-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" size="sm">Success</Badge>;
      case 'warning':
        return <Badge variant="warning" size="sm">Warning</Badge>;
      case 'error':
        return <Badge variant="error" size="sm">Action Taken</Badge>;
      default:
        return <Badge variant="default" size="sm">Info</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-info-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-info-50/30 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-info-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug Panel */}
        <AdminDebug />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-info-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Cog6ToothIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                Admin Dashboard
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Platform administration and management
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-info-600 bg-info-100 px-2 py-1 rounded-full">
                +{stats.newUsersToday} today
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Total Users</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.activeTasks}
            </div>
            <div className="text-sm text-secondary-600">Active Tasks</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-warning-600 bg-warning-100 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.pendingPayments}
            </div>
            <div className="text-sm text-secondary-600">Pending Payments</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-success-600 bg-success-100 px-2 py-1 rounded-full">
                Revenue
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Total Revenue</div>
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">System Health</h3>
              <div className="text-center">
                <div className="text-4xl font-black text-success-600 mb-2">
                  {stats.systemHealth}%
                </div>
                <div className="text-sm text-secondary-600 mb-4">All systems operational</div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.systemHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" size="sm" className="flex flex-col items-center p-4 h-auto">
                  <UsersIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">Manage Users</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center p-4 h-auto">
                  <BriefcaseIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">Review Tasks</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center p-4 h-auto">
                  <CurrencyDollarIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">Process Payments</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center p-4 h-auto">
                  <ChartBarIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">View Analytics</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center p-4 h-auto">
                  <ExclamationTriangleIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">Review Flags</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center p-4 h-auto">
                  <Cog6ToothIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl shadow-xl">
          <div className="p-6 border-b border-secondary-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-secondary-900">Recent Activity</h3>
              <Button variant="outline" size="sm">
                <EyeIcon className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <div className="font-semibold text-secondary-900">
                        {activity.type === 'user_registered' && `New user registered: ${activity.user}`}
                        {activity.type === 'task_completed' && `${activity.user} completed ${activity.task}`}
                        {activity.type === 'payment_processed' && `Payment of ${activity.amount} processed for ${activity.user}`}
                        {activity.type === 'content_flagged' && `Content flagged: ${activity.content}`}
                        {activity.type === 'user_suspended' && `User ${activity.user} suspended: ${activity.reason}`}
                      </div>
                      <div className="text-sm text-secondary-600">{activity.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default AdminDashboard;