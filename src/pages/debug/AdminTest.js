import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../services/supabase';
import { adminService } from '../../services/adminService';
import AdminDebug from '../../components/debug/AdminDebug';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminTest = () => {
  const { user, profile, isAuthenticated } = useSelector((state) => state.auth);
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Database connection
      console.log('Testing database connection...');
      const { data: dbTest, error: dbError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      results.dbConnection = {
        success: !dbError,
        message: dbError ? dbError.message : 'Database connected successfully',
        data: dbTest
      };

      // Test 2: Admin service stats
      console.log('Testing admin service...');
      try {
        const stats = await adminService.getDashboardStats();
        results.adminService = {
          success: true,
          message: 'Admin service working',
          data: stats
        };
      } catch (error) {
        results.adminService = {
          success: false,
          message: error.message,
          data: null
        };
      }

      // Test 3: User authentication
      results.auth = {
        success: isAuthenticated,
        message: isAuthenticated ? 'User authenticated' : 'User not authenticated',
        data: { user: user?.id, profile: profile?.user_type }
      };

      // Test 4: Admin access
      results.adminAccess = {
        success: profile?.user_type === 'admin',
        message: profile?.user_type === 'admin' ? 'User has admin access' : `User type: ${profile?.user_type || 'unknown'}`,
        data: profile
      };

    } catch (error) {
      results.error = {
        success: false,
        message: error.message,
        data: null
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, [user, profile, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔧 Admin Dashboard Debug</h1>
          
          <AdminDebug />
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">System Tests</h2>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{testName.replace(/([A-Z])/g, ' $1')}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.success ? '✅ Pass' : '❌ Fail'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={runTests}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Running Tests...' : 'Run Tests Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;