import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { fetchMySubmissions } from '../../store/slices/taskSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MySubmissions = () => {
  const dispatch = useDispatch();
  const { mySubmissions, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMySubmissions());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-error',
    };
    return badges[status] || 'badge-info';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'border-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-2">
            Track the status of your submitted tasks and view feedback.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{mySubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mySubmissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mySubmissions.filter(s => s.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mySubmissions.filter(s => s.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {mySubmissions.length === 0 ? (
          <div className="card p-12 text-center">
            <EyeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-600 mb-6">
              Start completing tasks to see your submissions here.
            </p>
            <a
              href="/tasks"
              className="btn-primary"
            >
              Browse Available Tasks
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {mySubmissions.map((submission) => (
              <div key={submission.id} className={`card border-l-4 ${getStatusColor(submission.status)}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(submission.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.task?.title || 'Task'}
                        </h3>
                        <span className={`badge ${getStatusBadge(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-medium capitalize">
                            {submission.task?.category?.replace('-', ' ') || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-medium">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Earnings</p>
                          <p className="font-medium text-primary-600">
                            ${submission.payoutDetails?.workerEarning?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>

                      {/* Proof Data */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Your Submission:</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm">
                            <span className="font-medium">Type:</span> {submission.proofData?.type}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Content:</span> {submission.proofData?.content}
                          </p>
                        </div>
                      </div>

                      {/* Review Feedback */}
                      {submission.review && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Employer Feedback:</p>
                          <div className="bg-blue-50 rounded-lg p-3">
                            {submission.review.rating && (
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium mr-2">Rating:</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < submission.review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            )}
                            {submission.review.feedback && (
                              <p className="text-sm">{submission.review.feedback}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-primary-600">
                        ${submission.payoutDetails?.amount?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">Total Payout</div>
                      {submission.reviewedAt && (
                        <div className="text-xs text-gray-500 mt-2">
                          Reviewed: {new Date(submission.reviewedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;