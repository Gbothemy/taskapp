#!/usr/bin/env node

/**
 * Check Admin Status Script
 * Checks if admin users exist and their status
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xwvpkvzotdaugkywdnme.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dnBrdnpvdGRhdWdreXdkbm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NTU5NzQsImV4cCI6MjA1MDEzMTk3NH0.Ej_1_rrCJGJJWJQKJJQKJJQKJJQKJJQKJJQKJJQKJJQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdminStatus() {
  console.log('🔍 Checking admin user status...\n');

  try {
    // Check for admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', 'admin');

    if (adminError) {
      console.error('❌ Error checking admin users:', adminError.message);
      return;
    }

    console.log(`📊 Found ${adminUsers.length} admin user(s):`);
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found!');
      console.log('\n🔧 To create an admin user:');
      console.log('1. Register a new account at http://localhost:3001/register');
      console.log('2. Use email: admin@demo.com, password: demo123');
      console.log('3. Select "Admin" as user type (if available)');
      console.log('4. Or run: node scripts/create-demo-accounts.js');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.full_name} (${user.email})`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
      });
    }

    // Check all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('user_type, count')
      .group('user_type');

    if (!usersError && allUsers) {
      console.log('\n📈 User type distribution:');
      allUsers.forEach(userType => {
        console.log(`   ${userType.user_type}: ${userType.count} users`);
      });
    }

    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    console.log(`\n🔗 Database connection: ${testError ? '❌ Failed' : '✅ Success'}`);
    if (testError) {
      console.log(`   Error: ${testError.message}`);
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run the check
checkAdminStatus();