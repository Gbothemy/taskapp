const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const { password, ...userProfile } = req.user;
  res.json({ user: userProfile });
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('bio').optional().isLength({ max: 500 }),
  body('location').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, bio, location } = req.body;
    const db = getDatabase();

    if (db.type === 'demo') {
      const user = db.data.users.find(u => u.id === req.user.id);
      if (user) {
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        
        const { password, ...updatedUser } = user;
        res.json({ 
          message: 'Profile updated successfully',
          user: updatedUser 
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      // MongoDB/Supabase implementation would go here
      res.status(501).json({ message: 'Not implemented for this database mode' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Update password
router.put('/password', authenticateToken, [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    if (db.type === 'demo') {
      const user = db.data.users.find(u => u.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedNewPassword;

      res.json({ message: 'Password updated successfully' });
    } else {
      // MongoDB/Supabase implementation would go here
      res.status(501).json({ message: 'Not implemented for this database mode' });
    }
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// Get user by ID (public profile)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    let user = null;
    if (db.type === 'demo') {
      user = db.data.users.find(u => u.id === id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only public information
    const publicProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      workerStats: user.workerStats,
      employerStats: user.employerStats,
      createdAt: user.createdAt
    };

    res.json({ user: publicProfile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// Get user dashboard stats
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};

    if (db.type === 'demo') {
      if (userRole === 'worker') {
        const submissions = db.data.submissions.filter(s => s.workerId === userId);
        const approvedSubmissions = submissions.filter(s => s.status === 'approved');
        const pendingSubmissions = submissions.filter(s => s.status === 'pending');
        
        const totalEarnings = approvedSubmissions.reduce((sum, s) => sum + s.payoutDetails.workerEarning, 0);
        const todayEarnings = approvedSubmissions
          .filter(s => new Date(s.reviewedAt).toDateString() === new Date().toDateString())
          .reduce((sum, s) => sum + s.payoutDetails.workerEarning, 0);

        stats = {
          totalEarnings,
          todayEarnings,
          pendingEarnings: pendingSubmissions.reduce((sum, s) => sum + s.payoutDetails.workerEarning, 0),
          tasksCompleted: approvedSubmissions.length,
          pendingTasks: pendingSubmissions.length,
          approvalRate: req.user.workerStats?.approvalRate || 100,
          level: req.user.workerStats?.level || 1
        };
      } else if (userRole === 'employer') {
        const tasks = db.data.tasks.filter(t => t.employerId === userId);
        const submissions = db.data.submissions.filter(s => s.employerId === userId);
        const pendingSubmissions = submissions.filter(s => s.status === 'pending');

        stats = {
          tasksPosted: tasks.length,
          activeTasks: tasks.filter(t => t.status === 'active').length,
          totalSpent: req.user.wallet?.totalSpent || 0,
          pendingReviews: pendingSubmissions.length,
          completedTasks: tasks.reduce((sum, t) => sum + t.completedTasks, 0)
        };
      }
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

module.exports = router;