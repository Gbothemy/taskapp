// Serverless function for authentication
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

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

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'taskapp_super_secret_jwt_key_2024_development',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'taskapp_super_secret_refresh_key_2024_development',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

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

// Register
app.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('role').isIn(['worker', 'employer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role } = req.body;
    const db = getDatabase();

    // Check if user already exists
    let existingUser = null;
    if (db.type === 'demo') {
      existingUser = db.data.users.find(u => u.email === email);
    } else if (db.type === 'supabase') {
      existingUser = await db.service.getUserByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    let newUser = null;
    if (db.type === 'demo') {
      const userId = String(db.data.users.length + 1);
      newUser = {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        status: 'active',
        wallet: {
          balance: 0,
          pendingEarnings: 0,
          totalEarned: 0,
          totalSpent: 0
        },
        workerStats: role === 'worker' ? {
          tasksCompleted: 0,
          approvalRate: 100,
          level: 1,
          badges: []
        } : undefined,
        employerStats: role === 'employer' ? {
          tasksPosted: 0,
          totalSpent: 0
        } : undefined,
        createdAt: new Date()
      };
      db.data.users.push(newUser);
    } else if (db.type === 'supabase') {
      newUser = await db.service.createUser({
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser.id);

    // Remove password from response
    const { password: _, password_hash: __, ...userResponse } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const db = getDatabase();

    // Find user
    let user = null;
    if (db.type === 'demo') {
      user = db.data.users.find(u => u.email === email);
    } else if (db.type === 'supabase') {
      user = await db.service.getUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const passwordField = user.password_hash || user.password;
    const isValidPassword = await bcrypt.compare(password, passwordField);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account suspended or banned' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Remove password from response
    const { password: _, password_hash: __, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Refresh token
app.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'taskapp_super_secret_refresh_key_2024_development');
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Get current user
app.get('/me', authenticateToken, (req, res) => {
  const { password, password_hash, ...userResponse } = req.user;
  res.json({ user: userResponse });
});

// Logout (client-side token removal)
app.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'auth',
    database: process.env.DATABASE_MODE || 'demo'
  });
});

// Export for Vercel serverless
module.exports = app;