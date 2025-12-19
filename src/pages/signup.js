import React from 'react';
import Layout from '@theme/Layout';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import SignupForm from '../components/Auth/SignupForm';
import Link from '@docusaurus/Link';

const SignupPage = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    // Redirect to home if already logged in
    window.location.href = '/';
    return null;
  }

  return (
    <Layout title="Sign Up" description="Create a new account">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <SignupForm
              onSignupSuccess={() => window.location.href = '/'}
              onCancel={() => window.location.href = '/'}
            />
            <div className="text--center margin-top--lg">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SignupPageWithProviders = () => (
  <AuthProvider>
    <LanguageProvider>
      <SignupPage />
    </LanguageProvider>
  </AuthProvider>
);

export default SignupPageWithProviders;