// Serverless function for users
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import database configuration
const { connectDatabase, getDatabase } = require('../server/config/database');

const app = express();

// Initialize database connection
connectDatabase();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://taskapp-gbothemy.vercel.app', 
      'https://taskapp.vercel.app', 
      'https://taskappv1.vercel.app',
      /^https:\/\/taskapp.*\.vercel\.app$/
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    callback(null, isAllowed || true);
  },
  credentials: true
}));

app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'taskapp_super_secret_jwt_key_2024_development', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Get user from database
    const db = getDatabase();
    let user = null;
    
    if (db.type === 'demo') {
      user = db.data.users.find(u => u.id === decoded.userId);
    } else if (db.type === 'supabase') {
      user = await db.service.getUserById(decoded.userId);
    }
    
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  });
};

// Get user profile
app.get('/profile', authenticateToken, (req, res) => {
  const { password, password_hash, ...userResponse } = req.user;
  res.json({ user: userResponse });
});

// Update user profile
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const db = getDatabase();

    if (db.type === 'demo') {
      const user = db.data.users.find(u => u.id === req.user.id);
      if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        const { password, password_hash, ...userResponse } = user;
        res.json({ message: 'Profile updated successfully', user: userResponse });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else if (db.type === 'supabase') {
      const updatedUser = await db.service.updateUser(req.user.id, {
        first_name: firstName,
        last_name: lastName
      });
      const { password_hash, ...userResponse } = updatedUser;
      res.json({ message: 'Profile updated successfully', user: userResponse });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Get dashboard stats
app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    let stats = {};

    if (req.user.role === 'worker') {
      if (db.type === 'demo') {
        const submissions = db.data.submissions.filter(s => s.workerId === req.user.id);
        const approvedSubmissions = submissions.filter(s => s.status === 'approved');
        const pendingSubmissions = submissions.filter(s => s.status === 'pending');
        
        stats = {
          totalEarnings: approvedSubmissions.reduce((sum, s) => sum + (s.payoutDetails?.workerEarning || 0), 0),
          todayEarnings: 0, // Would need date filtering
          pendingEarnings: pendingSubmissions.reduce((sum, s) => sum + (s.payoutDetails?.workerEarning || 0), 0),
          tasksCompleted: approvedSubmissions.length,
          pendingTasks: pendingSubmissions.length,
          approvalRate: req.user.workerStats?.approvalRate || 100,
          level: req.user.workerStats?.level || 1
        };
      } else if (db.type === 'supabase') {
        stats = await db.service.getWorkerStats(req.user.id);
      }
    } else if (req.user.role === 'employer') {
      if (db.type === 'demo') {
        const tasks = db.data.tasks.filter(t => t.employerId === req.user.id);
        const submissions = db.data.submissions.filter(s => s.employerId === req.user.id);
        
        stats = {
          tasksPosted: tasks.length,
          activeTasks: tasks.filter(t => t.status === 'active').length,
          totalSpent: tasks.reduce((sum, t) => sum + (t.payoutPerTask * (t.approvedTasks || 0)), 0),
          pendingReviews: submissions.filter(s => s.status === 'pending').length,
          completedTasks: tasks.reduce((sum, t) => sum + (t.completedTasks || 0), 0)
        };
      } else if (db.type === 'supabase') {
        stats = await db.service.getEmployerStats(req.user.id);
      }
    }

    res.json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

// Export for Vercel serverless
module.exports = app;