import React, { useState, useEffect } from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import { useAuth } from 'better-auth/react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { performLogout } from '../../utils/authUtils';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

const Navbar = (props) => {
  const { session, signOut } = useAuth();
  const { currentLanguage } = useLanguageContext();
  const [navbarItems, setNavbarItems] = useState(props.items);

  useEffect(() => {
    // Create updated navbar items based on auth state
    const updatedItems = [...props.items];

    // Add language switcher as a component in the navbar
    updatedItems.push({
      type: 'custom',
      component: () => <LanguageSwitcher />,
      position: 'right',
      key: 'language-switcher',
    });

    // Add auth-related items based on session state
    if (session.data) {
      // User is logged in - show profile/logout
      updatedItems.push({
        type: 'dropdown',
        label: session.data.user?.name || 'Account',
        position: 'right',
        items: [
          {
            label: 'Profile',
            to: '/profile',
          },
          {
            label: 'Logout',
            to: '#',
            onClick: async (e) => {
              e.preventDefault();
              await performLogout(signOut, () => {
                window.location.href = '/';
              });
            },
          },
        ],
      });
    } else {
      // User is not logged in - show login/signup
      updatedItems.push({
        type: 'dropdown',
        label: 'Account',
        position: 'right',
        items: [
          {
            label: 'Login',
            to: '/login',
          },
          {
            label: 'Sign Up',
            to: '/signup',
          },
        ],
      });
    }

    setNavbarItems(updatedItems);
  }, [session.data, currentLanguage]);

  return <OriginalNavbar {...props} items={navbarItems} />;
};

export default Navbar;