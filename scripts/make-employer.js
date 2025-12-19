const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function makeUserEmployer() {
  try {
    // Get the most recent user (likely the one currently logged in)
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, email, user_type, full_name')
      .order('last_active', { ascending: false })
      .limit(5);
    
    if (fetchError) throw fetchError;
    
    console.log('Recent users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.user_type}) - ${user.full_name}`);
    });
    
    // Update the first user to be an employer
    if (users.length > 0) {
      const userToUpdate = users[0];
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          user_type: 'employer',
          company: 'Test Company Inc.',
          updated_at: new Date().toISOString()
        })
        .eq('id', userToUpdate.id)
        .select();
      
      if (error) throw error;
      
      console.log(`\n✅ Updated ${userToUpdate.email} to be an employer!`);
      console.log('You can now access the My Tasks page as an employer.');
    } else {
      console.log('No users found to update.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

makeUserEmployer();