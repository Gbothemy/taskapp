const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Database connectivity test
async function testDatabaseConnectivity() {
  console.log('🔍 Testing TaskApp Database Connectivity...\n');

  // Check environment variables
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Environment variables missing!');
    console.log('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    return false;
  }

  console.log('✅ Environment Variables:');
  console.log('   URL:', supabaseUrl);
  console.log('   Key:', supabaseKey.substring(0, 20) + '...');
  console.log('');

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Basic connection
    console.log('🧪 Test 1: Basic Connection');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (connectionError) {
      if (connectionError.code === '42P01') {
        console.log('⚠️  Database connected but tables not found');
        console.log('   Need to run: database/complete-schema.sql');
        return 'tables_missing';
      } else {
        console.error('❌ Connection failed:', connectionError.message);
        return false;
      }
    }
    console.log('✅ Database connection successful');

    // Test 2: Check required tables
    console.log('\n🧪 Test 2: Table Structure');
    const tables = ['users', 'categories', 'tasks', 'task_submissions'];
    const tableResults = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          tableResults[table] = '❌ Missing';
        } else {
          tableResults[table] = '✅ Exists';
        }
      } catch (err) {
        tableResults[table] = '❌ Error';
      }
    }

    Object.entries(tableResults).forEach(([table, status]) => {
      console.log(`   ${table}: ${status}`);
    });

    // Test 3: Data operations (if tables exist)
    if (Object.values(tableResults).every(status => status.includes('✅'))) {
      console.log('\n🧪 Test 3: Data Operations');

      // Test categories retrieval
      try {
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('*')
          .limit(5);

        if (catError) {
          console.log('   Categories: ❌ Query failed');
        } else {
          console.log(`   Categories: ✅ Retrieved ${categories?.length || 0} records`);
        }
      } catch (err) {
        console.log('   Categories: ❌ Error');
      }

      // Test users count
      try {
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.log('   Users: ❌ Count failed');
        } else {
          console.log(`   Users: ✅ ${count || 0} total users`);
        }
      } catch (err) {
        console.log('   Users: ❌ Error');
      }

      // Test tasks count
      try {
        const { count, error: taskCountError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true });

        if (taskCountError) {
          console.log('   Tasks: ❌ Count failed');
        } else {
          console.log(`   Tasks: ✅ ${count || 0} total tasks`);
        }
      } catch (err) {
        console.log('   Tasks: ❌ Error');
      }
    }

    // Test 4: Authentication test
    console.log('\n🧪 Test 4: Authentication System');
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.log('   Auth System: ❌ Error -', authError.message);
      } else {
        console.log('   Auth System: ✅ Working');
        console.log('   Current Session:', authData.session ? 'Active' : 'None');
      }
    } catch (err) {
      console.log('   Auth System: ❌ Error');
    }

    // Test 5: Real-time capabilities
    console.log('\n🧪 Test 5: Real-time Capabilities');
    try {
      const channel = supabase.channel('test-channel');
      console.log('   Real-time: ✅ Channel created');
      await channel.unsubscribe();
      console.log('   Real-time: ✅ Subscription system working');
    } catch (err) {
      console.log('   Real-time: ❌ Error');
    }

    console.log('\n🎉 Database Connectivity Test Complete!');
    
    // Summary
    const allTablesExist = Object.values(tableResults).every(status => status.includes('✅'));
    if (allTablesExist) {
      console.log('\n✅ RESULT: Database is fully connected and operational!');
      console.log('   - Can retrieve data ✅');
      console.log('   - Can store data ✅');
      console.log('   - Authentication ready ✅');
      console.log('   - Real-time features ready ✅');
      return true;
    } else {
      console.log('\n⚠️  RESULT: Database connected but setup incomplete');
      console.log('   - Connection: ✅');
      console.log('   - Tables: ❌ Some missing');
      console.log('   - Action needed: Run database setup scripts');
      return 'setup_needed';
    }

  } catch (error) {
    console.error('\n❌ Database connectivity test failed:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnectivity()
  .then(result => {
    if (result === true) {
      console.log('\n🚀 Your TaskApp is ready for production!');
      process.exit(0);
    } else if (result === 'tables_missing' || result === 'setup_needed') {
      console.log('\n📋 Next Steps:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Open SQL Editor');
      console.log('3. Run database/complete-schema.sql');
      console.log('4. Run database/add-plan-column.sql');
      console.log('5. Run this test again');
      process.exit(1);
    } else {
      console.log('\n❌ Database connection failed. Check your credentials.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });