import React from 'react';
import clsx from 'clsx';

/**
 * Accessible Button Component
 * Follows WCAG 2.1 AA compliance guidelines
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  onClick,
  ariaLabel,
  ...props
}) => {
  const buttonClasses = clsx(
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--disabled': disabled || loading,
      'button--loading': loading,
    },
    className
  );

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="loading-spinner" aria-hidden="true"></span>
      )}
      {children}
    </button>
  );
};

export default Button;