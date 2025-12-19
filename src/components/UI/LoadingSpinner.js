import React from 'react';
import clsx from 'clsx';

/**
 * Accessible Loading Spinner Component
 * Follows WCAG 2.1 AA compliance guidelines
 */
const LoadingSpinner = ({
  size = 'md',
  label = 'Loading...',
  className = '',
  ...props
}) => {
  const spinnerClasses = clsx(
    'loading-spinner',
    `loading-spinner--${size}`,
    className
  );

  // Size mappings
  const sizeClasses = {
    sm: 'loading-spinner--sm',
    md: 'loading-spinner--md',
    lg: 'loading-spinner--lg',
  };

  return (
    <div
      className={clsx(spinnerClasses, sizeClasses[size])}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;