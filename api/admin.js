// Serverless function for admin
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

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get admin dashboard stats
app.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    let stats = {};

    if (db.type === 'demo') {
      const users = db.data.users;
      const tasks = db.data.tasks;
      const submissions = db.data.submissions;
      const transactions = db.data.transactions;

      stats = {
        users: {
          total: users.length,
          active: users.filter(u => u.status === 'active').length,
          workers: users.filter(u => u.role === 'worker').length,
          employers: users.filter(u => u.role === 'employer').length,
          recent: users.filter(u => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(u.createdAt) > thirtyDaysAgo;
          }).length
        },
        tasks: {
          total: tasks.length,
          active: tasks.filter(t => t.status === 'active').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          recent: tasks.filter(t => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(t.createdAt) > thirtyDaysAgo;
          }).length
        },
        submissions: {
          total: submissions.length,
          pending: submissions.filter(s => s.status === 'pending').length,
          approved: submissions.filter(s => s.status === 'approved').length,
          rejected: submissions.filter(s => s.status === 'rejected').length,
          approvalRate: submissions.length > 0 ? (submissions.filter(s => s.status === 'approved').length / submissions.length) * 100 : 0
        },
        financial: {
          totalVolume: transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
          platformFees: transactions.filter(t => t.type === 'platform_fee').reduce((sum, t) => sum + Math.abs(t.amount), 0),
          totalTransactions: transactions.length,
          recent: transactions.filter(t => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(t.createdAt) > thirtyDaysAgo;
          }).length
        }
      };
    } else if (db.type === 'supabase') {
      stats = await db.service.getAdminStats();
    }

    res.json({ stats });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
});

// Get all users (admin only)
app.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    let users = [];

    if (db.type === 'demo') {
      users = db.data.users.map(user => {
        const { password, password_hash, ...userResponse } = user;
        return userResponse;
      });
    } else if (db.type === 'supabase') {
      // Would need to implement in supabase service
      users = [];
    }

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Export for Vercel serverless
module.exports = app;