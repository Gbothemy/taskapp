import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tasksService, categoriesService } from '../../services/supabase';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FileUpload from '../../components/ui/FileUpload';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    reward_amount: '',
    deadline: '',
    difficulty_level: 'medium',
    requirements: '',
    deliverables: ''
  });

  useEffect(() => {
    loadTaskAndCategories();
  }, [id]);

  const loadTaskAndCategories = async () => {
    try {
      setLoading(true);
      
      const [taskData, categoriesData] = await Promise.all([
        tasksService.getTaskById(id),
        categoriesService.getCategories()
      ]);
      
      // Check if user owns this task
      if (taskData.employer_id !== user?.id) {
        toast.error('You can only edit your own tasks');
        navigate('/employer/my-tasks');
        return;
      }
      
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        category_id: taskData.category_id || '',
        reward_amount: taskData.reward_amount || '',
        deadline: taskData.deadline ? taskData.deadline.split('T')[0] : '',
        difficulty_level: taskData.difficulty_level || 'medium',
        requirements: taskData.requirements || '',
        deliverables: Array.isArray(taskData.deliverables) 
          ? taskData.deliverables.join('\n') 
          : taskData.deliverables || ''
      });
      
      setAttachments(taskData.attachments || []);
      setCategories(categoriesData || []);
      
    } catch (error) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task details');
      navigate('/employer/my-tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to edit a task');
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.description || !formData.reward_amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const taskData = {
        ...formData,
        reward_amount: parseFloat(formData.reward_amount),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        attachments,
        deliverables: formData.deliverables ? formData.deliverables.split('\n').filter(d => d.trim()) : [],
        updated_at: new Date().toISOString()
      };

      await tasksService.updateTask(id, taskData);
      
      toast.success('Task updated successfully!');
      navigate('/employer/my-tasks');
      
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error(error.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
          <p className="mt-2 text-gray-600">
            Update your task details and requirements
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a clear, descriptive title for your task"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Amount ($) *
                </label>
                <input
                  type="number"
                  name="reward_amount"
                  value={formData.reward_amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide a detailed description of what you need done..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="List any specific requirements, skills, or qualifications needed..."
              />
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Deliverables
              </label>
              <textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe what you expect to receive upon completion..."
              />
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <FileUpload
                onFileSelect={(files) => setAttachments(prev => [...prev, ...files])}
                multiple={true}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 text-xs font-medium">
                            {file.name?.split('.').pop()?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employer/my-tasks')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? <LoadingSpinner size="sm" /> : 'Update Task'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditTask;