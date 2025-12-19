import React from 'react';
import clsx from 'clsx';

/**
 * Accessible Form Field Component
 * Includes label, input, and error message with WCAG 2.1 AA compliance
 */
const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helpText,
  className = '',
  ...props
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('form-group', className)}>
      <label
        htmlFor={fieldId}
        className={clsx('form-label', {
          'form-label--required': required,
        })}
      >
        {label}
        {required && <span aria-label="required" className="required-indicator"> *</span>}
      </label>

      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={clsx('form-control', 'form-input', {
          'form-control--error': error,
          'form-control--disabled': disabled,
        })}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      />

      {helpText && (
        <div id={`${fieldId}-help`} className="form-text">
          {helpText}
        </div>
      )}

      {error && (
        <div
          id={`${fieldId}-error`}
          className="form-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;