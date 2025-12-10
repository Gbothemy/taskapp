// Test script for serverless functions
const express = require('express');
const authFunction = require('./api/auth');
const healthFunction = require('./api/health');

const app = express();

// Mount the serverless functions
app.use('/api/auth', authFunction);
app.get('/api/health', healthFunction);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Testing serverless functions on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Auth: http://localhost:${PORT}/api/auth/login`);
});