import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import { employerService } from '../../services/employerService';
import TaskDebugInfo from '../../components/debug/TaskDebugInfo';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);
  
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id || profile?.user_type !== 'employer') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const filters = {
          status: filterStatus,
          category: filterCategory,
          search: searchTerm
        };
        const tasksData = await employerService.getEmployerTasks(user.id, filters);
        console.log('Loaded tasks:', tasksData);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching employer tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, searchTerm, filterStatus, filterCategory]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'completed':
        return <Badge variant="default" size="sm">Completed</Badge>;
      case 'paused':
        return <Badge variant="warning" size="sm">Paused</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      console.log('Task action:', action, 'for task:', taskId);
      
      switch (action) {
        case 'view':
          console.log('Navigating to task detail view:', `/employer/task/${taskId}`);
          navigate(`/employer/task/${taskId}`);
          break;
        case 'edit':
          console.log('Navigating to task edit:', `/employer/edit-task/${taskId}`);
          navigate(`/employer/edit-task/${taskId}`);
          break;
        case 'pause':
          await employerService.updateTaskStatus(taskId, 'paused');
          setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, status: 'paused' } : task
          ));
          toast.success('Task paused successfully');
          break;
        case 'resume':
          await employerService.updateTaskStatus(taskId, 'active');
          setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, status: 'active' } : task
          ));
          toast.success('Task resumed successfully');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this task?')) {
            await employerService.deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
            toast.success('Task deleted successfully');
          }
          break;
        default:
          console.warn('Unknown task action:', action);
          break;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task: ' + error.message);
    }
  };

  // Redirect if user is not an employer
  if (user && profile && profile.user_type !== 'employer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-warning-500" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Access Denied</h2>
          <p className="text-secondary-600">This page is only accessible to employers.</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="mt-4"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Error Loading Tasks</h2>
          <p className="text-secondary-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalBudget = tasks.reduce((sum, task) => sum + task.budget, 0);
  const activeTasks = tasks.filter(task => task.status === 'active').length;
  const totalSubmissions = tasks.reduce((sum, task) => sum + task.submissions, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-xl">
                <BriefcaseIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-secondary-900">
                  My Tasks
                </h1>
                <p className="text-secondary-600 mt-2 text-lg">
                  Manage and monitor your posted tasks
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/employer/create-task')}
                className="bg-gradient-to-r from-primary-600 to-primary-700"
                size="lg"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Task
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  onClick={() => navigate('/debug/tasks')}
                  variant="outline"
                  size="lg"
                >
                  Debug Test
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {activeTasks}
            </div>
            <div className="text-sm text-secondary-600">Active Tasks</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              ${totalBudget}
            </div>
            <div className="text-sm text-secondary-600">Total Budget</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {totalSubmissions}
            </div>
            <div className="text-sm text-secondary-600">Total Submissions</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {tasks.length}
            </div>
            <div className="text-sm text-secondary-600">Total Tasks</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="Data Entry">Data Entry</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Survey">Survey</option>
                <option value="Moderation">Moderation</option>
                <option value="Writing">Writing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-secondary-900">{task.title}</h3>
                    {getStatusBadge(task.status)}
                  </div>
                  <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    <span className="bg-secondary-100 px-2 py-1 rounded-full">
                      {task.category}
                    </span>
                    <span>Budget: ${task.budget}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-secondary-50 rounded-xl">
                  <div className="text-2xl font-bold text-secondary-900">{task.submissions}</div>
                  <div className="text-xs text-secondary-600">Submissions</div>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-xl">
                  <div className="text-2xl font-bold text-secondary-900">{task.workers}</div>
                  <div className="text-xs text-secondary-600">Workers</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">Progress</span>
                  <span className="text-secondary-900 font-semibold">{task.completionRate}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
                <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <span className="text-success-600">{task.approved} approved</span>
                  <span className="text-warning-600">{task.pending} pending</span>
                  <span className="text-error-600">{task.rejected} rejected</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleTaskAction(task.id, 'view')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {task.status === 'active' ? (
                  <Button
                    onClick={() => handleTaskAction(task.id, 'pause')}
                    variant="outline"
                    size="sm"
                    className="text-warning-600 border-warning-600 hover:bg-warning-50"
                  >
                    Pause
                  </Button>
                ) : task.status === 'paused' ? (
                  <Button
                    onClick={() => handleTaskAction(task.id, 'resume')}
                    variant="outline"
                    size="sm"
                    className="text-success-600 border-success-600 hover:bg-success-50"
                  >
                    Resume
                  </Button>
                ) : null}
                <Button
                  onClick={() => handleTaskAction(task.id, 'edit')}
                  variant="outline"
                  size="sm"
                  className="text-info-600 border-info-600 hover:bg-info-50"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Debug Info - Remove in production */}
              <TaskDebugInfo task={task} showDetails={process.env.NODE_ENV === 'development'} />
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-secondary-400" />
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No tasks found</h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first task to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <Button 
                onClick={() => navigate('/employer/create-task')}
                className="bg-gradient-to-r from-primary-600 to-primary-700"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Task
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default MyTasks;