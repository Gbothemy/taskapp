#!/usr/bin/env node

// Load environment variables from server/.env
require('dotenv').config({ path: './server/.env' });

const { supabase } = require('./server/config/supabase');

async function testDatabase() {
  console.log('🔍 Testing Supabase Database Connection');
  console.log('=====================================\n');

  try {
    // Test basic connection
    console.log('1. Testing connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.log('❌ Connection failed:', healthError.message);
      return;
    }
    console.log('✅ Connection successful');

    // Test if users table exists and has demo data
    console.log('\n2. Checking demo users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, role')
      .in('email', ['worker@taskapp.com', 'employer@taskapp.com', 'admin@taskapp.com']);

    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
      console.log('\n🔧 Solution: Run the database schema in Supabase SQL Editor');
      console.log('   File: database/supabase-schema-simple.sql');
      return;
    }

    if (!users || users.length === 0) {
      console.log('❌ No demo users found');
      console.log('\n🔧 Solution: Run the database schema in Supabase SQL Editor');
      console.log('   File: database/supabase-schema-simple.sql');
      return;
    }

    console.log('✅ Demo users found:');
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    // Test if tasks table exists
    console.log('\n3. Checking tasks table...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, title')
      .limit(5);

    if (tasksError) {
      console.log('❌ Tasks table error:', tasksError.message);
      return;
    }

    console.log(`✅ Tasks table ready (${tasks?.length || 0} demo tasks)`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database setup complete!');
    console.log('\n🚀 Ready to test login:');
    console.log('   Email: worker@taskapp.com');
    console.log('   Password: worker123');
    console.log('\n🌐 Access your app:');
    console.log('   Development: http://localhost:3000');
    console.log('   Production: http://localhost:5000');

  } catch (error) {
    console.log('❌ Database test failed:', error.message);
    console.log('\n🔧 Check your Supabase configuration in server/.env');
  }
}

testDatabase();