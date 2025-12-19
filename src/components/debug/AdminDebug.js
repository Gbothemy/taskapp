import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../services/supabase';
import Button from '../ui/Button';

const AdminDebug = () => {
  const { user, profile, isAuthenticated } = useSelector((state) => state.auth);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const createAdminUser = async () => {
    setCreating(true);
    setMessage('');
    
    try {
      // First check if admin user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@demo.com')
        .single();

      if (existingUser) {
        setMessage('Admin user already exists! Try logging in with admin@demo.com / demo123');
        setCreating(false);
        return;
      }

      // Create admin user directly in the database
      const adminId = crypto.randomUUID();
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: adminId,
            email: 'admin@demo.com',
            full_name: 'Demo Admin',
            user_type: 'admin',
            status: 'active',
            company: 'TaskApp Inc.',
            bio: 'Demo admin account for testing',
            rating: 5.0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setMessage('✅ Admin user created! You can now register with admin@demo.com and password demo123');
    } catch (error) {
      console.error('Error creating admin user:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const checkUserType = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setMessage(`❌ Database error: ${error.message}`);
        return;
      }

      setMessage(`✅ User found in database: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setMessage(`❌ Error checking user: ${error.message}`);
    }
  };

  const updateUserToAdmin = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ user_type: 'admin' })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setMessage('✅ User updated to admin! Please refresh the page.');
    } catch (error) {
      setMessage(`❌ Error updating user: ${error.message}`);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">🔧 Admin Debug Panel</h3>
      
      <div className="space-y-4">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold mb-2">Current Auth State:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify({ 
              isAuthenticated, 
              userId: user?.id, 
              userEmail: user?.email,
              profileType: profile?.user_type,
              profileId: profile?.id 
            }, null, 2)}
          </pre>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={createAdminUser} 
            disabled={creating}
            size="sm"
            variant="outline"
          >
            {creating ? 'Creating...' : 'Create Demo Admin'}
          </Button>
          
          <Button 
            onClick={checkUserType} 
            disabled={!user}
            size="sm"
            variant="outline"
          >
            Check User in DB
          </Button>
          
          <Button 
            onClick={updateUserToAdmin} 
            disabled={!user}
            size="sm"
            variant="outline"
          >
            Make Current User Admin
          </Button>
        </div>

        {message && (
          <div className="bg-gray-100 p-3 rounded">
            <pre className="text-xs whitespace-pre-wrap">{message}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDebug;