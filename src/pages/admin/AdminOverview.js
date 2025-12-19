import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
  ShieldCheckIcon,
  DocumentTextIcon,
  ServerIcon,
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import adminService from '../../services/adminService';
import { supabase } from '../../services/supabase';
import AdminDebug from '../../components/debug/AdminDebug';
import ActivityMonitor from '../../components/admin/ActivityMonitor';

const AdminOverview = () => {
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

  const [systemInfo, setSystemInfo] = useState({
    databaseStatus: 'checking',
    totalTables: 0,
    storageUsed: 0,
    apiCalls: 0,
    uptime: '99.9%'
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Admin Overview: Starting data fetch...');
        
        // Test database connection first
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error('Database connection test failed:', testError);
          setSystemInfo(prev => ({ ...prev, databaseStatus: 'error' }));
        } else {
          setSystemInfo(prev => ({ ...prev, databaseStatus: 'connected' }));
        }
        
        const [dashboardStats, activityData, sysInfo] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentActivity(10),
          getSystemInfo()
        ]);

        setStats(dashboardStats);
        setRecentActivity(activityData);
        setSystemInfo(prev => ({ ...prev, ...sysInfo }));
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(`Failed to load admin data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_type === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
      setError('Access denied. Admin privileges required.');
    }
  }, [user]);

  const getSystemInfo = async () => {
    try {
      // Get table count
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      return {
        totalTables: tables?.length || 0,
        storageUsed: Math.floor(Math.random() * 500) + 100, // Mock data
        apiCalls: Math.floor(Math.random() * 10000) + 5000, // Mock data
        uptime: '99.9%'
      };
    } catch (error) {
      console.error('Error getting system info:', error);
      return {
        totalTables: 0,
        storageUsed: 0,
        apiCalls: 0,
        uptime: 'Unknown'
      };
    }
  };

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
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Error Loading Admin Panel</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-info-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-info-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-xl">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-secondary-900">
                  Admin Control Panel
                </h1>
                <p className="text-secondary-600 mt-2 text-lg">
                  Complete platform administration and monitoring
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to="/debug/admin">
                <Button variant="outline" size="sm">
                  <Cog6ToothIcon className="w-4 h-4 mr-2" />
                  Debug Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <AdminDebug />

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <ServerIcon className="w-6 h-6 text-white" />
              </div>
              <Badge variant={systemInfo.databaseStatus === 'connected' ? 'success' : 'error'} size="sm">
                {systemInfo.databaseStatus === 'connected' ? 'Online' : 'Error'}
              </Badge>
            </div>
            <div className="text-2xl font-black text-secondary-900 mb-1">
              Database
            </div>
            <div className="text-sm text-secondary-600">
              {systemInfo.totalTables} tables • {systemInfo.databaseStatus}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <Badge variant="success" size="sm">
                {systemInfo.uptime}
              </Badge>
            </div>
            <div className="text-2xl font-black text-secondary-900 mb-1">
              System Health
            </div>
            <div className="text-sm text-secondary-600">
              Uptime: {systemInfo.uptime}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
              <Badge variant="info" size="sm">
                API
              </Badge>
            </div>
            <div className="text-2xl font-black text-secondary-900 mb-1">
              {systemInfo.apiCalls.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">
              API Calls Today
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <Badge variant="default" size="sm">
                {systemInfo.storageUsed} MB
              </Badge>
            </div>
            <div className="text-2xl font-black text-secondary-900 mb-1">
              Storage
            </div>
            <div className="text-sm text-secondary-600">
              Database Size
            </div>
          </Card>
        </div>

        {/* Platform Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
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
          </Card>

          <Card className="p-6">
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
          </Card>

          <Card className="p-6">
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
          </Card>

          <Card className="p-6">
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
          </Card>
        </div>

        {/* Admin Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">Admin Management</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link to="/admin/dashboard">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <ChartBarIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">Dashboard</span>
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <UsersIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">User Management</span>
                  </Button>
                </Link>
                <Link to="/admin/tasks">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <BriefcaseIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">Task Management</span>
                  </Button>
                </Link>
                <Link to="/admin/payments">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <CurrencyDollarIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">Payment Management</span>
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <ChartBarIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <Cog6ToothIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">System Settings</span>
                  </Button>
                </Link>
                <Link to="/debug/admin">
                  <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                    <ShieldCheckIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">Debug Tools</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                  <DocumentTextIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">Reports</span>
                </Button>
                <Button variant="outline" className="w-full flex flex-col items-center p-4 h-auto">
                  <ServerIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs">System Health</span>
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
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
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-xl">
          <div className="p-6 border-b border-secondary-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-secondary-900">Recent Platform Activity</h3>
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
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;