import React from 'react';
import clsx from 'clsx';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-xl shadow-sm border transition-all duration-200 hover:scale-105';

  const variantClasses = {
    default: 'bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-800 border-secondary-200',
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-300 shadow-lg',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white border-success-300 shadow-lg',
    warning: 'bg-gradient-to-r from-warning-500 to-warning-600 text-white border-warning-300 shadow-lg',
    error: 'bg-gradient-to-r from-error-500 to-error-600 text-white border-error-300 shadow-lg',
    info: 'bg-gradient-to-r from-info-500 to-info-600 text-white border-info-300 shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-sm',
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;