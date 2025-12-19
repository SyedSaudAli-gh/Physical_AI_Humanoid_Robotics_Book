import React from 'react';
import Layout from '@theme/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';

// This will wrap the entire app with the providers
const AppProviders = ({ children }) => (
  <AuthProvider>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </AuthProvider>
);

const Home = (props) => (
  <AppProviders>
    <Layout {...props} />
  </AppProviders>
);

export default Home;