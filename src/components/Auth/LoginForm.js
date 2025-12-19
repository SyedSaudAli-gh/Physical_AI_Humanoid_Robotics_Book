import React, { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from 'better-auth/react';
import FormField from '../UI/FormField';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './AuthForm.css';

/**
 * Login Form Component
 * Handles user authentication with email and password
 */
const LoginForm = ({ onLoginSuccess, onSignupRequest, onCancel }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      // Using Better-Auth's signIn method for email login
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: '/', // Redirect to home after login
      });

      if (result.error) {
        setGeneralError(result.error.message || 'Login failed. Please check your credentials.');
      } else if (result.data) {
        // Login successful
        if (onLoginSuccess) {
          onLoginSuccess(result.data.user);
        }
      }
    } catch (error) {
      setGeneralError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Sign In to Your Account" className="auth-form-card">
      <form onSubmit={handleSubmit} className="auth-form login-form">
        {generalError && (
          <div className="form-error general-error" role="alert">
            {generalError}
          </div>
        )}

        <FormField
          id="login-email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          error={errors.email}
          required
        />

        <FormField
          id="login-password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSignupRequest}
              disabled={loading}
            >
              Sign up
            </button>
          </p>
          <p>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                // Password reset functionality would go here
                alert('Password reset functionality would be implemented here');
              }}
              disabled={loading}
            >
              Forgot password?
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;