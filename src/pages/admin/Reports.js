import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import adminService from '../../services/adminService';

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [adminActions, setAdminActions] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    loadReportsData();
  }, [selectedPeriod]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      const [analyticsData, logsData, actionsData, healthData] = await Promise.all([
        adminService.getAdvancedAnalytics(selectedPeriod),
        adminService.getActivityLogs({ limit: 50 }),
        adminService.getAdminActions({ limit: 20 }),
        adminService.getSystemHealth()
      ]);

      setAnalytics(analyticsData);
      setActivityLogs(logsData);
      setAdminActions(actionsData);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    // In a real implementation, this would generate and download reports
    console.log(`Exporting ${type} report for period ${selectedPeriod}`);
    alert(`${type} report export started. You'll receive an email when ready.`);
  };

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'User Analytics', icon: UserGroupIcon },
    { id: 'tasks', name: 'Task Reports', icon: BriefcaseIcon },
    { id: 'revenue', name: 'Revenue Analysis', icon: CurrencyDollarIcon },
    { id: 'activity', name: 'Activity Logs', icon: ClockIcon },
    { id: 'system', name: 'System Health', icon: ExclamationTriangleIcon }
  ];

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  if (loading) {
    return (
      <AdminLayout title="Reports & Analytics" subtitle="Advanced reporting and system insights">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reports & Analytics" subtitle="Advanced reporting and system insights">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedReport === type.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedReport(type.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.name}
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportReport(selectedReport)}
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Report */}
        {selectedReport === 'overview' && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* User Metrics */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.userMetrics.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analytics.userMetrics.workers} workers, {analytics.userMetrics.employers} employers
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant={analytics.userMetrics.growthRate >= 0 ? 'success' : 'error'} size="sm">
                  {analytics.userMetrics.growthRate >= 0 ? '+' : ''}{analytics.userMetrics.growthRate}% growth
                </Badge>
              </div>
            </Card>

            {/* Task Metrics */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.taskMetrics.totalTasks}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analytics.taskMetrics.completionRate}% completion rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant={analytics.taskMetrics.growthRate >= 0 ? 'success' : 'error'} size="sm">
                  {analytics.taskMetrics.growthRate >= 0 ? '+' : ''}{analytics.taskMetrics.growthRate}% growth
                </Badge>
              </div>
            </Card>

            {/* Revenue Metrics */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics.revenueMetrics.totalRevenue?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Net: ${analytics.revenueMetrics.netRevenue?.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant={analytics.revenueMetrics.growthRate >= 0 ? 'success' : 'error'} size="sm">
                  {analytics.revenueMetrics.growthRate >= 0 ? '+' : ''}{analytics.revenueMetrics.growthRate}% growth
                </Badge>
              </div>
            </Card>

            {/* Engagement Metrics */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.engagementMetrics.avgRating}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analytics.engagementMetrics.totalReviews} reviews
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="info" size="sm">
                  {analytics.engagementMetrics.notificationReadRate}% read rate
                </Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Activity Logs Report */}
        {selectedReport === 'activity' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity Logs</h3>
              <Button variant="outline" size="sm" onClick={() => exportReport('activity')}>
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
            
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.severity === 'error' ? 'bg-red-500' :
                    log.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.timeAgo}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" size="sm">{log.category}</Badge>
                      {log.user && (
                        <span className="text-xs text-gray-500">by {log.user}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* System Health Report */}
        {selectedReport === 'system' && systemHealth && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Overall Health</span>
                  <Badge 
                    variant={
                      systemHealth.overall.status === 'healthy' ? 'success' :
                      systemHealth.overall.status === 'warning' ? 'warning' : 'error'
                    }
                  >
                    {systemHealth.overall.score}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Database</span>
                  <Badge variant={systemHealth.database.status === 'healthy' ? 'success' : 'warning'}>
                    {systemHealth.database.responseTime}ms
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">API Response</span>
                  <Badge variant={systemHealth.api.status === 'healthy' ? 'success' : 'warning'}>
                    {systemHealth.api.responseTime}ms
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Storage</span>
                  <Badge variant="success">
                    {systemHealth.storage.usagePercent}% used
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {analytics?.performanceMetrics && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                      <span className="text-sm text-gray-900">{analytics.performanceMetrics.cpuUsage}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                      <span className="text-sm text-gray-900">{analytics.performanceMetrics.memoryUsage}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Active Connections</span>
                      <span className="text-sm text-gray-900">{analytics.performanceMetrics.activeConnections}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Error Rate</span>
                      <span className="text-sm text-gray-900">{analytics.performanceMetrics.errorRate}%</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Admin Actions Report */}
        {selectedReport === 'activity' && adminActions.length > 0 && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Actions Audit Trail</h3>
            <div className="space-y-4">
              {adminActions.map((action) => (
                <div key={action.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{action.action}</p>
                      <p className="text-xs text-gray-500">{action.timeAgo}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">by {action.admin}</span>
                      {action.targetType && (
                        <Badge variant="outline" size="sm">{action.targetType}</Badge>
                      )}
                      {action.reason && (
                        <span className="text-xs text-gray-500">Reason: {action.reason}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;