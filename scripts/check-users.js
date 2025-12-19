const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, user_type, full_name')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log('Available users in database:');
    console.log('================================');
    data.forEach(user => {
      console.log(`- ${user.email} (${user.user_type}) - ${user.full_name}`);
    });
    
    const employers = data.filter(u => u.user_type === 'employer');
    console.log(`\nFound ${employers.length} employer(s)`);
    
    if (employers.length === 0) {
      console.log('\n⚠️  No employer accounts found!');
      console.log('To test the My Tasks page properly, you need an employer account.');
      console.log('You can create one by registering with user_type: "employer"');
    }
    
  } catch (error) {
    console.error('Error checking users:', error.message);
  }
}

checkUsers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });