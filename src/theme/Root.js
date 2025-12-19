import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import ErrorBoundary from '../components/ErrorBoundary';

// This is the global provider that wraps the entire app
const Root = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default Root;