const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  });
  
  return env;
}

async function createAuthUsers() {
  console.log('🔧 Creating Auth Users for Demo Accounts...\n');

  try {
    // Load environment variables
    const env = loadEnv();
    const supabaseUrl = env.REACT_APP_SUPABASE_URL;
    const supabaseAnonKey = env.REACT_APP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const demoUsers = [
      {
        email: 'demo.worker@taskapp.com',
        password: 'SecurePass123!',
        fullName: 'Alex Johnson',
        userType: 'worker'
      },
      {
        email: 'demo.employer@taskapp.com',
        password: 'SecurePass123!',
        fullName: 'Sarah Chen',
        userType: 'employer'
      },
      {
        email: 'demo.admin@taskapp.com',
        password: 'admin123',
        fullName: 'Admin User',
        userType: 'admin'
      }
    ];

    for (const user of demoUsers) {
      console.log(`Creating auth user: ${user.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName,
            user_type: user.userType
          },
          emailRedirectTo: undefined // Disable email verification
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✅ ${user.email} - Already exists in auth`);
        } else {
          console.log(`❌ ${user.email} - Error: ${error.message}`);
        }
      } else {
        console.log(`✅ ${user.email} - Auth user created successfully`);
        
        // Update the existing profile with the auth user ID
        if (data.user) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ id: data.user.id })
            .eq('email', user.email);

          if (updateError) {
            console.log(`   ⚠️  Profile update failed: ${updateError.message}`);
          } else {
            console.log(`   ✅ Profile linked to auth user`);
          }
        }
      }
      
      // Sign out after each creation
      await supabase.auth.signOut();
    }

    console.log('\n🎉 Auth user creation completed!');
    console.log('\nYou can now try logging in with:');
    console.log('- demo.worker@taskapp.com / SecurePass123!');
    console.log('- demo.employer@taskapp.com / SecurePass123!');
    console.log('- demo.admin@taskapp.com / admin123');

  } catch (error) {
    console.error('❌ Auth user creation failed:', error.message);
  }
}

// Run the creation
createAuthUsers();