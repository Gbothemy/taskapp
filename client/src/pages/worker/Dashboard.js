import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  StarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const WorkerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = React.useState(null);
  const [recentSubmissions, setRecentSubmissions] = React.useState([]);
  const [availableTasks, setAvailableTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, submissionsRes, tasksRes] = await Promise.all([
          api.get('/users/dashboard/stats'),
          api.get('/tasks/my/submissions?limit=5'),
          api.get('/tasks?limit=6'),
        ]);

        setStats(statsRes.data.stats);
        setRecentSubmissions(submissionsRes.data.submissions || []);
        setAvailableTasks(tasksRes.data.tasks || []);
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
      title: 'Total Earnings',
      value: `$${stats?.totalEarnings?.toFixed(2) || '0.00'}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Today\'s Earnings',
      value: `$${stats?.todayEarnings?.toFixed(2) || '0.00'}`,
      icon: ArrowTrendingUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Tasks',
      value: stats?.pendingTasks || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Completed Tasks',
      value: stats?.tasksCompleted || 0,
      icon: CheckCircleIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-error',
    };
    return badges[status] || 'badge-info';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your task completion overview and earnings summary.
          </p>
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

        {/* Worker Level & Progress */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Worker Progress</h2>
            <div className="flex items-center space-x-2">
              <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">Level {stats?.level || 1}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {stats?.approvalRate?.toFixed(1) || '100.0'}%
              </div>
              <div className="text-sm text-gray-600">Approval Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {stats?.tasksCompleted || 0}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${stats?.pendingEarnings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-600">Pending Earnings</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
              <Link
                to="/my-submissions"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No submissions yet</p>
              ) : (
                recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {submission.task?.title || 'Task'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getStatusBadge(submission.status)}`}>
                        {submission.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${submission.payoutDetails?.workerEarning?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Tasks */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Available Tasks</h2>
              <Link
                to="/tasks"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Browse all
              </Link>
            </div>
            <div className="space-y-4">
              {availableTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tasks available</p>
              ) : (
                availableTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{task.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary-600">
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
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/tasks"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Tasks</h3>
            <p className="text-gray-600 text-sm">Find new tasks to complete and earn money</p>
          </Link>

          <Link
            to="/wallet"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Wallet</h3>
            <p className="text-gray-600 text-sm">View balance and withdraw earnings</p>
          </Link>

          <Link
            to="/profile"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <StarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Update Profile</h3>
            <p className="text-gray-600 text-sm">Improve your worker profile and stats</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;