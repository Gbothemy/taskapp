require('dotenv').config({ path: './server/.env' });
const { supabase } = require('./server/config/supabase');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up TaskApp database...');
    
    // Test the connection first
    console.log('🔍 Testing database connection...');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.log('📝 Tables not found, they need to be created in Supabase dashboard');
      console.log('🔗 Please run the SQL schema in your Supabase dashboard:');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Go to SQL Editor');
      console.log('   4. Run the contents of database/supabase-schema.sql');
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Check if demo data exists
    const { data: demoUsers } = await supabase
      .from('users')
      .select('email')
      .in('email', ['worker@taskapp.com', 'employer@taskapp.com', 'admin@taskapp.com']);
    
    if (demoUsers && demoUsers.length > 0) {
      console.log('🎭 Demo accounts available:');
      demoUsers.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    } else {
      console.log('⚠️  No demo accounts found. Please run the schema to create them.');
    }
    
    console.log('📊 Database is ready for use');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('🔗 Please ensure your Supabase credentials are correct in server/.env');
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };