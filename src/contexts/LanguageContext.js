import React, { createContext, useContext, useReducer } from 'react';

// Create Language Context
const LanguageContext = createContext();

// Language Reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      // Persist language preference in localStorage
      localStorage.setItem('preferred-language', action.payload);
      return {
        ...state,
        currentLanguage: action.payload,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial State
const initialState = {
  currentLanguage: 'en', // Default to English
  loading: false,
  error: null,
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, () => {
    // Check for saved language preference in localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    return {
      ...initialState,
      currentLanguage: savedLanguage || 'en',
    };
  });

  // Set language function
  const setLanguage = (languageCode) => {
    if (languageCode === 'en' || languageCode === 'ur') {
      dispatch({
        type: 'SET_LANGUAGE',
        payload: languageCode,
      });

      // Update HTML lang attribute for accessibility
      document.documentElement.lang = languageCode;
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Unsupported language code. Use "en" or "ur".',
      });
    }
  };

  // Initialize language on component mount
  React.useEffect(() => {
    // Set the initial language as the HTML lang attribute
    document.documentElement.lang = state.currentLanguage;
  }, [state.currentLanguage]);

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setLanguage,
    clearError,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use Language Context
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};