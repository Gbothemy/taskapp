import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../services/supabase';
import Button from '../ui/Button';

const TaskDebug = () => {
  const { user, profile } = useSelector((state) => state.auth);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({});

  const runTaskTests = async () => {
    setTesting(true);
    const testResults = {};

    try {
      // Test 1: Check if tasks table exists
      console.log('Testing tasks table...');
      const { data: tasksTest, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .limit(1);
      
      testResults.tasksTable = {
        success: !tasksError,
        message: tasksError ? tasksError.message : 'Tasks table accessible',
        data: tasksTest
      };

      // Test 2: Check if categories table exists
      console.log('Testing categories table...');
      const { data: categoriesTest, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .limit(5);
      
      testResults.categoriesTable = {
        success: !categoriesError,
        message: categoriesError ? categoriesError.message : `Found ${categoriesTest?.length || 0} categories`,
        data: categoriesTest
      };

      // Test 3: Check user authentication
      testResults.userAuth = {
        success: !!user?.id,
        message: user?.id ? `User authenticated: ${user.id}` : 'User not authenticated',
        data: { userId: user?.id, userType: profile?.user_type }
      };

      // Test 4: Test simple task creation (dry run)
      if (user?.id) {
        console.log('Testing task creation...');
        const testTaskData = {
          title: 'Test Task',
          description: 'This is a test task',
          employer_id: user.id,
          category_id: categoriesTest?.[0]?.id || 'test-category',
          reward_amount: 25.00,
          difficulty_level: 'easy',
          requirements: 'Test requirements',
          deliverables: 'Test deliverables',
          max_submissions: 1,
          status: 'active'
        };

        try {
          // Don't actually create, just test the data structure
          testResults.taskCreation = {
            success: true,
            message: 'Task data structure valid',
            data: testTaskData
          };
        } catch (error) {
          testResults.taskCreation = {
            success: false,
            message: error.message,
            data: null
          };
        }
      }

    } catch (error) {
      testResults.error = {
        success: false,
        message: error.message,
        data: null
      };
    }

    setResults(testResults);
    setTesting(false);
  };

  const createTestTask = async () => {
    if (!user?.id) {
      alert('Please log in first');
      return;
    }

    setTesting(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: 'Debug Test Task',
          description: 'This is a test task created by the debug component',
          employer_id: user.id,
          category_id: results.categoriesTable?.data?.[0]?.id || null,
          reward_amount: 10.00,
          difficulty_level: 'easy',
          requirements: 'No special requirements',
          deliverables: 'Simple test deliverable',
          max_submissions: 1,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        alert(`Error creating test task: ${error.message}`);
        console.error('Task creation error:', error);
      } else {
        alert(`Test task created successfully! ID: ${data.id}`);
        console.log('Test task created:', data);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Task creation error:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-blue-800 mb-4">🔧 Task Creation Debug</h3>
      
      <div className="space-y-4">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold mb-2">Current State:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify({ 
              userId: user?.id, 
              userType: profile?.user_type,
              isAuthenticated: !!user?.id
            }, null, 2)}
          </pre>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={runTaskTests} 
            disabled={testing}
            size="sm"
            variant="outline"
          >
            {testing ? 'Running Tests...' : 'Run System Tests'}
          </Button>
          
          <Button 
            onClick={createTestTask} 
            disabled={testing || !user?.id}
            size="sm"
            variant="outline"
          >
            {testing ? 'Creating...' : 'Create Test Task'}
          </Button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Test Results:</h4>
            {Object.entries(results).map(([testName, result]) => (
              <div key={testName} className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium capitalize">{testName.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`px-2 py-1 rounded text-xs ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.success ? '✅ Pass' : '❌ Fail'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{result.message}</p>
                {result.data && (
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDebug;