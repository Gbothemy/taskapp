import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tasksService, submissionsService, analyticsService } from '../../services/supabase';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const ReviewSubmissions = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const [reviewData, setReviewData] = useState({
    feedback: '',
    rating: 5
  });

  useEffect(() => {
    if (user) {
      loadTasks();
      analyticsService.trackPageView('/employer/review-submissions', 'Review Submissions');
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const data = await tasksService.getUserTasks(user.id);
      const tasksWithSubmissions = data.filter(task => 
        task.submissions && task.submissions.length > 0
      );
      setTasks(tasksWithSubmissions);
      
      if (tasksWithSubmissions.length > 0) {
        setSelectedTask(tasksWithSubmissions[0]);
        loadSubmissions(tasksWithSubmissions[0].id);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (taskId) => {
    try {
      const taskData = await tasksService.getTaskById(taskId);
      setSubmissions(taskData.submissions || []);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    loadSubmissions(task.id);
    setReviewingSubmission(null);
  };

  const startReview = (submission) => {
    setReviewingSubmission(submission);
    setReviewData({
      feedback: submission.feedback || '',
      rating: submission.rating || 5
    });
  };

  const submitReview = async (submissionId, status) => {
    try {
      await submissionsService.updateSubmissionStatus(
        submissionId,
        status,
        reviewData.feedback,
        reviewData.rating
      );

      // Track analytics
      await analyticsService.trackTaskInteraction('reviewed', selectedTask.id, {
        status,
        rating: reviewData.rating
      });

      toast.success(`Submission ${status} successfully!`);
      
      // Reload submissions
      loadSubmissions(selectedTask.id);
      setReviewingSubmission(null);
      setReviewData({ feedback: '', rating: 5 });
    } catch (error) {
      console.error('Failed to update submission:', error);
      toast.error('Failed to update submission');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Submissions</h1>
          <p className="text-gray-600 mt-2">
            Review and approve worker submissions for your tasks
          </p>
        </div>

        {tasks.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions to review</h3>
            <p className="text-gray-500 mb-6">
              You don't have any tasks with submissions yet. Create tasks to start receiving submissions.
            </p>
            <Button onClick={() => navigate('/employer/create-task')}>
              Create Task
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task List */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Tasks with Submissions
                </h2>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskSelect(task)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedTask?.id === task.id
                          ? 'bg-primary-50 border-2 border-primary-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {task.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="primary">
                          {task.submissions?.length || 0} submission{(task.submissions?.length || 0) !== 1 ? 's' : ''}
                        </Badge>
                        <span className="text-gray-500">
                          ${task.reward_amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Submissions List */}
            <div className="lg:col-span-2">
              {selectedTask && (
                <Card className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedTask.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>${selectedTask.reward_amount}</span>
                      <span>•</span>
                      <span>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                {submission.worker?.full_name?.charAt(0) || 'W'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {submission.worker?.full_name || 'Worker'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Submitted {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {submission.submission_text}
                          </p>
                        </div>

                        {/* Files */}
                        {submission.submission_files && submission.submission_files.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Attached Files</h4>
                            <div className="space-y-2">
                              {submission.submission_files.map((file, index) => (
                                <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                  >
                                    Download
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        {submission.submission_links && submission.submission_links.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Links</h4>
                            <div className="space-y-2">
                              {submission.submission_links.map((link, index) => (
                                <a
                                  key={index}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-primary-600 hover:text-primary-700 text-sm"
                                >
                                  {link}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Review Section */}
                        {submission.status === 'pending' && (
                          <div className="border-t pt-4">
                            {reviewingSubmission?.id === submission.id ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feedback
                                  </label>
                                  <textarea
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                                    rows={3}
                                    placeholder="Provide feedback to the worker..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating (1-5 stars)
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                                        className={`w-8 h-8 ${
                                          star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                      >
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      </button>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                      ({reviewData.rating}/5)
                                    </span>
                                  </div>
                                </div>

                                <div className="flex space-x-3">
                                  <Button
                                    onClick={() => submitReview(submission.id, 'approved')}
                                    variant="success"
                                    size="sm"
                                  >
                                    Approve & Pay
                                  </Button>
                                  <Button
                                    onClick={() => submitReview(submission.id, 'rejected')}
                                    variant="error"
                                    size="sm"
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => setReviewingSubmission(null)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                onClick={() => startReview(submission)}
                                size="sm"
                              >
                                Review Submission
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Existing Review */}
                        {submission.status !== 'pending' && (submission.feedback || submission.rating) && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Your Review</h4>
                            {submission.feedback && (
                              <p className="text-gray-700 text-sm mb-2">{submission.feedback}</p>
                            )}
                            {submission.rating && (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < submission.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">({submission.rating}/5)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissions;