/**
 * Utility functions for authentication and JWT token management
 */

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token to parse
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const parseJWT = (token) => {
  try {
    if (!token) return null;

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Split token into parts
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }

    // Decode payload (part 1)
    const payload = parts[1];
    // Replace URL-safe base64 characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Decode and parse JSON
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) {
      return true; // If no expiration, consider expired
    }

    // Check if expiration time (in seconds) is in the past
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) {
      return null;
    }

    // Convert expiration time from seconds to milliseconds
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token to store
 * @param {string} refreshToken - Refresh token to store (optional)
 */
export const storeAuthTokens = (token, refreshToken = null) => {
  try {
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  } catch (error) {
    console.error('Error storing auth tokens:', error);
  }
};

/**
 * Retrieve authentication token from localStorage
 * @returns {string|null} - Stored token or null if not found/expired
 */
export const getAuthToken = () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      // Remove expired token
      localStorage.removeItem('auth_token');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Retrieve refresh token from localStorage
 * @returns {string|null} - Stored refresh token or null if not found
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem('refresh_token');
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Clear stored authentication tokens
 */
export const clearAuthTokens = () => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
  }
};

/**
 * Store user data in localStorage
 * @param {object} userData - User data to store
 */
export const storeUserData = (userData) => {
  try {
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Retrieve user data from localStorage
 * @returns {object|null} - Stored user data or null if not found
 */
export const getUserData = () => {
  try {
    const userDataStr = localStorage.getItem('user_data');
    if (!userDataStr) {
      return null;
    }

    return JSON.parse(userDataStr);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Get session data combining token and user info
 * @returns {object|null} - Session data or null if not authenticated
 */
export const getSessionData = () => {
  const token = getAuthToken();
  const userData = getUserData();

  if (!token || !userData) {
    return null;
  }

  return {
    token,
    user: userData,
    isAuthenticated: true,
    expiration: getTokenExpiration(token),
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null && !isTokenExpired(token);
};

/**
 * Set up token refresh interval to maintain session
 * @param {function} refreshTokenFn - Function to refresh token
 * @param {number} intervalMs - Interval in milliseconds (default: 5 minutes)
 * @returns {number} - Interval ID for cleanup
 */
export const setupTokenRefresh = (refreshTokenFn, intervalMs = 5 * 60 * 1000) => {
  if (typeof refreshTokenFn !== 'function') {
    console.error('refreshTokenFn must be a function');
    return null;
  }

  const intervalId = setInterval(async () => {
    try {
      const token = getAuthToken();
      if (token && !isTokenExpired(token)) {
        // Check if token expires within 10 minutes
        const expiration = getTokenExpiration(token);
        const now = new Date();
        const tenMinutes = 10 * 60 * 1000;

        if (expiration && (expiration - now) < tenMinutes) {
          await refreshTokenFn();
        }
      }
    } catch (error) {
      console.error('Error during token refresh check:', error);
    }
  }, intervalMs);

  return intervalId;
};

/**
 * Perform logout and clean up
 * @param {function} signOutFn - Better-Auth signOut function
 * @param {function} redirectFn - Function to handle redirect after logout
 */
export const performLogout = async (signOutFn, redirectFn) => {
  try {
    // Call Better-Auth signOut if provided
    if (signOutFn && typeof signOutFn === 'function') {
      await signOutFn();
    }

    // Clear local storage
    clearAuthTokens();

    // Optionally redirect
    if (redirectFn && typeof redirectFn === 'function') {
      redirectFn();
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear tokens even if signOut fails
    clearAuthTokens();
    if (redirectFn && typeof redirectFn === 'function') {
      redirectFn();
    }
  }
};