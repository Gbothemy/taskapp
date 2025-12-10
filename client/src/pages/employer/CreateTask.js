import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createTask } from '../../store/slices/taskSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(createTask(data)).unwrap();
      toast.success('Task created successfully!');
      navigate('/my-tasks');
    } catch (error) {
      toast.error(error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-2">
            Post a task and get quality work done by skilled workers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 200, message: 'Title must be less than 200 characters' },
              })}
              className="input-field"
              placeholder="Enter a clear, descriptive title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input-field"
            >
              <option value="">Select a category</option>
              <option value="data-entry">Data Entry</option>
              <option value="content">Content Creation</option>
              <option value="review">Review & Feedback</option>
              <option value="research">Research</option>
              <option value="testing">Testing</option>
              <option value="design">Design</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                maxLength: { value: 2000, message: 'Description must be less than 2000 characters' },
              })}
              rows={4}
              className="input-field"
              placeholder="Provide a clear description of what needs to be done"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Instructions *
            </label>
            <textarea
              {...register('instructions', {
                required: 'Instructions are required',
                maxLength: { value: 5000, message: 'Instructions must be less than 5000 characters' },
              })}
              rows={6}
              className="input-field"
              placeholder="Provide step-by-step instructions for completing this task"
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payout per Task ($) *
              </label>
              <input
                {...register('payoutPerTask', {
                  required: 'Payout is required',
                  min: { value: 0.01, message: 'Minimum payout is $0.01' },
                })}
                type="number"
                step="0.01"
                className="input-field"
                placeholder="5.00"
              />
              {errors.payoutPerTask && (
                <p className="mt-1 text-sm text-red-600">{errors.payoutPerTask.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Tasks Needed *
              </label>
              <input
                {...register('totalTasksNeeded', {
                  required: 'Number of tasks is required',
                  min: { value: 1, message: 'Minimum 1 task required' },
                })}
                type="number"
                className="input-field"
                placeholder="10"
              />
              {errors.totalTasksNeeded && (
                <p className="mt-1 text-sm text-red-600">{errors.totalTasksNeeded.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline *
            </label>
            <input
              {...register('deadline', { required: 'Deadline is required' })}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Proof Type *
            </label>
            <select
              {...register('requiredProofType', { required: 'Proof type is required' })}
              className="input-field"
            >
              <option value="">Select proof type</option>
              <option value="text">Text Description</option>
              <option value="image">Image/Screenshot</option>
              <option value="url">URL/Link</option>
              <option value="file">File Upload</option>
            </select>
            {errors.requiredProofType && (
              <p className="mt-1 text-sm text-red-600">{errors.requiredProofType.message}</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Requirements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Approval Rate (%)
                </label>
                <input
                  {...register('qualityRequirements.minApprovalRate')}
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Worker Level
                </label>
                <select
                  {...register('qualityRequirements.workerLevel')}
                  className="input-field"
                  defaultValue="1"
                >
                  <option value="1">Level 1 (Beginner)</option>
                  <option value="2">Level 2 (Intermediate)</option>
                  <option value="3">Level 3 (Advanced)</option>
                  <option value="4">Level 4 (Expert)</option>
                  <option value="5">Level 5 (Master)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Task...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;