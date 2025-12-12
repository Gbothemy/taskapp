// Serverless function for payments
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

// Get wallet balance
app.get('/wallet', authenticateToken, (req, res) => {
  const wallet = req.user.wallet || {
    balance: 0,
    pendingEarnings: 0,
    totalEarned: 0,
    totalSpent: 0
  };
  
  res.json({ wallet });
});

// Get transaction history
app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    let transactions = [];

    if (db.type === 'demo') {
      transactions = db.data.transactions.filter(t => t.userId === req.user.id);
    } else if (db.type === 'supabase') {
      const result = await db.service.getTransactionsByUser(req.user.id, req.query);
      transactions = result.transactions;
    }

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
});

// Placeholder for payment processing endpoints
app.post('/withdraw', authenticateToken, (req, res) => {
  res.status(501).json({ message: 'Withdrawal functionality not implemented yet' });
});

app.post('/deposit', authenticateToken, (req, res) => {
  res.status(501).json({ message: 'Deposit functionality not implemented yet' });
});

// Export for Vercel serverless
module.exports = app;