import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { resetPassword } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(resetPassword(data.email)).unwrap();
      setEmailSent(true);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      toast.error(error || 'Failed to send reset email');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-secondary-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-6">
              Check Your Email
            </h2>
            
            <p className="text-white/80 mb-6 text-lg">
              We've sent a password reset link to <strong className="text-primary-300">{getValues('email')}</strong>
            </p>
            
            <p className="text-sm text-white/60 mb-8">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setEmailSent(false)}
              >
                Try Different Email
              </Button>
              
              <Link 
                to="/login"
                className="block text-center text-primary-300 hover:text-primary-200 font-semibold transition-colors duration-200"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-secondary-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
          
          <h2 className="text-4xl font-black text-white mb-4">
            Reset Your Password
          </h2>
          
          <p className="text-lg text-white/70 mb-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                Email Address
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
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              Send Reset Link
            </Button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-primary-300 hover:text-primary-200 font-semibold transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-white/50">
            For security reasons, we'll only send reset links to registered email addresses
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;