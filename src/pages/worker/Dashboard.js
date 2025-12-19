import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { fetchMySubmissions } from '../../store/slices/taskSlice';
import { fetchWallet } from '../../store/slices/walletSlice';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import MobileNav from '../../components/layout/MobileNav';

const WorkerDashboard = () => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  const { mySubmissions } = useSelector((state) => state.tasks);
  const { wallet } = useSelector((state) => state.wallet);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMySubmissions(user.id));
      dispatch(fetchWallet(user.id));
    }
  }, [dispatch, user?.id]);

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }
    return `$${Number(value).toFixed(2)}`;
  };

  const stats = [
    {
      title: 'Available Balance',
      value: formatCurrency(wallet?.balance),
      icon: CurrencyDollarIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      title: 'Total Earned',
      value: formatCurrency(wallet?.totalEarned),
      icon: TrophyIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      title: 'Tasks Completed',
      value: profile?.tasks_completed || 0,
      icon: CheckCircleIcon,
      color: 'text-info-600',
      bgColor: 'bg-info-100'
    },
    {
      title: 'Pending Submissions',
      value: mySubmissions?.filter(s => s.status === 'pending').length || 0,
      icon: ClockIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    }
  ];

  const recentSubmissions = mySubmissions?.slice(0, 5) || [];

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      under_review: 'info',
      approved: 'success',
      rejected: 'error',
      revision_requested: 'warning'
    };
    return variants[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Review',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      revision_requested: 'Revision Requested'
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0) || 'W'}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                Welcome back, {profile?.full_name || 'Worker'}!
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Here's your activity overview and recent submissions
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-secondary-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-black text-secondary-900">{stat.value}</p>
                </div>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-1">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (parseInt(stat.value) || 0) * 10)}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-secondary-900">Recent Submissions</h2>
                <Link
                  to="/my-submissions"
                  className="text-primary-600 hover:text-primary-500 font-semibold text-sm flex items-center bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary-100 transition-all duration-300"
                >
                  View All
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-gradient-to-r from-white to-primary-50/30 border border-primary-200/50 rounded-xl p-6 hover:shadow-lg hover:scale-102 transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-secondary-900 text-lg group-hover:text-primary-700 transition-colors">
                          {submission.task?.title}
                        </h3>
                        <Badge variant={getStatusBadge(submission.status)}>
                          {getStatusText(submission.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-success-600">Reward: ${submission.task?.reward_amount}</span>
                        <span className="text-secondary-500">Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ClipboardDocumentListIcon className="w-10 h-10 text-primary-600" />
                  </div>
                  <p className="text-secondary-600 mb-6 text-lg">No submissions yet</p>
                  <Button size="lg">
                    <Link to="/tasks">Browse Available Tasks</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-secondary-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link to="/tasks" className="block">
                  <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl hover:from-primary-100 hover:to-secondary-100 transition-all duration-300 group border border-primary-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">Browse Tasks</div>
                      <div className="text-sm text-secondary-600">Find new opportunities</div>
                    </div>
                  </div>
                </Link>
                <Link to="/wallet" className="block">
                  <div className="flex items-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl hover:from-success-100 hover:to-success-200 transition-all duration-300 group border border-success-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CurrencyDollarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-secondary-900 group-hover:text-success-700 transition-colors">Manage Wallet</div>
                      <div className="text-sm text-secondary-600">View earnings & payments</div>
                    </div>
                  </div>
                </Link>
                <Link to="/profile" className="block">
                  <div className="flex items-center p-4 bg-gradient-to-r from-info-50 to-info-100 rounded-xl hover:from-info-100 hover:to-info-200 transition-all duration-300 group border border-info-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <TrophyIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-secondary-900 group-hover:text-info-700 transition-colors">Update Profile</div>
                      <div className="text-sm text-secondary-600">Enhance your profile</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-secondary-900 mb-6">Profile Strength</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200/50">
                  <span className="text-sm font-semibold text-secondary-700">Profile Photo</span>
                  <CheckCircleIcon className="w-6 h-6 text-success-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200/50">
                  <span className="text-sm font-semibold text-secondary-700">Skills Listed</span>
                  <CheckCircleIcon className="w-6 h-6 text-success-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200/50">
                  <span className="text-sm font-semibold text-secondary-700">Account Status</span>
                  <CheckCircleIcon className="w-6 h-6 text-success-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200/50">
                  <span className="text-sm font-semibold text-secondary-700">Portfolio Items</span>
                  <ClockIcon className="w-6 h-6 text-warning-500" />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-secondary-700">Profile Completion</span>
                  <span className="text-sm font-bold text-primary-600">75%</span>
                </div>
                <div className="bg-secondary-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-secondary-500 mt-2">Complete your profile to get more opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default WorkerDashboard;