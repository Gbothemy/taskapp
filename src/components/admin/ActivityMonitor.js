import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import adminService from '../../services/adminService';

const ActivityMonitor = ({ className = '', autoRefresh = true, limit = 20 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadActivities();
    
    if (autoRefresh) {
      const interval = setInterval(loadActivities, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    }
  }, [filter, autoRefresh]);

  const loadActivities = async () => {
    try {
      const filters = {
        limit,
        category: filter !== 'all' ? filter : undefined
      };
      
      const data = await adminService.getActivityLogs(filters);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (category, severity) => {
    if (severity === 'error' || severity === 'critical') {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
    if (severity === 'warning') {
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    }
    if (category === 'auth') {
      return <UserIcon className="w-5 h-5 text-blue-500" />;
    }
    if (severity === 'success') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
  };

  const getActivityColor = (severity) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'auth', label: 'Authentication' },
    { value: 'task', label: 'Tasks' },
    { value: 'payment', label: 'Payments' },
    { value: 'admin', label: 'Admin Actions' },
    { value: 'system', label: 'System Events' }
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ClockIcon className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Activity Monitor</h3>
          {autoRefresh && (
            <Badge variant="success" size="sm">Live</Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadActivities}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No activities found</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`border-l-4 p-4 rounded-r-lg ${getActivityColor(activity.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.category, activity.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge variant="outline" size="sm">
                      {activity.category}
                    </Badge>
                    
                    {activity.user && activity.user !== 'System' && (
                      <span className="text-xs text-gray-500">
                        by {activity.user}
                      </span>
                    )}
                    
                    {!activity.success && (
                      <Badge variant="error" size="sm">
                        Failed
                      </Badge>
                    )}
                  </div>
                  
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        View details
                      </summary>
                      <pre className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Showing {activities.length} recent activities</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ActivityMonitor;