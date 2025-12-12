// Test script for unified API functions
const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('Testing unified API functions...');
  console.log('Base URL:', BASE_URL);

  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('Health check:', healthResponse.data);

    // Test auth endpoints
    console.log('\n2. Testing auth endpoints...');
    
    // Test login with demo user
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'worker@taskapp.com',
      password: 'worker123'
    });
    console.log('Login successful:', loginResponse.data.message);
    
    const token = loginResponse.data.accessToken;
    console.log('Access token received');

    // Test tasks endpoint
    console.log('\n3. Testing tasks endpoint...');
    const tasksResponse = await axios.get(`${BASE_URL}/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Tasks fetched:', tasksResponse.data.tasks?.length || 0, 'tasks');

    // Test protected route
    console.log('\n4. Testing protected route...');
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('User profile:', meResponse.data.user.email);

    console.log('\n✅ All API tests passed!');
    
  } catch (error) {
    console.error('\n❌ API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run tests
testAPI();