import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tasksService } from '../../services/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  PencilIcon, 
  EyeIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TaskDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await tasksService.getTaskById(id);
      
      // Check if user owns this task
      if (data.employer_id !== user?.id) {
        toast.error('You can only view your own tasks');
        navigate('/employer/my-tasks');
        return;
      }
      
      // Transform data to ensure compatibility
      const transformedTask = {
        ...data,
        category: data.categories || data.category,
        submissions: data.task_submissions || []
      };
      
      setTask(transformedTask);
    } catch (error) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task details');
      navigate('/employer/my-tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/employer/my-tasks')}>
            Back to My Tasks
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/employer/my-tasks')}
            className="flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to My Tasks</span>
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
                  {task.category?.name || task.categories?.name || 'Uncategorized'}
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
                  <CurrencyDollarIcon className="w-5 h-5" />
                  <span className="font-semibold text-green-600">${task.reward_amount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>Posted {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                </div>
                {task.deadline && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate(`/employer/edit-task/${task.id}`)}
                variant="outline"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit Task
              </Button>
              <Button
                onClick={() => navigate('/employer/review-submissions')}
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                View Submissions
              </Button>
            </div>
          </div>

            {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {task.submissions?.length || task.task_submissions?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${task.reward_amount}
              </div>
              <div className="text-sm text-gray-500">Reward</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 capitalize">
                {task.status}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 capitalize">
                {task.difficulty_level}
              </div>
              <div className="text-sm text-gray-500">Difficulty</div>
            </div>
          </div>
        </Card>

        {/* Task Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>
            </Card>

            {/* Requirements */}
            {task.requirements && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{task.requirements}</p>
              </Card>
            )}

            {/* Deliverables */}
            {task.deliverables && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expected Deliverables</h3>
                {Array.isArray(task.deliverables) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {task.deliverables.map((deliverable, index) => (
                      <li key={index} className="text-gray-700">{deliverable}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{task.deliverables}</p>
                )}
              </Card>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {task.attachments.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/employer/edit-task/${task.id}`)}
                  className="w-full"
                  variant="outline"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
                <Button
                  onClick={() => navigate('/employer/review-submissions')}
                  className="w-full"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Review Submissions
                </Button>
                {task.status === 'active' && (
                  <Button
                    onClick={() => toast('Pause task functionality coming soon!')}
                    className="w-full"
                    variant="outline"
                  >
                    Pause Task
                  </Button>
                )}
              </div>
            </Card>

            {/* Task Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                {task.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="text-gray-900">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{task.category?.name || task.categories?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="text-gray-900 capitalize">{task.difficulty_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <Badge variant={task.status === 'active' ? 'success' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;