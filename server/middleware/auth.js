const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const db = getDatabase();
    let user = null;

    if (db.type === 'demo') {
      user = db.data.users.find(u => u.id === decoded.userId);
    } else if (db.type === 'mongodb') {
      const User = require('../models/User');
      user = await User.findById(decoded.userId).select('-password');
    } else if (db.type === 'supabase') {
      const { data } = await db.connection
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();
      user = data;
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account suspended or banned' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

const requireWorker = requireRole(['worker']);
const requireEmployer = requireRole(['employer']);
const requireAdmin = requireRole(['admin']);
const requireEmployerOrAdmin = requireRole(['employer', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireWorker,
  requireEmployer,
  requireAdmin,
  requireEmployerOrAdmin
};