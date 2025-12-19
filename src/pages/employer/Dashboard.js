import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  UsersIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import { employerService } from '../../services/employerService';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState({
    activeTasks: 0,
    pendingReviews: 0,
    completedTasks: 0,
    totalSpent: 0,
    activeWorkers: 0,
    avgCompletionTime: '0 days'
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Check if we have user data and profile
      if (!user?.id) {
        console.log('No user ID found, waiting for auth...');
        return;
      }

      // Check user type from profile first, then fallback to user object
      const userType = profile?.user_type || user?.user_type;
      if (userType !== 'employer') {
        console.log('User is not an employer:', userType);
        setError('Access denied. This dashboard is for employers only.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching dashboard data for employer:', user.id);
        
        const [dashboardStats, tasksData] = await Promise.all([
          employerService.getDashboardStats(user.id),
          employerService.getRecentTasks(user.id, 4)
        ]);

        console.log('Dashboard stats:', dashboardStats);
        console.log('Recent tasks:', tasksData);

        setStats(dashboardStats);
        setRecentTasks(tasksData);
      } catch (err) {
        console.error('Error fetching employer dashboard data:', err);
        setError('Failed to load dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'completed':
        return <Badge variant="default" size="sm">Completed</Badge>;
      case 'paused':
        return <Badge variant="warning" size="sm">Paused</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-xl">
                <BriefcaseIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-secondary-900">
                  Employer Dashboard
                </h1>
                <p className="text-secondary-600 mt-2 text-lg">
                  Manage your tasks and review submissions
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/employer/create-task')}
              className="bg-gradient-to-r from-primary-600 to-primary-700"
              size="lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-success-600 bg-success-100 px-2 py-1 rounded-full">
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
              {stats.pendingReviews}
            </div>
            <div className="text-sm text-secondary-600">Pending Reviews</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-info-600 bg-info-100 px-2 py-1 rounded-full">
                Done
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-secondary-600">Completed Tasks</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                Spent
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              ${stats.totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Total Spent</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
                Workers
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.activeWorkers}
            </div>
            <div className="text-sm text-secondary-600">Active Workers</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-success-600 bg-success-100 px-2 py-1 rounded-full">
                Avg
              </span>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {stats.avgCompletionTime}
            </div>
            <div className="text-sm text-secondary-600">Avg Completion</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/employer/create-task')}
            variant="outline" 
            className="flex items-center justify-center p-6 h-auto"
          >
            <PlusIcon className="w-6 h-6 mr-2" />
            <span>Create New Task</span>
          </Button>
          <Button 
            onClick={() => navigate('/employer/review-submissions')}
            variant="outline" 
            className="flex items-center justify-center p-6 h-auto"
          >
            <DocumentTextIcon className="w-6 h-6 mr-2" />
            <span>Review Submissions</span>
          </Button>
          <Button 
            onClick={() => navigate('/employer/my-tasks')}
            variant="outline" 
            className="flex items-center justify-center p-6 h-auto"
          >
            <BriefcaseIcon className="w-6 h-6 mr-2" />
            <span>My Tasks</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center p-6 h-auto"
          >
            <ChartBarIcon className="w-6 h-6 mr-2" />
            <span>View Analytics</span>
          </Button>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl shadow-xl">
          <div className="p-6 border-b border-secondary-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-secondary-900">Recent Tasks</h3>
              <Button 
                onClick={() => navigate('/employer/my-tasks')}
                variant="outline" 
                size="sm"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                      <BriefcaseIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">{task.title}</div>
                      <div className="text-sm text-secondary-600">
                        {task.submissions} submissions • {task.pending} pending review
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-secondary-900">${task.budget}</div>
                      <div className="text-sm text-secondary-600">Budget</div>
                    </div>
                    {getStatusBadge(task.status)}
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

export default EmployerDashboard;