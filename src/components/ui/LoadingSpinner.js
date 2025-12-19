import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ size = 'md', className = '', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <div className={clsx('relative', sizeClasses[size], className)}>
      {/* Outer ring */}
      <div className={clsx('absolute inset-0 animate-spin', colorClasses[color])}>
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      
      {/* Inner pulse */}
      <div className={clsx('absolute inset-2 animate-pulse rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 opacity-30')}></div>
    </div>
  );
};

export default LoadingSpinner;