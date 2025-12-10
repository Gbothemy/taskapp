import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { fetchTaskById, submitTask, clearCurrentTask } from '../../store/slices/taskSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTask, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [dispatch, id]);

  const handleSubmitTask = async (data) => {
    setSubmitting(true);
    try {
      const proofData = {
        type: currentTask.requiredProofType,
        content: data.content,
      };

      await dispatch(submitTask({ taskId: id, proofData })).unwrap();
      toast.success('Task submitted successfully!');
      navigate('/my-submissions');
    } catch (error) {
      toast.error(error || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'data-entry': 'bg-blue-100 text-blue-800',
      'content': 'bg-purple-100 text-purple-800',
      'review': 'bg-green-100 text-green-800',
      'research': 'bg-yellow-100 text-yellow-800',
      'testing': 'bg-red-100 text-red-800',
      'design': 'bg-pink-100 text-pink-800',
      'other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getProofIcon = (type) => {
    switch (type) {
      case 'image':
        return PhotoIcon;
      case 'text':
        return DocumentTextIcon;
      case 'url':
        return LinkIcon;
      case 'file':
        return PaperClipIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due Today', color: 'text-red-600' };
    if (diffDays === 1) return { text: 'Due Tomorrow', color: 'text-yellow-600' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h2>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/tasks')}
            className="btn-primary"
          >
            Browse Tasks
          </button>
        </div>
      </div>
    );
  }

  const deadline = formatDeadline(currentTask.deadline);
  const ProofIcon = getProofIcon(currentTask.requiredProofType);
  const remainingTasks = currentTask.totalTasksNeeded - currentTask.completedTasks;
  const canSubmit = remainingTasks > 0 && currentTask.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Tasks
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`badge ${getCategoryColor(currentTask.category)}`}>
                  {currentTask.category.replace('-', ' ')}
                </span>
                <span className={`text-sm font-medium ${deadline.color}`}>
                  {deadline.text}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentTask.title}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                ${currentTask.payoutPerTask}
              </div>
              <div className="text-sm text-gray-600">per task</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{currentTask.description}</p>
            </div>

            {/* Instructions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{currentTask.instructions}</p>
              </div>
            </div>

            {/* Submission Form */}
            {canSubmit && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Submit Your Work</h2>
                  {!showSubmissionForm && (
                    <button
                      onClick={() => setShowSubmissionForm(true)}
                      className="btn-primary"
                    >
                      Start Submission
                    </button>
                  )}
                </div>

                {showSubmissionForm && (
                  <form onSubmit={handleSubmit(handleSubmitTask)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ProofIcon className="h-4 w-4 inline mr-1" />
                        Required Proof: {currentTask.requiredProofType}
                      </label>
                      
                      {currentTask.requiredProofType === 'text' && (
                        <textarea
                          {...register('content', {
                            required: 'Please provide your work details',
                            minLength: {
                              value: 10,
                              message: 'Please provide at least 10 characters',
                            },
                          })}
                          rows={6}
                          className="input-field"
                          placeholder="Describe your completed work in detail..."
                        />
                      )}

                      {currentTask.requiredProofType === 'url' && (
                        <input
                          {...register('content', {
                            required: 'Please provide a valid URL',
                            pattern: {
                              value: /^https?:\/\/.+/,
                              message: 'Please enter a valid URL starting with http:// or https://',
                            },
                          })}
                          type="url"
                          className="input-field"
                          placeholder="https://example.com/your-work"
                        />
                      )}

                      {currentTask.requiredProofType === 'image' && (
                        <div>
                          <input
                            {...register('content', {
                              required: 'Please provide an image URL or description',
                            })}
                            type="text"
                            className="input-field"
                            placeholder="Image URL or description of uploaded image"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            For demo purposes, please provide an image URL or description
                          </p>
                        </div>
                      )}

                      {currentTask.requiredProofType === 'file' && (
                        <div>
                          <input
                            {...register('content', {
                              required: 'Please provide file details or URL',
                            })}
                            type="text"
                            className="input-field"
                            placeholder="File URL or description of uploaded file"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            For demo purposes, please provide a file URL or description
                          </p>
                        </div>
                      )}

                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex items-center"
                      >
                        {submitting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Task'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSubmissionForm(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!canSubmit && (
              <div className="card p-6 bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  Task Not Available
                </h3>
                <p className="text-yellow-700">
                  {remainingTasks <= 0 
                    ? 'This task has been completed by other workers.'
                    : 'This task is currently not accepting submissions.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Payout</span>
                  </div>
                  <span className="font-semibold">${currentTask.payoutPerTask}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Remaining</span>
                  </div>
                  <span className="font-semibold">{remainingTasks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Deadline</span>
                  </div>
                  <span className={`font-semibold ${deadline.color}`}>
                    {new Date(currentTask.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <ProofIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Proof Type</span>
                  </div>
                  <span className="font-semibold capitalize">
                    {currentTask.requiredProofType}
                  </span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min Approval Rate</span>
                  <span className="font-semibold">
                    {currentTask.qualityRequirements?.minApprovalRate || 80}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Worker Level</span>
                  <span className="font-semibold">
                    Level {currentTask.qualityRequirements?.workerLevel || 1}+
                  </span>
                </div>
              </div>
              
              {user?.workerStats && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your Approval Rate</span>
                      <span className={`font-semibold ${
                        user.workerStats.approvalRate >= (currentTask.qualityRequirements?.minApprovalRate || 80)
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {user.workerStats.approvalRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your Level</span>
                      <span className={`font-semibold ${
                        user.workerStats.level >= (currentTask.qualityRequirements?.workerLevel || 1)
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Level {user.workerStats.level}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span>{currentTask.completedTasks} / {currentTask.totalTasksNeeded}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(currentTask.completedTasks / currentTask.totalTasksNeeded) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((currentTask.completedTasks / currentTask.totalTasksNeeded) * 100)}% complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;