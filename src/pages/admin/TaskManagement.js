import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const TaskManagement = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const filters = {
          status: filterStatus,
          priority: filterPriority,
          search: searchTerm
        };
        const tasksData = await adminService.getAllTasks(filters);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchTerm, filterStatus, filterPriority]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'completed':
        return <Badge variant="default" size="sm">Completed</Badge>;
      case 'paused':
        return <Badge variant="warning" size="sm">Paused</Badge>;
      case 'flagged':
        return <Badge variant="error" size="sm">Flagged</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error" size="sm">High</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'low':
        return <Badge variant="default" size="sm">Low</Badge>;
      default:
        return <Badge variant="default" size="sm">{priority}</Badge>;
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      switch (action) {
        case 'approve':
        case 'pause':
        case 'complete':
          await adminService.updateTaskStatus(taskId, action === 'approve' ? 'active' : action === 'pause' ? 'paused' : 'completed');
          setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, status: action === 'approve' ? 'active' : action === 'pause' ? 'paused' : 'completed' } : task
          ));
          toast.success(`Task ${action}d successfully`);
          break;
        case 'delete':
          await adminService.deleteTask(taskId);
          setTasks(tasks.filter(task => task.id !== taskId));
          toast.success('Task deleted successfully');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Error Loading Tasks</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
              <BriefcaseIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                Task Management
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Monitor and manage all platform tasks
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-success-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {tasks.filter(t => t.status === 'active').length}
            </div>
            <div className="text-sm text-secondary-600">Active Tasks</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {tasks.filter(t => t.status === 'paused').length}
            </div>
            <div className="text-sm text-secondary-600">Paused</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-error-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {tasks.filter(t => t.status === 'flagged').length}
            </div>
            <div className="text-sm text-secondary-600">Flagged</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-secondary-600">Completed</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
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
                  placeholder="Search tasks by title, employer, or category..."
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
                <option value="flagged">Flagged</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-secondary-200/50">
            <h3 className="text-lg font-bold text-secondary-900">Tasks ({filteredTasks.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-secondary-900">{task.title}</div>
                        <div className="text-sm text-secondary-600">
                          {task.employer} • {task.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(task.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-secondary-900">${task.budget}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-secondary-900">{task.submissions} submissions</div>
                        <div className="text-secondary-600">
                          {task.flagged > 0 && (
                            <span className="text-error-600">{task.flagged} flagged</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          variant="outline"
                          size="sm"
                          className="text-info-600 border-info-600 hover:bg-info-50"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        {task.status === 'flagged' ? (
                          <Button
                            onClick={() => handleTaskAction(task.id, 'approve')}
                            variant="outline"
                            size="sm"
                            className="text-success-600 border-success-600 hover:bg-success-50"
                          >
                            Approve
                          </Button>
                        ) : task.status === 'active' ? (
                          <Button
                            onClick={() => handleTaskAction(task.id, 'pause')}
                            variant="outline"
                            size="sm"
                            className="text-warning-600 border-warning-600 hover:bg-warning-50"
                          >
                            Pause
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleTaskAction(task.id, 'approve')}
                            variant="outline"
                            size="sm"
                            className="text-success-600 border-success-600 hover:bg-success-50"
                          >
                            Resume
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default TaskManagement;