# Quickstart Guide: Docusaurus UI Enhancements

## Overview
This guide provides a quick overview of how to implement the Docusaurus UI enhancements including authentication, multilingual support, and hero page customization.

## Prerequisites
- Node.js 16+ installed
- Basic knowledge of React and Docusaurus
- Better-Auth account (or self-hosted instance)
- Access to the Physical AI & Humanoid Robotics book repository

## Setup Steps

### 1. Install Dependencies
```bash
npm install better-auth @docusaurus/plugin-content-docs @docusaurus/plugin-content-pages
```

### 2. Configure Docusaurus for i18n
Update `docusaurus.config.js` to include language configurations:

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
  },
  // ... other config
};
```

### 3. Set up Better-Auth
Create an `auth.config.js` file:

```javascript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // Configuration for your database
  },
  socialProviders: {
    // Optional social login providers
  },
  // Custom fields for background questions
  user: {
    additionalFields: {
      software_background: {
        type: "string",
        required: true,
      },
      hardware_background: {
        type: "string",
        required: true,
      },
    },
  },
});
```

### 4. Create Custom Navbar Component
Create a new navbar component that displays different content based on authentication status:

```jsx
// src/components/Navbar/index.js
import React from 'react';
import clsx from 'clsx';
import { useAuth } from 'better-auth/react';
import LanguageSwitcher from '../LanguageSwitcher';

const Navbar = () => {
  const { signIn, signOut, session } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__items">
          {/* Logo and site title */}
        </div>
        <div className="navbar__items navbar__items--right">
          {session.data ? (
            // Authenticated user menu
            <div className="dropdown">
              <span>Profile</span>
              <button onClick={() => signOut()}>Logout</button>
            </div>
          ) : (
            // Guest user menu
            <button onClick={() => signIn()}>Login/Signup</button>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### 5. Create Hero Landing Page
Create `src/pages/index.mdx`:

```mdx
import Hero from '@theme/Hero';

# Physical AI & Humanoid Robotics

## Master the Future of AI and Robotics

Dive deep into the intersection of artificial intelligence and humanoid robotics with our comprehensive guide.

[Start Reading](/docs/intro) [View on GitHub](https://github.com/your-repo)

<Hero />
```

### 6. Set up Language Switching
Create a language switcher component:

```jsx
// src/components/LanguageSwitcher/index.js
import React from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

const LanguageSwitcher = () => {
  const history = useHistory();
  const location = useLocation();

  const switchLanguage = (lang) => {
    // Logic to switch language and update URL
    const newPath = location.pathname.replace(/^\/(en|ur)\//, `/${lang}/`);
    history.push(newPath);
  };

  return (
    <select onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="ur">Urdu</option>
    </select>
  );
};

export default LanguageSwitcher;
```

## Running the Development Server
```bash
npm run start
```

## Building for Production
```bash
npm run build
```

## Testing the Features

### Authentication Testing
1. Visit the site as a guest - you should see "Login/Signup" button
2. Register with required background information
3. Verify that "Profile/Logout" appears after login
4. Test that authentication state persists across page navigation

### Language Switching Testing
1. Use the language switcher to toggle between English and Urdu
2. Verify that content updates correctly
3. Check that language preference persists across navigation

### Hero Page Testing
1. Visit the root URL (/) and verify the hero page displays
2. Test all call-to-action buttons
3. Verify responsive design on mobile devices

## Deployment to GitHub Pages
1. Ensure all configuration files are properly set up
2. Run `npm run build`
3. Deploy the build folder to GitHub Pages
4. Verify all features work in the production environment