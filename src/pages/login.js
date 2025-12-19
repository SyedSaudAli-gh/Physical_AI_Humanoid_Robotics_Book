import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import LoginForm from '../components/Auth/LoginForm';
import Link from '@docusaurus/Link';

const LoginPage = () => {
  const { isAuthenticated } = useAuthContext();
  const [showSignup, setShowSignup] = useState(false);

  if (isAuthenticated) {
    // Redirect to home if already logged in
    window.location.href = '/';
    return null;
  }

  return (
    <Layout title="Sign In" description="Sign in to your account">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <LoginForm
              onLoginSuccess={() => window.location.href = '/'}
              onSignupRequest={() => setShowSignup(true)}
              onCancel={() => window.location.href = '/'}
            />
            <div className="text--center margin-top--lg">
              <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const LoginPageWithProviders = () => (
  <AuthProvider>
    <LanguageProvider>
      <LoginPage />
    </LanguageProvider>
  </AuthProvider>
);

export default LoginPageWithProviders;