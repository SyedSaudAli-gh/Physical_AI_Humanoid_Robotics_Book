import React from 'react';
import Layout from '@theme/Layout';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Profile from '../components/Auth/Profile';

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <Layout title="Loading..." description="Loading your profile...">
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Layout title="Access Denied" description="Please sign in to view your profile">
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <h1>Access Denied</h1>
              <p>Please sign in to view your profile.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Profile" description="Manage your account profile">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Profile
              onLogout={() => window.location.href = '/'}
              onLanguageChange={(lang) => console.log('Language changed to:', lang)}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ProfilePageWithProviders = () => (
  <AuthProvider>
    <LanguageProvider>
      <ProfilePage />
    </LanguageProvider>
  </AuthProvider>
);

export default ProfilePageWithProviders;