import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { fetchMyTasks } from '../../store/slices/taskSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MyTasks = () => {
  const dispatch = useDispatch();
  const { myTasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

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

  const getProgressPercentage = (task) => {
    return task.totalTasksNeeded > 0 ? (task.completedTasks / task.totalTasksNeeded) * 100 : 0;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-2">
              Manage your posted tasks and track their progress.
            </p>
          </div>
          <Link to="/create-task" className="btn-primary flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Task
          </Link>
        </div>

        {myTasks.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks created yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first task to start getting work done by skilled workers.
            </p>
            <Link to="/create-task" className="btn-primary inline-flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myTasks.map((task) => (
              <div key={task.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {task.category?.replace('-', ' ')}
                      </span>
                    </div>
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

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {task.completedTasks} / {task.totalTasksNeeded} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(task)}%` }}
                    />
                  </div>
                </div>

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

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                  <span>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="btn-outline flex-1 text-center flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                  {task.status === 'active' && (
                    <Link
                      to="/review-submissions"
                      className="btn-primary flex-1 text-center"
                    >
                      Review Submissions
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;