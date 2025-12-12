// Test serverless functions locally
const express = require('express');

// Test the auth function
console.log('Testing auth serverless function...');
try {
  const authApp = require('./api/auth.js');
  console.log('✅ Auth function loaded successfully');
} catch (error) {
  console.error('❌ Auth function failed:', error.message);
}

// Test the tasks function
console.log('Testing tasks serverless function...');
try {
  const tasksApp = require('./api/tasks.js');
  console.log('✅ Tasks function loaded successfully');
} catch (error) {
  console.error('❌ Tasks function failed:', error.message);
}

// Test the health function
console.log('Testing health serverless function...');
try {
  const healthApp = require('./api/health.js');
  console.log('✅ Health function loaded successfully');
} catch (error) {
  console.error('❌ Health function failed:', error.message);
}

console.log('Local serverless function test completed.');