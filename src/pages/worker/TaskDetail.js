import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tasksService, submissionsService, analyticsService } from '../../services/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FileUpload from '../../components/ui/FileUpload';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useSelector(state => state.auth);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [attachments, setAttachments] = useState([]);
  
  const [submissionData, setSubmissionData] = useState({
    submissionText: '',
    links: []
  });

  useEffect(() => {
    if (id) {
      loadTask();
      analyticsService.trackPageView(`/tasks/${id}`, 'Task Detail');
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTask = async () => {
    try {
      const data = await tasksService.getTaskById(id);
      setTask(data);
    } catch (error) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submissionData.submissionText.trim()) {
      toast.error('Please provide your submission details');
      return;
    }

    setSubmitting(true);
    
    try {
      const submission = {
        submissionText: submissionData.submissionText,
        files: attachments.map(file => ({
          name: file.name,
          url: file.url,
          size: file.size,
          type: file.type
        })),
        links: submissionData.links.filter(link => link.trim())
      };

      await submissionsService.submitTask(id, submission);
      
      // Track analytics
      await analyticsService.trackTaskInteraction('submitted', id, {
        submission_length: submissionData.submissionText.length,
        files_count: attachments.length
      });

      toast.success('Submission sent successfully!');
      navigate('/my-submissions');
    } catch (error) {
      console.error('Failed to submit task:', error);
      toast.error(error.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUploaded = (files) => {
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setSubmissionData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const updateLink = (index, value) => {
    setSubmissionData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? value : link)
    }));
  };

  const removeLink = (index) => {
    setSubmissionData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tasks')}>
            Browse Tasks
          </Button>
        </Card>
      </div>
    );
  }

  const canSubmit = profile?.user_type === 'worker' && task.status === 'active';
  const hasSubmitted = task.submissions?.some(sub => sub.worker_id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/tasks')}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Tasks</span>
          </Button>
        </div>

        {/* Task Header */}
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Badge 
                  variant={task.difficulty_level === 'easy' ? 'success' : task.difficulty_level === 'medium' ? 'warning' : 'error'}
                >
                  {task.difficulty_level}
                </Badge>
                <Badge variant="primary">
                  {task.category?.name}
                </Badge>
                <Badge variant={task.status === 'active' ? 'success' : 'secondary'}>
                  {task.status}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {task.title}
              </h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-semibold text-green-600">${task.reward_amount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{task.employer?.full_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Posted {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ${task.reward_amount}
              </div>
              <div className="text-sm text-gray-500">
                {task.submissions?.length || 0} submission{(task.submissions?.length || 0) !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Task Description */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Requirements */}
          {task.requirements && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{task.requirements}</p>
            </div>
          )}

          {/* Deliverables */}
          {task.deliverables && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Expected Deliverables</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{task.deliverables}</p>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
              <div className="space-y-2">
                {task.attachments.map((file, index) => (
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

          {/* Deadline */}
          {task.deadline && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-yellow-800">
                  Deadline: {new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Submission Status */}
        {hasSubmitted && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900">Submission Sent</h3>
                <p className="text-blue-700">You have already submitted work for this task. Check your submissions page for status updates.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Submission Form */}
        {canSubmit && !hasSubmitted && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Your Work</h2>
              {!showSubmissionForm && (
                <Button onClick={() => setShowSubmissionForm(true)}>
                  Start Submission
                </Button>
              )}
            </div>

            {showSubmissionForm && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Submission Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Work *
                  </label>
                  <textarea
                    value={submissionData.submissionText}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, submissionText: e.target.value }))}
                    rows={6}
                    placeholder="Describe what you've completed, how you approached the task, and any important details..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* File Uploads */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <FileUpload
                    onFileUploaded={handleFileUploaded}
                    multiple={true}
                    folder="submissions"
                    className="mb-4"
                  />
                  
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Links (Optional)
                    </label>
                    <Button type="button" variant="outline" size="sm" onClick={addLink}>
                      Add Link
                    </Button>
                  </div>
                  
                  {submissionData.links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateLink(index, e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSubmissionForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="min-w-[120px]"
                  >
                    {submitting ? <LoadingSpinner size="sm" /> : 'Submit Work'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {/* Not Eligible Message */}
        {!canSubmit && !hasSubmitted && (
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {profile?.user_type !== 'worker' ? 'Worker Account Required' : 'Task Not Available'}
            </h3>
            <p className="text-gray-600">
              {profile?.user_type !== 'worker' 
                ? 'You need a worker account to submit work for tasks.'
                : 'This task is no longer accepting submissions.'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
     