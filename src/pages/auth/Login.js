import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { login, clearError } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data) => {
    try {
      // Validate input
      if (!data.email || !data.password) {
        toast.error('Please enter both email and password');
        return;
      }

      await dispatch(login(data)).unwrap();
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the error state and toast above
      console.error('Login failed:', error);
    }
  };

  const demoAccounts = [
    { email: 'demo.worker@taskapp.com', password: 'SecurePass123!', role: 'Worker', description: 'Experienced freelancer' },
    { email: 'demo.employer@taskapp.com', password: 'SecurePass123!', role: 'Employer', description: 'Business account' },
    { email: 'demo.admin@taskapp.com', password: 'admin123', role: 'Admin', description: 'Platform administrator' },
  ];

  const handleDemoLogin = async (email, password) => {
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the error state and toast above
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-secondary-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <img 
                src="/logo task.jpg" 
                alt="TaskApp Logo" 
                className="w-20 h-20 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-600/20 to-secondary-600/20 group-hover:opacity-0 transition-opacity duration-300"></div>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-lg text-white/70 mb-6">
            Sign in to continue your journey
          </p>
          <p className="text-white/60">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-300 hover:text-primary-200 transition-colors duration-200"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-primary-300 mr-2" />
            <h3 className="text-sm font-semibold text-white">Demo Accounts</h3>
          </div>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white group-hover:text-primary-200">
                      {account.role}
                    </div>
                    <div className="text-white/60 text-xs">{account.description}</div>
                  </div>
                  <div className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to login
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                  Email address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-lg"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-lg"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-6 w-6" />
                    ) : (
                      <EyeIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-300 hover:text-primary-200 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              Sign in securely
            </Button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            Protected by enterprise-grade security • SSL encrypted • GDPR compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;