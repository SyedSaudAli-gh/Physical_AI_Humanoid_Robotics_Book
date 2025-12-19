import React from 'react';
import clsx from 'clsx';
import { useLanguageContext } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

/**
 * Language Switcher Component
 * Allows users to switch between English and Urdu
 */
const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, error } = useLanguageContext();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

  return (
    <div className="language-switcher-container">
      <label htmlFor="language-select" className="language-switcher-label sr-only">
        Select Language
      </label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="language-switcher-select"
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="ur">Urdu</option>
      </select>

      {error && (
        <div className="language-switcher-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;