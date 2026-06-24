import axios from 'axios';

const API_BASE_URL = 'https://collegenz-api.onrender.com/api/v1';

export const postsService = {
  getFeed: async (filter: string, page: number = 1) => {
    try {
      let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // 🔍 Clean the token: strip any accidental extra double quotes wrapped around the string
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      const response = await axios.get(`${API_BASE_URL}/posts/feed`, {
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
      console.error('Failed to stream posts from Render cluster:', error);
      return []; 
    }
  }
};
