import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MobileNav from '../../components/layout/MobileNav';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const filters = {
          role: filterRole,
          status: filterStatus,
          search: searchTerm
        };
        const usersData = await adminService.getAllUsers(filters);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, filterRole, filterStatus]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'worker':
        return <Badge variant="info" size="sm">Worker</Badge>;
      case 'employer':
        return <Badge variant="primary" size="sm">Employer</Badge>;
      case 'admin':
        return <Badge variant="warning" size="sm">Admin</Badge>;
      default:
        return <Badge variant="default" size="sm">{role}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'suspended':
        return <Badge variant="error" size="sm">Suspended</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'inactive':
        return <Badge variant="default" size="sm">Inactive</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'activate':
          await adminService.updateUserStatus(userId, 'active');
          setUsers(users.map(user => 
            user.id === userId ? { ...user, status: 'active' } : user
          ));
          toast.success('User activated successfully');
          break;
        case 'suspend':
          await adminService.updateUserStatus(userId, 'suspended');
          setUsers(users.map(user => 
            user.id === userId ? { ...user, status: 'suspended' } : user
          ));
          toast.success('User suspended successfully');
          break;
        case 'delete':
          await adminService.deleteUser(userId);
          setUsers(users.filter(user => user.id !== userId));
          toast.success('User deleted successfully');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-info-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-info-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-xl">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-secondary-900">
                User Management
              </h1>
              <p className="text-secondary-600 mt-2 text-lg">
                Manage platform users and their permissions
              </p>
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
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-secondary-600">Active Users</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <div className="text-sm text-secondary-600">Pending Approval</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-error-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {users.filter(u => u.status === 'suspended').length}
            </div>
            <div className="text-sm text-secondary-600">Suspended</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-secondary-900 mb-1">
              {users.length}
            </div>
            <div className="text-sm text-secondary-600">Total Users</div>
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
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="worker">Workers</option>
                <option value="employer">Employers</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-secondary-200/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-secondary-200/50">
            <h3 className="text-lg font-bold text-secondary-900">Users ({filteredUsers.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-secondary-900">{user.name}</div>
                          <div className="text-sm text-secondary-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-secondary-900">Joined {new Date(user.joinDate).toLocaleDateString()}</div>
                        <div className="text-secondary-600">Last active: {user.lastActive}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {user.role === 'worker' ? (
                          <>
                            <div className="text-secondary-900">{user.tasksCompleted} tasks completed</div>
                            <div className="text-secondary-600">${user.earnings} earned</div>
                          </>
                        ) : (
                          <>
                            <div className="text-secondary-900">{user.tasksPosted} tasks posted</div>
                            <div className="text-secondary-600">${user.totalSpent} spent</div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.status === 'suspended' ? (
                          <Button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            variant="outline"
                            size="sm"
                            className="text-success-600 border-success-600 hover:bg-success-50"
                          >
                            Activate
                          </Button>
                        ) : user.status === 'active' ? (
                          <Button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            variant="outline"
                            size="sm"
                            className="text-warning-600 border-warning-600 hover:bg-warning-50"
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            variant="outline"
                            size="sm"
                            className="text-success-600 border-success-600 hover:bg-success-50"
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-secondary-600"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </Button>
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

export default UserManagement;