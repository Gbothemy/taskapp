import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  CurrencyDollarIcon, 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ClockIcon,
  EyeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/users/dashboard/stats'),
          api.get('/tasks/my/tasks'),
        ]);

        setStats(statsRes.data.stats);
        setRecentTasks(tasksRes.data.tasks || []);
        
        // Mock pending submissions for demo
        setPendingSubmissions([
          {
            id: '1',
            taskTitle: 'Website Review',
            workerName: 'John Worker',
            submittedAt: new Date().toISOString(),
            amount: 15.00,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Tasks',
      value: stats?.activeTasks || 0,
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Spent',
      value: `$${stats?.totalSpent?.toFixed(2) || '0.00'}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: CheckCircleIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge-info',
      active: 'badge-success',
      paused: 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge-error',
    };
    return badges[status] || 'badge-info';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your tasks and review worker submissions.
            </p>
          </div>
          <Link
            to="/create-task"
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Task
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <Link
                to="/my-tasks"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks created yet</p>
                  <Link
                    to="/create-task"
                    className="btn-primary mt-4 inline-flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </Link>
                </div>
              ) : (
                recentTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`badge ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {task.completedTasks}/{task.totalTasksNeeded} completed
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${task.payoutPerTask}
                      </span>
                      <Link
                        to={`/tasks/${task.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Submissions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Reviews</h2>
              <Link
                to="/review-submissions"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Review all
              </Link>
            </div>
            <div className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending submissions</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Worker submissions will appear here for review
                  </p>
                </div>
              ) : (
                pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{submission.taskTitle}</h3>
                      <p className="text-sm text-gray-600">
                        by {submission.workerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${submission.amount}
                      </span>
                      <Link
                        to="/review-submissions"
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/create-task"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Task</h3>
            <p className="text-gray-600 text-sm">Post a new task and start getting work done</p>
          </Link>

          <Link
            to="/review-submissions"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Review Work</h3>
            <p className="text-gray-600 text-sm">Review and approve worker submissions</p>
          </Link>

          <Link
            to="/wallet"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Funds</h3>
            <p className="text-gray-600 text-sm">Add funds and manage your spending</p>
          </Link>
        </div>

        {/* Task Performance Chart Placeholder */}
        <div className="mt-8 card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Performance</h2>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-2">📊</div>
              <p className="text-gray-500">Performance charts coming soon</p>
              <p className="text-sm text-gray-400">Track your task completion rates and worker performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;