import React, { useEffect, useState } from 'react';
import { 
  ClipboardDocumentListIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/tasks', { params: filters });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getProgressPercentage = (task) => {
    return task.totalTasksNeeded > 0 ? (task.completedTasks / task.totalTasksNeeded) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all tasks on the platform.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="data-entry">Data Entry</option>
              <option value="content">Content Creation</option>
              <option value="review">Review & Feedback</option>
              <option value="research">Research</option>
              <option value="testing">Testing</option>
              <option value="design">Design</option>
              <option value="other">Other</option>
            </select>
            
            <button
              onClick={() => setFilters({ status: '', category: '', page: 1, limit: 20 })}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-12 text-center">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`badge ${getCategoryColor(task.category)}`}>
                        {task.category?.replace('-', ' ')}
                      </span>
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">
                      ${task.payoutPerTask}
                    </div>
                    <div className="text-sm text-gray-600">per task</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                {/* Employer Info */}
                {task.employer && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium">Employer:</span> {task.employer.firstName} {task.employer.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{task.employer.email}</div>
                  </div>
                )}

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {task.completedTasks} / {task.totalTasksNeeded}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(task)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {task.approvedTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Approved</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {(task.completedTasks || 0) - (task.approvedTasks || 0) - (task.rejectedTasks || 0)}
                    </div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">
                      {task.rejectedTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Rejected</div>
                  </div>
                </div>

                {/* Task Details */}
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div>
                    <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Proof Type:</span> {task.requiredProofType}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="btn-outline flex-1 text-center flex items-center justify-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;