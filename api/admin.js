// Serverless function for admin - uses same server logic
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');

// Import server routes and database configuration
const adminRoutes = require('../server/routes/admin');
const { connectDatabase } = require('../server/config/database');

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

// Use server admin routes
app.use('/api/admin', adminRoutes);

// Handle admin routes at root level for serverless
app.use('/', adminRoutes);

// Export for Vercel serverless
module.exports = app;