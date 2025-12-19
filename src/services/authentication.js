import { createClient } from '@supabase/supabase-js';
import { handleApiError } from '../utils/errorHandler';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Clean Authentication Service - NO VERIFICATION
export const authService = {
  async signUp(userData) {
    const { email, password, fullName, username, userType, company, bio } = userData;
    
    // Validate input data
    if (!email || !password || !fullName || !userType) {
      throw new Error('Missing required fields: email, password, fullName, and userType are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate user type against allowed values
    const allowedUserTypes = ['worker', 'employer', 'admin'];
    if (!allowedUserTypes.includes(userType)) {
      throw new Error('Invalid user type. Must be either "worker" or "employer"');
    }

    // Check if email already exists in the database
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Email check error:', checkError);
        throw new Error('Unable to verify email availability');
      }

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
    } catch (error) {
      if (error.message === 'An account with this email already exists' || 
          error.message === 'Unable to verify email availability') {
        throw error;
      }
      // Continue if it's just a connection issue
      console.warn('Email check failed, continuing with signup:', error);
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType
          },
          emailRedirectTo: undefined
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        handleApiError(authError, 'signup');
        throw new Error(authError.message || 'Failed to create account');
      }

      // Create user profile
      if (authData.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: email.toLowerCase().trim(),
                full_name: fullName.trim(),
                username: username ? username.toLowerCase().trim() : null,
                user_type: userType,
                bio: bio ? bio.trim() : null,
                company: company ? company.trim() : null,
                status: 'active',
                rating: 0.00,
                tasks_completed: 0,
                tasks_created: 0,
                total_earnings: 0.00,
                wallet_balance: 0.00
              }
            ])
            .select()
            .single();

          if (profileError) {
            console.error('Profile creation error:', profileError);
            await supabase.auth.signOut();
            throw new Error('Failed to create user profile: ' + profileError.message);
          }

          return {
            user: authData.user,
            profile: profileData,
            session: authData.session
          };
        } catch (error) {
          console.error('Profile creation failed:', error);
          await supabase.auth.signOut();
          throw error;
        }
      }

      throw new Error('Failed to create user account');
    } catch (error) {
      console.error('Signup error:', error);
      handleApiError(error, 'signup');
      throw error;
    }
  },

  async signIn(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in');
        }
        if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please try again later');
        }
        throw new Error(error.message || 'Failed to sign in');
      }

      if (data.user) {
        const profile = await this.getProfile(data.user.id);
        return {
          user: data.user,
          profile,
          session: data.session
        };
      }

      throw new Error('Failed to sign in');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

      if (error) {
        console.warn('Profile fetch failed:', error);
        // Return a basic profile structure instead of null
        return {
          id: userId,
          email: '',
          full_name: 'User',
          user_type: 'worker',
          created_at: new Date().toISOString()
        };
      }

      return data || {
        id: userId,
        email: '',
        full_name: 'User',
        user_type: 'worker',
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Return fallback profile
      return {
        id: userId,
        email: '',
        full_name: 'User',
        user_type: 'worker',
        created_at: new Date().toISOString()
      };
    }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { user: null, profile: null };

    const profile = await this.getProfile(user.id);
    return { user, profile };
  },

  // Check if user type is valid
  async validateUserType(userType) {
    const allowedUserTypes = ['worker', 'employer', 'admin'];
    return allowedUserTypes.includes(userType);
  },

  // Check email availability
  async checkEmailAvailability(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw new Error('Unable to check email availability');
      }

      return !data; // Returns true if email is available (no existing user found)
    } catch (error) {
      console.error('Email availability check failed:', error);
      throw new Error('Unable to verify email availability');
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send reset email');
      }
      
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to update password');
      }
      
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }
};

export default authService;