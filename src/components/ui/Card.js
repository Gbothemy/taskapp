import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'lg',
  hover = true,
  glass = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const baseClasses = glass 
    ? 'bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl'
    : 'bg-white rounded-xl border border-primary-200/50';

  return (
    <div
      className={clsx(
        baseClasses,
        paddingClasses[padding],
        shadowClasses[shadow],
        hover && 'hover:shadow-2xl hover:scale-105 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;