import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useAuth } from 'better-auth/react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import Button from '../UI/Button';
import Card from '../UI/Card';
import FormField from '../UI/FormField';
import './AuthForm.css';

/**
 * Profile Component
 * Displays user information and allows updates
 */
const Profile = ({ onLogout, onLanguageChange }) => {
  const { session, signOut } = useAuth();
  const { setLanguage, currentLanguage } = useLanguageContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session.data?.user) {
      setEditData({
        name: session.data.user.name || '',
        email: session.data.user.email || '',
        software_background: session.data.user.software_background || '',
        hardware_background: session.data.user.hardware_background || '',
        language_preference: session.data.user.language_preference || currentLanguage,
      });
    }
  }, [session.data, currentLanguage]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit and reset to original values
      if (session.data?.user) {
        setEditData({
          name: session.data.user.name || '',
          email: session.data.user.email || '',
          software_background: session.data.user.software_background || '',
          hardware_background: session.data.user.hardware_background || '',
          language_preference: session.data.user.language_preference || currentLanguage,
        });
      }
      setMessage('');
    }
    setIsEditing(!isEditing);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!editData.name) {
      newErrors.name = 'Name is required';
    } else if (editData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!editData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // In a real implementation, we would update the user profile via an API call
      // For now, we'll simulate the update and show a success message
      console.log('Updating user profile:', editData);

      // Update language preference if changed
      if (editData.language_preference !== currentLanguage) {
        setLanguage(editData.language_preference);
        if (onLanguageChange) {
          onLanguageChange(editData.language_preference);
        }
      }

      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
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

  const handleLogout = async () => {
    try {
      await signOut();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setMessage('Error during logout: ' + error.message);
    }
  };

  if (!session.data?.user) {
    return (
      <Card title="Profile" className="auth-form-card">
        <p>Please sign in to view your profile.</p>
      </Card>
    );
  }

  const user = session.data.user;

  return (
    <Card title="Your Profile" className="auth-form-card">
      <div className="profile-container">
        {message && (
          <div className={`profile-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-info">
          {isEditing ? (
            <form className="auth-form profile-form">
              <FormField
                id="profile-name"
                label="Full Name"
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <FormField
                id="profile-email"
                label="Email"
                type="email"
                name="email"
                value={editData.email || ''}
                onChange={handleChange}
                error={errors.email}
                required
                disabled // Email might be disabled from editing in some systems
              />

              <FormField
                id="profile-software-background"
                label="Software Background"
                type="textarea"
                name="software_background"
                value={editData.software_background || ''}
                onChange={handleChange}
                helpText="Your software development experience"
              />

              <FormField
                id="profile-hardware-background"
                label="Hardware Background"
                type="textarea"
                name="hardware_background"
                value={editData.hardware_background || ''}
                onChange={handleChange}
                helpText="Your hardware experience"
              />

              <div className="form-group">
                <label htmlFor="profile-language" className="form-label">
                  Language Preference
                </label>
                <select
                  id="profile-language"
                  name="language_preference"
                  value={editData.language_preference || currentLanguage}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                </select>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="profile-field">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="profile-field">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="profile-field">
                <strong>Software Background:</strong> {user.software_background}
              </div>
              <div className="profile-field">
                <strong>Hardware Background:</strong> {user.hardware_background}
              </div>
              <div className="profile-field">
                <strong>Member Since:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Profile;