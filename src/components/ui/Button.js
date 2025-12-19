import React from 'react';
import clsx from 'clsx';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 hover:shadow-2xl hover:scale-105 focus:ring-primary-500 shadow-lg',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 hover:shadow-2xl hover:scale-105 focus:ring-secondary-500 shadow-lg',
    success: 'bg-gradient-to-r from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 hover:shadow-2xl hover:scale-105 focus:ring-success-500 shadow-lg',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-700 text-white hover:from-warning-700 hover:to-warning-800 hover:shadow-2xl hover:scale-105 focus:ring-warning-500 shadow-lg',
    error: 'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 hover:shadow-2xl hover:scale-105 focus:ring-error-500 shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-500 hover:text-white hover:shadow-2xl hover:scale-105 focus:ring-primary-500 backdrop-blur-sm',
    ghost: 'text-secondary-700 hover:bg-secondary-100 hover:scale-105 focus:ring-primary-500 rounded-xl',
  };

  const sizeClasses = {
    xs: 'px-3 py-2 text-xs',
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          color={variant === 'outline' || variant === 'ghost' ? 'gray' : 'white'} 
          className="mr-2" 
        />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={clsx('w-4 h-4', children ? 'mr-2' : '')} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={clsx('w-4 h-4', children ? 'ml-2' : '')} />
      )}
    </button>
  );
};

export default Button;