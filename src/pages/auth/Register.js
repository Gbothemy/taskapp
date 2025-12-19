import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { register as registerUser, clearError } from '../../store/slices/authSlice';
import { authService } from '../../services/authentication';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userType: searchParams.get('type') || 'worker'
    }
  });

  const watchUserType = watch('userType');
  const watchEmail = watch('email');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Check email availability when email changes
  useEffect(() => {
    let isCancelled = false;

    const checkEmail = async () => {
      // Validate email format first
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (watchEmail && emailRegex.test(watchEmail)) {
        if (!isCancelled) {
          setCheckingEmail(true);
        }
        try {
          const isAvailable = await authService.checkEmailAvailability(watchEmail);
          if (!isCancelled) {
            setEmailAvailable(isAvailable);
          }
        } catch (error) {
          console.error('Email check failed:', error);
          if (!isCancelled) {
            setEmailAvailable(null);
          }
          // Don't show error toast here as it would be too noisy
        } finally {
          if (!isCancelled) {
            setCheckingEmail(false);
          }
        }
      } else {
        if (!isCancelled) {
          setEmailAvailable(null);
          setCheckingEmail(false);
        }
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); // Debounce
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [watchEmail]);

  // Removed pricing plans - no longer needed

  const onSubmit = async (data) => {
    try {
      // Check if email availability check is still in progress
      if (checkingEmail) {
        toast.error('Please wait for email validation to complete');
        return;
      }

      // Check if email is available before submitting
      if (emailAvailable === false) {
        toast.error('This email is already registered. Please use a different email.');
        return;
      }

      const userData = {
        ...data,
        // No email verification needed
      };
      
      await dispatch(registerUser(userData)).unwrap();
      toast.success('Account created successfully! Welcome to TaskApp!');
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the error state and toast above
    }
  };

  // Removed pricing plans reference

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-secondary-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Join TaskApp Professional
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Start your journey to professional success
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-white/70">Get started in less than 2 minutes</p>
            </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    I want to:
                  </label>
                  <p className="text-white/60 text-sm mb-4">Choose your account type. You can change this later in your profile settings.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                      watchUserType === 'worker' 
                        ? 'border-primary-400 bg-primary-500/20 shadow-lg' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                    }`}>
                      <input
                        {...register('userType', { 
                          required: 'Please select your account type',
                          validate: (value) => {
                            const allowedTypes = ['worker', 'employer', 'admin'];
                            return allowedTypes.includes(value) || 'Invalid user type selected';
                          }
                        })}
                        type="radio"
                        value="worker"
                        className="sr-only"
                      />
                      <div className="flex items-center w-full">
                        <div className="text-sm w-full">
                          <div className="font-semibold text-white flex items-center justify-center">
                            <span className="mr-2 text-2xl">👷</span>
                            Find Work
                          </div>
                          <div className="text-white/60 text-center mt-1">Browse and apply for tasks</div>
                        </div>
                      </div>
                      {watchUserType === 'worker' && (
                        <div className="absolute top-2 right-2">
                          <CheckIcon className="h-5 w-5 text-primary-400" />
                        </div>
                      )}
                    </label>

                    <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                      watchUserType === 'employer' 
                        ? 'border-primary-400 bg-primary-500/20 shadow-lg' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                    }`}>
                      <input
                        {...register('userType', { 
                          required: 'Please select your account type',
                          validate: (value) => {
                            const allowedTypes = ['worker', 'employer', 'admin'];
                            return allowedTypes.includes(value) || 'Invalid user type selected';
                          }
                        })}
                        type="radio"
                        value="employer"
                        className="sr-only"
                      />
                      <div className="flex items-center w-full">
                        <div className="text-sm w-full">
                          <div className="font-semibold text-white flex items-center justify-center">
                            <span className="mr-2 text-2xl">🏢</span>
                            Hire Talent
                          </div>
                          <div className="text-white/60 text-center mt-1">Post tasks and find professionals</div>
                        </div>
                      </div>
                      {watchUserType === 'employer' && (
                        <div className="absolute top-2 right-2">
                          <CheckIcon className="h-5 w-5 text-primary-400" />
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.userType && (
                    <p className="mt-2 text-sm text-red-300">{errors.userType.message}</p>
                  )}
                  {watchUserType && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/80 text-sm">
                        {watchUserType === 'worker' 
                          ? '🎯 As a Worker, you can browse available tasks, submit proposals, and earn money by completing work.'
                          : '🚀 As an Employer, you can post tasks, review submissions, and hire talented professionals for your projects.'
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Full Name *
                    </label>
                    <input
                      {...register('fullName', { 
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-300">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          },
                          validate: () => {
                            if (emailAvailable === false) {
                              return 'This email is already registered';
                            }
                            return true;
                          }
                        })}
                        type="email"
                        className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
                          emailAvailable === true 
                            ? 'border-green-400 focus:ring-green-400' 
                            : emailAvailable === false 
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-white/20 focus:ring-primary-400'
                        }`}
                        placeholder="Enter your email"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {checkingEmail && (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        )}
                        {!checkingEmail && emailAvailable === true && (
                          <CheckIcon className="h-5 w-5 text-green-400" />
                        )}
                        {!checkingEmail && emailAvailable === false && (
                          <XMarkIcon className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
                    )}
                    {!errors.email && emailAvailable === true && (
                      <p className="mt-2 text-sm text-green-300">✓ Email is available</p>
                    )}
                    {!errors.email && emailAvailable === false && (
                      <p className="mt-2 text-sm text-red-300">✗ This email is already registered</p>
                    )}
                  </div>
                </div>

                {/* Company (for employers) */}
                {watchUserType === 'employer' && (
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Company Name
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter your company name"
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-200"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Confirm Password *
                  </label>
                  <input
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-300">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Bio (Optional)
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 resize-none"
                    placeholder={watchUserType === 'worker' 
                      ? "Tell employers about your skills and experience..."
                      : "Describe your business and what kind of work you need..."
                    }
                  />
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                    type="checkbox"
                    className="h-4 w-4 text-primary-400 focus:ring-primary-400 border-white/20 rounded mt-1 bg-white/10"
                  />
                  <label className="ml-3 block text-sm text-white/80">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-primary-300 hover:text-primary-200 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary-300 hover:text-primary-200 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-2 text-sm text-red-300">{errors.agreeToTerms.message}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || checkingEmail || emailAvailable === false}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="lg"
                >
                  {loading ? 'Creating Account...' : 
                   checkingEmail ? 'Validating Email...' :
                   emailAvailable === false ? 'Email Already Taken' :
                   `Create ${watchUserType === 'worker' ? 'Worker' : 'Employer'} Account`}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-white/70">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-300 hover:text-primary-200 font-semibold transition-colors duration-200">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: '🔒', text: 'Secure & encrypted' },
              { icon: '⚡', text: 'Instant activation' },
              { icon: '🌟', text: 'Instant access' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/80 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;