import axios from 'axios';

// 🟢 FORCE THE DIRECT NESTJS PRODUCTION ENDPOINT DIRECTLY
const BACKEND_URL = 'https://collegenz-api.onrender.com/api/v1';

export const postsService = {
  getFeed: async (filter: string, page: number = 1) => {
    try {
      let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      // 🟢 Force axios to use the absolute, direct backend path string
      const response = await axios.get(`${BACKEND_URL}/posts/feed`, {
        params: {
          type: filter,
          page: page,
        },
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      return response.data;
    } catch (error) {
      console.error('Frontend absolute API call failed:', error);
      throw error;
    }
  }
};
