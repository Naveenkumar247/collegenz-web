/**
 * Utility to retrieve the Authorization header for API requests.
 * Now reads directly from the 'token' key used in useAuthStore.
 */
export const getAuthHeader = () => {
  // 1. Ensure we are in a browser environment
  if (typeof window === 'undefined') return {};

  try {
    // 2. Retrieve the token directly from the key 'token' 
    // This matches the localStorage.setItem('token', accessToken) in your store
    const token = localStorage.getItem('token');
    
    // 3. Clean the token if it contains surrounding quotes
    const cleanToken = token?.replace(/^"|"$/g, '');
    
    if (!cleanToken) return {};

    // 4. Return the standard Bearer header format
    return {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json'
    };
  } catch (e) {
    console.error("Auth utility error:", e);
    return {};
  }
};
