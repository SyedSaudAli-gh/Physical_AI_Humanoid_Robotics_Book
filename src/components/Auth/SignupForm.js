import React, { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from 'better-auth/react';
import FormField from '../UI/FormField';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './AuthForm.css';

/**
 * Signup Form Component
 * Collects user information including required background questions
 */
const SignupForm = ({ onSignupSuccess, onCancel }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    software_background: '',
    hardware_background: '',
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

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Software background validation
    if (!formData.software_background) {
      newErrors.software_background = 'Software background is required';
    }

    // Hardware background validation
    if (!formData.hardware_background) {
      newErrors.hardware_background = 'Hardware background is required';
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
      // Using Better-Auth's signIn method for email registration
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: '/', // Redirect to home after signup
      }, {
        name: formData.name,
        software_background: formData.software_background,
        hardware_background: formData.hardware_background,
      });

      if (result.error) {
        setGeneralError(result.error.message || 'Signup failed. Please try again.');
      } else if (result.data) {
        // Signup successful
        if (onSignupSuccess) {
          onSignupSuccess(result.data.user);
        }
      }
    } catch (error) {
      setGeneralError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create Account" className="auth-form-card">
      <form onSubmit={handleSubmit} className="auth-form signup-form">
        {generalError && (
          <div className="form-error general-error" role="alert">
            {generalError}
          </div>
        )}

        <FormField
          id="signup-email"
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
          id="signup-name"
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />

        <FormField
          id="signup-password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          error={errors.password}
          required
          helpText="Must be at least 8 characters"
        />

        <FormField
          id="signup-confirm-password"
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
        />

        <FormField
          id="signup-software-background"
          label="Software Background"
          type="textarea"
          name="software_background"
          value={formData.software_background}
          onChange={handleChange}
          placeholder="Describe your experience with software development, programming languages, frameworks, etc."
          error={errors.software_background}
          required
          helpText="Please provide details about your software development background"
        />

        <FormField
          id="signup-hardware-background"
          label="Hardware Background"
          type="textarea"
          name="hardware_background"
          value={formData.hardware_background}
          onChange={handleChange}
          placeholder="Describe your experience with hardware, electronics, robotics, etc."
          error={errors.hardware_background}
          required
          helpText="Please provide details about your hardware experience"
        />

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
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
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onCancel}
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default SignupForm;