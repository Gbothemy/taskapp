const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const db = getDatabase();
    let stats = {};

    if (db.type === 'demo') {
      const users = db.data.users;
      const tasks = db.data.tasks;
      const submissions = db.data.submissions;
      const transactions = db.data.transactions;

      // User statistics
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.status === 'active').length;
      const workers = users.filter(u => u.role === 'worker').length;
      const employers = users.filter(u => u.role === 'employer').length;

      // Task statistics
      const totalTasks = tasks.length;
      const activeTasks = tasks.filter(t => t.status === 'active').length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;

      // Submission statistics
      const totalSubmissions = submissions.length;
      const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
      const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;
      const rejectedSubmissions = submissions.filter(s => s.status === 'rejected').length;

      // Financial statistics
      const totalTransactions = transactions.length;
      const totalVolume = transactions
        .filter(t => t.type === 'task_payment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      const platformFees = transactions
        .filter(t => t.type === 'platform_fee' && t.status === 'completed')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentUsers = users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;
      const recentTasks = tasks.filter(t => new Date(t.createdAt) >= thirtyDaysAgo).length;
      const recentTransactions = transactions.filter(t => new Date(t.createdAt) >= thirtyDaysAgo).length;

      stats = {
        users: {
          total: totalUsers,
          active: activeUsers,
          workers,
          employers,
          recent: recentUsers
        },
        tasks: {
          total: totalTasks,
          active: activeTasks,
          completed: completedTasks,
          recent: recentTasks
        },
        submissions: {
          total: totalSubmissions,
          pending: pendingSubmissions,
          approved: approvedSubmissions,
          rejected: rejectedSubmissions,
          approvalRate: totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0
        },
        financial: {
          totalVolume,
          platformFees,
          totalTransactions,
          recent: recentTransactions
        }
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const db = getDatabase();
    let users = [];

    if (db.type === 'demo') {
      users = db.data.users.filter(user => {
        if (role && user.role !== role) return false;
        if (status && user.status !== status) return false;
        if (search) {
          const searchLower = search.toLowerCase();
          return user.firstName.toLowerCase().includes(searchLower) ||
                 user.lastName.toLowerCase().includes(searchLower) ||
                 user.email.toLowerCase().includes(searchLower);
        }
        return true;
      });

      // Remove passwords from response
      users = users.map(({ password, ...user }) => user);

      // Sort by creation date (newest first)
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = users.slice(startIndex, endIndex);

      res.json({
        users: paginatedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(users.length / limit),
          totalUsers: users.length,
          hasNext: endIndex < users.length,
          hasPrev: startIndex > 0
        }
      });
    } else {
      res.json({ users: [], pagination: {} });
    }
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Update user status
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const db = getDatabase();

    if (db.type === 'demo') {
      const user = db.data.users.find(u => u.id === id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.status = status;

      // Emit real-time notification to user
      const io = req.app.get('io');
      io.to(`user_${id}`).emit('account_status_changed', {
        status,
        message: `Your account status has been changed to ${status}`
      });

      const { password, ...userResponse } = user;
      res.json({
        message: 'User status updated successfully',
        user: userResponse
      });
    } else {
      res.status(501).json({ message: 'Not implemented for this database mode' });
    }
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const db = getDatabase();
    let tasks = [];

    if (db.type === 'demo') {
      tasks = db.data.tasks.filter(task => {
        if (status && task.status !== status) return false;
        if (category && task.category !== category) return false;
        return true;
      });

      // Add employer information
      tasks = tasks.map(task => {
        const employer = db.data.users.find(u => u.id === task.employerId);
        return {
          ...task,
          employer: employer ? {
            id: employer.id,
            firstName: employer.firstName,
            lastName: employer.lastName,
            email: employer.email
          } : null
        };
      });

      // Sort by creation date (newest first)
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      res.json({
        tasks: paginatedTasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(tasks.length / limit),
          totalTasks: tasks.length,
          hasNext: endIndex < tasks.length,
          hasPrev: startIndex > 0
        }
      });
    } else {
      res.json({ tasks: [], pagination: {} });
    }
  } catch (error) {
    console.error('Get admin tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Get pending submissions for review
router.get('/submissions/pending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const db = getDatabase();
    let submissions = [];

    if (db.type === 'demo') {
      submissions = db.data.submissions.filter(s => s.status === 'pending');

      // Add task and worker information
      submissions = submissions.map(submission => {
        const task = db.data.tasks.find(t => t.id === submission.taskId);
        const worker = db.data.users.find(u => u.id === submission.workerId);
        const employer = db.data.users.find(u => u.id === submission.employerId);

        return {
          ...submission,
          task: task ? {
            id: task.id,
            title: task.title,
            category: task.category
          } : null,
          worker: worker ? {
            id: worker.id,
            firstName: worker.firstName,
            lastName: worker.lastName,
            email: worker.email
          } : null,
          employer: employer ? {
            id: employer.id,
            firstName: employer.firstName,
            lastName: employer.lastName,
            email: employer.email
          } : null
        };
      });

      // Sort by submission date (oldest first for review queue)
      submissions.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedSubmissions = submissions.slice(startIndex, endIndex);

      res.json({
        submissions: paginatedSubmissions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(submissions.length / limit),
          totalSubmissions: submissions.length,
          hasNext: endIndex < submissions.length,
          hasPrev: startIndex > 0
        }
      });
    } else {
      res.json({ submissions: [], pagination: {} });
    }
  } catch (error) {
    console.error('Get pending submissions error:', error);
    res.status(500).json({ message: 'Server error fetching pending submissions' });
  }
});

module.exports = router;