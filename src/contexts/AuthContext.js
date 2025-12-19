import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from 'better-auth/react';

// Create Auth Context
const AuthContext = createContext();

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
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
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { signIn, signOut, session } = useAuth();

  // Set user when session changes
  React.useEffect(() => {
    if (session.data) {
      dispatch({
        type: 'SET_USER',
        payload: session.data.user,
      });
    } else {
      dispatch({
        type: 'SET_USER',
        payload: null,
      });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, [session.data]);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await signIn.email({
        email,
        password,
        callbackURL: '/',
      });

      if (result.error) {
        dispatch({
          type: 'SET_ERROR',
          payload: result.error.message || 'Login failed',
        });
        return { success: false, error: result.error.message };
      }

      return { success: true, user: result.data?.user };
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Login failed',
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Register function
  const register = async (email, name, password, softwareBackground, hardwareBackground) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await signIn.email({
        email,
        password,
        callbackURL: '/',
      }, {
        name,
        software_background: softwareBackground,
        hardware_background: hardwareBackground,
      });

      if (result.error) {
        dispatch({
          type: 'SET_ERROR',
          payload: result.error.message || 'Registration failed',
        });
        return { success: false, error: result.error.message };
      }

      return { success: true, user: result.data?.user };
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Registration failed',
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await signOut();
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Logout failed',
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};