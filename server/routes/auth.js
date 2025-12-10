const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register
router.post('/register', [
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
    } else if (db.type === 'mongodb') {
      const User = require('../models/User');
      existingUser = await User.findOne({ email });
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
    } else if (db.type === 'mongodb') {
      const User = require('../models/User');
      newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      });
      await newUser.save();
      newUser = newUser.toObject();
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
    const { password: _, ...userResponse } = newUser;

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
router.post('/login', [
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
    } else if (db.type === 'mongodb') {
      const User = require('../models/User');
      user = await User.findOne({ email });
    } else if (db.type === 'supabase') {
      user = await db.service.getUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash || user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account suspended or banned' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Update last login
    if (db.type === 'demo') {
      user.lastLogin = new Date();
    } else if (db.type === 'mongodb') {
      const User = require('../models/User');
      await User.findByIdAndUpdate(user.id, { lastLogin: new Date() });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

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
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
router.get('/me', authenticateToken, (req, res) => {
  const { password, ...userResponse } = req.user;
  res.json({ user: userResponse });
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;