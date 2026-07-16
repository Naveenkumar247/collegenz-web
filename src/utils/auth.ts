/**
 * Utility to retrieve the Authorization header for API requests.
 * This looks into your 'auth-storage' (Zustand persist) to find the token.
 */
export const getAuthHeader = () => {
  // 1. Ensure we are in a browser environment
  if (typeof window === 'undefined') return {};

  try {
    // 2. Retrieve the persisted Zustand state
    const authStorage = localStorage.getItem('auth-storage');
    
    if (!authStorage) return {};

    const parsed = JSON.parse(authStorage);
    
    // 3. Extract the token and remove potential double quotes
    // Zustand persists store the state as a stringified JSON
    const token = parsed?.state?.token?.replace(/^"|"$/g, '');
    
    if (!token) return {};

    // 4. Return the standard Bearer header format
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (e) {
    console.error("Auth utility error:", e);
    return {};
  }
};

