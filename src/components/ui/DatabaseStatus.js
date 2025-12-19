import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import Button from './Button';

const DatabaseStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Test if we can access the users table
      const { error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          setStatus('setup_required');
          setError('Database tables not found');
        } else {
          setStatus('error');
          setError(error.message);
        }
      } else {
        setStatus('ready');
      }
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'checking') {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-info-200/50 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-info-500 to-info-600 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
          <span className="text-info-800 font-semibold">Checking database status...</span>
        </div>
      </div>
    );
  }

  if (status === 'ready') {
    return null; // Don't show anything if database is ready
  }



  if (status === 'setup_required') {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-warning-200/50 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-warning-800 mb-3">
              Database Setup Required
            </h3>
            <p className="text-warning-700 mb-6 text-lg">
              Your database tables haven't been created yet. Please follow these steps to set up your database:
            </p>
            <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 p-6 rounded-xl mb-6">
              <ol className="list-decimal list-inside space-y-3 text-sm text-warning-800">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-warning-900">Supabase Dashboard</a></li>
                <li>Select your project and open the <strong>SQL Editor</strong></li>
                <li>Copy the contents of <code className="bg-warning-200 px-2 py-1 rounded font-mono">database/complete-schema.sql</code></li>
                <li>Paste and run the SQL to create all tables</li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={checkDatabaseStatus}
                size="md"
                className="bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800"
              >
                Check Again
              </Button>
              <Button
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                variant="outline"
                size="md"
              >
                Open Supabase Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-error-200/50 rounded-2xl p-8 mb-8 shadow-xl">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-error-800 mb-3">
            Database Connection Error
          </h3>
          <p className="text-error-700 mb-6 text-lg">
            There was an error connecting to your database:
          </p>
          <div className="bg-gradient-to-r from-error-50 to-error-100 border border-error-200 p-4 rounded-xl mb-6">
            <code className="text-error-800 font-mono text-sm break-all">{error}</code>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={checkDatabaseStatus}
              size="md"
              className="bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800"
            >
              Retry Connection
            </Button>
            <Button
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              variant="outline"
              size="md"
            >
              Check Supabase Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;